
let SEED = Math.floor(Math.random() * 100000)
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"
let GUI

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

const settings = {
  exampleSetting: [1., 0, 10, 0.1],
  shapeVelocity: [1., 0, 10, 0.1]
}

const settingValues = _.mapValues(settings, (o) => o[0])

function preload() {

}

function redrawSketch() {
  clear();
  c.clear();
  // redraw();
  c.redraw();
  c.background("#EFAF0E")
  if (!GUI.config.same_seed) {
    SEED = Math.floor(Math.random() * 100000)
    randomSeed(SEED);
    noiseSeed(SEED);
  }
  // recalculateTransform(c)
  // makeParticles()
}



function setup() {
  randomSeed(1243);
  colorMode(HSB);
  frameRate(60)

  rng = d3.randomLcg(random())

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);
  background(bgCol);
  // initialize gui
  GUI = new _GUI(settings)
  GUI.startGUI(redrawSketch)

  c = createGraphics(width * 0.9, height * 0.9)
  c.background("#EFAF0E")
  c.translate(c.width * 0.1, c.height * 0.075)

  rectMode(CENTER);

}

let Line = []
let Shapes = []

function draw() {
  noFill();
  push()
  background(200)
  // Draw here
  if (mouseIsPressed) {
    // console.log("mouse pressed...")
    // better approach is to use currentTime() here to adjust what points can close a shape
    Line.push([mouseX, mouseY, millis()]);
    // limit to 2 secs ago
    let oldLine = _.filter(Line, (p) => ((millis() - p[2]) / 1000) > 2)
    // let oldLine = _.take(Line, Line.length - 50)

    // last point within a radius of the mouse
    let lastPointIdx = _.findLastIndex(oldLine, xy =>
      Math.abs((xy[0] - mouseX)) < 2 &&
      Math.abs(xy[1] - mouseY) < 2)
    if (lastPointIdx > 0) {
      // get 
      let ShapeLine = _.slice(Line, start = lastPointIdx)
      Shapes.push(ShapeLine)
      Line = Line.slice(start = 0, end = lastPointIdx)
      endShape()
    }
  }

  // console.log("drawing shapes:", Shapes[0])
  for (let j = 0; j < Shapes.length; j++) {
    push()
    fill(0, 0, 0)
    // console.log("shape velocity:", settings.shapeVelocity)
    for (let i = 0; i < Shapes[j].length; i++) {
      Shapes[j][i][0] += map(noise(noise(frameCount * 1235)), 0, 1, -1, 1) * GUI.config.shapeVelocity;
      Shapes[j][i][1] += map(noise(noise(frameCount * 1224458)), 0, 1, -1, 1) * GUI.config.shapeVelocity;
    }
    beginShape()
    Shapes[j].map(xy => curveVertex(...xy))
    endShape(CLOSE)
    pop()
  }

  beginShape();

  //TODO: if I don't want the line to "continue",
  // we need to create "new" lines but still draww the old ones
  // so make an array of Lines, split whenever a shape is made, then
  // in the loop draw all old lines AND check for collisions.
  Line.map(([x, y, t]) => vertex(x, y))
  // Line.map(xy => c.vertex(...xy))
  // ^ alternatively you can use this shorter syntax: Line.map(xy=>vertex(...xy));
  endShape();
  //display canvas
  // translate(c.width * 0.1, c.height * 0.075)
  // image(c, width * 0.05, height * 0.05)
}
