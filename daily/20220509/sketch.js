let WIDTH = 1280
let HEIGHT = 1280
let bgCol = "#f9f9f9"

let colors = ["#FFA69E", "#9CAFB7", "#344055", "#E9EB9E", "#A30000", "#303030"]

//shaders ------------------
let theShader;
// we need to create a texture for the shader to draw on
let shaderGraphics;
//
let metaballs = [];
let N_BALLS = 20

function mousePressed() {
  save(new Date().toJSON() + ".png")
}

function preload() {
  theShader = loadShader('shader.vert', 'shader.frag')
}

function setup() {
  pixelDensity(1);

  createCanvas(WIDTH, HEIGHT);
  noStroke()

  shaderGraphics = createGraphics(WIDTH, HEIGHT, WEBGL);
  shaderGraphics.shader(theShader)
  shaderGraphics.noStroke();

  for (let i = 0; i < N_BALLS; i++)
    metaballs.push(new Metaball());
}


function draw() {
  background(bgCol)

  metaballs.forEach((b) => b.update())
  theShader.setUniform(
    'u_metaballs',
    metaballs.map((b, i) => [b.pos.x, b.pos.y, b.pos.z, b.radius]).flat())
  // console.log(metaballs.map((b, i) => [b.pos.x, b.pos.y, b.pos.z, b.radius]).flat())

  theShader.setUniform('u_frameCount', frameCount)
  theShader.setUniform('uResolution', [WIDTH, HEIGHT])

  // translate(-WIDTH / 2, -HEIGHT / 2)
  imageMode(CENTER)

  push()
  translate(WIDTH / 2, HEIGHT / 2)
  shaderGraphics.rect(0, 0, WIDTH, HEIGHT);
  // translate(WIDTH / 2, HEIGHT / 2)
  // rotate(frameCount / 150)
  image(shaderGraphics, 0, 0, WIDTH, HEIGHT)
  pop()
}

const minSize = 0.1;
const maxSize = 0.175;
class Metaball {
  constructor() {
    const size = map(Math.pow(Math.random(), 2), 0, 1, minSize, maxSize);
    // trying to solve for tiny velos
    this.vel = p5.Vector.random2D().mult(map(size, minSize, maxSize, 0.001, 0.002))
    this.radius = size;

    this.pos = new p5.Vector(
      random(this.radius, 1 - this.radius),
      random(this.radius, 1 - this.radius),
      random(this.radius, 1 - this.radius));
  }

  update() {
    this.pos.add(this.vel);

    if (this.pos.x < this.radius / 2 || this.pos.x > 1 - this.radius / 2) this.vel.x *= -1;
    if (this.pos.y < this.radius / 2 || this.pos.y > 1 - this.radius / 2) this.vel.y *= -1;
    if (this.pos.z < this.radius / 2 || this.pos.z > 1 - this.radius / 2) this.vel.z *= -1;
  }
}
