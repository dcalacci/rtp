// https://observablehq.com/@dcalacci/rtp-vera-molnar-triangle@932
import define1 from "./493851ae5989f70a@398.js";
import define2 from "./316b246fa1642db4@283.js";

async function _1(FileAttachment,md){return(
md`# Recreating The Past Week 1: Vera Molnár

It's difficult for me to choose a piece to re-create. I spent some time reading [Aesthetic Guidelines](https://www.jstor.org/stable/1573236), trying to understand her process. I'd like to try and re-create not just the piece, but also how she went about creating them/it. 

I remember Zach mentioning her fascination with Gaussian curves. She became inured with them one year, deciding she would move away from simple shapes towards generated curvature. Then, all of her work over several months on these curves was stolen. She and her husband had stored them wrapped up in a towel, and it had been taken. She then vowed to return to squares, circles, and triangles. 

But she saw, at one point, Mont Sainte Victoire, a mountain famously painted by Cézanne between 1904 and 1906. She saw this mountain and immediately recognized her mutilated gaussian curves, and, it seems became obsessed with it. 

While I am fascinated by this pattern and her long-standing relationship with the mountain and it's curves, I'd like to re-create something else. 

The theme of this week, broadly, is Order / Chaos. I perused some gallery sites and the works my classmates found, but one piece caught my eye: [Triangle](https://www.artsy.net/artwork/vera-molnar-triangle), 1988. 

I can't really find any other details about this work outside of Artsy. it's currently at the [Galerie La Ligne](https://www.artsy.net/partner/galerie-la-ligne) in Zürich. 

![Screen Shot 2022-02-03 at 12.43.18 PM.png](${await FileAttachment("Screen Shot 2022-02-03 at 12.43.18 PM.png").url()})

Molnár was interested in how iterative changes to a composition move that design closer or farther from some isthmus of aesthetic value. In 1975 in [Aesthetic Guidelines](https://www.jstor.org/stable/1573236), she wrote:

> "...despite the efforts of painters and others interested in art during past centuries, such principles [of aesthetics] continue to elude discovery...The principles that I believe exist are in the form of laws that are determined by human physiology and psychology and recent achievements in the human sciences encourage my belief."

Molnár believed in some universalistic notion of aesthetics; one that was a collaboration at once between the artist and the viewer, but that followed some set of social, psychological, and physiological laws. Within each piece is a small microcosm of steps she takes towards some ultimate, pleasing form within a set of constraints she begins with. Each step, some pertubation of the original form, takes her closer or further from that pleasing form.

When viewing her entire body of work, it stands to reason that each set of pieces is itself a kind of meta-step. It seems she viewed her practice as a number of motions intent on moving artistry closer towards a kind of aesthetic discovery. In this way, the "disorder" she starts with in each piece (a set of simple shapes and rules) is a kind of ordered chaos, a way to search a solution space for pieces and forms that test theories of aesthetics in herself and audiences more broadly. It is a set of arbitrary rules that she has used to intuitively (randomly) search the space of forms for those most pleasing and most able to reveal something about our concepts of aesthetics.

_Triangle_, to me, departs from this thesis slightly. Unlike other pieces of her work that start with simple shapes and move towards chaotic ends, _Triangle_ takes what is seeming randomness—a series of dashes and dots of varying lengths—and reveals an ordered shape; a triangle. One of her primitives. It's this inversion that I like about the piece.

I know that this basically _looks like_ dithering, but there's something about it that isn't quite that, and I like the idea of kind of hand-rolling it without resorting to an algorithmic back-pocket approach. Feels less lazy.

There are some other qualities about it that I like as well. The staccato nature of the lines suggest some kind of motion. In this way the triangle feels fleeting, momentary. it has a sense of motion to me that some of her other works lack.`
)}

