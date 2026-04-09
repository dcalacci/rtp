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
  c.clear();
  redraw();
  c.redraw();
  c.background("#EFAF0E");
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
  c = createCanvas(0.7 * dim, dim, SVG);

  // initialize gui
  GUI = new _GUI(settings);
  GUI.startGUI(redrawSketch);

  // c = createGraphics(width * 0.9, height * 0.9, SVG);
  // c = createCanvas(width * 0.9, height * 0.9, SVG);
  translate(c.width * 0.1, c.height * 0.075);

  pixelDensity(4);
  u = c.width / N;
  gap = u / 6;
  noStroke();
  noLoop();
  createComposition();

  rectMode(CENTER);
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
    const letterFunc = letters.shift()
    letters.push(letterFunc)
    letterFunc(c, x0, y0, si, sj)
  }

  rectangles = _.sortBy(rectangles, (r) => r.j);

  for (let recta of rectangles) {
    if (recta.si == 1 && recta.sj == 1) {
      drawLetter(
        c,
        recta.i * u + gap / 2,
        recta.j * u + gap / 2,
        recta.si,
        recta.sj
      );
      // }
    } else {
      drawRectangle(
        c,
        recta.i * u + gap / 2,
        recta.j * u + gap / 2,
        recta.si,
        recta.sj
      );
    }
  }

  //display canvas
  c.translate(c.width * 0.1, c.height * 0.075);
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

function drawA(c, x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;
  // c.noStroke();
  c.push();
  c.noFill();
  c.stroke(1);
  c.strokeWeight(1.5);

  c.translate(x0 + w / 2, y0 + h / 2);
  c.rotate(PI);
  c.translate(-x0 - h / 2, -y0 - w / 2);

  // Left diagonal
  c.line(x0 + 0.75 * w, y0, x0 + 0.75 * w, y0 + 0.5 * h);
  // Right diagonal
  c.line(x0 + 0.25 * w, y0, x0 + 0.25 * w, y0 + 0.5 * h);
  // c.line(x0 + w, y0, x0 + w / 2, y0 + h);
  // top arc
  c.arc(x0 + w / 2, y0 + h / 2, w / 2, h / 2, 0, PI);

  // middle bar
  c.line(x0 + 0.25 * w, y0 + 0.25 * h, x0 + 0.75 * w, y0 + 0.25 * h);

  c.pop();
}

function drawV(c, x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;
  c.push();
  c.noFill();
  c.stroke(1);
  c.strokeWeight(1.5);

  // TODO: make more of a 'v' shape
  // Left diagonal
  c.line(x0 + 0.2 * w, y0 + 0.3 * h, x0 + 0.25 * w, y0 + 0.75 * h);

  // bottom arc
  c.arc(x0 + w / 2, y0 + 0.75 * h, w / 2, h / 2, 0.05 * PI, 0.95 * PI);
  // Right diagonal
  c.line(x0 + 0.75 * w, 0.75 * h + y0, x0 + 0.8 * w, y0 + 0.3 * h);

  c.pop();
}

function drawE(c, x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;
  c.push();
  c.noFill();
  c.stroke(1);
  c.strokeWeight(1.5);

  c.translate(0.15 * w, 0.15 * h);
  // Top horizontal line
  c.line(x0 + 0.25 * w, y0 + 0.17 * h, x0 + w - 0.33 * w, y0 + 0.17 * h);
  // Middle horizontal line
  c.line(x0 + 0.25 * w, y0 + h / 2, x0 + w - 0.33 * w, y0 + h / 2);
  // Bottom horizontal line
  c.line(x0 + 0.25 * w, y0 + h * 0.83, x0 + w - 0.33 * w, y0 + h * 0.83);

  // Left arc (top)
  c.arc(x0 + 0.25 * w, y0 + 0.33 * h, 0.33 * w, 0.33 * h, 0.5 * PI, 1.5 * PI);
  // Left arc (bottom)
  c.arc(x0 + 0.25 * w, y0 + 0.66 * h, 0.33 * w, 0.33 * h, 0.5 * PI, 1.5 * PI);
  c.pop();
}

