let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

//shaders ------------------
let theShader;
// we need to create a texture for the shader to draw on
let shaderGraphics;
let metaballs = [];
let N_BALLS = 20

function keyPressed() {
  if (key == 's')
    save(new Date().toJSON() + ".png")
}

function preload() {
  theShader = loadShader('shader.vert', 'shader.frag')
}
// let canvas;

function setup() {
  pixelDensity(1);

  // createCanvas(WIDTH, HEIGHT);
  // noStroke()
  frameRate(30)
  createGraphics(WIDTH, HEIGHT, WEBGL)
  createCanvas(WIDTH, HEIGHT, WEBGL)
  ortho(-WIDTH, WIDTH, HEIGHT, -HEIGHT / 2, 0.1, 100);
  shader(theShader)
  noStroke();

  for (let i = 0; i < N_BALLS; i++)
    metaballs.push(new Metaball());
}


function draw() {
  background(bgCol)

  metaballs.forEach((b) => b.update())
  theShader.setUniform(
    'u_metaballs',
    metaballs.map((b, i) => [b.pos.x, b.pos.y, b.pos.z, b.radius]).flat())

  theShader.setUniform('u_frameCount', frameCount)
  theShader.setUniform('uResolution', [float(WIDTH), float(HEIGHT)])

  // orbitControl(4, 2, 0.1);
  // imageMode(CENTER)

  // translate((WIDTH / 2) + 20, 10)
  // push()
  //////////////////
  // shaderGraphics.box(100);
  // shaderGraphics.translate(100, 100, -100);
  // shaderGraphics.rotate(PI / 4, [1, 1, 0]);
  // shaderGraphics.box(30);
  /////////////////////////

  rect(0, 0, WIDTH, HEIGHT);
  // shaderGraphics.rect(0, 0, WIDTH, HEIGHT);
  // translate(WIDTH / 2, HEIGHT / 2)
  // rotate(frameCount / 150)
  // image(shaderGraphics, 0, 0, WIDTH, HEIGHT)
  // pop()
}

const minSize = 0.05;
const maxSize = 0.2;
class Metaball {
  constructor() {
    const size = map(Math.pow(Math.random(), 2), 0, 1, minSize, maxSize);
    // trying to solve for tiny velos
    this.vel = p5.Vector.random3D().mult(map(size, minSize, maxSize, 0.001, 0.005))
    this.radius = size;

    this.pos = new p5.Vector(
      random(this.radius, 1 - this.radius),
      random(this.radius, 1 - this.radius),
      random(this.radius, 1 - this.radius));

    // this.pos = new p5.Vector(
    //   random(0.1, 0.9),
    //   random(0.1, 0.9),
    //   random(0.1, 0.9));

  }

  update() {
    this.pos.add(this.vel);

    if (this.pos.x < this.radius / 2 || this.pos.x > 1 - this.radius / 2) this.vel.x *= -1;
    if (this.pos.y < this.radius / 2 || this.pos.y > 1 - this.radius / 2) this.vel.y *= -1;
    if (this.pos.z < this.radius / 2 || this.pos.z > 1 - this.radius / 2) this.vel.z *= -1;
  }
}
