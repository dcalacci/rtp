let minHeight = 20;
let maxHeight = 120;
let frequency = 1.8;
let autoRotation = false;
let strokeEffect = true;
let size = 400; // size of whole "block"
let divs = 5; // number of times to divide box (this many boxes)
let spacing = (size / divs) / 2; // spacing between boxes
let boxWidth; // width of each box

let maxPauseLength = 5
let pauses = {}
let lastMax = {}
let frames = {}


function setup() {
  colorMode(HSB, 100);
  pixelDensity(1);
  createCanvas(800, 800, WEBGL);
  boxWidth = size / divs;
  if (strokeEffect) {
    stroke(90, 80, 80);
    strokeWeight(2);
  } else {
    noStroke();
  }
  ortho(-width / 2, width / 2, -height / 2, height / 2, -5 * size, 10 * size);
  camera(width, -width / 2, width * 2, 0, 0, 0, 0, 1, 0);
  //noLoop();
  dims = ["x", "y", "z"]
  dims.forEach((d) => frames[d] = _.fill(Array(divs), 0))
  dims.forEach((d) => lastMax[d] = _.fill(Array(divs), 0))
  dims.forEach((d) => pauses[d] = random(maxPauseLength))
}

function getLight() {
  ambientLight(100);
  // directionalLight(255, 255, 0, 0, 0, -1);
  // directionalLight(255, 255, 0, 0, 0, -1);
  // directionalLight(255, 255, 0, 0, 0, -1);
  // directionalLight(255, 255, 0, 0, 0, -1);

}



function draw() {
  if (autoRotation) rotateY(frameCount / 100);
  colorMode(HSB, 100);
  background(50, 50, 80);
  getLight()
  orbitControl();
  for (let z = 0; z < divs; z++) {
    for (let y = 0; y < divs; y++) {
      for (let x = 0; x < divs; x++) {
        let yPos = map(y, 0, divs, -size / 2, size / 2)
        let xPos = map(x, 0, divs, -size / 2, size / 2)
        let zPos = map(z, 0, divs, -size / 2, size / 2)

        let h = map(getH(
          xPos + boxWidth / 2,
          yPos + boxWidth / 2,
          zPos + boxWidth / 2), 0, 1, minHeight, maxHeight);
        push();

        getTranslation(x, yPos, zPos, frameCount, h)

        let hh = (cos(
          (frequency * TAU * (4 * z) + (2 * x)) /
          width + frameCount / 30) / 2 + 0.1);

        box(
          (boxWidth - spacing / 2),// * hh * 2, //* map(getH(x + side / 2, y + side / 2, z), 0, 1, 1, 1.2),
          (boxWidth - spacing / 2),
          (boxWidth - spacing / 2));
        pop();
      }
    }
  }
}


// for (let i = 0; i < divs; i++) {
//   lastMax[i] = 0;
//   xFrame[i] = 0;
// }

function getTranslation(x, y, z, t, h) {
  let xPos = map(x, 0, divs, -size / 2, size / 2)
  let vertOffset = boxWidth - spacing;
  let offset = (d) => map(d, -size / 2, size / 2, -1, 1)

  let xOffset = map(sin(frames.x[x] / 30 + offset(xPos)), -1, 1, 0, spacing)

  if (t - lastMax.x[x] < pauses.x) {
    // console.log("inside last max range for", x, lastMax[x], t)
  } else {
    frames.x[x] += 1 / (divs * divs)
    if (abs(xOffset - spacing) < 0.01 || xOffset < 0.01) {
      lastMax.x[x] = t
    }
  }


  translate(
    xPos + vertOffset + xOffset,
    y + vertOffset, //+ map(sin((t - 30) / 30 + offset(y)), 0, 1, 0, spacing),
    z + vertOffset,
  )
}




function getH(x, y, z) {
  let distFromCenter = dist(0, 0, 0, x, y, z);
  let d;
  d = z;
  // } else if (frameCount < 20 * 30) {
  //   d = z;
  // } else if (frameCount < 30 * 30) {
  //   d = distFromCenter
  // }
  return (
    cos(
      (frequency * PI / 2 * d) /
      width + frameCount / 30) / 2 +
    0.1
  );
}

