class Dice {
  constructor(pixelSize) {
    this.palette = [];
    this.dice = [];
    this.pixelSize = pixelSize
    this.generatePalette(diceImages);
    this.generateDice()
    console.log("n dice:", this.dice.length)
  }

  mean(cv) {
    console.log(cv);
    const density = pixelDensity();
    let cvLength = cv.pixels.length;
    let R = [];
    let G = [];
    let B = [];

    for (let x = 0; x < cv.width; x++) {
      for (let y = 0; y < cv.height; y++) {
        const i = 4 * density * (y * density * cv.width + x);
        const [r, g, b] = [cv.pixels[i], cv.pixels[i + 1], cv.pixels[i + 2]]; // get colors
        R.push(r);
        G.push(g);
        B.push(b);
      }
    }
    // console.log("sum:", _.reduce(R, (a, b) => a + b, 0), _.reduce(G, (a, b) => a + b, 0), _.reduce(B, (a, b) => a + b, 0))
    let r = floor(R / cvLength);
    let g = floor(G / cvLength);
    let b = floor(B / cvLength);
    return [r, g, b];
  }

  meanColor = (cv) => {
    let h = cv.height;
    let w = cv.width;
    console.log(w, h);
    let [r, g, b] = [0, 0, 0];
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        let c = cv.get(i, j);
        r += red(c);
        b += blue(c);
        g += green(c);
      }
    }
    r = floor(r / w / h);
    b = floor(b / w / h);
    g = floor(g / w / h);
    return [r, g, b];
  };

  createDiceImage(dImage) {
    let diceImg = createGraphics(50, 50);
    diceImg.pixelDensity(1);
    diceImg.background(255);
    diceImg.noStroke();
    diceImg.image(dImage, 0, 0, 50, 50);
    diceImg.loadPixels();
    return [dImage, diceImg];
  }

  generatePalette(diceImages) {
    diceImages.forEach((dImage, i) => {
      let [img, diceImg] = this.createDiceImage(dImage);
      let mean = this.meanColor(img);
      let br = brightness(color(...mean));
      this.palette.push({
        name: diceList[i],
        mean: mean,
        diceImage: img,
        graphics: diceImg,
        brightness: br + 55,
      });
    });
  }

  getMatch(r, g, b) {
    let min = Infinity;
    let bestMatch = null;
    this.palette.forEach((dice) => {
      let dR = r - dice.mean[0];
      let dG = g - dice.mean[1];
      let dB = b - dice.mean[2];
      let dist = sqrt(dR * dR + dG * dG + dB * dB);
      if (dist < min) {
        min = dist;
        bestMatch = dist;
      }
    });
    return bestMatch.diceImage;
  }

  getBrightnessMatch(bright) {
    let min = Infinity;
    let bestMatch = null;
    this.palette.forEach((dice) => {
      let dist = abs(bright - dice.brightness);
      if (dist < min) {
        min = dist;
        bestMatch = dice;
      }
    });
    return bestMatch;
  }

  generateDice() {
    console.log("Generating dice...")
    for (let x = 0; x < w; x += this.pixelSize) {
      for (let y = 0; y < h; y += this.pixelSize) {
        // could make random if you wanted
        this.dice.push(new SingleDie(this.palette[0], x, y, this.palette, this.pixelSize));
      }
    }
  }

  updateDice(x, y, brightness) {
    this.dice.forEach((d) => {
      if (x == d.x && y == d.y ) {
        let newDie = this.getBrightnessMatch(brightness);
        if (d.currentDie.name != newDie.name) {
          d.update(newDie)
        }
      }
    });
  }

  render() {
    this.dice.forEach((d) => {
      d.render();
    });
  }
}

class SingleDie {
  constructor(currentDie, x, y, palette, pixelSize) {
    console.log("Dice created");
    this.palette = palette;
    this.pixelSize = pixelSize;
    this.xRotation = random(0,10) * 0.01;
    this.yRotation = random(0,10) * 0.01;
    this.zRotation = random(0,10) * 0.01;
    this.targetX = 0;
    this.targetY = 0;
    this.targetZ = 0;
    this.x = x;
    this.y = y;
    this.currentDie = currentDie;
  }

  update(newDie) {
    this.currentDie = newDie;
  }

  render() {
    let diceImage = this.currentDie.diceImage;
    push();
    noStroke();
    translate(this.x - (w / 2), this.y - (h / 2));
    rotateX(this.xRotation + random(-0.1, 0.1))
    rotateY(this.yRotation + random(-0.1, 0.1))
    rotateZ(this.zRotation + random(-0.1, 0.1))
    texture(diceImage);
    box(this.pixelSize * 0.75);
    pop();
  }
}
