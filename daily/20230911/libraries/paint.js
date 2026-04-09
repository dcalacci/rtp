
//recursive deform
function deform(poly, n, variance) {
  if (n == 0) return poly
  let res = []
  for (let i = 0; i < poly.length - 1; i++) {
    let curr = poly[i].slice()
    let next = poly[i + 1].slice()
    let len = Math.sqrt(Math.pow(curr[0] - next[0], 2),
      Math.pow(curr[1] - next[1], 2))
    let mid = [(curr[0] + next[0]) / 2, (curr[1] + next[1]) / 2];
    mid[0] = randomGaussian(mid[0], variance * len)
    mid[1] = randomGaussian(mid[1], variance * len)
    let inner = deform([curr, mid, next], n - 1,
      variance)
    res = res.concat(inner)
  }
  return res
}

function poly(radius, n) {
  let res = []
  radius = radius || 30.0
  n = n || 6
  let angle = (Math.PI * 2) / n
  for (let i = 0; i < n; i++) {
    res.push([Math.sin(i * angle) * radius,
    Math.cos(i * angle) * radius])
  }
  return res
}

function drawPoly(c, poly) {
  c.beginShape()
  for (let pt of poly) c.vertex(pt[0], pt[1])
  c.endShape(CLOSE)
}

function rep(fn, d, n) {
  let res = d
  for (let i = 0; i < n; i++) res = fn(res)
  return res
}

function drawBrushMark(c, settings) {
  c.push()
  c.noStroke()
  c.colorMode(HSB)

  let redLayers = new Array(settings.nLayers).fill()
    .map((x, i) => deform(
      poly(settings.polyRadius1,
        noise(i) * settings.noiseScale),
      settings.polyDeformN, settings.polyDeformVar))

  let yellowLayers = new Array(settings.nLayers).fill()
    .map((x, i) => deform(
      poly(settings.polyRadius2,
        noise(i) * settings.noiseScale),
      settings.polyDeformN, settings.polyDeformVar))

  for (let i = 0; i < redLayers.length + yellowLayers.length; i++) {
    if (Math.floor(i / 5) % 2 == 0) {
      c.fill(351, 32, 98, settings.alpha1)
      c.push()
      c.translate(
        randomGaussian(settings.poly1X, settings.polyLayerStdX),
        randomGaussian(settings.poly1Y, settings.polyLayerStdY))
      drawPoly(c, redLayers[i % redLayers.length])
      c.pop()
    } else if (Math.floor(i / 5) % 2 == 1) {
      c.fill(271, 32, 98, settings.alpha2)
      c.push()
      c.translate(
        randomGaussian(settings.poly2X, settings.polyLayerStdX),
        100 + randomGaussian(settings.poly2Y, settings.polyLayerStdY))
      drawPoly(c, yellowLayers[i % yellowLayers.length])
      c.pop()
    }

  }


}

///////////////////////////////////////////////////////////////////////

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

// particle -> path using p noise
function makeParticlePath({ scale = .01, speed = 0.1, strength = 1, length = 8000 }) {
  var loc = createVector(random(0, 100), random(0, 100), 2);
  var angle = 0; //any value to initialize
  var dir = createVector(cos(angle), sin(angle));
  // var speed = random(5,map(mouseX,0,width,5,20));   // faster
  let pp = new Particle(loc, dir, speed, scale, strength);
  _.range(length).forEach(() => {
    pp.run()
  })
  return pp.path
}

// creates a "path" of x/y coords using perlin noise len length
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
  lineMode = 0,
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
          // textured noise along the ribbon
          if (d3.randomBernoulli(0.1)() > 0) {
            // let t = floor(thickness / 5)
            // if (n % t == 0 && Math.abs(n) > 2) {
            canvas.push()
            canvas.stroke(0)
            canvas.fill(0)
            canvas.strokeWeight(strokeWeight / 10)
            canvas.circle(x, y, strokeWeight / 10)
            canvas.pop()
          }
        } else if (stripes) {
          // stripes along the ribbon 
          let t = floor(thickness / 5)
          if (n % t == 0 && Math.abs(n) > 2) {
            canvas.push()
            canvas.stroke('#fff')
            canvas.fill('#fff')
            if (lineMode == 1) {
              canvas.strokeWeight(d3.randomNormal(strokeWeight, 0.5)())
            }
            // canvas.strokeWeight(strokeWeight)
            canvas.circle(x, y, strokeWeight / 2)
            canvas.pop()
          }
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
