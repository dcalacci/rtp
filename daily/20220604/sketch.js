let minHeight = 20;
let maxHeight = 120;
let frequency = 1.8;
let autoRotation = false;
let strokeEffect = true;
let size = 400; // size of whole "block"
let divs = 8; // number of times to divide box (this many boxes)
let spacing = (size / divs) / 2; // spacing between boxes
let boxWidth; // width of each box

let maxPauseLength = 5
let pauses = {}
let lastMax = {}
let frames = {}

let cam;


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
  cam = createCamera()
  ortho(-width / 2, width / 2, -height / 2, height / 2, -5 * size, 10 * size);
  cam.camera(width * 3, -width / 2, width * 2, 0, 0, 0, 0, 3, 0);
  cam.tilt(.2)
  cam.move(0, -600, 0)
  //noLoop();
  dims = [0, 1, 2]
  dims.forEach((d, i) => frames[d] = _.fill(Array(divs), 0))
  dims.forEach((d) => lastMax[d] = _.fill(Array(divs), 0))
  // staggering pauses means each dim moves in isolation
  dims.forEach((d, i) => pauses[d] = i)
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
        // tt = [1, 1, 1]
        box(
          (boxWidth - spacing / 2) * tt[0],
          (boxWidth - spacing / 2) * tt[1],
          (boxWidth - spacing / 2) * tt[2]);
        pop();
      }
    }
  }
}

function getTranslation(x, y, z, t) {
  let vertOffset = boxWidth - spacing;

  let d = dist(0, 0, 0, x, y, z);
  translate(
    getDimTranslation(0, x, t, d) + vertOffset,
    getDimTranslation(1, y, t, d) + vertOffset,
    getDimTranslation(2, z, t, d) + vertOffset,
  )
}


function getDimTranslation(dimName, dimIndex, t, d) {
  let pos = map(dimIndex, 0, divs, -size / 2, size / 2)
  let vertOffset = boxWidth - spacing;
  let offset = (d) => map(d, -size / 2, size / 2, -1, 1)

  let dimOffset = map(sin(frameCount / 30 + offset(d)), -1, 1, spacing * -2, spacing * 2)

  // let dimOffset = map(sin(frames[dimName][dimIndex] / 30 + offset(pos)), -1, 1, 0, spacing * 2)

  if (t - lastMax[dimName][dimIndex] > pauses[dimName]) {
    frames[dimName][dimIndex] += 1 / (divs * divs)
    if (abs(dimOffset - spacing * 2) < 0.01 || dimOffset < 0.01) {
      lastMax[dimName][dimIndex] = t
    }
  }
  return vertOffset + pos //dimOffset + pos //* map(cos((PI / 4 * d) / width + (frameCount / 30)), 0, 1, 1, 1.2)

}

function getTransform(x, y, z, t) {
  let distFromCamera = dist(-10, 0, -10, x, y, z);
  let vertOffset = boxWidth - spacing;

  return [x, y, z].map((d, i) => {
    let pos = map(d, 0, divs, -size / 2, size / 2)
    let offset = (d) => map(d, -size / 2, size / 2, -1, 1)
    // let dimOffset = map(sin(distFromCenter + frames[i][d] / 30), -1, 1, 0.5, 1.2)
    let dimOffset = map(sin(frameCount / 10 * offset(distFromCamera)), -1, 1, -.5, 1)
    return dimOffset // * distFromCenter / 3//* map(noise((frameCount * d * i / 100)), 0, 1, 0.8, 1)
  })
  // return (
  //   cos(
  //     (PI / 2 * distFromCenter) /
  //     width + frameCount / 30) / 2 +
  //   0.1
  // );
}
