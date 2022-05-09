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
  frameRate(30)
  pixelDensity(1);
  createCanvas(8.5 * 150, 11 * 150); // create an 8.5x11 inch canvas at 150dpi
  for (let x = 0; x < width; x += spacer) {
    grid[x] = [];
    for (let y = 0; y < height; y += spacer) {
      grid[x][y] = 0;
    }
  }
  grid[spacer][spacer] = 1;
  rectMode(CENTER);
}

function canMove(x, y) {
  // if x and y are within the width and height and x and y are at least 1 away
  // from another dot, return true
  surroundingsAreEmpty = (x, y) => {
    // returns true if only one surrounding dot is filled
    let newGrid = grid;
    // let latestMove = moveList[moveList.length - 1];
    let surroundings = [
      newGrid[x][y],
      newGrid[x + spacer][y],
      newGrid[x - spacer][y],
      newGrid[x][y + spacer],
      newGrid[x][y - spacer],
      // newGrid[x + spacer][y + spacer],
      // newGrid[x - spacer][y - spacer]
    ];
    console.log(x, y, "surround:", surroundings)
    return surroundings.filter((s) => s === 1).length <= 1;
  };
  let inBounds = x >= spacer && x < width - spacer && y >= spacer && y < height - spacer;
  if (inBounds) {
    let isValid = surroundingsAreEmpty(x, y)
    return isValid
  }
  return false
}

function makeMove(x, y, direction) {
  let newX = x;
  let newY = y;
  switch (direction) {
    case 0: //right
      newX += spacer;
      break;
    case 1: //left
      newX -= spacer;
      break;
    case 2: // down 
      newY += spacer;
      break;
    case 3: // up
      newY -= spacer;
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
  console.log(x, y, legalMoves)
  return random(legalMoves)
}

let bgCol = "#f9f9f9"

let backup = 2
function draw() {
  // Loop through creating line segments
  // TODO: segments should be at least two long
  background(bgCol)
  beginShape();
  fill(230, 0, 76);
  noStroke();
  // for (let x = 0; x < width; x += spacer) {
  //   for (let y = 0; y < height; y += spacer) {
  //     if (grid[x][y] === 1) {
  //       rect(x, y, spacer, spacer);
  //     }
  //   }
  // }
  moveList.forEach((m) => {
    rect(m[0], m[1], spacer, spacer)
  })


}

function keyPressed() {
  if (key == "ArrowRight") {
    let latestMove = moveList[moveList.length - 1];
    let nextMove = generateMove(latestMove[0], latestMove[1]);
    if (nextMove === false) {
      // let poppedMove = moveList.pop();
      console.log("Backing up...")
      for (let i = 0; i <= backup; i++) {
        backMove = moveList.slice(moveList.length - i, moveList.length)
        grid[backMove[0], backMove[1]] = 0
      }

      console.log("deleting two moves...")
      moveList = moveList.slice(0, moveList.length - backup);
    } else {
      let [newX, newY] = makeMove(latestMove[0], latestMove[1], nextMove);
      moveList.push([newX, newY])
      grid[newX][newY] = 1;
      console.log("making move", nextMove, newX, newY)
    }
  }
  else if (key == "ArrowLeft") {
    console.log("backing up...")
    backMove = moveList.slice(moveList.length - 1, moveList.length)
    grid[backMove[0], backMove[1]] = 0
  }
}
