
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
  c = createGraphics(width * 0.9, height * 0.9)
}

function draw() {
  noLoop()
  background(bgCol);
  noFill();

  push()
  c.background(240)
  c.translate(c.width * 0.1, c.height * 0.075)
  let w = c.width * 0.8
  let h = c.height / 5

  drawPaintedRect({
    width: w,
    height: h,
    canvas: c,
    density: 0.8,
    jitter: 2.2,
    color: color(269, 11, 87)
  })

  c.translate(0, h + c.height * 0.1)
  drawPaintedRect({
    width: c.width * 0.8,
    height: c.height / 10,
    canvas: c,
    density: 0.7,
    jitter: 1.8,
    color: color(171, 16, 78)
  })

  c.translate(0, c.height / 10 + c.height * 0.1)
  drawPaintedRect({
    width: c.width * 0.8,
    height: c.height / 8,
    canvas: c,
    density: 0.6,
    jitter: 1.5,
    color: color(0, 13, 90)
  })

  c.translate(0, c.height / 8 + c.height * 0.1)
  drawPaintedRect({
    width: c.width * 0.8,
    height: c.height / 8,
    canvas: c,
    density: 0.5,
    jitter: 1.8,
    // color: color(222, 90, 50)
    color: color(222, 73, 50)
  })
  pop()
  image(c, width * 0.05, height * 0.05)
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
    canvas.push()
    canvas.translate(0, jt() / 2)
    _.range(nLines).forEach((n) => {
      if (d3.randomBernoulli(1 / 3)() > 0) {
        //TODO: stray and errant lines here really bother me.
        // an alternative approach is to generate the start and end positions,
        // filter them for outliers, and then draw.
        canvas.push()
        canvas.line(
          0 - jt(), n * lineWeight + jt(),
          w + jt(), n * lineWeight + jt())
        canvas.pop()
      }
    })
    canvas.pop()
  })

  pop()
}
