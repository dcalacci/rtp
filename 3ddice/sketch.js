let m;
let cam;
let diceList = ["six", "five", "four", "three", "two", "one"];
let diceImages = []
let w = 800;
let h = 600
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
  dice = new Dice();
  dice.generate(diceImages);
  // m = createModel();
  frameRate(30)
}

let diceGrid = []
let xRotate = []
let yRotate = []
let zRotate = []
function draw() {
  background(100);
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
  let pixelSize = 10;
  for (let x = 0; x < vid.width; x += pixelSize) {
    diceGrid[x] = [];
    xRotate[x] = [];
    yRotate[x] = []
    zRotate[x] = []
    for (let y = 0; y < vid.height; y += pixelSize) {
      let index = (x + y * vid.width) * 4; // convert x&y to index //index = position in the array

      // get the color of the pixel position
      // draw a rect at the corresponding x and y pixel
      let r = vid.pixels[index];
      let g = vid.pixels[index + 1];
      let b = vid.pixels[index + 2];
      let bright = brightness(color(r,g,b))
      let die = dice.getBrightnessMatch(bright);
      let diceImage = die.diceImage
      let newDicep = diceGrid[x][y] == die.name
      diceGrid[x][y] = die.name;
      zRotate[x][y] = 0
      xRotate[x][y] = 0
      yRotate[x][y] = 0
      noStroke();
      // rotate if it's a new die
      drawDice(x,y,diceImage, pixelSize, pixelSize, newDicep)
      // image(diceImage, x, y, pixelSize);
    }
  }
}


function drawDice(x,y, diceImage, pixelSize, rotateP) {
  push();
  translate(x-(w/2),y-(h/2));
  if (rotateP) {
    lerp(xRotate[x][y], rotateX, 0.05)
    rotateZ(PI)
    // rotateZ(random(0,10) * 0.01);
    rotateX(random(0,10) * 0.01);
    rotateY(random(0,10) * 0.01);
  }
  texture(diceImage)
  box(pixelSize);
  pop();
}
