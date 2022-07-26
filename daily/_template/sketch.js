
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

const settings = {
  exampleSetting: [1., 0, 10, 0.1],
}

const settingValues = _.mapValues(settings, (o) => o[0])


function mousePressed() {
  // saves both image and the json of current settings
  fname = 'daily_' + new Date().toJSON()
  save(fname + "_" + seed + ".png")
  saveJSON(settings, fname + ".json")
}

function preload() {

}

function _startGUI() {
  gui = new dat.GUI();
  gui.useLocalStorage = true
  controllers = []
  _.forEach(settings, (([dd, min, max, step], k) => {
    controllers.push(gui.add(defaults, k, min, max, step));
  }))

  // adds redraw button
  var obj = { REDRAW: function() { redraw() } };
  controllers.push(gui.add(obj, 'REDRAW'))
  controllers.forEach((con) => con.onChange(() => { clear(); redraw() }))
}

function setup() {
  randomSeed(1243);
  colorMode(HSB);

  _startGUI()

  rng = d3.randomLcg(random())

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);

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