function _2(md){return(
md`# First Attempt at background

Below is my first attempt at creating the "background" of the piece. My approach is going to be generating the lines first, and then figuring out how to draw a shape second. 

First, some observations about the piece:

- The piece consists of a series of columns, regularly spaced across the width of the piece
- each column has a series of lines of seemingly random length.
- Lines are not entirely random. Few are very long—the longest I could find was about 1/6 of the height of the piece. There are many very short lines, but the shortest lines are maybe 1/100 of the piece
- There is also a seemingly random space before and after each line—also not entirely random. Smaller than the length of the lines themselves.
- Lines are not entirely random lengths—they seem to be quantized, so some lines start and end on the same point.
- Columns have more density near where the triangle is drawn, with most of those lines being particularly long.

## Approaches
My first approach generated line lengths using a gaussian. it was entirely out of whack and didn't look right.

I then thought of each line segment as a binary pixel, and randomly selected to display a segment or not uniformly. This wasn't quite right either - the image is more line than space, and randomly selecting meant it would be about 50/50. 

I decided instead to generate segments with a probability of 2/3. This produced something that I think is the closest approximation to the line generation I've been able to achieve. 

I found that there are 121 columns (strange! but i did count twice). The smallest line is about 1/64th of the figure's total height.`
)}

function _3(md){return(
md`To start, let's figure out how to draw one column. I use draws from a bernoulli distribution with a \`p=0.66\` to decide where to draw line segments. We do this until we move past the limits of our canvas.`
)}

function _5(md){return(
md`Probability of a line being drawn in any "pixel"`
)}

function _lineProb(){return(
2/3
)}

function _7(md){return(
md`This defines the minimum size of any "pixel" (line) in the piece. `
)}

function _lineSizeRatio(){return(
1/128
)}

function _createLineLengths(lineSizeRatio,d3,lineProb){return(
function createLineLengths ([start, end]) {
  // parameters: List of integer.
  // start: start x value
  // end: end x value
  // returns: a list of pairs [[start, end]] of each segment from start to end, probabalistically 
  // drawn from a bernoulli distribution. 
  let minLineSize = lineSizeRatio * (end - start);
  let x = start;
  let rLine = d3.randomBernoulli(lineProb)
  let lines = [];
  while (x < end) {
    if (rLine() > 0) {
      lines.push([x, x + minLineSize]);
    }
    x = x + minLineSize;
  }
  return lines
}
)}

function _10(p5,createLineLengths)
{
const width = 500;
return p5(sketch => {
  sketch.setup = function () {
    sketch.createCanvas(width,20);
    sketch.noLoop()
  }

  sketch.draw = function () {

    sketch.stroke('#000000')
    sketch.strokeWeight(2);
    let lineLengths = createLineLengths([0, width])
    lineLengths.forEach(l => {
      sketch.line(l[0], 10, l[1], 10)
    })
  }
})
}


function _11(md){return(
md`Here's our first attempt using the above function. Pretty good! I'd say that looks close to what one of Molnar's columns looks like.

Now, to create a set of columns and repeat that work. We can reuse the function above. 

To create a set of columns, I just create a range from \`0\` to \`121\` (that's how many columns I counted in the original piece). I'm using a size of \`750 x750\` because on my monitor it approximates a print-out I have of the original, so I can display them side-by-side.

For the _width_ of each vertical stroke, I simply make it half the size of each column.`
)}

function _cols(_){return(
_.range(0,121,1)
)}

function _size(){return(
[750,750]
)}

function _xScale(d3,cols,size){return(
d3
.scaleBand()
.domain(cols)
.range([0,size[0]])
)}

function _15(p5,size,_,cols,createLineLengths,xScale){return(
p5(sketch => {
  sketch.setup = function () {
    sketch.createCanvas(size[0],size[1]);
    sketch.noLoop()
  }

  sketch.draw = function () {
    // split into columns
    sketch.stroke('#000000')
    sketch.strokeWeight(size[0] / (121*2));
    _.forEach(cols, (c) => {
      let lineLengths = createLineLengths([0, size[1]])
      lineLengths.forEach(l => {
        sketch.line(xScale(c), l[0], xScale(c), l[1])
      })
    })
  }
})
)}

