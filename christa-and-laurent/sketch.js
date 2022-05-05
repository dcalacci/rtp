var capture; // this is the video camera
var capimg;

let W = 1112
let H = 834

let N_FLIES = 2000
let FLY_SIZE = 15
let UPDATE_FREQ = 15
let flies = []
let fly1;
let fly2;

function preload() {
  fly1 = loadImage("./fly1.png")
  fly2 = loadImage("./fly2.png")
}

function setup() {
  createCanvas(W, H);
  pixelDensity(1);
  background(100);

  fly1.resize(FLY_SIZE, FLY_SIZE)
  fly2.resize(FLY_SIZE, FLY_SIZE)

  capture = createCapture(VIDEO); // this opens the digitizer
  capture.size(width, height);
  capture.hide();

  let canvas = createCanvas(W, H);
  canvas.position(0, 0);

  for (let i = 0; i < N_FLIES; ++i) {
    let newFly = new Fly();
    newFly.init();
    flies.push(newFly);
  }

}

let flyTargets;
let updateTargets = true;

function draw() {
  capimg = capture.get(); // copying frames
  dstimg = createImage(capimg.width, capimg.height);
  processImage(capimg, dstimg);

  background(255)
  image(dstimg, 0, 0, dstimg.width, dstimg.height);

  updateTargets = false
  if (frameCount % UPDATE_FREQ == 0 || frameCount == 1) {
    flyTargets = getFlyTargets(dstimg)
    updateTargets = true;
  }

  flies.forEach(fly => {
    if (updateTargets) {
      // let sortedTargets = _.sortBy(flyTargets, (pos) => {
      //   let a = pos[0] - fly.x
      //   let b = pos[1] - fly.y
      //   return Math.hypot(a, b)
      // })
      // let closestTarget = sortedTargets[0];
      let closestTarget = random(flyTargets)
      if (closestTarget) {
        // flyTargets.slice(0, 1)
        fly.setTarget(closestTarget[0], closestTarget[1])
        circle(closestTarget[0], closestTarget[1], 10)
      }
    }
    // get closest target
    for (let i = 0; i < fly.speed; ++i) {
      fly.move();
    }
    fly.draw();
  });
}

function getFlyTargets(_dstimg) {
  let targets = []
  const img = _dstimg;
  img.loadPixels()
  const step = 2;
  for (var y = step; y < img.height; y += step) {
    for (var x = step; x < img.width; x += step) {
      var i = y * img.width + (img.width - x - 1);
      const darkness = ((0, 0, 255) - img.pixels[i * 4]) / (0, 0, 255);
      let sX = x * width / img.width;
      let sY = y * height / img.height;
      if (darkness > 0.7) {
        targets.push([width - x, y])
      }
    }
  }
  return targets;

}


