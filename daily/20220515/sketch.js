
let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let boundary;
let city_limit;
let padding = 20;

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

function getBoundingBox(boundary) {
  let bounds = {};
  let coords, latitude, longitude;
  let data = boundary.bbox;

  for (var i = 0; i < data.length; i++) {
    coords = data[i];

    for (var j = 0; j < coords.length; j++) {
      longitude = coords[0];
      latitude = coords[1];
      bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
      bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
      bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
      bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
    }
  }
  return bounds;
}

function mousePressed() {
  save(new Date().toJSON() + ".png")
}

function draw_track(track, height, width) {
  console.log("drawing track:", track)
  let boundary = track.bbox
  let coordinates = track.geometry.coordinates
  strokeWeight(10)
  noFill()
  stroke(colors[0])
  beginShape();
  for (var i = 0; i < coordinates.length; i++) {
    let lon = coordinates[i][0];
    let lat = coordinates[i][1];

    let x = map(lon, boundary[0], boundary[2], 0 + padding, width - padding);
    let y = map(lat, boundary[1], boundary[3], height - padding, 0 + padding);

    vertex(x, y);
  }
  endShape(CLOSE);
}


function preload() {
  tracks = loadJSON("./f1-circuits.geojson"); //data from City of Calgary Open Data
}

function drawTrackVertex(coord, boundary, width, height) {
  let lon = coord[0];
  let lat = coord[1];

  let x = map(lon, boundary[0], boundary[2], 0 + padding, width - padding);
  let y = map(lat, boundary[1], boundary[3], height - padding, 0 + padding);
  point(x, y)
  // vertex(x, y);
}

let i = 0;
let j = 0;
function draw() {
  noFill()
  strokeWeight(4)
  stroke(colors[i % colors.length])
  console.log("ntracks:", tracks.features.length)
  if (i < tracks.features.length - 1) {

    console.log(`in draw loop for track # ${i}`)
    let track = tracks.features[i] // set track
    let coords = track.geometry.coordinates

    // if (frameCount % 30 == 0) { // update track counter
    //   i++
    // }

    if (j <= coords.length - 1) {
      // if we're at the first vertex, begin our shape
      if (j == 0) {
        console.log(`begining shape...`)
        // beginShape()
      }

      console.log(`drawing vertex ${j}, ${coords[j]},  ${track.bbox}`)
      drawTrackVertex(coords[j], track.bbox, WIDTH, HEIGHT)

      if (j == coords.length - 1) {
        console.log(`ending shape...`)
        // endShape()
        i++
        j = 0
      }

      j++;
    }
  }
}


function setup() {
  // blendMode(BLUR)
  createCanvas(WIDTH, HEIGHT);

  background(bgCol);
  console.log(tracks)
}
