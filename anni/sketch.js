let w = 400;
let h = 600;

let distances = [];
let maxDistance;
let spacer;

function setup() {
  pixelDensity(1);
  createCanvas(8.5 * 150, 11 * 150); // create an 8.5x11 inch canvas at 150dpi

  maxDistance = dist(width / 2, height / 2, width, height);
  for (let x = 0; x < width; x++) {
    distances[x] = []; // create nested array
    for (let y = 0; y < height; y++) {
      let distance = dist(width / 2, height / 2, x, y);
      distances[x][y] = (distance / maxDistance) * 255;
    }
  }
  spacer = 10;

  noLoop();
}

 

function draw() {
  // Loop through creating line segments
  beginShape();
  noFill();
  for (let x = 0; x < width; x += spacer) {
    for (let y = 0; y < height; y += spacer) {
      stroke(distances[x][y]);
      point(x + spacer / 2, y + spacer / 2);
    }
  }
}
