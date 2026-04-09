let SEED = Math.floor(Math.random() * 100000);
let WIDTH = 1280;
let HEIGHT = 1280;
let bgCol = "#f9f9f9";
let GUI;

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"];
const LINECOLOR = "#401F3E";
let dim;

// custom vars for this sketch
let particle_sets = [];
let circles = [];
let perspT;

const settings = {
  number_of_particles: [2, 100, 10000, 100],
  number_of_particle_sets: [1200, 1, 1000, 1],
  band_width: [0.03, 0.01, 0.9, 0.001],
  band_dist: [0.045, 0.01, 0.9, 0.001],
  zoom: [0.5, 0.1, 3, 0.01],
  particle_path_length: [500, 500, 10000, 100],
  particle_speed: [3, 1, 100, 1],
  noise_scale: [0.05, 0.01, 1, 0.01],
  noise_buffer: [0.2, 0.1, 1, 0.01],
  particle_curl: [2, 0.1, 10, 0.01],
  y_transform: [0.1, 0.01, 0.1, 0.001],
  x_transform: [0.02, 0.1, 0.9, 0.01],
  // maximum number of iterations before particle is removed
  maxLoops: [3, 1, 10, 1],
  same_seed: [false],
  perspective_shift: [false],
  add_weird_alt: [true],
  numCircles: [5, 1, 100, 1],
  minCircleRadius: [100, 10, 1000, 1],
  maxCircleRadius: [200, 10, 1000, 1],
};

let font;
let fSize = 300; // font size
// let msg = "MIT\nMEDIA\nLAB"; // text to write
let msg = "dates\nto\nsave"; // text to write
let pts = []; // store path data
let minSize = 1;
let maxSize = 3;
let black, blue, red, yellow;

function preload() {
  // preload OTF font file
  font = loadFont("Raleway-ExtraBold.ttf");
}

function redrawSketch() {
  clear();
  redraw();
  if (!GUI.config.same_seed) {
    SEED = Math.floor(Math.random() * 100000);
    randomSeed(SEED);
    noiseSeed(SEED);
  }

  recalculateTransform(c);
  particle_sets = [];
  circles = [];
  const center = createVector(width / 2, height * 1.9);
  const minR = height * 0.2;
  const maxR = height * 2;
  makeParticles(center, minR, maxR);
  console.log("particle sets:", particle_sets);
  makeRandomCircles(
    GUI.config.numCircles,
    GUI.config.minCircleRadius,
    GUI.config.maxCircleRadius
  );
  console.log("circles:", circles);
  // makeParticles();
  // makeRandomCircles(GUI.config.numCircles, 100, 200)
}

function setup() {
  // setting modes and seeds
  colorMode(HSB);
  rectMode(CENTER);
  randomSeed(SEED);
  noiseSeed(SEED);

  dim = Math.min(windowWidth, windowHeight) * 0.8;
  rng = d3.randomLcg(random());

  // base canvas
  bg = int(random(244, 254));
  createCanvas(dim, dim);
  background("#e7e7db");

  // our drawing canvas
  // c = createGraphics(width * 0.9, height * 0.9);
  // c.background("#EFAF0E");

  // c.translate(c.width * 0.1, c.height * 0.075);

  // createCanvas(8.5 * 150, 11 * 150); // create an 8.5x11 inch canvas at 150dpi

  // create 3 riso layers
  black = new Riso("slate");
  blue = new Riso("mediumblue");
  orange = new Riso("sunflower");
  yellow = new Riso("yellow");
  red = new Riso("red");
  noLoop();

  // initialize gui
  GUI = new _GUI(settings);
  GUI.startGUI(redrawSketch);

  // recalculateTransform(c);
}

let drawText = function (text) {
  let textImg = createGraphics(8.5 * 150, 11 * 150);
  // let textImg = createGraphics(dim * 150, dim * 150)
  textImg.pixelDensity(1);
  textImg.background(255);
  textImg.textFont(font);
  textImg.textSize(fSize);
  textImg.text(text, 100, fSize + 100);
  textImg.loadPixels();
  return textImg;
};

