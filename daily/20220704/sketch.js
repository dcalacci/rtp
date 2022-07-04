
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

  colorMode(RGB);
  pixelDensity(1)
  dim = Math.min(windowWidth, windowHeight);
  rectMode(CENTER);

  rng = d3.randomLcg(random())
  seed = floor(d3.randomUniform(0, 1000)())

  noiseSeed(seed)
  randomSeed(seed);
}



function draw() {
  createCanvas(0.70 * dim, dim);
  c = createGraphics(width, height)
  colorMode(HSB)
  noLoop()
  noFill();
  background(settings.backgroundColor);

  ///////////////// drawing rect
  // Draw Here
  let palette = palettes[settings.palette]
  console.log("palette:", palette)
  console.log(c.width, c.height)
  //draw background
  c.push()
  c.translate(c.width * 0.05, c.height * 0.05)
  let rectColor = _.sample(palette)

  drawPaintedRect({
    width: c.width * 0.9,
    height: c.height,
    canvas: c,
    density: settings.density,
    strokeWeight: settings.strokeWeight,
    hJitter: settings.hJitter,
    vJitter: settings.vJitter,
    color: rectColor,     // color: "#F3D1C8",
    colorVariance: settings.colorVariance,
    alpha: settings.alpha,
  })
  c.pop()

  // draw line
  let path = makeParticlePath({
    scale: 0.005,
    strength: 20,
    speed: 0.09,
    length: random(10000, 50000)
  })

  push()
  c.fill(0)
  translate(c.width * 0.05, c.height * 0.05)
  drawPaintedPath({
    canvas: c,
    density: 0.5,
    strokeWeight: 0.1,
    hJitter: 0.1,
    vJitter: 0.05,
    // color: _.sample(palette),
    color: _.sample(_.without(palette, rectColor)),
    colorVariance: 0.3,
    alpha: 0.2,
    path,
    thickness: 20,
    width: c.width * 0.9,
    height: c.height * 0.9,
    stripes: true
  })
  pop()
  image(c, 0, 0)
}


function getCloseColor(c, variance) {
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

function makeParticlePath({ scale = .01, speed = 0.1, strength = 1, length = 8000 }) {
  var loc = createVector(random(0, 100), random(0, 100), 2);
  var angle = 0; //any value to initialize
  var dir = createVector(cos(angle), sin(angle));
  // var speed = random(5,map(mouseX,0,width,5,20));   // faster
  let pp = new Particle(loc, dir, speed, scale, strength);
  _.range(length).forEach(() => {
    console.log('.')
    pp.run()
  })
  return pp.path
}

function makePath({ scale = .01, length = random(4000, 10000) }) {
  let t = 0
  let path = []
  _.range(length).forEach(() => {
    var x = noise((t + 10) * scale);
    var y = noise((t + 5) * scale);
    path.push({ x, y })
    t += 1
  })
  return path
}


class Particle {
  constructor(_loc, _dir, _speed, _scale, _strength) {
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.scale = _scale;
    this.strength = _strength;
    this.path = []
    // var col;
  }
  run() {
    this.move();
    // this.checkEdges();
    this.path.push({ x: this.loc.x / 100, y: this.loc.y / 100 })
  }
  move() {
    let angle = noise(
      this.loc.x * this.scale,
      this.loc.y * this.scale,
      frameCount * this.scale) * TWO_PI * this.strength; //0-2PI
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    var vel = this.dir.copy();
    var d = 1;  //direction change 
    vel.mult(this.speed * d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
  }
  checkEdges() {
    //float distance = dist(width/2, height/2, loc.x, loc.y);
    //if (distance>150) {
    if (this.loc.x < 0 || this.loc.x > 100 || this.loc.y < 0 || this.loc.y > 100) {
      // console.log("randomizing...", this.loc)
      this.loc.x = random(100);
      this.loc.y = random(100);
    }
  }
}


drawPaintedPath = ({
  canvas,
  strokeWeight,
  density,
  vJitter,
  hJitter,
  color,
  colorVariance,
  alpha,
  path,
  thickness,
  width,
  height,
  stripes = false,
  texture = false
}) => {
  let h_jt = d3.randomNormal.source(rng)(0, hJitter)
  let v_jt = d3.randomNormal.source(rng)(0, vJitter)
  // nLines*.5 above and nLines*.5 below the path, yes?
  let nLines = ceil(thickness / strokeWeight) + 1
  let nn = floor(nLines / 2)
  _.range(-nn, nn).forEach((n) => {
    const pDrawLine = d3.randomBernoulli(map(density, 0, 1, 0.3, 1))()
    canvas.push()
    let c = getCloseColor(color, colorVariance) // varies color for each line
    c.setAlpha(alpha)
    canvas.stroke(c)
    canvas.fill(c)
    canvas.strokeWeight(d3.randomNormal(strokeWeight, 2)())

    canvas.translate(-n * strokeWeight, n * strokeWeight)

    let drawStripe = d3.randomBernoulli(0.2)() > 0
    if (pDrawLine > 0) {
      path.forEach(({ x, y }) => {
        canvas.push()
        canvas.translate(h_jt(), v_jt())
        // don't draw out of bounds
        x = x * width
        y = y * height
        // if (!(x > width || y > width || y < 0 || x < 0) &&
        if (d3.randomBernoulli(0.9)() > 0) { // 10% 'dropout'
          canvas.circle(
            x,
            y,
            strokeWeight)
        }
        canvas.pop()
        if (texture) {
          if (d3.randomBernoulli(0.1)() > 0) {
            // let t = floor(thickness / 5)
            // if (n % t == 0 && Math.abs(n) > 2) {
            canvas.push()
            canvas.stroke(0)
            canvas.fill(0)
            canvas.strokeWeight(strokeWeight / 10)
            canvas.circle(x, y, strokeWeight / 10)
            canvas.pop()
            // }
          }
        } else if (stripes && drawStripe) {
          canvas.push()
          canvas.stroke(0)
          canvas.fill(0)
          canvas.strokeWeight(strokeWeight / 10)
          canvas.circle(x, y, strokeWeight / 10)
          canvas.pop()

        }
      })
    }
    canvas.pop()
  })
}

drawPaintedRect = ({
  canvas,
  width,
  height,
  strokeWeight,
  density,
  vJitter,
  hJitter,
  color,
  colorVariance,
  alpha,
}) => {
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

  _.range(nLayers).forEach((i) => {
    let nLines = Math.ceil(h / strokeWeight) + 1
    canvas.push()
    canvas.translate(0, d3.randomNormal.source(rng)(0, 0.5)())
    // randomizes if we draw from R->L or L->R
    let direction = random([-1, 1])
    _.range(nLines).forEach((n) => {
      let c = getCloseColor(color, colorVariance) // varies color for each line
      c.setAlpha(alpha)
      canvas.stroke(c)
      canvas.fill(c)
      canvas.strokeWeight(d3.randomNormal(strokeWeight, 2)())

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
  })
  console.log("drawing..")
  canvas.pop()
}
