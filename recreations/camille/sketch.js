// let poem = "This is my poem, see me roar"
// let poem = "the sci-fi library lives!"
let poem = "I like talking with you, simply that conversing, a turning-with or-around, as in \
your turning around to face me \
suddenly, saying \
Come, and I turn \
with you, for a sometime \
hand under my under-things, \
and you telling me \
what you would do, where, \
on what part of my body \
you might talk to me differently. \
At your turning, \
each part of my body turns to verb. \
We are the opposite oftongue-tied, as if there were such an \
antonym; we are synonyms \
for limbs’ loosening of syntax, \
and yet turn to nothing; \
It’s just talk."
let cam;

let DRAW_RECTS = false
let w = 800;
let h = 600
let font;
let fSize = w / 45;

let letters = []


// y, x, brightness avg (draw loop)

let pixelSize = 5
let vidPixels = Array(h).fill(255).map(() => Array(w).fill(255));
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
    var yPixel = Math.abs(Math.ceil(this.pos[1] / pixelSize) * pixelSize)
    var xPixel = Math.abs(Math.ceil(this.pos[0] / pixelSize) * pixelSize)

    if (vidPixels[yPixel]) {
      let vidPixel = vidPixels[yPixel][xPixel]
      // while it's on dark, move it upwards
      while (vidPixel < 50 && yPixel > 20) {
        if (vidPixels[yPixel]) {
          this.pos[1] -= 1
          let yPixelOld = yPixel
          yPixel = Math.abs(Math.ceil(this.pos[1] / pixelSize) * pixelSize)
          if (!vidPixels[yPixel]) {
            yPixel = yPixelOld
          }
          xPixel = Math.abs(Math.ceil(this.pos[0] / pixelSize) * pixelSize)

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


  let poemWidth = textWidth(poem) * 1.1
  let nPoems = max(Math.floor(w / poemWidth), 1)
  for (let n = 0; n < nPoems; n++) {
    // start at end of last poem
    let xPos = n * poemWidth;
    let firstLetter = int(random(0, poem.length / 2))
    console.log("first letter:", firstLetter)
    // let xPos = random(xStart, xStart + 10)
    for (let i = firstLetter; i < poem.length; i++) {
      if (xPos < w - 10) {
        letters.push(new Letter(poem[i],
          [
            xPos,
            random(pixelSize, h / 3)
          ]))
        xPos += textWidth(poem.charAt(i))
      }
    }
  }
}

function draw() {
  background(244);
  image(vid, 0, 0)

  // update video
  vid.loadPixels();
  rectMode(RADIUS)
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
    })
  }
}
