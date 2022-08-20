// https://observablehq.com/@tmcw/p5@398
import define1 from "./304a96e9418b6e7e@82.js";

function _1(md,copiable){return(
md`# p5

> [p5.js](https://p5js.org/) is a JavaScript library that starts with the original goal of Processing, to make coding accessible for artists, designers, educators, and beginners, and reinterprets this for today's web.

This notebook demonstrates how you can use p5.js in Observable. There are a few tricks involved, because p5.js is optimized to be the only script on a webpage - its examples mostly use ‘global mode,’ a strategy that makes programs very simple and terse, but doesn’t allow for multiple programs on a page. Observable is all about making notebooks relatively modular and isolated, so we’ll use p5’s _instance mode_ instead.

You can import the p5 helper function from this notebook like

${copiable(md`\`\`\`js
import {p5} from "@tmcw/p5";
\`\`\``)}

You can also [fork this basic example](https://beta.observablehq.com/@tmcw/p5-basic-example) to get started quickly - don’t forget to rename it by changing the title in the first cell.

This function:

- Loads p5.js
- Cleans up after sketches when you update their code. This is essential, because otherwise multiple draw() loops will be going at the same time.

### Basic example:`
)}

function _2(p5,$0){return(
p5(sketch => {
  let system;
  const c = sketch.color('#DC3F74');
  sketch.setup = function() {
    sketch.createCanvas(640, 300);
    sketch.textAlign(sketch.CENTER);
    sketch.textFont('sans-serif');
    sketch.textStyle(sketch.BOLD);
  };
  sketch.draw = function() {
    sketch.translate(sketch.millis() / 10 % sketch.width, sketch.height / 2);
    sketch.background($0.valueAsNumber);
    sketch.fill(c).textSize(100);
    sketch.text('p5.js', 0, 0);
  };
})
)}

function _background(html){return(
html`<input type='range' min=0 max=255 value=255 />`
)}

function _4(md){return(
md`And here’s an example of an input that affects the sketch above. Note that we’re doing kind of a trick here: the input is called background, and the sketch references it like:

\`\`\`js
viewof background.valueAsNumber
\`\`\`

So what we’re doing is referring to the curent value of this range slider, whatever it is, without wiring _updates_ from the range slider to the sketch. So when you move the slider, the sketch doesn’t re-render. This is because p5 itself manages when the sketch re-renders (the run-loop), and all we want to do is to expose a value that is read every time that the picture is drawn.`
)}

function _5(md){return(
md`For those interested, here’s how the helper works.`
)}

function _p5(DOM,P5){return(
function* p5(sketch) {
  const element = DOM.element('div');
  
  // p5.js really likes its target element to already be in the DOM, not just
  // floating around detached. So, before we call P5, we yield it, which puts
  // in the DOM.
  yield element;
  
  // This is ‘instance mode’ in p5 jargon: instead of relying on lots of
  // globals, we create a sketch that has its own copy of everything under p5.
  const instance = new P5(sketch, element, true);
  
  // This is the tricky part: when you run P5(sketch, element), it starts a
  // loop that updates the drawing a bunch of times a second. If we were just
  // to call P5 repeatedly with different arguments, the loops would all keep
  // running, one on top of the other. So what we do is we use this cell
  // as a generator, and then when that generator is interrupted, like
  // when you update the code in the sketch() method, then we call instance.remove()
  // to clean it up.
  try {
    while (true) {
      yield element;
    }
  } finally {
    instance.remove();
  }
}
)}

function _7(md){return(
md`## More advanced example:

Here’s how you use this code: call the p5 function with your sketch code. Note that, because we’re in [instance mode, not global mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode), you’ll need to call, for instance, \`sketch.color\` instead of just \`color()\`. That’s pretty likely also what you’ll end up doing if you use p5.js on any webpage.

This example is taken from the [Particle System](https://p5js.org/examples/simulate-particle-system.html), example, which in turn is from [The Nature of Code](http://natureofcode.com/). I’ve modernized it a little bit by making the classes into proper JavaScript classes, and making it work in instance mode.`
)}

function _8(p5,ParticleSystem){return(
p5(sketch => {
  let system;
  sketch.setup = function() {
    sketch.createCanvas(400, 300);
    system = new ParticleSystem(sketch, sketch.createVector(sketch.width/2, 50));
  };
  sketch.draw = function() {
    sketch.background(51);
    system.addParticle();
    system.run();
  }
})
)}

function _Particle(){return(
class Particle {
  constructor(p5, position) {
    this.p5 = p5;
    this.acceleration = this.p5.createVector(0, 0.05);
    this.velocity = this.p5.createVector(this.p5.random(-1, 1), this.p5.random(-1, 0));
    this.position = position.copy();
    this.lifespan = 255;
  }
  run() {
    this.update();
    this.display();
  }
  // Method to update position
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  }
  // Method to display
  display() {
    this.p5.stroke(200, this.lifespan);
    this.p5.strokeWeight(2);
    this.p5.fill(127, this.lifespan);
    this.p5.ellipse(this.position.x, this.position.y, 12, 12);
  }
  // Is the particle still useful?
  isDead() {
    return this.lifespan < 0;
  }
}
)}

function _ParticleSystem(Particle){return(
class ParticleSystem {
  constructor(p5, position) {
    this.p5 = p5;
    this.origin = position.copy();
    this.particles = [];
  }
  addParticle() {
    this.particles.push(new Particle(this.p5, this.origin));
  }
  run() {
    this.particles = this.particles.filter(particle => {
      particle.run();
      return !particle.isDead();
    });
  }
}
)}

function _P5(require){return(
require('https://unpkg.com/p5@1.2.0/lib/p5.js')
)}

function _12(md){return(
md`This code is just used to make the \`import\` statement in the top part of this notebook copiable with just a click.`
)}

function _14(style){return(
style
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md","copiable"], _1);
  main.variable(observer()).define(["p5","viewof background"], _2);
  main.variable(observer("viewof background")).define("viewof background", ["html"], _background);
  main.variable(observer("background")).define("background", ["Generators", "viewof background"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("p5")).define("p5", ["DOM","P5"], _p5);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["p5","ParticleSystem"], _8);
  main.variable(observer("Particle")).define("Particle", _Particle);
  main.variable(observer("ParticleSystem")).define("ParticleSystem", ["Particle"], _ParticleSystem);
  main.variable(observer("P5")).define("P5", ["require"], _P5);
  main.variable(observer()).define(["md"], _12);
  const child1 = runtime.module(define1);
  main.import("copiable", child1);
  main.import("style", child1);
  main.variable(observer()).define(["style"], _14);
  return main;
}
