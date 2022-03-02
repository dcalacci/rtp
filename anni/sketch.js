let w = 400;
let h = 600;

let nSegments = 10;
let NOISE_SCALE = 0.01;
let W_SCALE = w / 4
let H_SCALE = h / 4

let grav_point = {x: w/2, y: h/2}
let grav_force = 0.2
let grav_decay = 0.95

let generateLength= () => w * (0.25 + random(0.1))

let x, y;

function setup() {
  createCanvas(w, h);
  noLoop();
  x = w * 0.5;
  y = h * 0.5;  
}

function drawLine({xStart, yStart}) {
	// up to 10% shift
	let gravForce = grav_force
	let lineLength = 0;
	let totalLength = generateLength()
	let yEnd= yStart + (random(0.1) * w * random([-1, 1]));
	while (lineLength < totalLength) {
		gravForce = gravForce * grav_decay

	}
}

function addNextPoint(x, y) {
	inBounds = (x, y) => {
		return x > 0 && x < w && y > 0 && y < h;
	}
	
	let xRand = 0;
	let yRand = 0;
	while (!inBounds(xRand, yRand)) {
		yRand = map(noise((x* NOISE_SCALE), y* NOISE_SCALE), 0, 1, -H_SCALE, H_SCALE)
		xRand = map(noise((y* NOISE_SCALE), x* NOISE_SCALE), 0, 1, -W_SCALE, W_SCALE)
	}
	x = x + xRand;
	y = y + yRand;
	return {x, y}
}

function draw() {
  // Loop through creating line segments
  beginShape();
  noFill();

  // Add the first point
  stroke("black");
  strokeWeight(5);
  curveVertex(x, y);
  curveVertex(x, y);
  let points = [{ x: x, y: y }];
  _.range(nSegments).forEach((i) => {
    // Get random y
    // Add point to curve
	let r = addNextPoint(x, y);
    curveVertex(r.x, r.y)

    // Save point
    points.push({ x: x, y: y });
  });
  endShape();

  // Draw points for visualization
  stroke("#F4D06F");
  strokeWeight(10);
  points.push({ x: x, y: y });
  points.forEach(function (p) {
    point(p.x, p.y);
  });

  // Draw the line once and stop
  noLoop();
}
