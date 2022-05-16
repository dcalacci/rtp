let WIDTH = 1280;
let HEIGHT = 1280;
let FRAME_RATE = 100 
let bgCol = "#f9f9f9";

let STEP_SIZE = 10;
let velocity = 500; // pixels / sec

let city_limit;
let padding = 50;

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"];
// let colors = ["#ffa268", "#68c5ff", "#ff687a", "#c5ff68", "#ffed68"];

function mousePressed() {
  save(new Date().toJSON() + ".png");
}

function preload() {
  allTracks = loadJSON("./f1-circuits.geojson"); //data from City of Calgary Open Data
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  background(bgCol);
  allTracks.features.forEach((geojson) => {
    tracks.push(new Track(geojson, WIDTH, HEIGHT));
  });
}

let tracks = [];
function draw() {
  noFill();
  strokeWeight(4);
  // tracks[0].update();
  // tracks[0].showLines();
  tracks.forEach((track) => {
    track.update();
    track.showLines();
  });
}

class Track {
  constructor(track, width, height) {
    this.bbox = track.bbox;
    this.coords = track.geometry.coordinates;
    this.vertices = [];
    this.width = width;
    this.height = height;

    this.color = color(random(colors));
    this.color.setAlpha(50);
    this.strokeWeight = random([3, 4, 5, 6]);

    // animation
    this.currentPointIdx = 1;
    this.t = 0;

    // make the first segment
    let [x1, y1] = this.projectPoint(this.coords[this.currentPointIdx - 1]);
    let [x2, y2] = this.projectPoint(this.coords[this.currentPointIdx]);
    // needed to ensure constant velocity throughout track
    this.stepSize = (velocity / FRAME_RATE)  / dist(x1, y1, x2, y2);

    while (this.t < 1 / this.stepSize) {
      console.log("stepping in loop..");
      this.stepVerticesForward(
        this.coords[this.coords.length - 2],
        this.coords[this.coords.length - 1]
      );
    }
    this.t = 0;
  }

  projectPoint(c) {
    let x = map(
      c[0],
      this.bbox[0],
      this.bbox[2],
      0 + padding,
      this.width - padding
    );
    let y = map(
      c[1],
      this.bbox[1],
      this.bbox[3],
      this.height - padding,
      0 + padding
    );
    return [x, y];
  }

  drawPoint(coord) {
    let lon = coord[0];
    let lat = coord[1];
    let [x, y] = this.projectPoint([lon, lat]);
    point(x, y);
  }

  stepVerticesForward(c1, c2) {
    let [x1, y1] = this.projectPoint(c1);
    let [x2, y2] = this.projectPoint(c2);
    let tempX = map(this.t, 0, 1 / this.stepSize, x1, x2, 1);
    let tempY = map(this.t, 0, 1 / this.stepSize, y1, y2, 1);
    this.vertices.push([tempX, tempY]);
    this.t += 1;
  }

  showPoints() {
    push();
    for (let i = 0; i < this.currentPointIdx; i++) {
      this.drawPoint(this.coords[i]);
    }
    pop();
  }

  showLines() {
    push();
    stroke(this.color);
    strokeWeight(this.strokeWeight);
    beginShape();
    this.vertices.forEach((v) => {
      // point(v[0], v[1])
      vertex(v[0], v[1]);
    });
    endShape();
    pop();
  }

  update() {
    if (this.t < 1 / this.stepSize) {
      let currentCoord = this.coords[this.currentPointIdx - 1];
      let nextCoord = this.coords[this.currentPointIdx];
      this.stepVerticesForward(currentCoord, nextCoord);
    } else if (this.currentPointIdx < this.coords.length - 1) {
      this.t = 0;
      this.currentPointIdx++;
      let [x1, y1] = this.projectPoint(this.coords[this.currentPointIdx - 1]);
      let [x2, y2] = this.projectPoint(this.coords[this.currentPointIdx]);
      // needed to ensure constant velocity throughout track
      this.stepSize = ((velocity / FRAME_RATE) * 1) / dist(x1, y1, x2, y2);
    }
  }
}
