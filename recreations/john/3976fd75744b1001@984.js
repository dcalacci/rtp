// https://observablehq.com/@dcalacci/recreating-the-past-week-2-john-whitney@984
import define1 from "./493851ae5989f70a@398.js";

function _1(md){return(
md`# Recreating the Past Week 2: John Whitney

John Whitney was a pioneer of abstract computational animation. 

One of the most memorable pieces that he contributed to was the _Vertigo_ title sequence, done in collaboration with Saul Bass. 

I decided to recreate some frames from that sequence. it was difficult! As I'm learning about computational art, much of the devil is in the details. Finding the right parameters to recreate the effect from the opening spiral took several hours. 

[Here](https://www.artofthetitle.com/title/vertigo/) is the link to the title sequence. The first block below is the first opener, the oval spiral that comes out of Kim Novak's eyes:`
)}

function _a_start(Inputs){return(
Inputs.range([-1, 1], {value: 0.08, step: 0.001, label: "Initial Rotation"})
)}

function _aspect_start(Inputs){return(
Inputs.range([1, 2], {value: 1.25, step: 0.001, label: "Initial Aspect"})
)}

function _a_coef(Inputs){return(
Inputs.range([1, 1.1], {value: 1.0139, step: 0.0001, label: "Ellipse Angle Factor"})
)}

function _aspect_coef(Inputs){return(
Inputs.range([0.9, 1.1], {value: 0.9995, step: 0.0001, label: "Ellipse Aspect Factor"})
)}

function _e_coef(Inputs){return(
Inputs.range([1, 1.5], {value: 1.015, step: 0.0001, label: "Ellipse Size Factor"})
)}

function _n(Inputs){return(
Inputs.range([50, 200], {value: 74, step: 1, label: "Num Ellipses"})
)}

function _8(p5,a_start,aspect_start,n,a_coef,e_coef,aspect_coef){return(
p5(s => {
  let w = 800
  let h = 800

  let spiral;
  let spiralSize = 0.5
  
  //number of ellipses
  s.setup = function () {
    //s.noLoop()
    s.createCanvas(w, h);
    s.background('#000000');
    s.frameRate(30);

    spiral = s.createGraphics(spiralSize*w, spiralSize*h);
    spiral.translate(spiralSize * w/2, spiralSize * h/2);
    spiral.background('#000000');
  }

  let drawSpirals = function (canvas) {
    let ellipses = []
    let a = a_start;
    //aspect ratio of the ellipse (elongation) and ellongation factor
    //in the composition, the bigger ellipses are less elongated
    let aspect = aspect_start;
    let e = spiralSize*w/4;

    for (let i = 0; i <= n; i++) {
      a *= a_coef;
      e *= e_coef;
      aspect *= aspect_coef;
      ellipses.push([0, 0, e, e / aspect, a - 0.05])
    }

    ellipses.forEach(([x, y, e, e_aspect, a], i) => {
        // decrease stroke width as we increase size
        let sw = s.map(i, 0, n, 3, 0.33)
        canvas.strokeWeight(sw);
        canvas.noFill();
        canvas.stroke(160, 100, 164);
        canvas.rotate(a);
        canvas.ellipse(x, y, e, e_aspect);
      })
    return canvas
  }
  
  s.draw = function () {
    if (s.frameCount < 250) {
      s.background(0)
      s.translate(s.width/ 2, s.height / 2);
      s.rotate(-s.radians(5*s.frameCount))
      s.scale(s.frameCount / 100)
      spiral.background('#000000');
      spiral.push()
        drawSpirals(spiral);
      spiral.pop()
      s.image(spiral, -spiralSize*w/2,-spiralSize*h/2);
    } //else {
//      s.background(0)
//    }


  }
})
)}

function _9(md){return(
md`## Hypotrochoid!`
)}

function _10(md){return(
md`The second piece in the sequence I wanted to replicate was a blue spiral that looked to me like a hypotrochoid. After implementing it, I'm realizing that's not really the case, but it obtains a similar effect.`
)}

