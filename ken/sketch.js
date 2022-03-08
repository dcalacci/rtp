let w = 400;
let h = 600;

let dice;
let diceImages = []
let diceList = ["six", "five", "four", "three", "two", "one"];
function preload() {
  diceList.forEach((dFileName) => {
    diceImages.push(loadImage(`data/${dFileName}.png`));
  })
}

function setup() {
  canvas = createCanvas(800, 500);
  let p = createP("Press Enter to change Emoji");
  p.center("horizontal");
  pixelDensity(1);
  cam = createCapture(VIDEO);
  cam.size(800, 600);
  // cam.hide();
  dice = new Dice();
  dice.generate(diceImages);
  frameRate(10)
}

function draw() {
  background(244);
  cam.loadPixels();
  // cam.filter
  let pixelSize = 10;
  for (let x = 0; x < cam.width; x += pixelSize) {
    for (let y = 0; y < cam.height; y += pixelSize) {
      let index = (x + y * cam.width) * 4; // convert x&y to index //index = position in the array

      // get the color of the pixel position
      // draw a rect at the corresponding x and y pixel
      let r = cam.pixels[index];
      let g = cam.pixels[index + 1];
      let b = cam.pixels[index + 2];
      let bright = brightness(color(r,g,b))
      let diceImage = dice.getBrightnessMatch(bright);
      noStroke();
      push()
      translate(x/pixelSize - diceImage.width, y/pixelSize - diceImage.height);
      rotate(radians(map(random(), 0, 1, 0, 0.5)));
      image(diceImage, x, y, pixelSize, pixelSize);
      pop()
    }
  }
  // image(dice.palette[3].diceImage, 200, 200, 100, 100);
  // let c = dice.palette[3].diceImage.get(
  //   map(mouseX, 0, width, 0, dice.palette[3].diceImage.width),
  //   map(mouseY, 0, height, 0, dice.palette[3].diceImage.height)
  // );
  // fill(c);

  // Draw a square with that color
  // square(mouseX, mouseY, 50);
  // image(dice.getBrightnessMatch(10), 100, 100);
  // noLoop();
}
