
let WIDTH = 1280
let HEIGHT = 1280
let gui;

let bgCol = "#f9f9f9"

let palettes = [
  ["#D1C5DE", "#DEBFB6", "#A6C6C1", "#5297AB"],
  ["#D85F52", "#45998A", "#67839D", "#DDA606"]
]


const settings = {
  palette: 0,
  vJitter: 0.05,
  hJitter: 0.1,
  density: 0.9,
  strokeWeight: 1,
  backgroundColor: "#f9f9f9",
  canvasColor: "#e4e4e4",
  alpha: 0.9,
  colorVariance: 0.2,
  shape: 0  // 0: lines; 1: dots
}

function keyPressed() {
  if (key == "s") {
    fname = new Date().toJSON()
    save(fname + ".png")
    saveJSON(settings, fname + ".json")
  }
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
  controllers.push(gui.add(settings, "palette", 0, palettes.length, 1));
  controllers.push(gui.add(settings, "vJitter", 0, 5, 0.01));
  controllers.push(gui.add(settings, "hJitter", 0, 5, 0.05));
  controllers.push(gui.add(settings, "density", 0, 1, 0.1));
  controllers.push(gui.add(settings, "strokeWeight", 0, 5, 0.1));
  controllers.push(gui.add(settings, "alpha", 0, 1, 0.01));
  controllers.push(gui.add(settings, "colorVariance", 0, 1, 0.01));
  controllers.push(gui.addColor(settings, "backgroundColor"));
  controllers.push(gui.addColor(settings, "canvasColor"));

  // redraw everything on slider change for noLoop sketches.
  controllers.forEach((c) => c.onChange(() => { clear(); redraw() }))

  randomSeed(1243);
  colorMode(RGB);
  pixelDensity(2)
  dim = Math.min(windowWidth, windowHeight);
  rectMode(CENTER);

  rng = d3.randomLcg(random())
}



function draw() {
  createCanvas(0.70 * dim, dim);
  c = createGraphics(width, height)
  colorMode(HSB)
  noLoop()
  noFill();
  background(settings.backgroundColor);

  // randomly order our palette
  // let palette = _.sampleSize(settings.palette, settings.palette.length)

  ///////////////// drawing rect
  push()

  // Draw Here
  let palette = palettes[settings.palette]
  console.log("palette:", palette)
  console.log(c.width, c.height)
  //draw background
  c.translate(c.width * 0.05, c.height * 0.05)
  drawPaintedRect({
    width: c.width * 0.9,
    height: c.height,
    canvas: c,
    density: settings.density,
    strokeWeight: settings.strokeWeight,
    hJitter: settings.hJitter,
    vJitter: settings.vJitter,
    color: _.sample(palette),
    // color: "#F3D1C8",
    colorVariance: settings.colorVariance,
    alpha: settings.alpha,
  })
  pop()

  // draw line

  push()

  let path = makePath()
  drawPaintedRect({
    width: c.width * 0.9,
    height: c.height,
    canvas: c,
    density: settings.density,
    strokeWeight: settings.strokeWeight,
    hJitter: settings.hJitter,
    vJitter: settings.vJitter,
    color: _.sample(palette),
    // color: "#F3D1C8",
    colorVariance: settings.colorVariance,
    alpha: settings.alpha,
    path
  })
  //OLD
  let m_rnd = d3.randomNormal(0, 3)
  drawLine(c)
  _.range(2).forEach((n) => {
    c.translate(m_rnd(), m_rnd())
    c.rotate(m_rnd() / 1000)
    drawLine(c)
    pop()
  })
  image(c, 0, 0)
}

getCloseColor = (c, variance) => {
  let std_h = map(variance, 0, 1, 0, 1)
  let std_s = map(variance, 0, 1, 0, 2)
  let std_b = map(variance, 0, 1, 0, 1.5)
  return color(
    hue(c) + d3.randomNormal(0, std_h)(),
    saturation(c) + d3.randomNormal(0, std_s)(),
    brightness(c) + d3.randomNormal(0, std_b)()
  )
}