function _11(p5){return(
p5(s => {
  let fr = 30
  let frames = []
  let w = 800
  let h = 450
  let rcNoizeOffset = 0//s.random(1000);
  let rmNoizeOffset = 0//s.random(1000);
  let rdNoizeOffset = 0//s.random(100);
  
  s.setup = function() {
    s.frameRate(fr);
    s.createCanvas(w, h);
    s.frameRate(60);
  }
  
  s.draw = function() {
    let theta = s.radians(2);
    let r =20;
    s.background('#000000');
    s.stroke(33, 106, 143)
    s.strokeWeight(1);
    s.noFill()
    s.beginShape()

    let rc = 3 + 6 * s.noise(rcNoizeOffset + s.frameCount * 0.0001);
    let rm = 1 + 6 * s.noise(rmNoizeOffset + s.frameCount * 0.0001);
    let rd = 2 + 6 * s.noise(rdNoizeOffset + s.frameCount * 0.005);
    let d = rc - rm;
    s.translate(w/2, h/2)
    for (let i = 0, len = 360 * 30; i < len; i += 1) {
        const t = -s.QUARTER_PI + s.TWO_PI * i / 360;
        const x = d * s.cos(t) + rd * s.cos(t * d / rm);
        const y = d * s.sin(t) - rd * s.sin(t * d / rm);
        s.vertex((s.frameCount + 100) * 0.05 * x, (s.frameCount + 100) * 0.05 * y);
    }
    s.endShape()
  }
})
)}

function _12(md){return(
md`There were lots of happy accidents while trying to recreate peices of the sequence:`
)}

function _13(p5){return(
p5(s => {
  let fr = 30
  let frames = []
  let w = 800
  let h = 450
  s.setup = function() {
    s.frameRate(fr);
    s.createCanvas(w, h);
  }
  s.draw = function() {
    s.background('#000000');
    let xorig = w/2
    let yorig = h/2
    let t = s.frameCount / fr
    let r = 200
    let Rorig = s.map(s.sin(t/10), -1, 1, 0.2*r, r)
    let minR = s.map(s.sin(t/10), -1, 1, 100, Rorig)

    let trail = []
    for (let i = s.PI; i <= 3*s.PI; i+= 0.01) {
      let angle = i;
      let r = Rorig + s.map(s.sin(Rorig * angle * 0.5), -1, 1, 
                            minR - Rorig, 
                            minR);
      //let r = rorig + s.map(s.sin(ror ig * i * 0.2), -1, 1, -rorig + 50 + 5*t, rorig);
      let x = xorig + r / 2 * s.cos(angle);
      let y = yorig + r / 2 * s.sin(angle);
      trail.push([x,y]);
    }
    s.noFill();
    s.stroke(160, 100, 164);
    s.beginShape();
    trail.forEach(([x,y]) => {
      s.curveVertex(x, y);
    })
    s.endShape();
    
    //s.strokeWeight(10.0)

  }
})
)}

function _14(md){return(
md`# Appendix`
)}

function _15(md){return(
md`## Amplitude`
)}

function _16(p5,fr){return(
p5(s => {
  let frames = []
  s.setup = function() {
    s.frameRate(fr);
    s.createCanvas(500, 500);
  }
  s.draw = function() {
    s.background('#e8e8e8');
    s.fill('#000000');
    for (let i = 0; i < 50; i++) {
      let scale = s.map(i, 0,50,0,10)
      let amt = s.map(i, 0, 50, 0, 250)
      let x = 250 + s.map(s.sin(s.frameCount / fr), -1, 1, -amt, amt)
      s.circle(x, i*10, 5)
    }
  }
})
)}

function _17(md){return(
md`## Frequency`
)}

