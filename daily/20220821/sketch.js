let SEED = Math.floor(Math.random() * 100000)
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"
let GUI

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]
const LINECOLOR = "#401F3E"
let dim;

// custom vars for this sketch
let particle_sets = [];
let perspT;

const settings = {
  number_of_particles: [1000, 100, 10000, 100],
  number_of_particle_sets: [4, 1, 20, 1],
  band_width: [0.03, 0.01, 0.9, 0.001],
  band_dist: [0.045, 0.01, 0.9, 0.001],
  zoom: [0.5, 0.1, 3, 0.01],
  particle_path_length: [500, 500, 10000, 100],
  particle_speed: [3, 1, 100, 1],
  noise_scale: [0.05, 0.01, 1., 0.01],
  noise_buffer: [0.2, 0.1, 1, 0.01],
  particle_curl: [2, 0.1, 10, 0.01],
  y_transform: [0.07, 0.01, 0.1, 0.001],
  x_transform: [0.8, 0.1, 0.9, 0.01],
  same_seed: [false],
  perspective_shift: [true],
  add_weird_alt: [true]
}


function preload() {
}


function recalculateTransform(c) {
  let transformedWidth = c.width - c.width * GUI.config.x_transform
  let transformedHeight = c.height - c.height * (0.4 + GUI.config.y_transform)
  var sourceCorners = [0, 0, c.width, 0, c.width, c.height, 0, c.height];
  var destCorners = [
    transformedWidth,
    transformedHeight,
    c.width - transformedWidth,
    transformedHeight,
    c.width - transformedWidth,
    c.height - transformedHeight,
    transformedWidth,
    c.height - transformedHeight,
  ]
  console.log(sourceCorners, destCorners)
  perspT = PerspT(sourceCorners, destCorners)
}

function redrawSketch() {
  clear();
  c.clear();
  redraw();
  c.redraw();
  c.background("#EFAF0E")
  if (!GUI.config.same_seed) {
    SEED = Math.floor(Math.random() * 100000)
    randomSeed(SEED);
    noiseSeed(SEED);
  }
  recalculateTransform(c)
  makeParticles()
}

function setup() {
  // setting modes and seeds
  colorMode(HSB);
  rectMode(CENTER);
  randomSeed(SEED);
  noiseSeed(SEED);


  dim = Math.min(windowWidth, windowHeight) * 0.8;
  rng = d3.randomLcg(random())

  // base canvas
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);
  background('#e7e7db');

  // our drawing canvas
  c = createGraphics(width * 0.9, height * 0.9)
  c.background("#EFAF0E")
  c.translate(c.width * 0.1, c.height * 0.075)

  // initialize gui
  GUI = new _GUI(settings)
  GUI.startGUI(redrawSketch)

  recalculateTransform(c)
  //perspectiveTransform

  makeParticles()
}


function draw() {
  // noLoop()
  background(bgCol);

  push()
  cc = color(LINECOLOR)
  cc.setAlpha(0.75)
  c.stroke(cc)
  c.strokeWeight(0.8);

  if (particle_sets == undefined) { }
  else if (particle_sets.length == GUI.config.number_of_particle_sets) {
    for (let i = 0; i < GUI.config.number_of_particle_sets; i++) {
      for (let j = 0; j < GUI.config.number_of_particles; j++) {
        if (particle_sets[i][j] == undefined) { }
        else {

          particle_sets[i][j].update(i)
          drawParticle(c, particle_sets[i][j])

        }
      }
    }
  }
  //display canvas
  image(c, width * 0.05, height * 0.05)
}

function drawParticle(c, p) {
  let bw = GUI.config.band_width / 2

  if (p.val > 0.5 - bw && p.val < 0.5 + bw) {
    c.push();
    if (GUI.config.perspective_shift) {

      let scale = map(p.pos.y, 0, 1.3, 0.33, 4)
      let scaledX = (map(p.pos.x, 0, 1, -1, 1) * width) + width / 2
      let scaledY = (map(p.pos.y, 0, 1, -1, 1) * height + p.altitude * 2500) + height / 2
      let _point = perspT.transform(
        scaledX, scaledY)
      // p.pos.x * width * scale, //map(p.pos.y, 0, 1, 0.66, 1.33),
      // p.pos.y * height * 3 + p.altitude * 2500)
      // (15 - p.altitude * 45))// + 1500 - p.altitude * 10)
      c.point(
        _point[0],
        _point[1]
      )
    } else {

      c.point(p.pos.x * c.width, p.pos.y * c.height)
    }
    c.pop();
    // c.translate(p.pos.x, this.pos.y + 10 - this.altitude * 40 * map(this.pos.y, 0, height + 100 * GUI.config.zoom, 1, 4));
    // c.rotate(this.angle);
    // c.point(0, 0)
    // randomGaussian(0, 0.05),
    // randomGaussian(0, 0.05))
    // c.point(0, 0);

  }
}
