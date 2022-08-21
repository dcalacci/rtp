function makeParticles() {
  particle_sets = [];
  for (var j = 0; j < GUI.config.number_of_particle_sets; j++) {
    let ps = [];
    for (var i = 0; i < GUI.config.number_of_particles; i++) {
      ps.push(
        new Particle(
          randomGaussian(0.66, 1),
          randomGaussian(5 / 6, 0.5),

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

    let n = createVector(this.pos.x, this.pos.y);

    // this.altitude = noise(n.x + 423.2, n.y - 231.1) * config.noise_scale;
    this.altitude = noise(
      this.pos.x,
      this.pos.y) * GUI.config.noise_scale + GUI.config.noise_buffer;
    // let bandLevel = GUI.config.band_dist * index % 2;

    let nval = (this.altitude + GUI.config.band_dist *
      (index - GUI.config.number_of_particle_sets / 2)) % 1;


    this.angle += GUI.config.particle_curl * map(nval, 0, 1, -1, 1);
    this.val = nval;
  }

  checkEdges() {
    //float distance = dist(width/2, height/2, loc.x, loc.y);
    //if (distance>150) {
    if (this.pos.x < -0.1 || this.pos.x > 1 || this.pos.y < -0.1 || this.pos.y > 1) {
      // console.log("randomizing...", this.loc)
      this.pos.x = randomGaussian(0.66, 1)
      this.pos.y = randomGaussian(5 / 6, 0.5)
    }
  }
}
