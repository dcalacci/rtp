// vim: set ft=glsl:
// Adapted by Louise Lessel - 2019
// from
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
// https://thebookofshaders.com/02/

// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif

uniform float mouse;
varying vec2 vTexCoord;
uniform vec2 uDims;
uniform vec2 uBalls[10];
uniform float uRadii[10];

void main() {
    // A blue color
    // In shaders, the RGB color spectrum goes from 0 - 1 instead of 0 - 255
    vec2 coord = vTexCoord;
    // scale x and y to true pixel positions
    float pixelX = vTexCoord.x * 1280.;//* uDims.x;
    float pixelY = vTexCoord.y * 1280.; //* uDims.y;

    vec2 pixelPos = vec2(vTexCoord.x * uDims.x, vTexCoord.y * uDims.y);

    // if it's not within radius of a ball, it's black
    // get the closest ball
    bool inBall = false;
    float distSum = 0.0;
    /* float maxDist = sqrt(uDims.x * uDims.x + uDims.y * uDims.y); */
    for (int i = 0; i < 20; i++) {
      vec2 ball = uBalls[i];
      float radius = uRadii[i];
      /* float dx = abs(pixelX - ball.x); */
      /* float dy = abs(pixelY - ball.y); */
      float thisDist = distance(vTexCoord, ball);
      /* float pixelDistFromRadius = sqrt(dx * dx + dy * dy); */
      /* dists = dists + pixelDistFromRadius; */
      /* float thisDist = sqrt(dx * dx  + dy * dy); */
      /* if (thisDist > distSum) */
      /*   dists = thisDist; */
      if (thisDist <= radius) 
        inBall = true;

      // above 1 if frag is within radius of a ball.
      float dd = radius / thisDist;
      // so will be `radius` if we are exactly radius away.
      // greater than radius if closer, and far less than radius if farther.
      distSum += radius * dd;
    }
      /* dists += dists * dists / (dx * dx + dy * dy); */
      /* if (pixelDistFromRadius < radius) { */
      /*   inBall = true; */
      /* } */
  /*   if (dists > 1.0)  */
  /*     gl_FragColor = vec4(vTexCoord.x, vTexCoord.y, 0.0, 1.0); */
		/* else  */
  /*     gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); */

    gl_FragColor = vec4(0., 0., distSum, 1.);
    /* if (distSum >= 2000.)  */
    /*   gl_FragColor = vec4(0., 0., 255., 1.);  */
    /* else */
    /*   gl_FragColor = vec4(255., 0., distSum, 1.); */

    /* if (distSum > 230. && distSum < 255.)  */
    /*   gl_FragColor = vec4(255., 0., (distSum - 230.)/255., 1.); */

    /* if (inBall) { */
    /*   gl_FragColor = vec4(vTexCoord.x, vTexCoord.y, 0., 1.); */
    /* } else { */
    /*   gl_FragColor = vec4(vTexCoord.x,0.,0.,1.); */
    /* } */


    // gl_FragColor is a built in shader variable, and you .frag file must contain it
    // We are setting the vec3 color into a new vec4, with an transparency of 1 (no opacity)
}

