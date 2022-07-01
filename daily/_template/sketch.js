
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

function mousePressed() {
  save(new Date().toJSON() + ".png")
}

function preload() {

}

function setup() {
  randomSeed(1243);
  colorMode(HSB);
  rng = d3.randomLcg(random())

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);

  rectMode(CENTER);

  c = createGraphics(width * 0.9, height * 0.9)
}

function draw() {
  noLoop()
  background(bgCol);
  noFill();

  push()
  c.background(240)
  c.translate(c.width * 0.1, c.height * 0.075)
  image(c, width * 0.05, height * 0.05)
}
