let SEED = Math.floor(Math.random() * 100000);
let WIDTH = 1280;
let HEIGHT = 1280;
let bgCol = "#f9f9f9";
let GUI;

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"];
const LINECOLOR = "#401F3E";
let dim;

// custom vars for this sketch
let particle_sets = [];
let circles = [];
let perspT;

const settings = {
  number_of_particles: [2, 100, 10000, 100],
  number_of_particle_sets: [1200, 1, 1000, 1],
  band_width: [0.03, 0.01, 0.9, 0.001],
  band_dist: [0.045, 0.01, 0.9, 0.001],
  zoom: [0.5, 0.1, 3, 0.01],
  particle_path_length: [500, 500, 10000, 100],
  particle_speed: [3, 1, 100, 1],
  noise_scale: [0.05, 0.01, 1, 0.01],
  noise_buffer: [0.2, 0.1, 1, 0.01],
  particle_curl: [2, 0.1, 10, 0.01],
  y_transform: [0.1, 0.01, 0.1, 0.001],
  x_transform: [0.02, 0.1, 0.9, 0.01],
  // maximum number of iterations before particle is removed
  maxLoops: [3, 1, 10, 1],
  same_seed: [false],
  perspective_shift: [false],
  add_weird_alt: [true],
  numCircles: [5, 1, 100, 1],
  minCircleRadius: [100, 10, 1000, 1],
  maxCircleRadius: [200, 10, 1000, 1],
};

function preload() {}

function recalculateTransform(c) {
  let transformedWidth = c.width - c.width * GUI.config.x_transform;
  let transformedHeight = c.height - c.height * (0.1 + GUI.config.y_transform);
  var sourceCorners = [0, 0, c.width, 0, c.width, c.height, 0, c.height];
  // var destCorners = [
  //   c.width - transformedWidth,
  //   c.height - transformedHeight,
  //   transformedWidth,
  //   c.height - transformedHeight,
  //   c.transformedWidth,
  //   c.transformedHeight,
  //   c.width - transformedWidth,
  //   transformedHeight,
  // ];
  var destCorners = [
    transformedWidth,
    transformedHeight,
    c.width - transformedWidth,
    transformedHeight,
    c.width - transformedWidth,
    c.height - transformedHeight,
    transformedWidth,
    c.height - transformedHeight,
  ];
  console.log(sourceCorners, destCorners);
  perspT = PerspT(sourceCorners, destCorners);
}

function redrawSketch() {
  clear();
  c.clear();
  redraw();
  c.redraw();
  c.background("#EFAF0E");
  if (!GUI.config.same_seed) {
    SEED = Math.floor(Math.random() * 100000);
    randomSeed(SEED);
    noiseSeed(SEED);
  }

  recalculateTransform(c);
  particle_sets = [];
  circles = [];
  const center = createVector(width / 2, height * 1.9);
  const minR = height * 0.2;
  const maxR = height * 2;
  makeParticles(center, minR, maxR);
  console.log("particle sets:", particle_sets);
  makeRandomCircles(
    GUI.config.numCircles,
    GUI.config.minCircleRadius,
    GUI.config.maxCircleRadius
  );
  console.log("circles:", circles);
  // makeParticles();
  // makeRandomCircles(GUI.config.numCircles, 100, 200)
}

function setup() {
  // setting modes and seeds
  colorMode(HSB);
  rectMode(CENTER);
  randomSeed(SEED);
  noiseSeed(SEED);

  dim = Math.min(windowWidth, windowHeight) * 0.8;
  rng = d3.randomLcg(random());

  // base canvas
  bg = int(random(244, 254));
  createCanvas(dim, dim);
  background("#e7e7db");

  // our drawing canvas
  c = createGraphics(width * 0.9, height * 0.9);
  c.background("#EFAF0E");

  c.translate(c.width * 0.1, c.height * 0.075);

  // initialize gui
  GUI = new _GUI(settings);
  GUI.startGUI(redrawSketch);

  recalculateTransform(c);
  //perspectiveTransform

  const center = createVector(width / 2, height * 1.9);
  const minR = height * 0.2;
  const maxR = height * 2;
  makeParticles(center, minR, maxR);
  console.log("particle sets:", particle_sets);
  makeRandomCircles(
    GUI.config.numCircles,
    GUI.config.minCircleRadius,
    GUI.config.maxCircleRadius
  );
  console.log("circles:", circles);
}

