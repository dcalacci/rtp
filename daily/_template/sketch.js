
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
  // blendMode(BLUR)
  createCanvas(WIDTH, HEIGHT);
  frameRate(FRAME_RATE)

  background(bgCol);
}

function draw() {
}
