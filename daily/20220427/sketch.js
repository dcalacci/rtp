let N_CELLS = 10
let FRAME_RATE = 60
let DRAW_FREQUENCY = 1 // how often (in frames) to draw 
let BODY_OPACITY = 25 // opacity of body strokes
let BODY_STROKE_WEIGHT = 1 // stroke weight for body lines
let BODY_GRAYSCALE = false// if true, bodies are drawn in grayscale
let BODY_MAX_WIDTH_PCT = 0.6 // scaled width of the body in each grid cell
let BODY_MIN_LINES = 200;
let BODY_MAX_LINES = 500;
let BODY_STYLE = 1;
let BODY_ROTATION_SPEED = 0.02

let DRAW_GRID = true// if true, draw the grid
let N_BODIES_IN_CELL = 1
let GRID_STROKE_WEIGHT = 0.5
let GRID_MAX_OPACITY = 75 // max opacity of grid lines
let GRID_RANDOM = true // true if we want to drop some grid lines 

let WIDTH = 1280
let HEIGHT = 1280

let shapes = [];
let bgCol = "#f7f7f7"
// let colors = ["#66B3BA", "#D68FD6", "#CA054D", "#FA9F42"]
let colors = ["#ed3441", "#ffd630", "#66B3BA", "#329fe3", "#154296", "#303030"];
// let c2 = ['#f73939', '#ffda33', '#0c4896', '#48b7f7', '#f7f7f7', '#2b2b2b'];
let nScl = 0.002;
let offset = 100;

let bodies = []
let gridSeed;

function mousePressed() {
  save(new Date().toJSON() + ".png")
}

function setup() {
  // blendMode(REMOVE)
  createCanvas(WIDTH, HEIGHT);
  rectMode(CENTER);
  frameRate(FRAME_RATE)

  background(bgCol);

  gridSeed = random(10003)

  let w = WIDTH / N_CELLS;
  noFill();
  for (let i = 0; i < N_CELLS * 1.2; i++) {
    for (let j = 0; j < N_CELLS * 1.2; j++) {
      let x = i * w;
      let y = j * w;
      for (let n = 0; n < N_BODIES_IN_CELL; n++) {
        bodies.push(new Soma(x, y, w, random(129034)))
      }
    }
  }
}

function draw() {
  // background(bgCol)
  if (DRAW_GRID) {
    drawGrid(gridSeed, GRID_STROKE_WEIGHT + 1, 100, bgCol, false) // cover grid with white grid
    drawGrid(gridSeed, GRID_STROKE_WEIGHT, GRID_MAX_OPACITY, "#2b2b2b", GRID_RANDOM)

  }
  if (frameCount % DRAW_FREQUENCY == 0) {
    bodies.forEach((b) => {
      b.display()
    })
  }
}

function drawGrid(seed, weight, alpha, c, randomStroke) {
  randomSeed(seed)

  console.log("color", c)
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

class Soma {
  constructor(x, y, w, seed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.seed = random(seed)
    randomSeed(this.seed)

    this.max_lines = random(BODY_MIN_LINES, BODY_MAX_LINES);
    this.n_lines_drawn = 0;
    this.color = BODY_GRAYSCALE ? color("#2b2b2b") : color(random(colors))

    this.color.setAlpha(BODY_OPACITY)

    this.n_vertices = int(random(10, 18))
    this.vel = 500;
    this.sin_vel = 10
    this.rotation_speed = BODY_ROTATION_SPEED == 0 ? 0 : random(BODY_ROTATION_SPEED)

    this.r = this.w * 0.3 + 3 * this.w * 0.1 + sin(10) * this.w * 0.05
  }

  display() {
    if (this.n_lines_drawn > this.max_lines) return;
    stroke(this.color)
    strokeWeight(BODY_STROKE_WEIGHT)
    randomSeed(this.seed)
    push()
    translate(this.x, this.y)
    beginShape()

    rotate(frameCount * this.rotation_speed);
    let segment_angle = TWO_PI / this.n_vertices;
    // make sure at least 3 vertices
    for (let i = 0; i < this.n_vertices + 3; i++) {
      let ind = i % this.n_vertices; // index for this vertex
      let rad = segment_angle * ind; // total angle in radians  from start
      let coef = this.coef(ind)
      curveVertex(
        cos(rad) * coef,
        sin(rad) * coef);
    }
    endShape();
    pop()
    this.n_lines_drawn += 1
  }

  coef(index) {
    // coefficient to multiply for point on this form
    noiseSeed(this.seed)
    randomSeed(this.seed)
    let r;
    if (BODY_STYLE == 1) {
      r = (
        this.w * noise(BODY_MAX_WIDTH_PCT) +
        noise(frameCount / this.vel + index) *
        this.w * 0.5 + sin(frameCount / this.sin_vel * index) *
        this.w * 0.05
      )
    } else if (BODY_STYLE == 2) {
      r = (
        this.w * (BODY_MAX_WIDTH_PCT / 2) +
        noise((frameCount / this.vel + index * 50)) * this.w * 0.2
        // this.w * 0.5 + sin(frameCount / this.sin_vel * index) *
        // this.w * 0.05
      )

    }
    return r
  }
}
