// let rb = d3.randomBeta(4, 3)
function makeParticles(center, minR, maxR) {
  particle_sets = [];
  for (var j = 0; j < GUI.config.number_of_particle_sets; j++) {
    let _r = map(j, 0, GUI.config.number_of_particle_sets, minR, maxR);
    let ps = [];
    let pSkip = map(j, 0, GUI.config.number_of_particle_sets, 0, 0.25);
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
    let distance = dist(width/2, height/2, loc.x, loc.y);
    if (distance>150) {
      // console.log("randomizing...", this.loc)
      this.pos.x = randomGaussian(0.66, 2);
      this.pos.y = randomGaussian(0.8, 2);
      // this.pos.y = rb()//map(rb(), 0, 1, -0.2, 1.5)
    }
  }
}
