// let rb = d3.randomBeta(4, 3)
function makeParticles() {
  particle_sets = [];
  for (var j = 0; j < GUI.config.number_of_particle_sets; j++) {
    let ps = [];
    for (var i = 0; i < GUI.config.number_of_particles; i++) {
      ps.push(
        new Particle(
          randomGaussian(0.66, 2),
          // rb(),
          // map(rb(), 0, 1, -0.5, 1.5),
          randomGaussian(0.75, 2),

          // randomGaussian(2 * width / 3, width),
          // randomGaussian(5 * height / 6, height / 2),
          random(TWO_PI)
        )
      );
    }
    particle_sets.push(ps);
  }
}

class Particle {
  constructor(_x, _y, _angle) {
    this.pos = createVector(_x, _y);
    this.altitude = 0;
    this.angle = _angle;
    this.val = 0;
  }

  update(index) {
    this.pos.x += cos(this.angle) * GUI.config.particle_speed;
    this.pos.y += sin(this.angle) * GUI.config.particle_speed;

    this.checkEdges()

    // scaling perspective
    // let scale = map(this.pos.y, 0, height + 200, 3, 0.33)
    // let nx = scale * map(this.pos.x, 0, width, -1, 1)
    // let ny = 2 * scale * map(this.pos.y, 0, height, -1, 1)

    // let n = createVector(this.pos.x, this.pos.y);

    // this.altitude = noise(n.x + 423.2, n.y - 231.1) * config.noise_scale;
    this.altitude =
      noise(this.pos.x + 588.1, this.pos.y - 177.69)
    if (GUI.config.add_weird_alt) {
      this.altitude +=
        GUI.config.noise_scale * noise(this.pos.x * 15 - 113.3, this.pos.y * 8 + 261.1);
      0.02 * noise(this.pos.x * 30 - 54.3, this.pos.y * 30 + 121.1);
    }
    // this.altitude = noise(
    //   this.pos.x + 0.5,
    //   this.pos.y - 0.5) *
    //   GUI.config.noise_scale * noise(
    //     this.pos.x + 123.5,
    //     this.pos.y + 844.1) +
    //   GUI.config.noise_buffer;
    // let bandLevel = GUI.config.band_dist * index % 2;
    // this.altitude =
    //   p.noise(n.x + 423.2, n.y - 231.1) +
    //   0.04 * p.noise(n.x * 15 - 113.3, n.y * 8 + 261.1) +
    //   0.02 * p.noise(n.x * 30 - 54.3, n.y * 30 + 121.1);

    let nval = (this.altitude +
      GUI.config.band_dist *
      (index - GUI.config.number_of_particle_sets / 2)) % 1;


    this.angle += GUI.config.particle_curl * map(nval, 0, 1, -1, 1);
    this.val = nval;
  }

  checkEdges() {
    //float distance = dist(width/2, height/2, loc.x, loc.y);
    //if (distance>150) {
    if (this.pos.x < -2 || this.pos.x > 2 || this.pos.y < -2 || this.pos.y > 2) {
      // console.log("randomizing...", this.loc)
      this.pos.x = randomGaussian(0.66, 2)
      this.pos.y = randomGaussian(0.8, 2)
      // this.pos.y = rb()//map(rb(), 0, 1, -0.2, 1.5)
    }
  }
}
