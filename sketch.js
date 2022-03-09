let x = [],
  y = [],
  segNum = 10,
  segLength = 120;

for (let i = 0; i < segNum; i++) {
  x[i] = 0;
  y[i] = 0;
}

let artists = ["ken", "muriel", "anni"];
let artistNames = ["ken knowlton", "muriel cooper", "anni albers"];
let artistPreviews;

function preload() {
  artistPreviews = _.map(artists, (artist, i) => {
    let img = loadImage(`${artist}/preview.png`);
    return img;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(25);
  stroke(255, 20);
}

function draw() {
  background(255);
  dragSegment(0, mouseX, mouseY);
  for (let i = 0; i < x.length - 1; i++) {
    dragSegment(i + 1, x[i], y[i]);
  }
}

function dragSegment(i, xin, yin) {
  const dx = xin - x[i];
  const dy = yin - y[i];
  const angle = atan2(dy, dx);
  x[i] = xin - cos(angle) * segLength;
  y[i] = yin - sin(angle) * segLength;
  segment(x[i], y[i], angle, i);
}

function segment(x, y, a, i) {
  push();
  translate(x, y);

  textSize(18);
  if (i <= artistPreviews.length - 1) {
    console.log(artistPreviews[i]);
    strokeWeight(5);
    stroke(255, 100);
    let multiplier = 0.8;
    image(
      artistPreviews[i],
      0,
      0,
      segLength * multiplier,
      segLength * multiplier
    );
    text(artistNames[i], 0, segLength * multiplier + 10);
  } else {
    textSize(25);
    strokeWeight(10);
    text("?", 0, 0);
  }
  strokeWeight(15);

  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}
