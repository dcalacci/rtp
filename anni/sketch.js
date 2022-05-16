let w = 400;
let h = 600;

let distances = [];
let maxDistance;

let dotDensity = 1;
let spacer = w / 10;

let grid = [];
let latestMove = [spacer * 2, spacer];
let moveList = [[spacer, spacer], latestMove]

let segmentLength = 2


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
    let surroundings = []
    for (let i = 1; i < segmentLength; i++) {
      let s = spacer * i;
      console.log(x + s, y)
      console.log(newGrid[x + s][y])
      surroundings.push(
        newGrid[x][y],
        newGrid[x + s][y],
        newGrid[x - s][y],
        newGrid[x][y + s],
        newGrid[x][y - s]
      )

    }
    // let surroundings = [
    //   newGrid[x][y],
    //   newGrid[x + spacer][y],
    //   newGrid[x - spacer][y],
    //   newGrid[x][y + spacer],
    //   newGrid[x][y - spacer],
    //   // newGrid[x + spacer][y + spacer],
    //   // newGrid[x - spacer][y - spacer]
    // ];
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
    let r = [];
    let dx = x;
    let dy = y;
    console.log("> testing ", direction)
    for (let i = 0; i <= segmentLength; i++) {
      let d = makeMove(dx, dy, direction)
      r.push(canMove(d[0], d[1]))
      dx = d[0]
      dy = d[1]
    }
    return _.all(r)
  });
  if (legalMoves.length == 0) {
    return false
  }
  console.log("> legal moves:", legalMoves)
  return random(legalMoves)
}

let bgCol = "#f9f9f9"
let backup = 2
let play = false

let N_MOVES = 50

function draw() {
  // Loop through creating line segments
  // TODO: segments should be at least two long
  background(bgCol)
  beginShape();
  fill(230, 0, 76);
  noStroke();

  moveList.forEach((m) => {
    rect(m[0], m[1], spacer, spacer)
  })

  if (moveList > N_MOVES)
    play = false

  if (play)
    generate()

}

function generate() {
  let latestMove = moveList[moveList.length - 1];
  let nextMove = generateMove(latestMove[0], latestMove[1]);
  if (nextMove === false && moveList.length > 1) {
    // console.log("- Backing up...")
    backMoves = moveList[moveList.length - segmentLength]
    // console.log("- erasing move", backMoves)
    backMoves.forEach((m) => {
      console.log(m)
      grid[m[0], m[1]] = 0
    })
    moveList = moveList.slice(0, moveList.length - segmentLength)
  } else {
    // console.log("> Making move: ", nextMove)
    for (let i = 0; i < segmentLength; i++) {
      let latestMove = moveList[moveList.length - 1];
      let [newX, newY] = makeMove(latestMove[0], latestMove[1], nextMove);
      moveList.push([newX, newY])
      grid[newX][newY] = 1;
      // console.log("> Adding segment", moveList[moveList.length - 1])
    }
  }

}

function keyPressed() {
  if (key == "ArrowRight") {
    generate()
  }
  else if (key == "ArrowLeft") {
    // console.log("backing up...")
    backMove = moveList[moveList.length - 1]
    // console.log("erasing move", backMove)
    grid[backMove[0], backMove[1]] = 0
    moveList = moveList.slice(0, moveList.length - 1)
  }
  else if (key == " ") {
    play = !play
  } else if (key == 's')
    save(new Date().toJSON() + ".png")
}
