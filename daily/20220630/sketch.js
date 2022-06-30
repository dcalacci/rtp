
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

function mousePressed() {
  save(new Date().toJSON() + ".png")
}

function preload() {

}

let c;
let rng;

function setup() {
  randomSeed(1243);
  colorMode(HSB);
  rng = d3.randomLcg(random())

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);

  rectMode(CENTER);

  c = createGraphics(width * 0.9, 500)
}

function draw() {
  noLoop()
  background(bgCol);
  noFill();

  push()
  c.background(240)
  c.translate(c.width * 0.1, c.width * 0.1)
  drawPaintedRect({
    width: c.width * 0.8,
    height: c.height / 5,
    canvas: c,
    density: 0.4,
    jitter: 1,
    color: color(269, 11, 87)
    // color: "#D1C5DE"
  })
  pop()
  image(c, width * 0.05, width * 0.05)
}


drawPaintedRect = ({ canvas, width, height, density, jitter, color }) => {
  let jt = d3.randomNormal.source(rng)(0, jitter)
  let lineWeight = 2;
  // increase number of layers with "density" param
  let drawProbability = 1 / 3
  let nLayers = map(density || 1, 0, 1, 1, 2 / drawProbability) * 10

  push()
  color.setAlpha(0.3)
  canvas.strokeWeight(lineWeight)
  canvas.stroke(color)
  let h = height || canvas.height
  let w = width || canvas.width
  let nLines = Math.ceil(h / lineWeight) + 1

  _.range(nLayers).forEach((i) => {
    push()
    canvas.translate(0, jt() / 2)
    canvas.rotate(jt() * 0.001) // rotate ever so slightly
    _.range(nLines).forEach((n) => {
      if (d3.randomBernoulli(1 / 3)() > 0) {
        canvas.line(
          0 - jt(), n * lineWeight,
          w + jt(), n * lineWeight)
      }
    })
    pop()
  })

  pop()
}