function _16(htl){return(
htl.html`I'm happy with this! Notice how we get some emergent lines that show themselves across the entire image. Look at them side-by-side (forgive my shitty cropped version of her beautiful piece):

<section style="height: 550px;">
  <div class="s-b-container a-item-c">
    <img class="box-shadow-d" src="https://i.imgur.com/oCxmdr3.jpg" style="float: left; width:50%; height: 500px; object-fit: contain;">
    <img class="box-shadow-d" src="https://i.imgur.com/aLjpBAn.png" style="float: left; width:50%; height: 500px; object-fit: contain;">
  </div>
</section>

Besides the triangle, there's also this effect in Molnar's piece that is almost certainly from the plotter, which is lines shifting slightly on the vertical axis. This seems like low-hanging fruit, so let's try and get that effect. I'm going to add a small amount of Gaussian noise to the x-axis of each segment. It's not random, though—if you look across the x-axis at various points, it's a consistent noise due (probably) to shifting in the plotter. To achieve this, I'm going to generate noise values for each quantized value on the y-axis so we can apply it consistently. After fiddling with parameters, I find that a probability of applying noise at p=0.5 and noise generated w/ a gaussian at mean 0 and std 0.3-0.4 work pretty well to replicate the effect. The idea here is that on average, the lines should continue straight down, but we get movement around some mean.`
)}

function _17(p5,size,createNoises,_,lineSizeRatio,cols,createLineLengths,xScale){return(
p5(sketch => {
  sketch.setup = function () {
    sketch.createCanvas(size[0],size[1]);
    sketch.noLoop()
  }

  sketch.draw = function () {
    // split into columns
    sketch.stroke('#000000')
    sketch.strokeWeight(size[0] / (121*2));
    // Noise. First, create the array of noise:
    const noises = createNoises(size[1])
    // Then generate an index array of all our y values
    const yVals = _.range(0,size[1], lineSizeRatio * size[1])
    // looks up noise for each y value
    function getNoise(y) { return noises[_.indexOf(yVals, y)] }
    _.forEach(cols, (c) => {
      let lineLengths = createLineLengths([0, size[1]])
      lineLengths.forEach((l,i) => {
        // looks up our noise.
        let n = getNoise(l[0])
        sketch.line(xScale(c) + n, l[0], xScale(c) + n, l[1])
      })
    })
  }
})
)}

function _createNoises(d3,_,lineSizeRatio)
{
  const NoiseMean = 0
  const NoiseStd = 0.3 // std of normal dist for amount of noise
  const NoiseProb = 1/2 // probabilty of applying at any y-axis interval
  
  return function createNoises(s) {
    // for a given size, creates an array of noise values for each pixel based on 
    // lineSizeRatio.
    let noises = []
    let noise = d3.randomNormal(NoiseMean, NoiseStd)
    // create noise with a 1/5 chance as we go down the y-axis
    let willChange = d3.randomBernoulli(NoiseProb)
    let currentNoise = noise()
    _.range(0,s, lineSizeRatio * s).forEach(
          (v,i,c) => {
            if (willChange()) {
              currentNoise = noise()
            }
            noises.push(currentNoise)
          })
      return noises;
  }
}


function _19(md){return(
md`This looks pretty good. some strong variations but not enough to ruin the image. `
)}

async function _20(FileAttachment,md){return(
md`## Adding the Triangle

Now, for the hard part. Adding the triangle. I would love to abstract this so I can add any shape I like and use this as a kind of dithering, but this might be tricky!

My first guess on how to do this is to try and apply a kind of image mask, representing my vectors of plotting/not plotting as a matrix. But I'm not sure this is quite right. Some observations:

- The triangle is an outline, with a stroke width of about 6-7 (in line height) on average.
- There are only a few places where there are gaps in the outline. Most of it is solid. This means that it's still probabalistic—she didnt just apply a mask to the bits.
- It seems the closer it gets to the triangle outline, the more likely lines are to get filled in. This requires that we know where the triangle is in both X and Y, and for us to mediate the randomness (i.e., that bernoulli distribution) by the distance to the triangle.

This tells me that a crucial thing we need is a function that can tell us, from an \`x,y\` on our piece, our distance to an edge in a target image. Then, we need to follow some distribution - poisson? that increases the likelihood of drawing a line the closer we get to this edge.

First, I created an image in Figma that matched the size of the triangle in Molnár's original. I used rounded edges to try and attain the effect in the original. I first used a stroke size of 50 (shown here), but after running all of the below, it turned out to be too thick. A stroke size of 33 worked. much better.

![Group 1.png](${await FileAttachment("Group 1.png").url()})

I then exported that image, and read it into our notebook:
`
)}

