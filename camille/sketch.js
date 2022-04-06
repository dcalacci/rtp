let poem = "This is my poem, see me roar"
let cam;

let DRAW_RECTS = false
let w = 800;
let h = 600
let font;
let fSize = w / 50;

let letters = []


// y, x, brightness avg (draw loop)

let pixelSize = 5
let vidPixels = Array(h).fill().map(() => Array(w));
let nPixels = 0
var averageBrightness = 0
var calculatedAverage = false

class Letter {
  constructor(letter, initPos) {
    this.letter = letter;
    this.pos = initPos;
    this.velocity = random(2, 5)
    console.log("Created letter", this.letter)
  }

  update(vidPixels) {
    // console.log("updating... position:", this.pos)
    var yPixel = Math.ceil(this.pos[1] / pixelSize) * pixelSize
    var xPixel = Math.ceil(this.pos[0] / pixelSize) * pixelSize

    if (vidPixels[yPixel]) {
      let vidPixel = vidPixels[yPixel][xPixel]
      // while it's on dark, move it upwards
      while (vidPixel < averageBrightness) {
        if (vidPixels[yPixel]) {
          this.pos[1] -= this.velocity
          yPixel = Math.ceil(this.pos[1] / pixelSize) * pixelSize
          xPixel = Math.ceil(this.pos[0] / pixelSize) * pixelSize
          vidPixel = vidPixels[yPixel][xPixel]
        }
      }

      this.pos[1] += this.velocity
      // if (vidPixel > averageBrightness) {
      //   this.pos[1] += this.velocity
      // }
      if (this.pos[1] > h - 5) {
        console.log("looping")
        this.pos[1] = 0
      }
    }

  }

  draw() {

    fill(0)
    text(this.letter, this.pos[0], this.pos[1])
  }
}

function preload() {
  // preload OTF font file
  font = loadFont("Raleway-ExtraBold.ttf");
}


function setup() {
  textFont(font);
  textSize(fSize);
  createCanvas(w, h)
  vid = createCapture(VIDEO);
  vid.size(w, h);
  // textAlign(CENTER, CENTER);
  frameRate(30)

  let xPos = random(5, w * 0.75)
  for (let i = 0; i < poem.length; i++) {

    letters.push(new Letter(poem[i],
      [
        xPos,
        random(0, h / 3)
      ]))
    xPos += textWidth(poem.charAt(i))
  }
}

function draw() {
  background(244);
  image(vid, 0, 0)

  // update video
  vid.loadPixels();
  rectMode(RADIUS)
  // cam.filter
  for (let x = 0; x < vid.width; x += pixelSize) {
    for (let y = 0; y < vid.height; y += pixelSize) {
      let index = (x + y * vid.width) * 4; // convert x&y to index //index = position in the array
      // get the color of the pixel position
      // draw a rect at the corresponding x and y pixel
      let r = vid.pixels[index];
      let g = vid.pixels[index + 1];
      let b = vid.pixels[index + 2];
      let bright = brightness(color(r, g, b))
      vidPixels[y][x] = bright
      if (!calculatedAverage) {
        nPixels += 1
        averageBrightness += bright
      }
      if (DRAW_RECTS) {
        if (bright < averageBrightness) {
          fill(50)
          rect(x, y, pixelSize)
        }
      }
    }
  }
  if (!calculatedAverage && averageBrightness > 0) {
    averageBrightness = (averageBrightness / nPixels) * 255
    calculatedAverage = true
    console.log("average brightness:", averageBrightness)
  } else if (calculatedAverage) {

    letters.forEach((l) => {
      l.update(vidPixels)
      l.draw()
      // var yBlock = Math.ceil(l.pos[1] / pixelSize) * pixelSize
      // var xBlock = Math.ceil(l.pos[0] / pixelSize) * pixelSize
      // let stop = false
      // if (vidPixels[yBlock]) {
      //   let vidPixel = vidPixels[yBlock][xBlock]
      //   stop = vidPixel < averageBrightness
      // }
      // if (!stop) {
      // } else if (l.pos[1] > h - 5) {
      //   l.pos[1] = 0
      // }
      // l.draw()
    })
  }

  // // cam.filter
  // for (let x = 0; x < vid.width; x += pixelSize) {
  //   for (let y = 0; y < vid.height; y += pixelSize) {
  //     let index = (x + y * vid.width) * 4; // convert x&y to index //index = position in the array
  //     // get the color of the pixel position
  //     // draw a rect at the corresponding x and y pixel
  //     let r = vid.pixels[index];
  //     let g = vid.pixels[index + 1];
  //     let b = vid.pixels[index + 2];
  //     let bright = brightness(color(r, g, b))
  //     dice.updateDice(x, y, bright)
  //   }
  // }
  // dice.render()
}
