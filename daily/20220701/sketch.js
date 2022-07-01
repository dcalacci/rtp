
let WIDTH = 1280
let HEIGHT = 1280
let gui;

let bgCol = "#f9f9f9"
// let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]
// palette: ["#D1C5DE", "#DEBFB6", "#A6C6C1", "#5297AB"],


const settings = {
  numLines: 5,
  palette: ["#D85F52", "#45998A", "#67839D", "#DDA606"],
  jitter: 4,
  density: 0.8,
  strokeWeight: 0.1,
  backgroundColor: "#f9f9f9",
  canvasColor: "#e4e4e4",
  alpha: 0.1
}

function keyPressed() {
  if (key == "s")
    save(new Date().toJSON() + ".png")
}

function preload() {

}

let c;
let rng;
let dim;

function setup() {
  gui = new dat.GUI();
  gui.useLocalStorage = true
  controllers = []
  controllers.push(gui.add(settings, "numLines", 0, 10, 1));
  controllers.push(gui.add(settings, "jitter", 0, 10, 0.01));
  controllers.push(gui.add(settings, "alpha", 0, 1, 0.01));
  controllers.push(gui.add(settings, "density", 0, 1, 0.1));
  controllers.push(gui.add(settings, "strokeWeight", 0, 5, 0.1));
  controllers.push(gui.addColor(settings, "backgroundColor"));
  controllers.push(gui.addColor(settings, "canvasColor"));

  // redraw everything on slider change for noLoop sketches.
  controllers.forEach((c) => c.onChange(() => { clear(); redraw() }))

  randomSeed(1243);
  colorMode(RGB);
  dim = Math.min(windowWidth, windowHeight) * 0.8;
  rectMode(CENTER);

  rng = d3.randomLcg(random())
}



function draw() {
  createCanvas(0.70 * dim, dim);
  c = createGraphics(width * 0.9, height * 0.9)
  colorMode(HSB)
  noLoop()
  noFill();
  background(settings.backgroundColor);

  /////////////////
  push()

  c.background(settings.canvasColor)
  c.translate(c.width * 0.1, c.height * 0.075)

  // Draw Here
  // let palette = _.sampleSize(settings.palette, settings.palette.length)
  let palette = settings.palette
  console.log("palette:", palette)

  _.range(settings.numLines - 1).forEach((i) => {
    console.log("painting lines...")
    drawPaintedRect({
      width: c.width * 0.8,
      height: d3.randomNormal(
        c.height / (2 * settings.numLines),
        (c.height / settings.numLines) / 8)(),
      canvas: c,
      density: settings.density,
      strokeWeight: settings.strokeWeight,
      jitter: settings.jitter,
      color: color(palette[i % palette.length]),
      alpha: settings.alpha
    })
    c.translate(0, c.height / settings.numLines)
  })

  pop()
  image(c, width * 0.05, height * 0.05)
}

getCloseColor = (c) => {
  return color(
    hue(c) + d3.randomNormal(0, 0.5)(),
    saturation(c) + d3.randomNormal(0, 5)(),
    brightness(c) + d3.randomNormal(0, 3)()
  )
  // var h = hue(c)
  // var s = saturation(c)
  // var b = brightness(c)
  // console.log("got color values:", h, s, b)
  // s = s + d3.randomNormal(0, 1)()
  // s = s + d3.randomNormal(0, 1)()
  // console.log("new saturation:", s)
  // return color(h, s, b)
}


drawPaintedRect = ({ canvas, width, height, strokeWeight, density, jitter, color, alpha }) => {
  console.log(canvas, width, height, density, jitter, color)
  let jt = d3.randomNormal.source(rng)(0, jitter)
  let lineWeight = strokeWeight;
  // increase number of layers with "density" param
  let drawProbability = 1 / 3 // just noodling around
  let nLayers = map(density || 1,
    0, 1,
    1, 2 / drawProbability) * 10

  canvas.push()
  // canvas.blendMode(BLEND)
  // console.log("rect color:", color)
  // console.log("close color:", getCloseColor(color))
  canvas.strokeWeight(lineWeight)
  let h = height || canvas.height
  let w = width || canvas.width
  let nLines = Math.ceil(h / lineWeight) + 1

  _.range(nLayers).forEach((i) => {
    canvas.push()
    canvas.translate(0, noise() / 4)
    _.range(nLines).forEach((n) => {
      let c = getCloseColor(color)
      c.setAlpha(alpha)
      canvas.stroke(c)
      canvas.strokeWeight(d3.randomNormal(lineWeight, 2))
      if (d3.randomBernoulli(1 / 3)() > 0) {
        //TODO: stray and errant lines here really bother me.
        // an alternative approach is to generate the start and end positions,
        // filter them for outliers, and then draw.
        canvas.push()
        // cheap way to "rotate" the lines on center
        canvas.line(
          0 - jt(), n * lineWeight + jt(),
          w + jt(), n * lineWeight + jt())
        canvas.pop()
      }
    })
    console.log("drawing..")
    canvas.pop()
  })

  canvas.pop()
}