async function _data(FileAttachment,DOM)
{
  let img = await FileAttachment("triangle@1.png").image();
  let ctx = DOM.canvas(img.width, img.height).getContext('2d');
  ctx.drawImage(img, 0, 0);
  return {
    data: ctx.getImageData(0, 0, img.width, img.height),
    width: img.width,
    height: img.height
  };
}


function _22(md){return(
md`Then I export just the data:`
)}

function _tri(data){return(
new ImageData(
    new Uint8ClampedArray(data.data.data),
    data.width,
    data.height
  )
)}

function _24(md){return(
md`I've never worked with these kinds of arrays in JS before so I play around here. I figure out that each pixel is represented by (assumedly) R,G,B values in the array. Below, I experiment, and try to make a specific pixel (centered on the X-axis and on the top of the triangle) white. Once I do this correctly, I know I have a formula for understanding the values of pixels in the image:`
)}

function _25(tri,DOM)
{ 
  let d = tri.data
  let x = 375;//d3.randomUniform(750)();
  let y = 230;//d3.randomUniform(750)();
  let idx = ((750 * 4) * y) + (x * 4)
  d[idx] = 255
  d[idx + 1] = 255
  d[idx + 2] = 255
  let data = new ImageData(d, tri.width, tri.height)
  let ctx = DOM.canvas(data.width, data.height).getContext("2d");
  ctx.canvas.style.width = `${data.width}px`;
  ctx.putImageData(data, 0, 0);
  return ctx.canvas;
}


function _26(md){return(
md`Taking that experiment above and abstracting it, I create a function \`geteValue\`, which returns the average value of each R,G,B for a position \`[x,y]\`. \`d\` here is our data array (\`tri.data\`). `
)}

function _getValue(){return(
function getValue([x, y], d) {
  // Returns the average value across all R,G,B values for a pixel 
  // at x,y in data array d.
  let idx = ((750 * 4) * y) + (x * 4)
  return  ( d[idx] + d[idx + 1] + d[idx + 2]) / 3;
}
)}

function _28(md){return(
md`Right now, we randomly choose if a particular part of a column is drawn or not using a bernoulli distribution. 

We should augment that distribution with how close a position is to the pixels in our triangle image. We don't just want "closeness", though. We want pixels in the middle of the stroke of the triangle to be almost assuredly drawn, while pixels outside the stroke become less and less likely the farther you get.

This function implements one part of the strategy I detailed above. It averages the values of all pixels above and below a given \`x,y\` position. The idea here is that points in the middle of the triangle should have close to an average of \`0\` (black) while points farther away should be closer to \`1\`. `
)}

function _getYNeighborMean(_,getValue){return(
function getYNeighborMean([x, y], d, range) {
  // returns the average values of pixels `range/2` above and `range/2` below 
  // the pixel at `x,y` in `d`. 
  let neighbors = _.range(y - _.ceil(range/2), y + _.ceil(range/2));
  return _.sum(neighbors.map(y2 => getValue([x, y2], d))) / neighbors.length;
}
)}

function _30(md){return(
md`Here, we put it all together. \`range\` below is the parameter for how far around a point to look for lines in our image (in this case, the triangle). We take the average of pixels within this range, and translate it linearly to a number between \`[0, 0.85]\`, inclusive. This effectively translates the pixel value into a probability (with some guaranteed randomness, so there is never a 100% chance to draw a segment). The probability of drawing a line at any point at some y-value \`y\` is then (something like):`
)}

function _31(tex){return(
tex.block`P_d\sim Bernoulli(0.66) \\
k_y = \sum_{i=y-r}^{y+r} \frac{255 - M_i}{r} \\
P_y \sim P_d Bernoulli(k_y)`
)}

function _drawProb(Inputs){return(
Inputs.range([1, 100], {value: 85, step: 1, label: "Max. Draw Probability"})
)}

function _range(Inputs){return(
Inputs.range([2, 100], {value: 10, step: 1, label: "Range"})
)}

