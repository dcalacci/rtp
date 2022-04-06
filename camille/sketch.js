let poem = "This is my poem, see me roar"
let cam;

let w = 800;
let h = 600
let font;
let fSize = w / 50;

let letters = []

class Letter {
  constructor(letter, initPos) {
    this.letter = letter;
    this.pos = initPos;
    this.velocity = random(2, 5)
    console.log("Created letter", this.letter)
  }

  update() {
    // console.log("updating... position:", this.pos)
    if (this.pos[1] < h - 10) {
      this.pos[1] += this.velocity
    }
  }

  draw() {
    text(this.letter, this.pos[0], this.pos[1])
  }
}

function preload() {
  // preload OTF font file
  font = loadFont("Raleway-ExtraBold.ttf");
}


function setup() {
  // createCanvas(w, h, WEBGL);
  // cam = createCamera();
  //
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
        // I'm not sure why I need to multiply here to get better spacing,
        // and the spacing between skinny letters is poor 
        xPos,
        random(0, h / 3)
      ]))
    xPos += textWidth(poem.charAt(i))

    // let prevLetters = poem.slice(0, i + 1)
  }
}

function draw() {
  background(244);

  letters.forEach((l) => {
    l.update()
    l.draw()
    if (l.pos[1] > h) {

    }
  })
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