// edge detection {{
function processImage(_capimg, _dstimg) {
  var k1 = [[-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1]];
  var k2 = [[-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1]];
  _capimg.loadPixels(); // convert the entire canvas to a pixel buffer
  _dstimg.loadPixels(); // convert the entire canvas to a pixel buffer

  var w = _capimg.width;
  var h = _capimg.height;
  var p0, p1, p2, p3, p4, p5, p6, p7, p8;
  for (var x = 0; x < w; x++) {
    for (var y = 0; y < h; y++) {
      // where are we talking about???
      var ul = ((x - 1 + w) % w + w * ((y - 1 + h) % h)) * 4; // location of the UPPER LEFT
      var uc = ((x - 0 + w) % w + w * ((y - 1 + h) % h)) * 4; // location of the UPPER MID
      var ur = ((x + 1 + w) % w + w * ((y - 1 + h) % h)) * 4; // location of the UPPER RIGHT
      var ml = ((x - 1 + w) % w + w * ((y + 0 + h) % h)) * 4; // location of the LEFT
      var mc = ((x - 0 + w) % w + w * ((y + 0 + h) % h)) * 4; // location of the CENTER PIXEL
      var mr = ((x + 1 + w) % w + w * ((y + 0 + h) % h)) * 4; // location of the RIGHT
      var ll = ((x - 1 + w) % w + w * ((y + 1 + h) % h)) * 4; // location of the LOWER LEFT
      var lc = ((x - 0 + w) % w + w * ((y + 1 + h) % h)) * 4; // location of the LOWER MID
      var lr = ((x + 1 + w) % w + w * ((y + 1 + h) % h)) * 4; // location of the LOWER RIGHT

      // red channel
      p0 = _capimg.pixels[ul + 0] * k1[0][0]; // upper left
      p1 = _capimg.pixels[uc + 0] * k1[0][1]; // upper mid
      p2 = _capimg.pixels[ur + 0] * k1[0][2]; // upper right
      p3 = _capimg.pixels[ml + 0] * k1[1][0]; // left
      p4 = _capimg.pixels[mc + 0] * k1[1][1]; // center pixel
      p5 = _capimg.pixels[mr + 0] * k1[1][2]; // right
      p6 = _capimg.pixels[ll + 0] * k1[2][0]; // lower left
      p7 = _capimg.pixels[lc + 0] * k1[2][1]; // lower mid
      p8 = _capimg.pixels[lr + 0] * k1[2][2]; // lower right
      var rr1 = p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8; // how many neighbors are alive? SKIP p4: that's the center

      p0 = _capimg.pixels[ul + 0] * k2[0][0]; // upper left
      p1 = _capimg.pixels[uc + 0] * k2[0][1]; // upper mid
      p2 = _capimg.pixels[ur + 0] * k2[0][2]; // upper right
      p3 = _capimg.pixels[ml + 0] * k2[1][0]; // left
      p4 = _capimg.pixels[mc + 0] * k2[1][1]; // center pixel
      p5 = _capimg.pixels[mr + 0] * k2[1][2]; // right
      p6 = _capimg.pixels[ll + 0] * k2[2][0]; // lower left
      p7 = _capimg.pixels[lc + 0] * k2[2][1]; // lower mid
      p8 = _capimg.pixels[lr + 0] * k2[2][2]; // lower right
      var rr2 = p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8; // how many neighbors are alive? SKIP p4: that's the center

      var r_r = sqrt(rr1 * rr1 + rr2 * rr2);

      // green channel
      p0 = _capimg.pixels[ul + 1] * k1[0][0]; // upper left
      p1 = _capimg.pixels[uc + 1] * k1[0][1]; // upper mid
      p2 = _capimg.pixels[ur + 1] * k1[0][2]; // upper right
      p3 = _capimg.pixels[ml + 1] * k1[1][0]; // left
      p4 = _capimg.pixels[mc + 1] * k1[1][1]; // center pixel
      p5 = _capimg.pixels[mr + 1] * k1[1][2]; // right
      p6 = _capimg.pixels[ll + 1] * k1[2][0]; // lower left
      p7 = _capimg.pixels[lc + 1] * k1[2][1]; // lower mid
      p8 = _capimg.pixels[lr + 1] * k1[2][2]; // lower right
      var rg1 = p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8; // how many neighbors are alive? SKIP p4: that's the center

      p0 = capimg.pixels[ul + 1] * k2[0][0]; // upper left
      p1 = capimg.pixels[uc + 1] * k2[0][1]; // upper mid
      p2 = capimg.pixels[ur + 1] * k2[0][2]; // upper right
      p3 = capimg.pixels[ml + 1] * k2[1][0]; // left
      p4 = capimg.pixels[mc + 1] * k2[1][1]; // center pixel
      p5 = capimg.pixels[mr + 1] * k2[1][2]; // right
      p6 = capimg.pixels[ll + 1] * k2[2][0]; // lower left
      p7 = capimg.pixels[lc + 1] * k2[2][1]; // lower mid
      p8 = capimg.pixels[lr + 1] * k2[2][2]; // lower right
      var rg2 = p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8; // how many neighbors are alive? SKIP p4: that's the center

      var r_g = sqrt(rg1 * rg1 + rg2 * rg2);

      // blue channel
      p0 = _capimg.pixels[ul + 2] * k1[0][0]; // upper left
      p1 = _capimg.pixels[uc + 2] * k1[0][1]; // upper mid
      p2 = _capimg.pixels[ur + 2] * k1[0][2]; // upper right
      p3 = _capimg.pixels[ml + 2] * k1[1][0]; // left
      p4 = _capimg.pixels[mc + 2] * k1[1][1]; // center pixel
      p5 = _capimg.pixels[mr + 2] * k1[1][2]; // right
      p6 = _capimg.pixels[ll + 2] * k1[2][0]; // lower left
      p7 = _capimg.pixels[lc + 2] * k1[2][1]; // lower mid
      p8 = _capimg.pixels[lr + 2] * k1[2][2]; // lower right
      var rb1 = p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8; // how many neighbors are alive? SKIP p4: that's the center

      p0 = _capimg.pixels[ul + 2] * k2[0][0]; // upper left
      p1 = _capimg.pixels[uc + 2] * k2[0][1]; // upper mid
      p2 = _capimg.pixels[ur + 2] * k2[0][2]; // upper right
      p3 = _capimg.pixels[ml + 2] * k2[1][0]; // left
      p4 = _capimg.pixels[mc + 2] * k2[1][1]; // center pixel
      p5 = _capimg.pixels[mr + 2] * k2[1][2]; // right
      p6 = _capimg.pixels[ll + 2] * k2[2][0]; // lower left
      p7 = _capimg.pixels[lc + 2] * k2[2][1]; // lower mid
      p8 = _capimg.pixels[lr + 2] * k2[2][2]; // lower right
      var rb2 = p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8; // how many neighbors are alive? SKIP p4: that's the center

      var r_b = sqrt(rb1 * rb1 + rb2 * rb2);

      _dstimg.pixels[mc + 0] = r_r;
      _dstimg.pixels[mc + 1] = r_g;
      _dstimg.pixels[mc + 2] = r_b;
      _dstimg.pixels[mc + 3] = _capimg.pixels[mc + 3];
    }
  }

  _dstimg.updatePixels(); // update and display the pixel buffer
  _dstimg.filter(THRESHOLD, 0.33)
  // _dstimg.filter(GRAY);    //uncomment for a gray-shaded image
  _dstimg.filter(INVERT);  //uncomment for an inverse image
}