function _34(p5,size,createNoises,_,lineSizeRatio,cols,createLinesWithShape,tri,range,xScale)
{
//  let range = 20
  
  return p5(sketch => {
    sketch.setup = function () {
      sketch.createCanvas(size[0],size[1]);
      sketch.noLoop()
    }
  
    sketch.draw = function () {
      sketch.background('#ffffff');
      // split into columns
      sketch.stroke('#000000')
      sketch.strokeWeight(size[0] / (121*2));
      // Noise. First, create the array of noise:
      const noises = createNoises(size[1])
      // Then generate an index array of all our y values
      const yVals = _.range(0,size[1], lineSizeRatio * size[1])
      // looks up noise for each y value
      function getNoise(y) { return noises[_.indexOf(yVals, y)] }
      _.forEach(cols, (c) => {
        let lineLengths = createLinesWithShape(c, size[1], tri.data, range)
        lineLengths.forEach((l,i) => {
          // looks up our noise.
          let n = getNoise(l[0])
          sketch.line(xScale(c) + n, l[0], xScale(c) + n, l[1])
        })
      })
    }
})
}


function _lineScale(d3,drawProb){return(
d3.scaleLinear()
  .domain([255,0])
  .range([0, drawProb/100])
)}

function _createLinesWithShape(lineSizeRatio,d3,lineProb,xScale,lineScale,getYNeighborMean,_){return(
function createLinesWithShape (col, size, d, range) {
  // parameters: List of integer.
  // x: x val to create line on
  // size: length of lines in total 
  // returns: a list of pairs [[start, end]] of each segment from start to end, probabalistically 
  // drawn from a distribution ....
  let minLineSize = lineSizeRatio * size;
  let x = 0;
  let rLine = d3.randomBernoulli(lineProb)
  let lines = [];
  while (x < size) {
    let colX = xScale(col)
    let drawLine = d3.randomBernoulli(lineScale(getYNeighborMean([_.floor(colX), _.floor(x)], d, range)))
    if ((drawLine() > 0) | (rLine() > 0)) {
      lines.push([x, x + minLineSize]);
    }
    x = x + minLineSize;
  }
  return lines
}
)}

function _37(md){return(
md`Below, you can see the final product. The original is on the left. The right is my final piece, with the following parameters: a stroke size of 33, a maximum draw probability of 85%, and a range of 10.`
)}

function _38(htl){return(
htl.html`<section style="height: 420px;">
  <div class="s-b-container a-item-c">
    <img class="box-shadow-d" src="https://i.imgur.com/oCxmdr3.jpg" style="float: left; width:50%; height: 400px; object-fit: contain;">
    <img class="box-shadow-d" src="https://i.imgur.com/5uWKLnq.png" style="float: left; width:50%; height: 400px; object-fit: contain;">
  </div>
</section>`
)}

function _39(md){return(
md`For comparison, you can see the difference in something as small as the width of the original line used to generate the piece. My triangle here is with a line with a stroke-width of 50 pixels. The effect is to make the triangle too pronounced and clear:`
)}

function _40(htl){return(
htl.html`<section style="height: 420px;">
  <div class="s-b-container a-item-c">
<img class="box-shadow-d" src="https://i.imgur.com/oCxmdr3.jpg" style="float: left; width:50%; height: 400px; object-fit: contain;">
<img class="box-shadow-d" src="https://i.imgur.com/3xoQ05S.png" style="float: left; width:50%; height: 400px; object-fit: contain;">
    </div>
</section>`
)}

function _41(md){return(
md`# Animating
One fun thing about this work is that it allows us to build on top of her original piece. here is a fun little animation that iterates through different range values. I use perlin noise so it sort of 'walks' through different ranges rather than jumps randomly around.`
)}

function _isLooping(Inputs){return(
Inputs.toggle({label: "Loop?"})
)}

function _43(d3,p5,isLooping,size,perlin2,createNoises,_,lineSizeRatio,cols,createLinesWithShape,tri,xScale)
{
  let randRange = d3.randomNormal(5, 75);
  let MAX_RANGE = 75
  let range = 5
  let ix = 0;
  
  return p5(sketch => {
    sketch.setup = function () {
      if (!isLooping) 
        sketch.noLoop()
      else
        sketch.loop()
      sketch.createCanvas(size[0],size[1]);
      let SCALE = 0.01
      let r = perlin2(ix * SCALE, 1)
      range = Math.ceil((r + 1) / 2 * MAX_RANGE)
      ix += 1
    }
  
    sketch.draw = function () {
      sketch.background('#ffffff');
      // split into columns
      sketch.stroke('#000000')
      sketch.strokeWeight(size[0] / (121*2));
      // Noise. First, create the array of noise:
      const noises = createNoises(size[1])
      // Then generate an index array of all our y values
      const yVals = _.range(0,size[1], lineSizeRatio * size[1])
      // looks up noise for each y value
      function getNoise(y) { return noises[_.indexOf(yVals, y)] }
      _.forEach(cols, (c) => {
        let lineLengths = createLinesWithShape(c, size[1], tri.data, range)
        lineLengths.forEach((l,i) => {
          // looks up our noise.
          let n = getNoise(l[0])
          sketch.line(xScale(c) + n, l[0], xScale(c) + n, l[1])
        })
      })
    }
})
}


