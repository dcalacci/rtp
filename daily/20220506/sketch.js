let FRAME_RATE = 30
let FRAME = true
let N_CELLS = 5
let WIDTH = 800
let HEIGHT = 800

let UPDATE_PROBABILITY = 0.002
let bgCol = "#F8F6F5"

let es = new p5.Ease();

let COLORS = ["#0B3EB2", "#FFC109", "#FFA7B6"]

function mousePressed() {
  save(new Date().toJSON() + ".png")
}

function preload() {

}

let bodies = []
let wave1;

function setup() {
  // blendMode(BLUR)
  createCanvas(WIDTH, HEIGHT);
  rectMode(CENTER);
  frameRate(FRAME_RATE)

  background(bgCol);

  gridSeed = random(10003)

  // let w_coef = FRAME ? 0.75 : 1.2

  let w = WIDTH
  let step = WIDTH / N_CELLS
  let start = 0
  let end = N_CELLS

  // translate(step, step)

  if (FRAME) {
    start = 1
    end = N_CELLS - 1
  }


  for (let i = start; i <= end; i += 1) {
    let all_bodies = [Triangle, Wave, WavyTriangle, Circle]
    // let all_bodies = [Circle]
    for (let j = start; j <= end; j += 1) {
      let x = j * step
      let y = i * step;
      body = random(all_bodies)
      bodies.push(new body(x, y, step))
    }
  }

}


function draw() {
  background(bgCol)
  for (let b of bodies) {
    if (!b.isUpdating && random(0, 1) < b.updateProbability) {
      b.startUpdate()
    }
    b.update()
    b.display()
  }
}

class Soma {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.dMax = w;
    this.d = 0.25 * w;
    this.fr = random(10284701987);
    this.type = 0
    this.angle_init = 0;
    this.max_angle = this.angle_init + random(PI / 2, TWO_PI)
    this.frame = 0
    this.n_frames = 60
    this.isUpdating = false
    this.updateProbability = UPDATE_PROBABILITY // update probability for any frame
    this.strokeWeight = 3
    this.direction = random([-1, 1])

    this.color = random(COLORS)
  }
  startUpdate() {
    this.isUpdating = true
  }

  stopUpdate() {
    this.isUpdating = false
  }

  update() {
    this.frame += 1
  }

  display() {
    stroke(this.color)
  }
}

class Triangle extends Soma {
  constructor(x, y, w) {
    super(x, y, w)
    this.rotation_velocity = random(0.001, 0.005)
    this.angle = this.angle_init;
    this.direction = random([-1, 1])
    this.strokeWeight = 4;
  }

  update() {
    if (this.isUpdating) {
      super.update()

      if (0 < this.frame && this.frame < this.n_frames / 2) {
        let nrm = norm(this.frame, 0, this.n_frames - 1);
        this.angle = lerp(this.angle_init, this.max_angle, es.backInOut(nrm)) * this.direction
      } else if (this.n_frames / 2 <= this.frame && this.frame < this.n_frames - 1) {
        let nrm = norm(this.frame, 0, this.n_frames - 1);
        this.angle = lerp(this.max_angle, this.angle_init, es.backInOut(nrm)) * this.direction
      }

      if (this.frame > this.n_frames) {
        this.direction = random([-1, 1])
        this.isUpdating = false;
        this.frame = 0
      }
    }
  }

  display() {
    super.display()
    push()
    noFill()
    strokeWeight(this.strokeWeight)

    translate(this.x, this.y)
    rotate(this.angle)

    beginShape()
    for (let i = 0; i < 3; i++) {
      let a = map(i, 0, 3, -PI * .5, -PI * .5 + TAU)
      let xx = this.d * cos(a);
      let yy = this.d * sin(a);
      vertex(xx, yy)
    }
    endShape(CLOSE)

    pop()

  }
}