// edge detection }}

// with big help from from https://openprocessing.org/sketch/903237

class Fly {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.t = 0;
    this.speed = 0;
    this.restTime = 0;
    this.isRestMove = false;
    this.state = 0;
    this.canva = canvas;
  }

  init() {
    this.x = random(width * 2) - width;
    this.y = random(height * 2) - height;
    this.t = random(TAU);
    this.setSpeed();
    // this.setTargetPos();
  }

  setSpeed() {
    this.speed = floor(random(10, 30)) + 1;
  }

  jiggleTargetPos(amt) {
    if (amt) {

      this.targetX = this.targetX + random(0, amt);
      this.targetY = this.targetY + random(0, amt);

    } else {

      this.targetX = this.targetX + random(10, width * 0.05);
      this.targetY = this.targetY + random(10, height * 0.05);

    }
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
  }

  move() {
    if (this.restTime > 0) {
      if (this.isRestMove) {
        if (this.restTime % 4 < 2) {
          this.state = 1;
        }
        if (this.restTime % 100 == 0) {
          this.setSpeed();
          this.isRestMove = false;
          this.state = 0;
        }
      }
      if (this.restTime > 20 && this.restTime % 20 == 0 && random(10) < 5) {
        this.isRestMove = true;
      } else {
        this.state = 0;
      }
      this.restTime--;
      return;
    }
    this.t += TAU / (dist(this.x, this.y, this.targetX, this.targetY) / cos(PI / 2 - atan2(this.targetY - this.y, this.targetX - this.x) + this.t) * PI);
    this.x += cos(this.t);
    this.y += sin(this.t);

    if (abs(this.targetX - this.x) <= 1 && abs(this.targetY - this.y) <= 1) {
      this.jiggleTargetPos(5);
      if (random(10) < 3) {
        this.restTime = floor(random(1000));
      }
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.t);
    switch (this.state) {
      case 0:
        image(fly1, 0, 0);
        break;
      case 1:
        image(fly2, 0, 0);
        break;
    }
    pop();
  }
}



let lapse = 0;    // mouse timer
function mousePressed() {
  // prevents mouse press from registering twice
  if (millis() - lapse > 400) {
    save('pix.jpg');
    lapse = millis();
  }
}
