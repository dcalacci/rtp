let divs = 10;
let size = 400;
let minHeight = 20;
let maxHeight = 120;
let frequency = 1.8;
let autoRotation = false;
let strokeEffect = true;
let spacing = 30;
let side;

let nLayers = 5

function setup() {
  colorMode(HSB, 100);
  pixelDensity(1);
  createCanvas(600, 600, WEBGL);
  side = size / divs;
  if (strokeEffect) {
    stroke(90, 80, 80);
    strokeWeight(2);
  } else {
    noStroke();
  }
  ortho(-width / 2, width / 2, -height / 2, height / 2, -2 * size, 5 * size);
  camera(width, -width / 2, width, 0, 0, 0, 0, 1, 0);
  //noLoop();
}

function draw() {
  if (autoRotation) rotateY(frameCount / 100);
  colorMode(HSB, 100);
  background(50, 50, 80);
  ambientLight(100);
  // directionalLight(255, 255, 0, 0, 0, -1);
  // directionalLight(255, 255, 0, 0, 0, -1);
  // directionalLight(255, 255, 0, 0, 0, -1);
  // directionalLight(255, 255, 0, 0, 0, -1);
  orbitControl();
  for (let z = 1; z <= nLayers; z += 1) {
    for (let y = -size / 2; y < size / 2; y += side) {
      for (let x = -size / 2; x < size / 2; x += side) {
        let h = map(getH(
          x + side / 2,
          y + side / 2,
          z), 0, 1, minHeight, maxHeight);
        push();

        let vertOffset = side - spacing;
        translate(
          // x + side,
          (x + side / z) - h / 2,
          ((z * (side + vertOffset)) - 100) + h / 2,
          (-spacing + y + side / z)); //* (sin(frameCount / 50)))
        box(
          (side - spacing / 2) * map(getH(x + side / 2, y + side / 2, z), 0, 1, 1, 1.2),
          (side - spacing / 2), //* map(getH(x + side / 2, y + side / 2, l), 0, 1, 1, 1.2),
          side - spacing / 2);
        pop();
      }
    }
  }
}

function getH(x, y, z) {
  let distFromCenter = dist(0, 0, 0, x, y, z);
  return (
    cos((frequency * PI * distFromCenter) / width + frameCount / 30) / 2 +
    0.5
  );
}