function drawS(c, x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;
  // c.rotate(PI / 2)
  c.push();
  c.noFill();
  c.stroke(1);
  c.strokeWeight(1.5);

  c.push()
  c.translate(0.05 * w, 0.17 * h);
  // Top horizontal line
  c.line(x0 + 0.33 * w, y0 + 0.15 * h, x0 + w - 0.25 * w, y0 + 0.15 * h);
  // Middle horizontal line
  c.line(x0 + 0.33 * w, y0 + h / 2, x0 + w - 0.33 * w, y0 + h / 2);
  // Bottom horizontal line
  c.line(x0 + 0.25 * w, y0 + h * 0.82, x0 + w - 0.33 * w, y0 + h * 0.82);

  // Left arc (top)
  c.arc(x0 + 0.33 * w, y0 + 0.33 * h, 0.33 * w, 0.33 * h, 0.5 * PI, 1.5 * PI);
  // Left arc (bottom)
  // c.arc(x0 + 0.25 * w, y0 + 0.66 * h, 0.33 * w, 0.33 * h, 0.5 * PI, 1.5 * PI);
  c.arc(x0 + 0.66 * w, y0 + 0.66 * h, 0.33 * w, 0.33 * h, 1.5*PI, .5 * PI);

  c.pop();
  c.pop()
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

function drawRectangle(c, x0, y0, si, sj) {
  let w = si * u - gap,
    h = sj * u - gap;

  let col1 = random(palette),
    col2 = 5;
  if (random() < 1 / 3) [col1, col2] = [col2, col1];

  c.noStroke();
  c.fill(col1);
  // UNCOMMENT TO GET RECTS AGAIN
  // c.rect(x0, y0, w, h);

  c.noStroke();
  // c.fill(col2);
  c.fill(0)
  if (si == 1 && sj == 1) {
    c.circle(x0 + w / 2, y0 + h / 2, 3 * gap);
    c.fill(col1);
    c.circle(x0 + w / 2, y0 + h / 2, gap);
  } else {
    c.push();
    if (sj == 1 || (si > 1 && random() < 1 / 3)) {
      c.translate(x0 + w / 2, y0 + h / 2);
      c.rotate(PI / 2);
      c.translate(-x0 - h / 2, -y0 - w / 2);
      [si, sj] = [sj, si];
      [w, h] = [h, w];
    }

    for (let y = gap; y < h - gap; y += 2 * gap) {
      c.rect(x0 + 2.5 * gap, y0 + y, w - 5 * gap, gap);
    }

    let leftBorder = random() < 1 / 2;

    if (leftBorder) {
      c.rect(x0 + w - 2.5 * gap, y0 + gap, 1.5 * gap, gap);
    } else {
      c.rect(x0 + gap, y0 + gap, 1.5 * gap, gap);
    }

    if ((leftBorder && sj % 2 == 1) || (!leftBorder && sj % 2 == 0)) {
      c.rect(x0 + w - 2.5 * gap, y0 + h - 2 * gap, 1.5 * gap, gap);
    } else {
      c.rect(x0 + gap, y0 + h - 2 * gap, 1.5 * gap, gap);
    }

    for (let y = 2.5 * gap; y < h - gap; y += 2 * gap) {
      if (leftBorder) {
        // c.fill(col2);
        // c.fill('#ffff')
        c.fill(0)
        c.arc(x0 + 2.5 * gap, y0 + y, 3 * gap, 3 * gap, PI / 2, (3 * PI) / 2);
        // c.fill(col1);
        c.fill('#ffff')
        c.arc(x0 + 2.5 * gap, y0 + y, gap, gap, PI / 2, (3 * PI) / 2);
      } else {
        // c.fill(col2);
        c.fill(0)
        c.arc(x0 + w - 2.5 * gap, y0 + y, 3 * gap, 3 * gap, -PI / 2, PI / 2);

        c.fill('#ffff')
        // c.fill(col1);
        c.arc(x0 + w - 2.5 * gap, y0 + y, gap, gap, -PI / 2, PI / 2);
      }
      leftBorder = !leftBorder;
    }
    c.pop();
  }
}
