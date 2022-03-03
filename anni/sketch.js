let w = 400;
let h = 600;

let distances = [];
let maxDistance;

let dotDensity = 1;
let spacer = w / 10;

let grid = [];
let latestMove = [spacer, spacer];
let moveList = [latestMove]


function setup() {
  pixelDensity(1);
  createCanvas(8.5 * 150, 11 * 150); // create an 8.5x11 inch canvas at 150dpi
  for (let x = 0; x < width; x += spacer) {
    grid[x] = [];
    for (let y = 0; y < height; y += spacer) {
      grid[x][y] = 0;
    }
  }
  grid[spacer][spacer] = 1;
  // noLoop();
  rectMode(CENTER);
}

function canMove(x, y) {
  // if x and y are within the width and height and x and y are at least 1 away
  // from another dot, return true
  surroundingsAreEmpty = (x, y) => {
    // returns true if only one surrounding dot is filled
    let surroundings = [
      grid[x + spacer][y],
      grid[x - spacer][y],
      grid[x][y + spacer],
      grid[x][y - spacer],
      grid[x+spacer][y+spacer],
      grid[x-spacer][y-spacer]
    ];
    return surroundings.filter((s) => s === 1).length <= 2;
  };

  return (
    x >= spacer && x < width-spacer && y >= spacer && y < height-spacer && surroundingsAreEmpty(x, y)
  );
}

function makeMove(x,y, direction) {
    let newX = x;
    let newY = y;
    switch (direction) {
      case 0:
        newX += spacer;
        break;
      case 1:
        newX-= spacer;
        break;
      case 2:
        newY+= spacer;
        break;
      case 3:
        newY-= spacer;
        break;
    }
    return [newX, newY]
}

function generateMove(x, y) {
  let directions = [0, 1, 2, 3]; // right, left, up, down
  let legalMoves = directions.filter((direction) => {
    let d = makeMove(x, y, direction)
    return canMove(d[0], d[1])
  });
  if (legalMoves.length == 0) {
    return false
  }
  return random(legalMoves)
}


function draw() {
  // Loop through creating line segments
  // TODO: segments should be at least two long
  beginShape();
  fill(230, 0, 76);
  noStroke();
  for (let x = 0; x < width; x += spacer) {
    for (let y = 0; y < height; y += spacer) {
      if (grid[x][y] === 1) {
        rect(x, y, spacer - 1, spacer - 1);
      }
    }
  }
  let latestMove = moveList[moveList.length - 1];
  let move = generateMove(latestMove[0], latestMove[1]);
  if (move === false) {
    console.log("can't move, retracing...")
    // let poppedMove = moveList.pop();
    console.log(moveList.length)
    moveList = moveList.slice(0, moveList.length - 2);
    console.log(moveList.length)
  } else {
    let [newX, newY] = makeMove(latestMove[0], latestMove[1], move);
    grid[newX][newY] = 1;
    moveList.push([newX, newY])

  }
}
