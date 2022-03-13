let w = 850;
let h = 1100;

let font;
let fSize = 300; // font size
let msg = "MIT\nMEDIA\nLAB"; // text to write
let pts = []; // store path data
let minSize = 1;
let maxSize = 3;

let black, blue, red, yellow;

function preload() {
  // preload OTF font file
  font = loadFont("Raleway-ExtraBold.ttf");
}

function setup() {
  pixelDensity(1);
  createCanvas(8.5 * 150, 11 * 150); // create an 8.5x11 inch canvas at 150dpi

  // create 3 riso layers
  black = new Riso("slate");
  blue = new Riso("mediumblue");
  orange = new Riso("sunflower");
  yellow = new Riso("yellow");
  red = new Riso("red");
  noLoop();
}

let drawText = function (text) {
  let textImg = createGraphics(8.5 * 150, 11 * 150);
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
  let lineLength = 5
  points.forEach((p) => {
    canvas.strokeWeight(random([1, 2,3]));
    // canvas.stroke(random(50, 220))
    let strk = (map(p.y, extent.minY, extent.maxY, 220, 5))
    canvas.stroke(randomGaussian(strk, 10))
    canvas.point(p.x + xShift, p.y + yShift);
    //canvas.line(p.x + xShift, p.y + yShift - lineLength, p.x + xShift, p.y + yShift + lineLength)
  });
}

function NoiseMachine(min, max) {
  // std of noise on points should increase as we get closer to the bottom
  // of each letter.
  let getStd = d3.scalePow().exponent(3).domain([min, max]).range([0, 30]);
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
    let noiseLine = map(noise(p.x / 400, p.y / 400), 0, 1, min, max);
    let distToLine = map(abs(p.y - noiseLine), 0, height, 1, 0);
    let addNoise = d3.randomBernoulli(distToLine);

    if (p.y > noiseLine || addNoise()) {
      return {
        x: p.x + randomGaussian(0, noiseMachine((p.y - extent.minY))/2),
        y: p.y + abs(randomGaussian(0, noiseMachine(p.y - extent.minY))),
      };
    } else {
      return {
        x: p.x,
        y: p.y
      }
    }
    }
);
  return pts;
}


function draw() {
  let allCanvases = [blue, yellow, red];

  let msgs = msg.split("\n"); // split message by line
  let noiseRange = 10; // base noise for each layer

  ////////////////////////////////
  let x = 0;
  let y = 0;
  let r;

  msgs.forEach((msg) => {
    let letters = msg.split("");
    letters.forEach((l) => {
      canvases = _.sample(allCanvases, 2);
      canvases.forEach((c) => {
        // generate noise for each layer
        let xShift = randomGaussian(0, noiseRange / 2);
        let yShift = randomGaussian(0, noiseRange / 2);
        // get points to draw
        r = getTextPoints(l, x, y, (yPointDensity = random([1,2])), (xPointDensity = random([1,2])));
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
}

function mousePressed() {
  // when the user clicks, export the current image and stop
  // exportRiso();
  noLoop();
}