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
  dims = [0, 1, 2]
  dims.forEach((d, i) => frames[d] = _.fill(Array(divs), 0))
  dims.forEach((d) => lastMax[d] = _.fill(Array(divs), 0))
  // staggering pauses means each dim moves in isolation
  dims.forEach((d, i) => pauses[d] = i * 2)
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
        push();
        getTranslation(x, y, z, frameCount)
        let tt = getTransform(x, y, z, frameCount)
        box(
          (boxWidth - spacing / 2) * tt[0], //* map(getH(x + side / 2, y + side / 2, z), 0, 1, 1, 1.2),
          (boxWidth - spacing / 2) * tt[1],
          (boxWidth - spacing / 2) * tt[2]);
        pop();
      }
    }
  }
}

function getDimTranslation(dimName, dimIndex, t) {
  let pos = map(dimIndex, 0, divs, -size / 2, size / 2)
  let vertOffset = boxWidth - spacing;
  let offset = (d) => map(d, -size / 2, size / 2, -1, 1)

  let dimOffset = map(sin(frames[dimName][dimIndex] / 30 + offset(pos)), -1, 1, 0, spacing)

  if (t - lastMax[dimName][dimIndex] > pauses[dimName]) {
    frames[dimName][dimIndex] += 1 / (divs * divs)
    if (abs(dimOffset - spacing) < 0.01 || dimOffset < 0.01) {
      lastMax[dimName][dimIndex] = t
    }
  }
  return pos + vertOffset + dimOffset
}

function getTranslation(x, y, z, t, h) {
  let vertOffset = boxWidth - spacing;
  translate(
    getDimTranslation(0, x, t) + vertOffset,
    getDimTranslation(1, y, t) + vertOffset,
    getDimTranslation(2, z, t) + vertOffset,
    // map(x, 0, divs, -size / 2, size / 2) + vertOffset,
    // map(y, 0, divs, -size / 2, size / 2) + vertOffset,
    // map(z, 0, divs, -size / 2, size / 2) + vertOffset
  )
}


function getTransform(x, y, z, t) {
  let distFromCenter = dist(0, 0, 0, x, y, z);
  let vertOffset = boxWidth - spacing;

  return [x, y, z].map((d, i) => {
    let pos = map(d, 0, divs, -size / 2, size / 2)
    let dimOffset = map(sin(distFromCenter + frames[i][d] / 30), -1, 1, 0.5, 1.2)
    return dimOffset
  })
  // return (
  //   cos(
  //     (PI / 2 * distFromCenter) /
  //     width + frameCount / 30) / 2 +
  //   0.1
  // );
}