export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Screen Shot 2022-02-03 at 12.43.18 PM.png",new URL("./files/f76f85c188301532943beb1684ff9c012be64376f8bab304df02fea29801f9eeb92e0b4d095555cbce0afd457577f4c94d69a23eff087582ab84605225d82e55",import.meta.url)],["Group 1.png",new URL("./files/389992dfc83cae415a362fa780176da528e320a2f47b355a1144866c9f8da61ab8ebf5d642d559d253c81246373875975b51fa62564162d98bae0cdd31505a97",import.meta.url)],["triangle@1.png",new URL("./files/69e51e2e966a4964c951e00ca775ed55c5a3cc20ee98135e5ece836f9851cc748f8921629110c4ddac1ea2ff76b451a234bed3de462d3e37a169c887eb005cc0",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["FileAttachment","md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  const child1 = runtime.module(define1);
  main.import("p5", child1);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("lineProb")).define("lineProb", _lineProb);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("lineSizeRatio")).define("lineSizeRatio", _lineSizeRatio);
  main.variable(observer("createLineLengths")).define("createLineLengths", ["lineSizeRatio","d3","lineProb"], _createLineLengths);
  main.variable(observer()).define(["p5","createLineLengths"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("cols")).define("cols", ["_"], _cols);
  main.variable(observer("size")).define("size", _size);
  main.variable(observer("xScale")).define("xScale", ["d3","cols","size"], _xScale);
  main.variable(observer()).define(["p5","size","_","cols","createLineLengths","xScale"], _15);
  main.variable(observer()).define(["htl"], _16);
  main.variable(observer()).define(["p5","size","createNoises","_","lineSizeRatio","cols","createLineLengths","xScale"], _17);
  main.variable(observer("createNoises")).define("createNoises", ["d3","_","lineSizeRatio"], _createNoises);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["FileAttachment","md"], _20);
  main.variable(observer("data")).define("data", ["FileAttachment","DOM"], _data);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("tri")).define("tri", ["data"], _tri);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["tri","DOM"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("getValue")).define("getValue", _getValue);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("getYNeighborMean")).define("getYNeighborMean", ["_","getValue"], _getYNeighborMean);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["tex"], _31);
  main.variable(observer("viewof drawProb")).define("viewof drawProb", ["Inputs"], _drawProb);
  main.variable(observer("drawProb")).define("drawProb", ["Generators", "viewof drawProb"], (G, _) => G.input(_));
  main.variable(observer("viewof range")).define("viewof range", ["Inputs"], _range);
  main.variable(observer("range")).define("range", ["Generators", "viewof range"], (G, _) => G.input(_));
  main.variable(observer()).define(["p5","size","createNoises","_","lineSizeRatio","cols","createLinesWithShape","tri","range","xScale"], _34);
  main.variable(observer("lineScale")).define("lineScale", ["d3","drawProb"], _lineScale);
  main.variable(observer("createLinesWithShape")).define("createLinesWithShape", ["lineSizeRatio","d3","lineProb","xScale","lineScale","getYNeighborMean","_"], _createLinesWithShape);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer()).define(["htl"], _38);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer()).define(["htl"], _40);
  main.variable(observer()).define(["md"], _41);
  main.variable(observer("viewof isLooping")).define("viewof isLooping", ["Inputs"], _isLooping);
  main.variable(observer("isLooping")).define("isLooping", ["Generators", "viewof isLooping"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","p5","isLooping","size","perlin2","createNoises","_","lineSizeRatio","cols","createLinesWithShape","tri","xScale"], _43);
  const child2 = runtime.module(define2);
  main.import("perlin2", child2);
  main.import("perlin3", child2);
  return main;
}
