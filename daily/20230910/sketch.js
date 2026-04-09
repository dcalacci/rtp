let SEED = Math.floor(Math.random() * 100000);
let WIDTH = 1280;
let HEIGHT = 1280;
let bgCol = "#f9f9f9";
let GUI;

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"];

const settings = {
  exampleSetting: [1, 0, 10, 0.1],
  same_seed: [false],
};

const settingValues = _.mapValues(settings, (o) => o[0]);

// By Roni Kaufman
// https://ronikaufman.github.io

let margin = 0;
let N = 20;
let u, gap;
let backCol = 250;
let palette = ["#2a76d3", "#f4d730", "#f44e24", "#23b247", "#f398c3"];

let rectangles = [];

let randInt = (a, b) => floor(random(a, b));

// function mousePressed() {
//   // saves both image and the json of current settings
//   fname = 'daily_' + new Date().toJSON()
//   save(fname + "_" + SEED + ".png")
//   saveJSON(settings, fname + ".json")
// }

function preload() {}

function redrawSketch() {
  clear();
  clear();
  redraw();
  redraw();
  background("#EFAF0E");
  if (!GUI.config.same_seed) {
    SEED = Math.floor(Math.random() * 100000);
    randomSeed(SEED);
    noiseSeed(SEED);
  }
}

function setup() {
  randomSeed(1243);
  colorMode(HSB);

  rng = d3.randomLcg(random());

  let dim = Math.min(windowWidth, windowHeight) * 0.8;
  bg = int(random(244, 254));
  // createCanvas(100, 100, SVG);
  createCanvas(0.7 * dim, dim, SVG);

  // initialize gui
  GUI = new _GUI(settings);
  GUI.startGUI(redrawSketch);

  // c = createGraphics(width * 0.9, height * 0.9, SVG);
  // c = createCanvas(width * 0.9, height * 0.9, SVG);
  translate(width * 0.1, height * 0.075);

  pixelDensity(4);
  u = width / N;
  gap = u / 6;
  noStroke();
  noLoop();
  createComposition();

  // rectMode(CENTER);
}

function draw() {
  // c = createGraphics(width * 0.9, height * 0.9);
  noLoop();
  background(bgCol);
  noFill();

  push();
  background(240);
  // Draw here

  let letters = [drawS, drawA, drawV, drawE];

  const drawLetter = (c, x0, y0, si, sj) => {
    const letterFunc = letters.shift();
    letters.push(letterFunc);
    letterFunc(c, x0, y0, si, sj);
  };

  rectangles = _.sortBy(rectangles, (r) => r.j);

  for (let recta of rectangles) {
    if (recta.si == 1 && recta.sj == 1) {
      drawLetter(
        recta.i * u + gap / 2,
        recta.j * u + gap / 2,
        recta.si,
        recta.sj
      );
      // }
    } else {
      drawRectangle(
        recta.i * u + gap / 2,
        recta.j * u + gap / 2,
        recta.si,
        recta.sj
      );
    }
  }

  //display canvas
  translate(width * 0.1, height * 0.075);
  image(c, width * 0.05, height * 0.05);
}

function createComposition() {
  for (let i = 0; i < 2000; i++) {
    let newRecta = generateRectangle();
    let canAdd = true;
    for (let recta of rectangles) {
      if (rectanglesIntersect(newRecta, recta)) {
        canAdd = false;
        break;
      }
    }
    if (canAdd) {
      rectangles.push(newRecta);
    }
  }

  // fill the gaps with 1x1 rectangles
  for (let i = margin; i < N - margin; i++) {
    for (let j = margin; j < N - margin; j++) {
      let newRecta = {
        i: i,
        j: j,
        si: 1,
        sj: 1,
      };
      let canAdd = true;
      for (let recta of rectangles) {
        if (rectanglesIntersect(newRecta, recta)) {
          canAdd = false;
          break;
        }
      }
      if (canAdd) {
        rectangles.push(newRecta);
      }
    }
  }
}

// function createWords(i, j, si, sj) {
// }

function drawA(x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;
  // noStroke();
  push();
  noFill();
  stroke(1);
  strokeWeight(1.5);

  translate(x0 + w / 2, y0 + h / 2);
  rotate(PI);
  translate(-x0 - h / 2, -y0 - w / 2);

  // Left diagonal
  line(x0 + 0.75 * w, y0, x0 + 0.75 * w, y0 + 0.5 * h);
  // Right diagonal
  line(x0 + 0.25 * w, y0, x0 + 0.25 * w, y0 + 0.5 * h);
  // line(x0 + w, y0, x0 + w / 2, y0 + h);
  // top arc
  arc(x0 + w / 2, y0 + h / 2, w / 2, h / 2, 0, PI);

  // middle bar
  line(x0 + 0.25 * w, y0 + 0.25 * h, x0 + 0.75 * w, y0 + 0.25 * h);

  pop();
}

function drawV(x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;
  push();
  noFill();
  stroke(1);
  strokeWeight(1.5);

  // TODO: make more of a 'v' shape
  // Left diagonal
  line(x0 + 0.2 * w, y0 + 0.3 * h, x0 + 0.25 * w, y0 + 0.75 * h);

  // bottom arc
  arc(x0 + w / 2, y0 + 0.75 * h, w / 2, h / 2, 0.05 * PI, 0.95 * PI);
  // Right diagonal
  line(x0 + 0.75 * w, 0.75 * h + y0, x0 + 0.8 * w, y0 + 0.3 * h);

  pop();
}