class Wave extends Soma {
  constructor(x, y, w, seed = random(0, 1223124)) {
    super(x, y, w)

    this.seed = seed
    randomSeed(seed)

    this.min_a = 0
    this.max_a = this.min_a + random(3, 6)
    this.min_f = random(0.5, 1)
    this.max_f = random(2, 6)
    this.f = 1
    this.a = 0
    this.d = w / 4
    this.strokeWeight = 4
    this.angle = TAU / random([1, 2, 3, 4, 5, 6, 7, 8])
    this.rotate = random([true, false])

  }
  display() {

    super.display()
    push()
    noFill()
    strokeWeight(this.strokeWeight)

    translate(this.x, this.y)
    rotate(this.angle)
    beginShape()
    let y2 = this.d
    let y1 = -this.d
    for (let i = y1; i < y2; i++) {
      let xx = map(i, y1, y2, 0, TWO_PI)
      let yy = i;
      vertex(
        sin(xx * this.f) * this.a,
        yy)
    }
    endShape()
    pop()
  }

  update() {
    if (this.isUpdating) {
      super.update()
      if (0 < this.frame && this.frame < this.n_frames / 2) {
        let nrm = norm(this.frame, 0, (this.n_frames / 2));
        this.a = lerp(this.min_a, this.max_a, es.quarticInOut(nrm))
        this.f = lerp(this.min_f, this.max_f, es.doubleExponentialSigmoid(nrm))
        if (this.rotate)
          this.angle = lerp(this.angle_init, this.max_angle, es.backInOut(nrm)) * this.direction

      } else if (this.n_frames / 2 <= this.frame && this.frame < this.n_frames - 1) {
        let nrm = norm(this.frame, this.n_frames / 2, this.n_frames - 1);
        this.a = lerp(this.max_a, this.min_a, es.quarticInOut(nrm))
        this.f = lerp(this.max_f, this.min_f, es.circularInOut(nrm))
        if (this.rotate)
          this.angle = lerp(this.max_angle, this.angle_init, es.backInOut(nrm)) * this.direction

      }

      if (this.frame > this.n_frames) {
        this.isUpdating = false;
        this.frame = 0
      }

    }
  }
}


class WavyTriangle extends Soma {
  constructor(x, y, w) {
    super(x, y, w)
    this.rotation_velocity = random(0.005, 0.01)
    this.angle = this.angle_init;
    this.direction = random([-1, 1])
    this.min_a = random(2, 5)
    this.max_a = this.min_a + random(5, 10)
    this.a = this.min_a

    this.waves = []
    this.initializedWaves = false
  }

  startUpdate() {
    super.startUpdate()
    this.waves.forEach((w) => random(0, 1) < 0.3 ? w.startUpdate() : null)
  }

  stopUpdate() {
    super.stopUpdate()
    this.waves.forEach((w) => {
      w.isUpdating = false
      w.frame = 0
    })
  }

  update() {
    if (this.isUpdating) {
      super.update()
      this.waves.forEach((w) => w.update())
      if (this.frame > 0 && this.frame < this.n_frames) {
        let nrm = norm(this.frame, 0, this.n_frames - 1);
        this.angle = this.angle_init + lerp(0, this.max_angle, es.backInOut(nrm)) * this.direction
      }

      if (this.frame > this.n_frames) {
        console.log("stopping update")
        this.direction = random([-1, 1])
        this.stopUpdate()
        this.frame = 0
      }
    }
  }

