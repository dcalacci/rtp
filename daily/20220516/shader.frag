// vim: set ft=glsl:
// Adapted by Louise Lessel - 2019
// from
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com
// https://thebookofshaders.com/02/

/* #extension GL_OES_standard_derivatives : enable */
// These are necessary definitions that let you graphics card know how to render the shader
#ifdef GL_ES
precision highp float;
#endif


varying vec3 vTexCoord;

uniform float u_frameCount;
uniform vec4 u_metaballs[20];
uniform vec2 uResolution;

const float WIDTH = 1280.;
const float HEIGHT = 1280.;

///////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////

// shamelessly taken from https://thebookofshaders.com/11/
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
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

float noise2(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}



///////////////////////////////////////////////////////
// RAY MARCHING
///////////////////////////////////////////////////////

// minimum distance from any ball
float min_distance_from_blob_1(in vec3 p) {
  float min_distance = 1.;
  /* int blob_index = 0; */
  for (int i = 1; i < 20; ++i) {
    float r = u_metaballs[i].w;
    vec3 ballPos = u_metaballs[i].xyz;

    // subtract r to get to edge of circle, not just center
    // finds "in circle" etc
    float dist = length(p - ballPos) - r;
    if (dist < min_distance) {
      min_distance = dist;
      /* blob_index = i; */
    }
  }
  return min_distance;
}

// min distance from the "blob"
float min_distance_from_blob(in vec3 p) {
  float min_distance = 1.;
  int blob_index = 0;

  float v = 0.;
  for (int i = 1; i < 20; i++) {
    vec3 ballPos = u_metaballs[i].xyz;
    float r = u_metaballs[i].w;
    v += (r*r) / distance(p, ballPos);
    float dist = length(p - ballPos) - r;
    if (dist < min_distance) {
      min_distance = dist;
      blob_index = i;
    }
  }

  if (v >= 0.55) {
    return v * 0.0000000001;
    /* return 0.0001; */
  } else {
    return 0.1;
    /* return min_distance; */
  }
  /* return length(p - u_metaballs[2].xyz) - u_metaballs[2].w; */
  /* return length(p - vec3(0.0)) - 1.; */
    /* v += (r*r) / distance(vTexCoord, ballPos); */
}



vec3 calculate_normal(in vec3 p)
{
    const vec3 small_step = vec3(0.001, 0.0, 0.0);

    float gradient_x = min_distance_from_blob(p + small_step.xyy) - min_distance_from_blob(p - small_step.xyy);
    float gradient_y = min_distance_from_blob(p + small_step.yxy) - min_distance_from_blob(p - small_step.yxy);
    float gradient_z = min_distance_from_blob(p + small_step.yyx) - min_distance_from_blob(p - small_step.yyx);

    vec3 normal = vec3(gradient_x, gradient_y, gradient_z);

    return normalize(normal);
}

vec4 calculate_background()
{
    vec2 st = vTexCoord.xy;
    /* st.x *= uResolution.x/1280.; */
    vec2 pos = vec2(st*20.0);

    vec3 bgColor = vec3(0.0);
    // staticky
    /* bgColor.r = 0.8 + noise2(vTexCoord.xy * 2000. - u_frameCount*20.*cos(u_frameCount)); */
    /* bgColor.g = 0.2 + (noise2(vTexCoord.yx * 2000. + u_frameCount*20.*cos(u_frameCount))); */
    bgColor.r = 0.8;
    bgColor.b = 0.05;
    vec3 color = vec3(0.0);
    // animate
    float t = abs(1.0 - sin(u_frameCount*.005))*2.;
    // noise on top of coords
    st += noise2(st * 2.) * t;
    color -= smoothstep(.2,.7,noise(st*3.));
    color = (1. - color) * vec3(1., 0.1, 0.6);
    return vec4(color, 0.41);
}




vec4 ray_march(in vec3 ro, in vec3 rd)
{
    float total_distance_traveled = 0.0;
    const int NUMBER_OF_STEPS = 128;
    const float MINIMUM_HIT_DISTANCE = 0.000001;
    const float MAXIMUM_TRACE_DISTANCE = 1000000000.0;

    for (int i = 0; i < NUMBER_OF_STEPS; ++i)
    {
        // Calculate our current position along the ray
        vec3 current_position = ro + total_distance_traveled * rd;

        // finds closest distance to any blob exterior.
        float distance_to_closest = min_distance_from_blob(current_position);

        if (distance_to_closest < MINIMUM_HIT_DISTANCE) {
            // We hit something! Return red for now
            /* return vec3(1.0, 0.0, 0.0); */
            vec3 normal = calculate_normal(current_position);
            vec3 light_position = vec3(5.0, 5.0, 3.0);
            vec3 direction_to_light = normalize(current_position - light_position);

            float diffuse_intensity = max(0.0, dot(normal, direction_to_light));


            vec3 c = vec3(
                0.2,
                0.1 + noise(vec2(u_frameCount / 50., vTexCoord.y)), 
                noise(vec2(vTexCoord.x, u_frameCount / 50.)));
            return vec4( c * (diffuse_intensity + 0.45), 0.4);
            /* return vec3(1.0, 0.0, 0.0) * diffuse_intensity; */
        }

        if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE) // miss
        {
            break;
        }

        // accumulate the distance traveled thus far
        total_distance_traveled += distance_to_closest;
    }

    // If we get here, we didn't hit anything so just
    // return a background color (black)

    /* vec3 bgColor = vec3(235., vTexCoord.xy * 0.5); */
    /* return vec3( */
    /*     bgColor *  */
    /*     noise((vTexCoord.xy + vec2(0.1, 0.1)) * sin((u_frameCount + 100.) / 100.))); */


    return calculate_background();
}

void main() {

  // ray marching
  /* vec2 uv = gl_FragCoord.xy * 2.0 - 1.0; */
  vec2 uv = vTexCoord.xy * 1.5 - .5;

  vec3 camera_position = vec3(0.0, 0.0, -1.5);
  vec3 ro = camera_position;
  vec3 rd = vec3(uv, 1.3);

  vec4 shaded_color = ray_march(ro, rd);
  /* vec4 o_color = vec4(shaded_color, 1.0); */
  gl_FragColor = shaded_color;



  // original code
  /* for (int i = 1; i < 20; i++) { */
  /*   vec3 ballPos = u_metaballs[i].xyz; */
  /*   float r = u_metaballs[i].w; */
  /*   v += (r*r) / distance(vTexCoord, ballPos); */
  /* } */

  /* // change this for various effects */
  /* if (v >= 0.55)  { */
  /*   vec3 blobColor = vec3(255, vTexCoord.xy); */
  /*   gl_FragColor = vec4( */
  /*       blobColor * noise(vTexCoord.xy * 8.  */
  /*         * sin(u_frameCount/100.)), */
  /*       0.7); */
  /* } */
  /* else { */

  /*   /* vec3 blobColor = vec3(255, vTexCoord.xy); */
  /*   /* gl_FragColor = vec4(blobColor * noise(vTexCoord.xy * 3.), 0.7); */
  /*   gl_FragColor = vec4(vTexCoord.y,  */
  /*       200. +  */
  /*       vTexCoord.z * 255., vTexCoord.y, 0.3); */
  /* } */
}
