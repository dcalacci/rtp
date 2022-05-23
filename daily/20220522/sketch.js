let WIDTH = 1280;
let HEIGHT = 1280;
let FRAME_RATE = 100

let N_TRACKS = null // number of tracks to render
let START_AT_CENTER = true// whether to start all tracks at center of canvas
let WIDTH_OPTIONS = [1]
let ALPHA = 0.5
let ROTATE = false // rotate each track randomly?

let velocity = 500 // pixels / sec

let padding = 50;

let bgCol = "#1D1718";
// let colors = ["#ffed68"]
let colors = ["#FF9DF0"]
// let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"];
// let colors = ["#A6C6C1", "#D1C5DE", "#DEA898", "#6A9CAB"]
// let colors = ["#ffa268", "#68c5ff", "#ff687a", "#c5ff68", "#ffed68"];

let tracks = [];

function mousePressed() {
  save(new Date().toJSON() + ".png");
}

function preload() {
  allTracks = loadJSON("./f1-circuits.geojson");
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  background(bgCol);
  let shuffled_tracks = allTracks.features
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
  let tr = N_TRACKS != null ? shuffled_tracks.slice(0, N_TRACKS) : shuffled_tracks
  tr.forEach((geojson) => {
    tracks.push(new Track(geojson, WIDTH, HEIGHT));
  });
}


function draw() {
  background(bgCol)
  noFill();
  // strokeWeight(4);
  tracks.forEach((track) => {
    push()
    translate(width / 2, height / 2)
    track.update();
    track.showLines();
    pop()
  });
}

class Track {
  constructor(track, width, height) {
    this.track = track
    this.bbox = track.bbox;
    this.coords = track.geometry.coordinates;
    this.vertices = [];
    this.width = width;
    this.height = height;
    this.rotate = random(-PI, PI)

    this.color = color(random(colors));
    this.color.setAlpha(ALPHA);
    this.strokeWeight = random(WIDTH_OPTIONS);

    // animation
    this.currentPointIdx = 1; // start one point in
    this.t = 0;

    // make the first segment
    let [x1, y1] = this.projectPoint(this.coords[this.currentPointIdx - 1]);
    let [x2, y2] = this.projectPoint(this.coords[this.currentPointIdx]);

    this.startAtCenter = START_AT_CENTER
    this.startingPoint = [x1, y1]
    // needed to ensure constant velocity throughout track
    this.stepSize = (velocity / FRAME_RATE) / dist(x1, y1, x2, y2);

    this.t = 0;
  }

  projectPoint(c) {
    let x = map(
      c[0],
      this.bbox[0],
      this.bbox[2],
      0 + padding / 2,
      this.width / 2 - padding / 2
    );
    let y = map(
      c[1],
      this.bbox[1],
      this.bbox[3],
      this.height / 2 - padding / 2,
      0 + padding / 2
    );
    if (this.startAtCenter) {
      return [
        x - this.startingPoint[0],
        y - this.startingPoint[1]
      ]

    } else {
      return [x, y];
    }
  }

  // getBbox() {
  //   if (this.startAtCenter) {
  //     // get bbox from center point
  //     let minX = _.min(this.coords.map((x) => x[0]), (x) => this.startingPoint[0])
  //   } else {
  //     return this.track.bbox
  //   }
  // }

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
    if (ROTATE) rotate(this.rotate)
    // for a "fade in " effect, don't draw background, and keep alpha extremely low, like 0.5 or so. 
    // it will re-draw on each iteration and make a ghostly effect
    // let alpha = map(this.currentPointIdx, 0, this.coords.length, 0.75, 3)
    let alpha = map(this.currentPointIdx, 0, this.coords.length, 20, 275)
    this.color.setAlpha(alpha);
    stroke(this.color);
    strokeWeight(this.strokeWeight);
    beginShape();
    this.vertices.forEach((v, i) => {
      // point(v[0], v[1])

      curveVertex(v[0], v[1]);
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
