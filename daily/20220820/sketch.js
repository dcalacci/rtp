
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

const settings = {
  exampleSetting: [1., 0, 10, 0.1],
}

const defaults = _.mapValues(settings, (o) => o[0])

var seed
var particle_set_size
var number_of_particle_sets
var number_of_particles
var band_width
var band_dist
var zoom
var particle_sets

function keyPressed() {
  if (key == "s") {
    fname = 'daily_' + new Date().toJSON()
    save(fname + "_" + seed + ".png")
    saveJSON(settings, fname + ".json")
  }
}


function preload() {

}

function _startGUI() {
  gui = new dat.GUI();
  gui.useLocalStorage = true
  controllers = []
  _.forEach(settings, (([dd, min, max, step], k) => {
    controllers.push(gui.add(defaults, k, min, max, step));
  }))

  // adds redraw button
  var obj = { REDRAW: function() { redraw() } };
  controllers.push(gui.add(obj, 'REDRAW'))
  controllers.forEach((con) => con.onChange(() => { clear(); redraw() }))
}

function setup() {
  colorMode(HSB);

  _startGUI()

  rng = d3.randomLcg(random())

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);

  rectMode(CENTER);

  seed = Math.floor(random(9999999));
  particle_set_size = 5000;
  number_of_particles = 20000;
  number_of_particle_sets = 6;
  band_width = 0.03;
  band_dist = 0.045;
  zoom = 0.5;

  particle_sets = [];
  background('#e7e7db');

  randomSeed(seed);

  // stroke(25, 35, 60, 20);
  smooth();


  for (var j = 0; j < number_of_particle_sets; j++) {
    let ps = [];
    for (var i = 0; i < number_of_particles; i++) {
      ps.push(
        new Particle(
          randomGaussian(width / 2, 160),
          //border + random(width - 2 * border),
          //border + random(height - 2 * border),
          randomGaussian(3 * height / 5, height / 2),
          random(TWO_PI)
        )
      );
    }
    particle_sets.push(ps);
  }


  c = createGraphics(width * 0.9, height * 0.9)
  c.background(240)
  c.translate(c.width * 0.1, c.height * 0.075)
}
let lineColor = "#401F3E"
function draw() {
  // noLoop()
  background(bgCol);
  // noFill();

  push()
  cc = color(lineColor)
  cc.setAlpha(0.2)
  c.stroke(cc)

  c.strokeWeight(0.7);
  // c.background(240)
  // Draw here

  particle_sets.forEach(function(particles, index) {
    particles.forEach(function(particle) {
      particle.update(index);
      particle.display(c);
    });
  });

  //display canvas
  image(c, width * 0.05, height * 0.05)
}


class Particle {
  constructor(x, y, phi) {
    this.pos = createVector(x, y);
    this.angle = phi;
    this.val = 0;
    this.altitude = 0;
  }

  update(index) {
    this.pos.x += cos(this.angle);
    this.pos.y += sin(this.angle);

    let nx = map(this.pos.y, 0, height + 100, 4, 0.5) * map(this.pos.x, 0, width, -1, 1);
    let ny = 2 * map(this.pos.y, 0, height + 100, 4, 1) * map(this.pos.y, 0, height, -1, 1);

    let n = createVector(nx, ny);

    this.altitude = noise(n.x + 423.2, n.y - 231.1);
    let nval = (this.altitude + band_dist * (index - number_of_particle_sets / 2)) % 1;

    this.angle += 3 * map(nval, 0, 1, -1, 1);
    this.val = nval;
  }

  display(c) {
    if (this.val > 0.5 - band_width / 2 && this.val < 0.5 + band_width / 2) {
      //stroke(palette[index % palette.length]);
      //if (index === 2) stroke(255, 25, 20, 20);
      //else stroke(20, 10);
      c.push();
      c.translate(this.pos.x, this.pos.y + 10 - this.altitude * 40 * map(this.pos.y, 0, height + 100 * zoom, 1, 4));
      c.rotate(this.angle);

      c.point(
        randomGaussian(0, 0.2),
        randomGaussian(0, 0.1))
      // c.point(0, 0);
      c.pop();
    }
  }
}
