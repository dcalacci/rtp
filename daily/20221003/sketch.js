
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
  background(50)
  strokeWeight(5)
  // Draw here
  if (mouseIsPressed) {
    // console.log("mouse pressed...")
    // better approach is to use currentTime() here to adjust what points can close a shape
    Line.push([mouseX, mouseY, millis()]);
    // limit to 2 secs ago
    let oldLine = _.filter(Line, (p) => ((millis() - p[2]) / 1000) > 0.5)
    // let oldLine = _.take(Line, Line.length - 50)

    // last point within a radius of the mouse
    let lastPointIdx = _.findLastIndex(oldLine, xy =>
      Math.abs((xy[0] - mouseX)) < 2 &&
      Math.abs(xy[1] - mouseY) < 2)

    if (lastPointIdx > 0) {
      let ShapeLine = _.slice(Line, start = lastPointIdx)
      Shapes.push({
        vertices: _.map(ShapeLine, ([x, y, t]) => [mouseX - x, mouseY - y, t]),
        noise: noise(noise(millis())),
        vNum: ShapeLine.length,
        vX: cos(noise(noise(millis()))) * random(1, -1),
        vY: sin(noise((millis()))) * random(1, -1),
        x: mouseX,
        y: mouseY,
        rotateSpeed: 100,
        t: millis()
      })
      Line = Line.slice(start = 0, end = lastPointIdx)
      endShape()
    }
  }

  for (let j = 0; j < Shapes.length; j++) {
    let Shape = Shapes[j]
    push()
    scale(map((millis() - Shape.t) / 1000, 0, 6, 1, 0))
    translate(Shape.x, Shape.y)
    push()
    let dr = TWO_PI / Shape.vNum
    // fill(0, 0, 0)

    blendMode(SCREEN)
    strokeWeight(10)
    fill(0, 0, 0)
    fill((j * 40 + (millis() - Shape.t) * 0.1) % 360, 69, 100, 80);
    stroke((j * 40 + (millis() - Shape.t) * 0.1) % 360, 69, 100, 20);
    rotate(frameCount / Shape.rotateSpeed)
    beginShape()
    // downsampling...
    Shape.vertices = _.sortBy(_.sampleSize(Shape.vertices, Shape.vNum), x => x[2])
    for (let i = 0; i < Shape.vertices.length; i++) {
      curveVertex(
        Shape.vertices[i][0] + 20 * cos(noise(i * (millis() - Shape.t) / 5000)),
        Shape.vertices[i][1] + 20 * sin(noise(i * (millis() - Shape.t) / 5000)))
    }
    endShape(CLOSE)
    // if (frameCount % 10 == 0) {
    //   Shape.vNum -= random(1, 3)
    // }
    Shape.x += Shape.vX
    Shape.y += Shape.vY
    pop()
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