function _18(p5,fr){return(
p5(s => {
  let frames = []
  s.setup = function() {
    s.frameRate(fr);
    s.createCanvas(500, 500);
  }
  s.draw = function() {
    s.background('#e8e8e8');
    s.fill('#000000');
    for (let i = 0; i < 50; i++) {
      let scale = s.map(i, 0,50,0,10)
      let amt = s.map(i, 0, 50, 0, 250)
      let x = s.map(s.sin((s.frameCount / fr) * scale), -1, 1, 0, s.width)
      s.circle(x, i*10, 5)
    }
  }
})
)}

function _19(md){return(
md`## Phase`
)}

function _20(p5,fr){return(
p5(s => {
  let frames = []
  s.setup = function() {
    s.frameRate(fr);
    s.createCanvas(500, 500);
  }
  s.draw = function() {
    s.background('#e8e8e8');
    s.fill('#000000');
    for (let i = 0; i < 50; i++) {
      let scale = s.map(i, 0,50,0,10)
      let amt = s.map(i, 0, 50, 0, 250)
      let x = 250 + s.map(s.sin((s.frameCount / fr) * i * 0.05), -1, 1, -amt, amt)
      s.circle(x, i*10, 5)
    }
  }
})
)}

function _21(p5,fr){return(
p5(s => {
  let frames = []
  s.setup = function() {
    s.frameRate(fr);
    s.createCanvas(500, 500);
  }
  s.draw = function() {
    s.background('#8e8e8e');
    s.stroke('#000000');
    s.fill('#8e8e8e')
    let xy = getXY(s, s.frameCount/30, s.width, s.height)
    frames.push(s.frameCount/30)
    if (frames.length > 200) {
      frames.shift()
    }
    s.beginShape();
    frames.forEach((f) => {
      let xy = getXY(s, f, s.width, s.height)
      s.curveVertex(xy[0], xy[1]);
      //        s.circle(xy[0], xy[1], 5);
    })
    s.endShape();
    s.fill('#000000')
    s.circle(xy[0], xy[1], 30);
  }

  function getXY(s, t, w, h) {
    let adder = s.map(s.sin(t), -1, 1, 0.01, 0.1)
    t += adder
    let x = s.map(s.sin(t), -1, 1, 0, w)
    let y = s.map(s.sin(t * 0.75), -1, 1, 0, h)
    return [x, y]
  }
})
)}

function _fr(){return(
30
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof a_start")).define("viewof a_start", ["Inputs"], _a_start);
  main.variable(observer("a_start")).define("a_start", ["Generators", "viewof a_start"], (G, _) => G.input(_));
  main.variable(observer("viewof aspect_start")).define("viewof aspect_start", ["Inputs"], _aspect_start);
  main.variable(observer("aspect_start")).define("aspect_start", ["Generators", "viewof aspect_start"], (G, _) => G.input(_));
  main.variable(observer("viewof a_coef")).define("viewof a_coef", ["Inputs"], _a_coef);
  main.variable(observer("a_coef")).define("a_coef", ["Generators", "viewof a_coef"], (G, _) => G.input(_));
  main.variable(observer("viewof aspect_coef")).define("viewof aspect_coef", ["Inputs"], _aspect_coef);
  main.variable(observer("aspect_coef")).define("aspect_coef", ["Generators", "viewof aspect_coef"], (G, _) => G.input(_));
  main.variable(observer("viewof e_coef")).define("viewof e_coef", ["Inputs"], _e_coef);
  main.variable(observer("e_coef")).define("e_coef", ["Generators", "viewof e_coef"], (G, _) => G.input(_));
  main.variable(observer("viewof n")).define("viewof n", ["Inputs"], _n);
  main.variable(observer("n")).define("n", ["Generators", "viewof n"], (G, _) => G.input(_));
  main.variable(observer()).define(["p5","a_start","aspect_start","n","a_coef","e_coef","aspect_coef"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["p5"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["p5"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["p5","fr"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["p5","fr"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["p5","fr"], _20);
  main.variable(observer()).define(["p5","fr"], _21);
  const child1 = runtime.module(define1);
  main.import("p5", child1);
  main.variable(observer("fr")).define("fr", _fr);
  return main;
}