function getTextPoints(
  text,
  xOrig,
  yOrig,
  yPointDensity = 1,
  xPointDensity = 1
) {
  // creates an array of point objects at the given pixel density for
  // some text.
  let textImg = drawText(text);

  let minX = 0,
    minY = 0,
    maxX = 0,
    maxY = 0;
  let points = [];

  for (let x = 0; x < textImg.width; x += xPointDensity) {
    for (let y = 0; y < textImg.height; y += yPointDensity) {
      let index = (x + y * textImg.width) * 4;
      let r = textImg.pixels[index]; // if there's a value at that point
      if (r < 128) {
        points.push({ x, y });
        minX = min(x, minX);
        minY = min(y, minY);
        maxY = max(y, maxY);
        maxX = max(x, maxX);
      }
    }
  }

  points = points.map((p) => {
    return { x: p.x + xOrig, y: p.y + yOrig };
  });
  minX = minX + xOrig;
  minY = minY + yOrig;
  maxY = maxY + yOrig;
  maxX = maxX + xOrig;

  return {
    points: points,
    extent: { minX, minY, maxX, maxY },
  };
}

function drawRisoLayer(points, extent, xShift, yShift, canvas) {
  let lineLength = 5;
  points.forEach((p) => {
    canvas.strokeWeight(random([1, 2, 3, 4]));
    // canvas.stroke(random(50, 220))
    let strk = map(p.y, extent.minY, extent.maxY, 220, 100);
    canvas.stroke(randomGaussian(strk, 10));
    // canvas.point(p.x + xShift, p.y + yShift);
    canvas.line(
      p.x + xShift,
      p.y + yShift - lineLength,
      p.x + xShift,
      p.y + yShift + lineLength
    );
  });
}

function NoiseMachine(min, max) {
  // std of noise on points should increase as we get closer to the bottom
  // of each letter.
  let getStd = d3.scalePow().exponent(5).domain([min, max]).range([0, 30]);
  return getStd;
}

function addNoiseToPoints(points, extent) {
  let height = extent.maxY - extent.minY;
  let min = extent.maxY - height / 4;
  // let min = extent.minY;
  let max = extent.maxY;
  let noiseMachine = NoiseMachine(0, height);

  let pts = points.map((p) => {
    // create a noise "threshold" line. points below this line get scattered.
    let noiseLine = map(noise(p.x / 800, p.y / 800), 0, 1, min, max);
    let distToLine = map(abs(p.y - noiseLine), 0, height, 1, 0);
    let addNoise = d3.randomBernoulli(distToLine);

    if (p.y > noiseLine || addNoise()) {
      return {
        x: p.x + randomGaussian(0, noiseMachine(p.y - extent.minY) / 2),
        y: p.y + abs(randomGaussian(0, noiseMachine(p.y - extent.minY))),
      };
    } else {
      return {
        x: p.x,
        y: p.y,
      };
    }
  });
  return pts;
}

function draw() {
  let allCanvases = [blue, yellow, red];

  let msgs = msg.split("\n"); // split message by line
  let noiseRange = 15; // base noise for each layer

  ////////////////////////////////
  let x = 0;
  let y = 0;
  let r;
  console.log("canvases:", _.sampleSize(allCanvases, 3).length);

  msgs.forEach((msg) => {
    let letters = msg.split("");
    letters.forEach((l) => {
      canvases = _.sampleSize(allCanvases, 2);
      canvases.forEach((c) => {
        // generate noise for each layer
        let xShift = randomGaussian(0, noiseRange / 2);
        let yShift = randomGaussian(0, noiseRange / 2);
        // get points to draw
        r = getTextPoints(
          l,
          x,
          y,
          (yPointDensity = random([1, 2])),
          (xPointDensity = random([1, 2]))
        );
        noisyPoints = addNoiseToPoints(r.points, r.extent);

        push();
        drawRisoLayer(noisyPoints, r.extent, xShift, yShift, c);
        pop();
      });
      x = r.extent.maxX - 75;
      y = r.extent.minY;
    });
    // reset for next 'line'
    x = 0;
    y = r.extent.maxY - r.extent.maxY / 10;
    // reset for next 'layer'
    x = 0;
    //    y = 0;
  });

  // preview riso
  drawRiso();

  // image(c, width * 0.05, height * 0.05);
}

function mousePressed() {
  // when the user clicks, export the current image and stop
  // exportRiso();
  noLoop();
}
