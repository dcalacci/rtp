let m;
let cam;
let diceList = ["six", "five", "four", "three", "two", "one"];
let diceImages = []
let w = 800;
let h = 600

let pixelSize = 15;
function preload() {
  diceList.forEach((dFileName) => {
    diceImages.push(loadImage(`data/${dFileName}.png`));
  })
}

function setup() {
  createCanvas(w, h, WEBGL);
  cam = createCamera();
  vid = createCapture(VIDEO);
  vid.size(w, h);
  dice = new Dice(pixelSize)
  frameRate(30)
}

function draw() {
  background(0);
  orbitControl(2, 1, 0.05);
  ambientLight(50);
  // Shine a light in the direction the camera is pointing
  directionalLight(
    240, 240, 240,
    cam.centerX - cam.eyeX,
    cam.centerY - cam.eyeY,
    cam.centerZ - cam.eyeZ
  );
  background(244);
  vid.loadPixels();
  // cam.filter
  for (let x = 0; x < vid.width; x += pixelSize) {
    for (let y = 0; y < vid.height; y += pixelSize) {
      let index = (x + y * vid.width) * 4; // convert x&y to index //index = position in the array
      // get the color of the pixel position
      // draw a rect at the corresponding x and y pixel
      let r = vid.pixels[index];
      let g = vid.pixels[index + 1];
      let b = vid.pixels[index + 2];
      let bright = brightness(color(r,g,b))
      dice.updateDice(x, y, bright)
    }
  }
  dice.render()
}