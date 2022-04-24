// var gui = createGui('blobs');

var COLOR_MODE = 'layers'
var MAX_LENGTH = 70;
var MIN_LENGTH = 20;
var ALLOW_COLLISION = true
var NOISE_RESOLUTION = 200
var VELOCITY_SCALER = 2.0
var BLOB_VERTICES = 10
var BLOB_1 = 40
var BLOB_2 = 50

var particles = [];
// var colors = ["#3DB2FF", "#FFB830", "#FF2442", "#FF7600", "#185ADB", "#0A1931", "#99154E"];

var colors;
var n, s, maxR;

var particleImage;

let colorIndex = 0

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#F8F6F5");

  let baseColor = [
    Math.floor(Math.random() * 250),
    Math.floor(Math.random() * 250),
    Math.floor(Math.random() * 250)
  ];
  const triadic3 = color((hue(baseColor) + 240) % 360, saturation(baseColor), brightness(baseColor));
  const tetradic2 = color((hue(baseColor) + 60) % 360, saturation(baseColor), brightness(baseColor));
  const complementary = color((hue(baseColor) + 180) % 360, saturation(baseColor), brightness(baseColor));
  const analogous1 = color((hue(baseColor) + 330) % 360, saturation(baseColor), brightness(baseColor));
  colors = [analogous1, baseColor, triadic3, tetradic2, complementary]

  smooth();

  n = 150;
  s = 15;
  maxR = height / 2 - height * 0.05;
  frameRate(60)

  particleImage = createGraphics(width, height)
  particleImage.noStroke();
  mask = createGraphics(width, height)
  mask.fill(255)
}

function draw() {

  blendMode(BLEND);
  // push()
  // image(blob, 0, 0)

  // pop()
  //
  // translate(width / 2, height / 2)
  //
  //

  drawBlob(mask, width / 2, height / 2, BLOB_VERTICES, BLOB_1, BLOB_2, 14, 20)

  if (s > 1) {
    console.log(s)

    if (particles.length != 0) {
      for (let i = 0; i < particles.length; i++) {
        var p = particles[i];

        // particleImage.translate(width / 2, height / 2)
        // translate(width / 2, height / 2)
        p.show();
        p.move();

        if (p.isDead()) particles.splice(i, 1);
      }
    } else {
      s -= 3;
      colorIndex += 1
      initParticles(particleImage, colorIndex);
    }
  }

  // image(particleImage, 0, 0)
  // particleImage.mask(mask)
  // masked = particleImage.get().mask(mask)
  (masked = particleImage.get()).mask(mask)
  image(masked, 0, 0)
}

function initParticles(img, c) {

  // let c = COLOR_MODE == 'layers' ? colors[int(random(colors.length))] : 'RANDOM';
  console.log('color', c)
  let color = COLOR_MODE == 'layers' ? colors[c] : 'RANDOM';
  for (let i = 0; i < n; i++) {
    let maxLife = random(MIN_LENGTH, MAX_LENGTH);
    particles.push(new Particle(img, maxR, s, maxLife, color));
  }
}

class Particle {

  constructor(img, maxR_, s_, maxLife_, c_) {
    this.img = img;
    this.c = c_ == 'RANDOM' ? colors[int(random(colors.length))] : c_;
    this.s = s_;
    this.maxR = maxR_;
    this.life = maxLife_;
    this.init();
  }

  init() {
    this.pos = p5.Vector.random2D();
    this.pos.normalize();
    this.pos.mult(random(2, maxR));

    this.vel = createVector();
  }

  show() {
    // draw in center
    this.img.push()
    this.img.translate(width / 2, height / 2)

    this.img.fill(this.c);
    this.img.ellipse(this.pos.x, this.pos.y, this.s, this.s);

    this.img.pop()
    this.life -= 1;
  }

  move() {
    var angle = noise(
      this.pos.x / NOISE_RESOLUTION,
      this.pos.y / NOISE_RESOLUTION) * TAU;

    this.vel.set(cos(angle), sin(angle));
    this.vel.mult(VELOCITY_SCALER);
    this.pos.add(this.vel);
  }


  isDead() {
    var d = dist(this.pos.x, this.pos.y, 0, 0);

    if (d > this.maxR || this.life < 1) return true;
    else return false;
  }
}

// 12, 45, 15, 150

function drawBlob(mask, x, y, n_vertices, r, nm, sm, fcm) {
  mask.push();
  mask.translate(x, y);
  // rotate(frameCount / fcm);
  let dr = TWO_PI / n_vertices;
  mask.beginShape();
  // make sure at least 3 vertices
  for (let i = 0; i < n_vertices + 3; i++) {
    let ind = i % n_vertices;
    let rad = dr * ind;
    let r = (height * 0.25 +
      noise(1200 / nm + ind) *
      height * 0.1 +
      sin(1200 / sm + ind) *
      height *
      0.05);
    mask.curveVertex(
      cos(rad) * r,// * r,
      sin(rad) * r);
  }
  mask.endShape();
  mask.pop();
}