function drawE(x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;
  push();
  noFill();
  stroke(1);
  strokeWeight(1.5);

  translate(0.15 * w, 0.15 * h);
  // Top horizontal line
  line(x0 + 0.25 * w, y0 + 0.17 * h, x0 + w - 0.33 * w, y0 + 0.17 * h);
  // Middle horizontal line
  line(x0 + 0.25 * w, y0 + h / 2, x0 + w - 0.33 * w, y0 + h / 2);
  // Bottom horizontal line
  line(x0 + 0.25 * w, y0 + h * 0.83, x0 + w - 0.33 * w, y0 + h * 0.83);

  // Left arc (top)
  arc(x0 + 0.25 * w, y0 + 0.33 * h, 0.33 * w, 0.33 * h, 0.5 * PI, 1.5 * PI);
  // Left arc (bottom)
  arc(x0 + 0.25 * w, y0 + 0.66 * h, 0.33 * w, 0.33 * h, 0.5 * PI, 1.5 * PI);
  pop();
}

function drawS(x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;
  // rotate(PI / 2)
  push();
  noFill();
  stroke(1);
  strokeWeight(1.5);

  push();
  translate(0.05 * w, 0.17 * h);
  // Top horizontal line
  line(x0 + 0.33 * w, y0 + 0.15 * h, x0 + w - 0.25 * w, y0 + 0.15 * h);
  // Middle horizontal line
  line(x0 + 0.33 * w, y0 + h / 2, x0 + w - 0.33 * w, y0 + h / 2);
  // Bottom horizontal line
  line(x0 + 0.25 * w, y0 + h * 0.82, x0 + w - 0.33 * w, y0 + h * 0.82);

  // Left arc (top)
  arc(x0 + 0.33 * w, y0 + 0.33 * h, 0.33 * w, 0.33 * h, 0.5 * PI, 1.5 * PI);
  // Left arc (bottom)
  // arc(x0 + 0.25 * w, y0 + 0.66 * h, 0.33 * w, 0.33 * h, 0.5 * PI, 1.5 * PI);
  arc(x0 + 0.66 * w, y0 + 0.66 * h, 0.33 * w, 0.33 * h, 1.5 * PI, 0.5 * PI);

  pop();
  pop();
}

function rectanglesIntersect(recta1, recta2) {
  return (
    ((recta1.i <= recta2.i && recta1.i + recta1.si > recta2.i) ||
      (recta2.i <= recta1.i && recta2.i + recta2.si > recta1.i)) &&
    ((recta1.j <= recta2.j && recta1.j + recta1.sj > recta2.j) ||
      (recta2.j <= recta1.j && recta2.j + recta2.sj > recta1.j))
  );
}

function generateRectangle() {
  let si, sj;
  do {
    si = randInt(1.5, 5);
    sj = randInt(1.5, 7);
  } while ((si == 1 && sj == 1) || si == sj);
  let i = randInt(margin, N - margin - si + 1);
  let j = randInt(margin, N - margin - sj + 1);
  let recta = {
    i: i,
    j: j,
    si: si,
    sj: sj,
  };
  return recta;
}

function drawRectangle(x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;

  let col1 = random(palette),
    col2 = 5;
  if (random() < 1 / 3) [col1, col2] = [col2, col1];

  noStroke();
  fill(col1);
  // UNCOMMENT TO GET RECTS AGAIN
  // rect(x0, y0, w, h);

  noStroke();
  // fill(col2);
  fill(0);
  if (si == 1 && sj == 1) {
    circle(x0 + w / 2, y0 + h / 2, 3 * gap);
    fill(col1);
    circle(x0 + w / 2, y0 + h / 2, gap);
  } else {
    push();
    if (sj == 1 || (si > 1 && random() < 1 / 3)) {
      translate(x0 + w / 2, y0 + h / 2);
      rotate(PI / 2);
      translate(-x0 - h / 2, -y0 - w / 2);
      [si, sj] = [sj, si];
      [w, h] = [h, w];
    }

    for (let y = gap; y < h - gap; y += 2 * gap) {
      rect(x0 + 2.5 * gap, y0 + y, w - 5 * gap, gap);
    }

    let leftBorder = random() < 1 / 2;

    if (leftBorder) {
      rect(x0 + w - 2.5 * gap, y0 + gap, 1.5 * gap, gap);
    } else {
      rect(x0 + gap, y0 + gap, 1.5 * gap, gap);
    }

    if ((leftBorder && sj % 2 == 1) || (!leftBorder && sj % 2 == 0)) {
      rect(x0 + w - 2.5 * gap, y0 + h - 2 * gap, 1.5 * gap, gap);
    } else {
      rect(x0 + gap, y0 + h - 2 * gap, 1.5 * gap, gap);
    }

    for (let y = 2.5 * gap; y < h - gap; y += 2 * gap) {
      if (leftBorder) {
        // fill(col2);
        // fill('#ffff')
        fill(0);
        arc(x0 + 2.5 * gap, y0 + y, 3 * gap, 3 * gap, PI / 2, (3 * PI) / 2);
        // fill(col1);
        fill("#ffff");
        arc(x0 + 2.5 * gap, y0 + y, gap, gap, PI / 2, (3 * PI) / 2);
      } else {
        // fill(col2);
        fill(0);
        arc(x0 + w - 2.5 * gap, y0 + y, 3 * gap, 3 * gap, -PI / 2, PI / 2);

        fill("#ffff");
        // fill(col1);
        arc(x0 + w - 2.5 * gap, y0 + y, gap, gap, -PI / 2, PI / 2);
      }
      leftBorder = !leftBorder;
    }
    pop();
  }
}
