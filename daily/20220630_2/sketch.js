
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]


let nCols = 20
let MAX_RANGE = 75
let range = 50
let randRange = d3.randomNormal(range, MAX_RANGE);
let ix = 0;

let size = [500, 500]
// let lineSizeRatio = 1 / size[1]
let lineSizeRatio = 10 / size[1]
let lineProb = 2 / 3

let cols = _.range(0, nCols, 1)

let img;
let tri;

let drawProb = 30

let lineScale = d3.scaleLinear()
  .domain([255, 0])
  .range([0, drawProb / 100])

let xScale = d3
  .scaleBand()
  .domain(cols)
  .range([0, size[0]])

function mousePressed() {
  save(new Date().toJSON() + ".png")
}

function preload() {
  img = loadImage('/daily/20220630/triangle1.png');
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  background(bgCol);
  noLoop()
  // loop()
  createCanvas(size[0], size[1]);
  let SCALE = 0.0005
  let r = noise(frameCount * SCALE, 1)
  range = Math.ceil((r + 1) / 2 * MAX_RANGE)

  img.loadPixels();
  tri = img.pixels
}

function draw() {
  background('#ffffff');
  // split into columns
  stroke('#000000')
  strokeWeight(size[0] / (121 * 4));
  // Noise. First, create the array of noise:
  // const noises = createNoises(size[1])
  // Then generate an index array of all our y values
  // const yVals = _.range(0, size[1], lineSizeRatio * size[1])
  // looks up noise for each y value
  // function getNoise(y) { return noises[_.indexOf(yVals, y)] }
  _.forEach(cols, (c) => {
    let lineLengths = createLinesWithShape(c, size[1], tri, range)
    lineLengths.forEach((l, i) => {
      // looks up our noise.
      // let n = getNoise(l[0])
      let n = 0
      line(
        xScale(c) + n, l[0],
        xScale(c) + n, l[1])
    })
  })

}


const NoiseMean = 0
const NoiseStd = 0.3 // std of normal dist for amount of noise
const NoiseProb = 1 / 2 // probabilty of applying at any y-axis interval

function createNoises(s) {
  // for a given size, creates an array of noise values for each pixel based on 
  // lineSizeRatio.
  let noises = []
  let noise = d3.randomNormal(NoiseMean, NoiseStd)
  // create noise with a 1/5 chance as we go down the y-axis
  let willChange = d3.randomBernoulli(NoiseProb)
  let currentNoise = noise()
  _.range(0, s, lineSizeRatio * s).forEach(
    (v, i, c) => {
      if (willChange()) {
        currentNoise = noise()
      }
      noises.push(currentNoise)
    })
  return noises;
}

function createLineLengths([start, end]) {
  // parameters: List of integer.
  // start: start x value
  // end: end x value
  // returns: a list of pairs [[start, end]] of each segment from start to end, probabalistically 
  // drawn from a bernoulli distribution. 
  let minLineSize = lineSizeRatio * (end - start);
  let x = start;
  // let rLine = noise(x / frameCount * 50) > lineProb
  let rLine = d3.randomBernoulli(lineProb)
  let lines = [];
  while (x < end) {
    if (rLine() > 0) {
      lines.push([x, x + minLineSize]);
    }
    x = x + minLineSize;
  }
  return lines
}

// function createLineLengthsNormal([start, end]) {
//   // parameters: List of integer.
//   // start: start x value
//   // end: end x value
//   // returns: a list of pairs [[start, end]] of each segment from start to end, probabalistically 
//   // drawn from a bernoulli distribution. 
//   let minLineSize = lineSizeRatio * (end - start);
//   let x = start;
//   // let rLine = noise(x / frameCount * 50) > lineProb
//   let rLine = d3.randomBernoulli(lineProb)
//   let lines = [];
//   while (x < end) {
//     if (rLine() > 0) {
//       lines.push([x, x + minLineSize]);
//     }
//     x = x + minLineSize;
//   }
//   return lines
// }

function createLinesWithShape(col, size, d, range) {
  // parameters: List of integer.
  // x: x val to create line on
  // size: length of lines in total 
  // returns: a list of pairs [[start, end]] of each segment from start to end, probabalistically 
  // drawn from a distribution ....
  let minLineSize = lineSizeRatio * size;
  let x = 0;
  let rLine = d3.randomBernoulli(lineProb)
  let lines = [];
  while (x < size) {
    let colX = xScale(col)
    let drawLine = d3.randomBernoulli(lineScale(getYNeighborMean([_.floor(colX), _.floor(x)], d, range)))
    if ((drawLine() > 0) | (rLine() > 0)) {
      lines.push([x, x + minLineSize]);
    }
    x = x + minLineSize;
  }
  return lines
}

function getYNeighborMean([x, y], d, range) {
  // returns the average values of pixels `range/2` above and `range/2` below 
  // the pixel at `x,y` in `d`. 
  let neighbors = _.range(y - _.ceil(range / 2), y + _.ceil(range / 2));
  return _.sum(neighbors.map(y2 => getValue([x, y2], d))) / neighbors.length;
}

function getValue([x, y], d) {
  // Returns the average value across all R,G,B values for a pixel 
  // at x,y in data array d.
  let idx = ((750 * 4) * y) + (x * 4)
  return (d[idx] + d[idx + 1] + d[idx + 2]) / 3;
}
