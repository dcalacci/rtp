
let SEED = Math.floor(Math.random() * 100000)
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"
let GUI

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

const settings = {
  exampleSetting: [1., 0, 10, 0.1],
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
  // fill(255, 0, 0)
  // console.log("drawwing...")

  push()
  background(200)
  // Draw here
  if (mouseIsPressed) {
    // console.log("mouse pressed...")
    // better approach is to use currentTime() here to adjust what points can close a shape
    Line.push([mouseX, mouseY]);
    let oldLine = _.take(Line, Line.length - 50)

    let lastPointIdx = _.findLastIndex(oldLine, xy => Math.abs((xy[0] - mouseX)) < 1 && Math.abs(xy[1] - mouseY) < 1)
    if (lastPointIdx > 0) {
      console.log("CLOSED SHAPE")
      console.log(lastPointIdx, mouseX, mouseY)
      let ShapeLine = _.slice(oldLine, start = lastPointIdx)
      console.log("shapeline length", ShapeLine.length)
      Shapes.push(ShapeLine)
      Line = Line.slice(start = 0, end = lastPointIdx)
      endShape()
    }
  }

  // console.log("drawing shapes:", Shapes[0])
  for (let j = 0; j < Shapes.length; j++) {
    push()
    fill(0, 0, 0)
    beginShape()
    Shapes[j].map(xy => vertex(...xy))
    endShape(CLOSE)
    pop()
  }

  for (let i = 0; i < Line.length; i++) {
    Line[i][0] += map(noise(frameCount * 17362), 0, 1, -1, 1);
    Line[i][1] += map(noise(frameCount * 12341234), 0, 1, -1, 1);
  }
  beginShape();

  //TODO: if I don't want the line to "continue",
  // we need to create "new" lines but still draww the old ones
  // so make an array of Lines, split whenever a shape is made, then
  // in the loop draw all old lines AND check for collisions.
  Line.map(xy => vertex(...xy))
  // Line.map(xy => c.vertex(...xy))
  // ^ alternatively you can use this shorter syntax: Line.map(xy=>vertex(...xy));
  endShape();
  //display canvas
  // translate(c.width * 0.1, c.height * 0.075)
  // image(c, width * 0.05, height * 0.05)
}
