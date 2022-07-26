
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

let polyColors = [
  [351, 32, 98],
  [271, 32, 98]
]

// default, min, max, step
const globalParams = {
  bde: [1, 0, 100, 1]
}

const polygonParams = {
  nLayers: [50, 10, 200, 1],
  stdScale: [1., 0, 10, 0.1],
  polyRadius: [100, 20, 500, 10],
  alpha: [0.05, 0.01, 0.8, 0.01],
  polyX: [0, -WIDTH / 2, WIDTH / 2, 1],
  polyY: [0, -HEIGHT / 2, HEIGHT / 2, 1],
  polyDeformN: [4, 2, 8, 1],
  polyDeformVar: [0.2, 0.1, 2.0, 0.01],
  polyLayerStdX: [20, 0, 200, 1],
  polyLayerStdY: [20, 0, 200, 1],
  noiseScale: [10, 1, 200, 1]
}

const globalSettings = _.mapValues(globalParams, (o) => o[0])
let polySettings = _.mapValues(polygonParams, (o) => o[0])
// polySettings.color = { h: 0, s: 0, b: 0 }

let allPolySettings = polyColors.map((c) => {
  return {
    ...polySettings,
    color: {
      h: c[0], s: c[1], b: c[2]
    }
  }
})
console.log("All poly settings:", allPolySettings)

let seed = 1243
function keyPressed() {
  if (key == "s") {
    fname = new Date().toJSON()
    save(fname + "_" + seed + ".png")
    saveJSON(
      //TODO: add polygon settings
      { global: globalParams },
      fname + ".json")
  }
}

function preload() {

}

let c;
let rng;
let dim;

function setup() {
  randomSeed(1243);
  colorMode(HSB);
  noStroke()
  gui = new dat.GUI();
  gui.useLocalStorage = true

  // Global folder
  let global = gui.addFolder('global')
  controllers = []
  _.forEach(globalParams, (([dd, min, max, step], k) => {
    controllers.push(global.add(globalSettings, k, min, max, step));
  }))
  var obj = { REDRAW: function() { redraw() } };
  controllers.push(global.add(obj, 'REDRAW'))
  controllers.forEach((con) => con.onChange(() => { clear(); redraw() }))

  // Polygons
  polyControllers = []
  polyColors.forEach(([h, s, b], n) => {
    const polyFolderN = gui.addFolder(`Poly${n}`)
    const thisPolySettings = allPolySettings[n]
    // indexed by n
    _.forEach(polygonParams, (([dd, min, max, step], k) => {
      polyControllers.push(polyFolderN.add(thisPolySettings, k, min, max, step))
    }))
  })
  polyControllers.forEach((con) => con.onChange(() => { clear(); redraw() }))

  rng = d3.randomLcg(random())

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  createCanvas(0.70 * dim, dim);
  rectMode(CENTER);
}

function draw() {
  c = createGraphics(width * 0.9, height * 0.9)
  c.noStroke()

  noLoop()
  background(bgCol);
  noFill();

  push()
  c.background(240)
  c.translate(c.width / 2, c.height / 2)
  drawBrushMarks(globalSettings, allPolySettings)
  c.translate(c.width * 0.1, c.height * 0.075)
  image(c, width * 0.05, height * 0.05)
  pop()
}
