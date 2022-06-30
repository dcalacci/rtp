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

varying vec2 vTexCoord;

uniform float u_frameCount;
uniform vec3 u_metaballs[20];

const float WIDTH = 1280.;
const float HEIGHT = 1280.;


float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   

float gold_noise(in vec2 xy, in float seed){
       return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

// shamelessly taken from https://thebookofshaders.com/11/
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float clmp (in float val, in float mn, in float mx) {
  if (val < mn) {
    return mn;
  } else if (val > mx) {
    return mx;
  } else {
    return val;
  }
}

float map (in float value, in float min1, in float max1, in float min2, in float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

/* float mod (in float a, in float b) { */
/*   return a - (b * floor(a/b)) */
/* } */

const float x_thickness = 5.;
const float y_thickness = 9.;
const float d_linex = 10.;
const float d_liney = 10.;

const int n_layers = 20;


void main() {
  bool inBall = false;
  float v = 0.0;

  // needs to be number of metaballs
  for (int i = 1; i < 15; i++) {
    vec2 ballPos = u_metaballs[i].xy;
    float r = u_metaballs[i].z;
    v += (r*r) / distance(vTexCoord, ballPos);
  }

  // change this for various effects
  float modx = mod(float(vTexCoord.x) * WIDTH, d_linex);
  float mody = mod(float(vTexCoord.y) * WIDTH, d_liney);
  vec3 blobColor = vec3(255, vTexCoord.xy);
  /* float n1 = noise(vTexCoord.xy/(u_frameCount/1000.)); */
  float r1 = random(vTexCoord.xy * noise(vTexCoord.xy)); /// (vTexCoord.y*2.);
  float seed = fract(u_frameCount);
  /* float r1 = map(gold_noise(vTexCoord.xy*1000., seed), 0., 255., 0., 1.); */
  /* float r1 = map(noise(vTexCoord.xy * sin(u_frameCount/1000.)), -1., 1., 0., 1.); */
  float n1 = map(noise(vTexCoord.xy * u_frameCount/100.), 0., 1., -.1, .1);
  /* float n2 = map(noise(vTexCoord.xy * sin(u_frameCount/1000.)), 0., 1., -2., 2.); */
  float vv = clmp(v, 0., 1.2);
  float vm = map(vv, 0., 1.4, -2., 2.);
  if (r1 <= vm) {
  /* if (v >= 1.2 && n1 > 0.333)  { */
    if (modx < y_thickness) {
      gl_FragColor = vec4(blobColor * noise(vTexCoord * 2. + u_frameCount/1000.), 0.5);
    }
  }
  else {
    /* if (mody < x_thickness) { */
    /* gl_FragColor = vec4(vTexCoord.y/2., 255, vTexCoord.y/2., 0.2); */
    gl_FragColor = vec4(255, 255, 255, 0.5);
    /* } */
  }
}
