
let SEED = Math.floor(Math.random() * 100000)
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"
let GUI

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

const settings = {
  exampleSetting: [1., 0, 10, 0.1],
  same_seed: [false],
}

const settingValues = _.mapValues(settings, (o) => o[0])


// function mousePressed() {
//   // saves both image and the json of current settings
//   fname = 'daily_' + new Date().toJSON()
//   save(fname + "_" + SEED + ".png")
//   saveJSON(settings, fname + ".json")
// }

function preload() {

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
}

function setup() {
  randomSeed(1243);
  colorMode(HSB);

  rng = d3.randomLcg(random())

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);

  // initialize gui
  GUI = new _GUI(settings)
  GUI.startGUI(redrawSketch)

  c = createGraphics(width * 0.9, height * 0.9)
  c.translate(c.width * 0.1, c.height * 0.075)

  rectMode(CENTER);

}

function draw() {
  c = createGraphics(width * 0.9, height * 0.9)
  noLoop()
  background(bgCol);
  noFill();

  push()
  c.background(240)
  // Draw here

  //display canvas
  c.translate(c.width * 0.1, c.height * 0.075)
  image(c, width * 0.05, height * 0.05)
}
