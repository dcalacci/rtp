// vim: set ft=glsl:
/*
vert file and comments from adam ferriss
https://github.com/aferriss/p5jsShaderExamples
with additional comments from Louise Lessel
*/ 

#ifdef GL_ES
precision mediump float;
#endif

// This “vec3 aPosition” is a built in shader functionality. You must keep that naming.
// It automatically gets the position of every vertex on your canvas

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

// We always must do at least one thing in the vertex shader:
// tell the pixel where on the screen it lives:
void main() {
  // just a copy of our position in a vec2
  vTexCoord = aTexCoord;

  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  gl_Position = positionVec4;
}
