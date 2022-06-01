let divs = 10;
let size = 250;
let minHeight = 20;
let maxHeight = 120;
let frequency = 1.8;
let autoRotation = false;
let strokeEffect = true;
let spacing = (size / divs) / 2;
let side;

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

function getTranslation(x, y, z, t, h) {
  let vertOffset = side - spacing;
  translate(
    x + side + h / 4,
    z + side + h / 2,
    y + side + h / 2)
  // (-spacing + y + side / z));
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
  for (let z = 0; z < divs; z++) {
    for (let y = 0; y < divs; y++) {
      for (let x = 0; x < divs; x++) {
        let yPos = map(y, 0, divs, -size / 2, size / 2)
        let xPos = map(x, 0, divs, -size / 2, size / 2)
        let zPos = map(z, 0, divs, -size / 2, size / 2)

        let h = map(getH(
          xPos + side / 2,
          yPos + side / 2,
          zPos + side / 2), 0, 1, minHeight, maxHeight);
        push();

        getTranslation(xPos, yPos, zPos, frameCount, h)
        // translate(
        //   // x + side,
        //   (x + side / z),
        //   ((z * (side + vertOffset)) - 100) + h / 2,
        //   (-spacing + y + side / z)); //* (sin(frameCount / 50)))
        box(
          side - spacing / 2, //* map(getH(x + side / 2, y + side / 2, z), 0, 1, 1, 1.2),
          side - spacing / 2, //* map(getH(xPos + side / 2, yPos + side / 2, z), 0, 1, 1, 1.2),
          side - spacing / 2);
        pop();
      }
    }
  }
}

function getH(x, y, z) {
  let distFromCenter = dist(0, 0, 0, x, y, z);
  return (
    cos(
      (frequency * PI / 2 * distFromCenter) /
      width + frameCount / 30) / 2 +
    0.1
  );
}