function draw() {
  // noLoop()
  background(bgCol);

  push();
  cc = color(LINECOLOR);
  cc.setAlpha(0.75);
  c.stroke(cc);
  c.strokeWeight(0.8);

  if (particle_sets == undefined) {
  } else if (particle_sets.length == GUI.config.number_of_particle_sets) {
    for (let i = 0; i < GUI.config.number_of_particle_sets; i++) {
      for (let j = 0; j < GUI.config.number_of_particles; j++) {
        if (particle_sets[i][j] == undefined) {
        } else {
          particle_sets[i][j].update(i);
          if (particle_sets[i][j].numLoops < GUI.config.maxLoops) {
            drawParticle(c, particle_sets[i][j]);
          }
        }
      }
    }
  }
  //display canvas
  image(c, width * 0.05, height * 0.05);
}

function drawParticle(c, p) {
  let bw = GUI.config.band_width / 2;

  // if (p.val > 0.5 - bw && p.val < 0.5 + bw) {
  c.push();
  if (GUI.config.perspective_shift) {
    let scale = map(p.pos.y, 0, width, 0.33, 4);
    let scaledY = p.pos.y + p.altitude;
    let _point = perspT.transform(p.pos.x, scaledY);
    // p.pos.x * width * scale, //map(p.pos.y, 0, 1, 0.66, 1.33),
    // p.pos.y * height * 3 + p.altitude * 2500)
    // (15 - p.altitude * 45))// + 1500 - p.altitude * 10)
    c.point(_point[0], _point[1]);
  } else {
    c.point(p.pos.x, p.pos.y);
  }
  c.pop();
}

// let rb = d3.randomBeta(4, 3)
function makeParticles(center, minR, maxR) {
  particle_sets = [];
  for (var j = 0; j < GUI.config.number_of_particle_sets; j++) {
    let _r = map(j, 0, GUI.config.number_of_particle_sets, minR, maxR);
    let ps = [];
    let pSkip = map(j, 0, GUI.config.number_of_particle_sets, 0, 0.4);
    for (var i = 0; i < GUI.config.number_of_particles; i++) {
      if (random() < pSkip) continue;
      ps.push(
        new Particle(
          center.x,
          center.y,
          _r,
          random(0.005, 0.01)
          //   random(0.01, 0.05)

          // randomGaussian(2 * width / 3, width),
          // randomGaussian(5 * height / 6, height / 2),
          //   random(TWO_PI)
        )
      );
    }
    particle_sets.push(ps);
  }
}

class Particle {
  constructor(_x, _y, _r, _v) {
    this.center = createVector(_x, _y);
    this.velocity = _v;
    this.altitude = 0;
    this.radius = _r;
    this.startAngle = PI * 1.33;
    this.angle = PI * 1.33;
    this.maxAngle = PI * 1.66;
    this.numLoops = 0;

    // this.pos should be a point 180 degrees and _r away from this.center
    this.pos = createVector(
      this.center.x + cos(this.angle) * this.radius,
      this.center.y + sin(this.angle) * this.radius
    );
    this.val = 0;
  }

  updatePosition() {
    this.pos = createVector(
      this.center.x + cos(this.angle) * this.radius,
      this.center.y + sin(this.angle) * this.radius
    );
  }

  update(index) {
    this.angle += this.velocity * randomGaussian(0.5, 1);
    if (this.angle >= this.maxAngle) {
      this.angle = this.startAngle;
      this.numLoops++;
    }
    this.updatePosition();

    this.altitude = noise(this.pos.x + 588.1, this.pos.y - 177.69);
    if (GUI.config.add_weird_alt) {
      this.altitude +=
        GUI.config.noise_scale *
        noise(this.pos.x * 15 - 113.3, this.pos.y * 8 + 261.1);
      0.02 * noise(this.pos.x * 30 - 54.3, this.pos.y * 30 + 121.1);
    }

    let nval =
      (this.altitude +
        GUI.config.band_dist *
          (index - GUI.config.number_of_particle_sets / 2)) %
      1;
    this.val = nval;
    this.checkEdges();
  }

  checkEdges() {
    const inACircle = circles.some((c) => {
      let distance = dist(c.x, c.y, this.pos.x, this.pos.y);
      return distance < c.r;
    });
    if (inACircle) {
      this.pos.x += randomGaussian(1, 3);
      this.pos.y += randomGaussian(1, 3);
    }
  }
}

const makeRandomCircles = (n, minR, maxR) => {
  while (circles.length < n) {
    let x = random(width);
    let y = random(height);
    let r = random(minR, maxR);
    let overlap = checkCircleCollision(x, y, r, random(10, 50));
    if (overlap) continue;
    circles.push({ x, y, r });
  }
  return circles;
};

const checkCircleCollision = (x, y, r, b) => {
  return circles.some((c) => {
    let distance = dist(c.x, c.y, x, y);
    return distance < c.r + r + b;
  });
};