  display() {
    super.display()
    push()
    noFill()
    strokeWeight(this.strokeWeight)
    translate(this.x, this.y)

    // three points of triangle
    let n_points = 3
    let triangle_vertices = []
    for (let i = 0; i < n_points; i++) {
      let a = map(i, 0, n_points, -PI * .5, -PI * .5 + TAU)
      let xx = this.d * cos(a);
      let yy = this.d * sin(a);
      // start on second point so we have one to start with
      let p2 = [xx, yy]
      triangle_vertices.push(p2)

      circle(xx, yy, 1)
    }


    let lastPoint;
    for (let i = 0; i < triangle_vertices.length + 1; i++) {
      push()
      let idx = i % triangle_vertices.length
      let xx = triangle_vertices[idx][0]
      let yy = triangle_vertices[idx][1]
      let p2 = [xx, yy]

      if (i > 0) {
        let p1 = lastPoint;
        translate(p1[0], p1[1])

        let x_mid = ((p2[0] - p1[0]) / 2)
        let y_mid = ((p2[1] - p1[1]) / 2)

        let angle = Math.atan2(p2[0] - p1[0], p2[1] - p1[1])
        let dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])

        if (!this.wavesInitialized) {
          let w = new Wave(x_mid, y_mid, dist, i)
          w.d = dist / 2
          w.angle = -angle
          w.rotate = false
          w.color = this.color
          this.waves.push(w)
          if (this.waves.length == n_points) {

            this.wavesInitialized = true
          }
        } else {
          this.waves.forEach((w) => {
            if (w.seed == i) {
              w.display()
            }
          })
        }
      }
      pop()
      lastPoint = [xx, yy]
    }
    pop()
  }

}

class Circle extends Soma {
  constructor(x, y, w) {
    super(x, y, w)
    this.direction = random([-1, 1])
    this.strokeWeight = 4;
    this.a = -w / 4;
    this.b = w / 4
    this.c = 0
    this.n_frames = 180
  }

  update() {
    if (this.isUpdating) {
      super.update()

      if (0 < this.frame && this.frame < this.n_frames / 2) {
        let nrm = norm(this.frame, 0, this.n_frames - 1);
        this.c = lerp(0, 10, es.linear(nrm))
        // this.vx = lerp(1, 10, es.backInOut(nrm))
        // this.vy = lerp(1, 10, es.backInOut(nrm))
      } else if (this.n_frames / 2 <= this.frame && this.frame < this.n_frames - 1) {
        let nrm = norm(this.frame, 0, this.n_frames - 1);
        this.c = lerp(10, 0, es.linear(nrm))
        // this.vx = lerp(10, 1, es.backInOut(nrm))
        // this.vy = lerp(10, 1, es.backInOut(nrm))
      }

      if (this.frame > this.n_frames) {
        this.isUpdating = false;
        this.frame = 0
      }
    }
  }

  display() {
    super.display()
    push()
    noFill()
    strokeWeight(this.strokeWeight)
    translate(this.x, this.y)
    // rotate(this.angle)
    beginShape()
    let n_points = 360
    let lastPoint;
    for (let i = 0; i <= n_points; i += 1) {
      let angle = map(i, 0, n_points, 0, TWO_PI)
      let x = map(cos(angle), -1, 1, this.a, this.b)
      let y = map(sin(angle), -1, 1, this.a, this.b)

      push()
      translate(x, y)
      rotate(angle)

      let xx = map(i, 0, n_points, -PI / 2, (-PI / 2) + TAU)
      let newX = 8 * sin(this.c * xx) * sin(this.c * xx)
      let newY = 8 * cos(this.c * xx) * cos(this.c * xx)

      // curveVertex(x + newX, y + newY)
      point(newX, newY)

      // if (i == 0) {
      //   lastPoint = [newX, newY]
      // }
      pop()
    }
    // curveVertex(lastPoint[0], lastPoint[1])
    // endShape(CLOSE)
    pop()
  }
}


function drawGrid(seed, weight, alpha, c, randomStroke) {
  randomSeed(seed)

  c = color(c)
  c.setAlpha(alpha)

  let w = width / N_CELLS;
  noFill();
  strokeWeight(weight)
  for (let i = 0; i < N_CELLS * 1.2; i++) {
    for (let j = 0; j < N_CELLS * 1.2; j++) {
      let x = i * w;
      let y = j * w;
      if (randomStroke) {
        c.setAlpha(random(alpha))
        // stroke(color, random(alpha));
      }
      stroke(c)
      rect(x, y,
        w + random(0, 1),
        w + random(0, 1));
    }
  }
}


