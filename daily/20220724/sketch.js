
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]


// default, min, max, step
const settings = {
  stdScale: [1., 0, 10, 0.1],
  nLayers: [50, 10, 200, 1],
  polyRadius1: [100, 20, 500, 10],
  noiseScale: [10, 1, 200, 1],
  polyDeformN: [4, 2, 8, 1],
  polyDeformVar: [0.2, 0.1, 2.0, 0.01],
  polyLayerStdX: [20, 0, 200, 1],
  polyLayerStdY: [20, 0, 200, 1],

  alpha1: [0.05, 0.01, 0.8, 0.01],
  poly1X: [0, -WIDTH / 2, WIDTH / 2, 1],
  poly1Y: [0, -HEIGHT / 2, HEIGHT / 2, 1],

  polyRadius2: [100, 20, 500, 10],
  alpha2: [0.05, 0.01, 0.8, 0.01],
  poly2X: [0, -WIDTH / 2, WIDTH / 2, 1],
  poly2Y: [0, -HEIGHT / 2, HEIGHT / 2, 1],

}

const defaults = _.mapValues(settings, (o) => o[0])

let seed = 1243
function keyPressed() {
  if (key == "s") {
    fname = new Date().toJSON()
    save(fname + "_" + seed + ".png")
    saveJSON(settings, fname + ".json")
  }
}

function preload() {

}

let c;
let rng;
let dim;

function setup() {
  randomSeed(1243);
  colorMode(HSB);
  noStroke()
  gui = new dat.GUI();
  gui.useLocalStorage = true
  controllers = []
  _.forEach(settings, (([dd, min, max, step], k) => {
    controllers.push(gui.add(defaults, k, min, max, step));
  }))

  var obj = { REDRAW: function() { redraw() } };
  controllers.push(gui.add(obj, 'REDRAW'))
  controllers.forEach((con) => con.onChange(() => { clear(); redraw() }))

  rng = d3.randomLcg(random())

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);
  rectMode(CENTER);
}

function draw() {
  c = createGraphics(width * 0.9, height * 0.9)
  c.noStroke()

  noLoop()
  background(bgCol);
  noFill();

  push()
  c.background(240)
  c.translate(c.width / 2, c.height / 2)
  drawBrushMark(c, defaults)
  c.translate(c.width * 0.1, c.height * 0.075)
  image(c, width * 0.05, height * 0.05)
  pop()
}