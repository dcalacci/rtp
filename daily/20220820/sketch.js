
let SEED = Math.floor(Math.random() * 100000)
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

const settings = {
  number_of_particles: [500, 100, 10000, 100],
  number_of_particle_sets: [4, 1, 20, 1],
  band_width: [0.03, 0.01, 0.9, 0.001],
  band_dist: [0.045, 0.01, 0.9, 0.001],
  zoom: [0.5, 0.1, 3, 0.01],
  particle_path_length: [500, 500, 10000, 100],
  particle_speed: [3, 1, 100, 1],
  noise_scale: [0.6, 0.1, 5.0, 0.01],
  noise_buffer: [0.2, 0.1, 1, 0.01],
  particle_curl: [2, 0.1, 10, 0.01]
}

let particle_sets = [];

const LINECOLOR = "#401F3E"

const config = _.mapValues(settings, (o) => o[0])

function keyPressed() {
  if (key == "s") {
    fname = 'daily_' + new Date().toJSON()
    save(fname + "_" + SEED + ".png")
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
    controllers.push(gui.add(config, k, min, max, step));
  }))

  // adds redraw button
  var obj = {
    REDRAW: function() {

      SEED = Math.floor(Math.random() * 100000)
      clear(); c.clear();

      c.background("#EFAF0E")
      randomSeed(SEED);
      noiseSeed(SEED);
      makeParticles(); redraw(); c.redraw();
    }
  };
  controllers.push(gui.add(obj, 'REDRAW'))
  // controllers.forEach((con) => con.onChange(() => { c.clear(); c.redraw() }))
}

function setup() {
  colorMode(HSB);
  rectMode(CENTER);
  randomSeed(SEED);
  noiseSeed(SEED);
  rng = d3.randomLcg(random())
  _startGUI()

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);

  background('#e7e7db');

  makeParticles()

  c = createGraphics(width * 0.9, height * 0.9)
  c.background("#EFAF0E")
  c.translate(c.width * 0.1, c.height * 0.075)
}

function makeParticles() {
  particle_sets = [];
  for (var j = 0; j < config.number_of_particle_sets; j++) {
    let ps = [];
    for (var i = 0; i < config.number_of_particles; i++) {
      ps.push(
        new Particle(
          randomGaussian(2 * width / 3, width),
          randomGaussian(5 * height / 6, height / 2),
          random(TWO_PI)
        )
      );
    }
    particle_sets.push(ps);
  }

}


function draw() {
  // noLoop()
  background(bgCol);

  push()
  cc = color(LINECOLOR)
  cc.setAlpha(0.75)
  c.stroke(cc)
  c.strokeWeight(0.8);

  if (particle_sets.length == config.number_of_particle_sets) {
    for (let i = 0; i < config.number_of_particle_sets; i++) {
      for (let j = 0; j < config.number_of_particles; j++) {
        particle_sets[i][j].update(i)
        particle_sets[i][j].display(c)

      }
    }
  }

  // c.background(240)
  // Draw here
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
    this.pos.x += cos(this.angle) * config.particle_speed;
    this.pos.y += sin(this.angle) * config.particle_speed;

    this.checkEdges()

    // scaling perspective
    let scale = map(this.pos.y, 0, height + 200, 3, 0.33)

    let nx = scale * map(this.pos.x, 0, width, -1, 1)
    let ny = 2 * scale * map(this.pos.y, 0, height, -1, 1)

    // let nx = map(this.pos.y, 0, height + 100, 4, 0.5) * map(this.pos.x, 0, width, -1, 1);
    // let ny = 2 * map(this.pos.y, 0, height + 100, 4, 1) * map(this.pos.y, 0, height, -1, 1);

    let n = createVector(nx, ny);

    // this.altitude = noise(n.x + 423.2, n.y - 231.1) * config.noise_scale;
    this.altitude = noise(n.x + width / 2, n.y + height / 2) * config.noise_scale + config.noise_buffer;
    let bandLevel = config.band_dist * index % 2;

    let nval = (this.altitude + config.band_dist *
      (index - config.number_of_particle_sets / 2)) % 1;


    this.angle += config.particle_curl * map(nval, 0, 1, -1, 1);
    this.val = nval;
  }

  checkEdges() {
    //float distance = dist(width/2, height/2, loc.x, loc.y);
    //if (distance>150) {
    if (this.pos.x < -100 || this.pos.x > width || this.pos.y < -100 || this.pos.y > height) {
      // console.log("randomizing...", this.loc)
      this.pos.x = randomGaussian(2 * width / 3, width)
      this.pos.y = randomGaussian(5 * height / 6, height / 2)
    }
  }


  display(c) {
    let bw = config.band_width / 2
    if (this.val > 0.5 - bw && this.val < 0.5 + bw) {
      //stroke(palette[index % palette.length]);
      //if (index === 2) stroke(255, 25, 20, 20);
      //else stroke(20, 10);
      c.push();
      c.translate(this.pos.x, this.pos.y + 10 - this.altitude * 40 * map(this.pos.y, 0, height + 100 * config.zoom, 1, 4));
      c.rotate(this.angle);

      c.point(0, 0)
      // randomGaussian(0, 0.05),
      // randomGaussian(0, 0.05))
      // c.point(0, 0);
      c.pop();
    }
  }
}
