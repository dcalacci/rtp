
let SEED = Math.floor(Math.random() * 100000)
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"
let GUI

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

const PI = Math.PI

const settings = {
  min_split: [2, 1, 10, 1],
  max_split: [5, 2, 20, 1],
  gen_start: [3, 1, 10, 1],
  gen_max: [10, 5, 20, 1],
  min_generation_branch_skip: [4, 1, 10, 1],
  min_branch_angle: [PI / 8, 0, PI / 4, PI / 24],
  max_branch_angle: [PI / 8, 0, PI / 4, PI / 24],
  gray: [40, 10, 255, 1],
  alpha: [50, 10, 255, 1],
  weight: [3, 1, 10, 1],
  same_seed: [false],
}

const settingValues = _.mapValues(settings, (o) => o[0])


function preload() {

}

function redrawSketch() {
  clear();
  c.clear();
  redraw();
  c.redraw();
  if (!GUI.config.same_seed) {
    SEED = Math.floor(Math.random() * 100000)
    randomSeed(SEED);
    noiseSeed(SEED);
  }
}

function setup() {
  randomSeed(1243);
  colorMode(HSB);

  rng = d3.randomLcg(random())

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);

  // initialize gui
  GUI = new _GUI(settings)
  GUI.startGUI(redrawSketch)

  c = createGraphics(width * 0.9, height * 0.9)
  c.translate(c.width * 0.1, c.height * 0.075)

  rectMode(CENTER);

}

let trees = []
let amount = 4;

function draw() {
  c = createGraphics(width * 0.9, height * 0.9)
  noLoop()
  background(bgCol);
  noFill();

  push()
  c.background(240)
  // Draw here

  for (let index = 1; index <= amount; index++) {
    c.push();
    const tree = new Tree(c, createVector(c.width / 2, height), 200);
    trees.push(tree);
    c.pop();
  }

  //display canvas
  c.translate(c.width * 0.1, c.height * 0.075)
  image(c, width * 0.05, height * 0.05)

}



class Tree {
  constructor(c, start, len, angle = 0, gen = GUI.config.gen_start, weight = GUI.config.weight) {

    this.c = c
    this.start = start
    this.branches = []
    this.len = len
    this.tint = random(50)
    this.gen = gen
    this.angle = angle
    this.weight = weight
    let newPoint = createVector(0, -len);
    newPoint.rotate(angle);
    this.end = p5.Vector.add(this.start, newPoint);

    this.min_split = GUI.config.min_split
    this.max_split = GUI.config.max_split
    this.gen_max = GUI.config.gen_max
    this.min_gen_skip = GUI.config.min_generation_branch_skip


    if (this.gen < this.gen_max) {
      let splitAmount = random(this.min_split, this.max_split);
      if (this.gen <= 2) {
        amount = min(splitAmount, this.min_split)
      }
      // make sure it's even
      if (splitAmount % 2 === 1) {
        splitAmount -= 1;
      }
      this.split(splitAmount);
    }

  }

  split(amount) {
    for (let index = 1; index <= amount; index++) {
      // the lower the generation, the more branches we should keep
      // don't skip branches before the 4th generation
      let p_keep_branch = map(this.gen, this.min_gen_skip, this.gen_max, 1, 0.2)

      if (random() < p_keep_branch) {
        this.createBranch(random(
          -GUI.config.min_branch_angle,
          GUI.config.max_branch_angle))
      }
    }
  }

  createBranch(angle) {
    this.c.push()
    let newBranch = new Tree(
      this.c,
      this.end,
      this.len * random(0.2, 0.9),
      this.angle - angle,
      this.gen + 1,
      this.weight * random(0.6, 0.9));
    this.branches.push(newBranch);
    newBranch.draw();
    this.c.pop()
  }

  draw() {
    this.c.stroke(GUI.config.gray, GUI.config.alpha)
    this.c.translate(this.start.x, this.start.y);
    this.c.strokeWeight(this.weight);
    this.c.line(0, 0, this.end.x - this.start.x, this.end.y - this.start.y);
  }

}
