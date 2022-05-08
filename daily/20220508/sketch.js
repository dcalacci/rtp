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

let outsideRadius = 200;
let insideRadius = 100;

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
  shaderGraphics.noStroke();

  for (let i = 0; i < N_BALLS; i++)
    metaballs.push(new Metaball());
}


function draw() {
  background(bgCol)

  theShader.setUniform('mouse', map(mouseX, 0, WIDTH, 0, 1));
  theShader.setUniform('uDims', [WIDTH, HEIGHT])
  // change to just pos if not working...
  theShader.setUniform('uBalls', metaballs.map((b) => [b.pos.x, b.pos.y]))
  theShader.setUniform('uRadii', metaballs.map((b) => b.radius))

  shaderGraphics.shader(theShader)
  shaderGraphics.rect(0, 0, WIDTH, HEIGHT);
  image(shaderGraphics, 0, 0, WIDTH, HEIGHT)

  for (const ball of metaballs) {
    ball.update();
    fill('#2e2e2e')
    circle(ball.pos.x, ball.pos.y, ball.radius)
  }
}

class Metaball {
  constructor() {
    const size = Math.pow(Math.random(), 2);
    this.vel = p5.Vector.random2D().mult(5 * (1 - size) + 2);
    this.radius = 100 * size + 20;

    this.pos = new p5.Vector(
      random(this.radius, width - this.radius),
      random(this.radius, height - this.radius));
  }

  update() {
    this.pos.add(this.vel);

    if (this.pos.x < this.radius || this.pos.x > width - this.radius) this.vel.x *= -1;
    if (this.pos.y < this.radius || this.pos.y > height - this.radius) this.vel.y *= -1;
  }
}
