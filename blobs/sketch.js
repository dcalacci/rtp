// var gui = createGui('blobs');

var COLOR_MODE = 'layers'
var MAX_LENGTH = 150;
var MIN_LENGTH = 50;
var ALLOW_COLLISION = true
var NOISE_RESOLUTION = 600
var VELOCITY_SCALER = 1.0

var particles = [];
// var colors = ["#3DB2FF", "#FFB830", "#FF2442", "#FF7600", "#185ADB", "#0A1931", "#99154E"];

var colors;
var n, s, maxR;

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
  s = 20;
  maxR = height / 2 - height * 0.05;
  frameRate(60)
}

function draw() {
  blendMode(SOFT_LIGHT);
  // particleImage= createGraphics(width, height)
  // push()
  // image(blob, 0, 0)
  // drawBlob(width / 2, height / 2, 10, 10, 15, 14, 10)
  // pop()
  translate(width / 2, height / 2);
  noStroke();


  if (s > 1) {
    console.log(s)
    if (particles.length != 0) {
      for (let i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.show();
        p.move();

        if (p.isDead()) particles.splice(i, 1);
      }
    } else {
      s -= 2;
      initParticles();
    }
  }
}

function initParticles() {

  let c = COLOR_MODE == 'layers' ? colors[int(random(colors.length))] : 'RANDOM';
  for (let i = 0; i < n; i++) {
    let maxLife = random(MIN_LENGTH, MAX_LENGTH);
    particles.push(new Particle(maxR, s, maxLife, c));
  }
}

class Particle {

  constructor(maxR_, s_, maxLife_, c_) {
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
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, this.s, this.s);
    //drawBlob(this.pos.x, this.pos.y, 12, 45, 15, 150);
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

function drawBlob(x, y, n_vertices, r, nm, sm, fcm) {
  push();
  translate(x, y);
  // rotate(frameCount / fcm);
  let dr = TWO_PI / n_vertices;
  beginShape();
  // make sure at least 3 vertices
  for (let i = 0; i < n_vertices + 3; i++) {
    let ind = i % n_vertices;
    let rad = dr * ind;
    let r = (height * 0.05 +
      noise(frameCount / nm + ind) *
      height * 0.1 +
      sin(frameCount / sm + ind) *
      height *
      0.05);
    curveVertex(
      cos(rad) * r,// * r,
      sin(rad) * r);
  }
  endShape();
  pop();
}