// TODO: how to draw similar "painted lines" but along a random path
function drawLine(c) {

  let path = makePath()
  c.push()
  path.forEach(({ x, y }) => {
    c.noStroke()
    c.fill(0, 20)
    d = random(0.002 * c.height, 0.003 * c.height);
    c.circle(x, y, d);
  })
  c.pop()
}

function makePath() {
  let t = 0
  let lineLength = random(4000, 10000)
  let path = []
  _.range(lineLength).forEach((l) => {
    var x = noise((t + 10) / 10);
    var y = noise((t + 5) / 10);
    path.push({ x, y })
    t += 0.01
  })
}


drawPaintedRect = ({ canvas,
  width,
  height,
  strokeWeight,
  density,
  vJitter,
  hJitter,
  color,
  colorVariance,
  alpha,
  // path: 
  // - 0: horizontal, across screen (flat)
  // - 1: set of points (path) for 'brush; to follow.
  path }) => {
  let h_jt = d3.randomNormal.source(rng)(0, hJitter)
  let v_jt = d3.randomNormal.source(rng)(0, vJitter)
  // original: increase number of layers with "density" param
  // let drawProbability = 1 / 3 // just noodling around
  // let nLayers = map(density || 1,
  //   0, 1,
  //   1, 2 / drawProbability) * 10
  // just move number of layers around
  let nLayers = map(density,
    0, 1,
    1, 5)

  canvas.push()
  canvas.blendMode(BLEND)
  canvas.strokeWeight(strokeWeight)
  let h = height || canvas.height
  let w = width || canvas.width
  let nLines = Math.ceil(h / strokeWeight) + 1

  _.range(nLayers).forEach((i) => {
    canvas.push()
    canvas.translate(0, d3.randomNormal.source(rng)(0, 0.5)())
    let c = getCloseColor(color, colorVariance) // varies color for each line
    c.setAlpha(alpha)
    canvas.stroke(c)
    canvas.fill(c)
    canvas.strokeWeight(d3.randomNormal(strokeWeight, 2)())
    // randomizes if we draw from R->L or L->R
    if (path == 0) {
      let direction = random([-1, 1])
      _.range(nLines).forEach((n) => {
        // scale p to draw a line
        const pDrawLine = d3.randomBernoulli(map(density, 0, 1, 0.3, 1))()
        let N = map(density, 0, 1, 50, 200)
        canvas.push()
        if (pDrawLine > 0) {
          //TODO: stray and errant lines here really bother me.
          // an alternative approach is to generate the start and end positions,
          // filter them for outliers, and then draw.
          // cheap way to "rotate" the lines on center instead of at start of draw
          // adding some randomness here avoids a dot-matrix effect
          N = N + floor(random(-10, 10))

          _.range(N).forEach((i) => {
            // change direction. we do this so we're not rotatating same direction
            // each time. If you do, you get a kind of dissolving effect which is nice,
            let j = direction < 0 ? N - i : i
            canvas.translate(h_jt(), v_jt())
            let d = w / N;
            if (d3.randomBernoulli(0.9)() > 0) // 10% 'dropout'
              canvas.circle(
                j * d,
                n * strokeWeight * 0.9,
                strokeWeight)
          })
        }
        canvas.pop()
      })
    } else if (path.length > 1) {
      // nLines*.5 above and nLines*.5 below the path, yes?
      let nn = floor(nLines / 2)
      _.range(-nn, nn).forEach((n) => {
        const pDrawLine = d3.randomBernoulli(map(density, 0, 1, 0.3, 1))()
        canvas.push()
        canvas.translate(n, n)
        let N = map(density, 0, 1, 50, 200)
        if (pDrawLine > 0) {
          path.forEach(({ x, y }) => {
            if (d3.randomBernoulli(0.9)() > 0) // 10% 'dropout'
              canvas.circle(
                x,
                y,
                strokeWeight)
          })
        }
      })
    }
  })
  console.log("drawing..")
  canvas.pop()
}

