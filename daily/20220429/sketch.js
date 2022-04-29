let N_CELLS = 25
let FRAME_RATE = 30
let DRAW_FREQUENCY = 1 // how often (in frames) to draw 
let BODY_OPACITY = 25 // opacity of body strokes
let BODY_STROKE_WEIGHT = 1 // stroke weight for body lines
let BODY_GRAYSCALE = false// if true, bodies are drawn in grayscale
let BODY_MAX_WIDTH_PCT = 0.6 // scaled width of the body in each grid cell
let BODY_MIN_LINES = 200;
let BODY_MAX_LINES = 500;
let BODY_STYLE = 2;
let BODY_ROTATION_SPEED = 0.6

let DRAW_GRID = true// if true, draw the grid
let N_BODIES_IN_CELL = 10
let GRID_STROKE_WEIGHT = 0.5
let GRID_MAX_OPACITY = 75 // max opacity of grid lines
let GRID_RANDOM = true // true if we want to drop some grid lines 

let WIDTH = 1280
let HEIGHT = 1280

let shapes = [];
let bgCol = "#f9f9f9"
// let colors = ["#66B3BA", "#D68FD6", "#CA054D", "#FA9F42"]
// let colors = ["#ed3441", "#ffd630", "#66B3BA", "#329fe3", "#154296", "#303030"];
let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]
// let c2 = ['#f73939', '#ffda33', '#0c4896', '#48b7f7', '#f7f7f7', '#2b2b2b'];
let nScl = 0.002;
let offset = 100;

let forms = []
let gridSeed;

function mousePressed() {
  save(new Date().toJSON() + ".png")
}


function setup() {
  // blendMode(BLUR)
  createCanvas(WIDTH, HEIGHT);
  rectMode(CENTER);
  frameRate(FRAME_RATE)

  background(bgCol);

  gridSeed = random(10003)

  // let w = WIDTH / N_CELLS;
  // noFill();
  //     let x = i * w;
  //     let y = j * w;
  //     for (let n = 0; n < N_BODIES_IN_CELL; n++) {
  //       bodies.push(new Soma(x, y, w, random(129034)))
  //     }
  //   }
  // }
}
function draw() {
  if (DRAW_GRID) {
    drawGrid(gridSeed, GRID_STROKE_WEIGHT + 1, 100, bgCol, false) // cover grid with white grid
    drawGrid(gridSeed, GRID_STROKE_WEIGHT, GRID_MAX_OPACITY, "#2b2b2b", GRID_RANDOM)
  }
  if (forms.length < 20000) {
    if (frameCount % 60 == 0) {
      addForms();
    }
  }
  for (let f of forms) {
    f.run();
  }
}

function addForms() {
  for (let i = 0; i < N_CELLS * 1.2; i++) {
    for (let j = 0; j < N_CELLS * 1.2; j++) {

      if (random(0, 1) > 0) {
        let gridW = WIDTH / N_CELLS;
        let x = (i * gridW) + random(-0.1, 1.1) * (i * gridW);
        let y = (j * gridW) + random(-0.1, 1.1) * (i * gridW);
        // for (let i = 0; i < 1000; i++) {
        // let x = random(-0.1, 1.1) * width;
        // let y = random(-0.1, 1.1) * height;
        // let w = random(random(random(random(random(random(random(width)))))));
        let w = random(width)
        forms.push(new Form(x, y, w));
      }
    }
  }
}

class Form {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.d = 0;
    this.dMax = w;
    this.col = random(colors);
    this.fr = random(10284701987);
  }

  show() {
    noFill();
    strokeWeight(0.2);
    stroke(this.col);
    beginShape();
    for (let i = 0; i < 30; i++) {
      let a = map(i, 0, 30, 0, TAU);
      let xx = this.x + this.d * 0.5 * cos(a);
      let yy = this.y + this.d * 0.5 * sin(a);
      let t = noise(xx * 0.005, yy * 0.005, this.fr) * 100;
      xx += cos(t) * this.d * 0.05;
      yy += sin(t) * this.d * 0.05;
      vertex(xx, yy);
    }
    endShape(CLOSE);
  }

  move() {
    this.d += noise(frameCount * 0.01, this.x, this.y);
  }

  run() {
    if (this.d < this.dMax) {
      this.show();
      this.move();
    }
  }
}

// let toggle = 1;
// function keyPressed() {
//   if (key == 's') {
//     save(day() + '_' + month() + '_' + year() + '_' + hour() + '_' + minute() + '_' + second());
//   }
//   if (key == '.') {
//     redraw();
//   }
//   if (key == ' ') {
//     if (toggle == 0) {
//       noLoop();
//       toggle = 1;
//     } else if (toggle == 1) {
//       loop();
//       toggle = 0;
//     }
//   }
// }

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

// class Soma {
//   constructor(x, y, w, seed) {
//     this.x = x;
//     this.y = y;
//     this.seed = random(seed)
//     randomSeed(this.seed)

//     this.max_lines = random(BODY_MIN_LINES, BODY_MAX_LINES);
//     this.n_lines_drawn = 0;
//     this.color = BODY_GRAYSCALE ? color("#2b2b2b") : color(random(colors))

//     this.color.setAlpha(BODY_OPACITY)

//     this.n_vertices = int(random(10, 18))
//     this.vel = 500;
//     this.sin_vel = 10
//     this.rotation_speed = BODY_ROTATION_SPEED == 0 ? 0 : random(BODY_ROTATION_SPEED)

//     this.delt = 0;

//     this.r = this.w * 0.3 + 3 * this.w * 0.1 + sin(10) * this.w * 0.05
//   }

//   display() {
//     if (this.n_lines_drawn > this.max_lines) return;
//     stroke(this.color)
//     strokeWeight(BODY_STROKE_WEIGHT)
//     // randomSeed(this.seed)
//     push()
//     // translate(this.x, this.y)
//     beginShape()

//     for (let i = 0; i < this.n_vertices + 3; i++) {
//       let rad = map(i, 0, this.n_vertices, 0, 2 * PI)
//       let x = this.x + this.delt * 0.5 * cos(rad)
//       let y = this.y + this.delt * 0.5 * sin(rad)
//       let jiggle = noise(
//         x / 5000,
//         y / 5000,
//         this.seed)

//       vertex(
//         x + cos(jiggle) * this.d * 0.1,
//         y + cos(jiggle) * this.d * 0.1)
//     }
//     endShape()

//     // rotate(frameCount * this.rotation_speed);
//     // let segment_angle = TWO_PI / this.n_vertices;
//     // // make sure at least 3 vertices
//     // for (let i = 0; i < this.n_vertices + 3; i++) {
//     //   let ind = i % this.n_vertices; // index for this vertex
//     //   let rad = segment_angle * ind; // total angle in radians  from start
//     //   let coef = this.coef(ind)
//     //   curveVertex(
//     //     cos(rad) * coef,
//     //     sin(rad) * coef);
//     // }
//     // endShape();
//     pop()
//     this.n_lines_drawn += 1
//   }

//   move() {
//     this.delt += noise(frameCount * 0.01, this.x, this.y);
//   }
// }
