cell_size = 10;

cells = [];
start = false;

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(0);
  console.log(cells.length);
  // kill cells out of screen
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].x < 0 || cells[i].x > width || cells[i].y < 0 || cells[i].y > height) {
      cells[i].kill();
    }
  }

  // display grid
  for (let i = 0; i < width; i += cell_size) {
    for (let j = 0; j < height; j += cell_size) {
      fill(50);
      rect(i, j, cell_size, cell_size);
    }
  }

  // display cells
  for (let i = 0; i < cells.length; i++) {
    cells[i].show();
  }

  // handle mouse event
  mouseEvent();
  if (start) {
    cells = applyRules(cells);
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].alive) {
        populateNeighbors(cells[i].x, cells[i].y);
      }
    } 
  }
}

function keyPressed() {
  // Space
  if (keyCode === 32) {
    start = !start;
  }
  // Restart
  else if (keyCode === 82) {
    cells = []
    start = false;
  }
  return false; // prevent default
}

function mouseEvent() {

  if (mouseIsPressed) {

    if (mouseButton === LEFT) {
      let x = floor(mouseX / cell_size) * cell_size;
      let y = floor(mouseY / cell_size) * cell_size;

      let create = true;

      for (let i = 0; i < cells.length; i++) {
        if (cells[i].x == x && cells[i].y == y) {
          cells[i].born();
          create = false;
        }
      }

      // add alive cell
      if (create) {
        cells.push(new cell(x, y, cell_size, cell_size));
      }
      populateNeighbors(x, y);
    }

    if (mouseButton === RIGHT) {
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].onClick(mouseX, mouseY)) {
          cells.splice(i, 1);
        }
      }
    }
  } // end of mouse click event
  return true;
}

function populateNeighbors(x, y) {
  // add dead cells
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {

      let cont = false;
      for (let k = 0; k < cells.length; k++) {
        if (cells[k].onClick(x + cell_size * j + 1, y + cell_size * i + 1)) {
          cont = true
          break;
        }
      }
      if (i == 0 && j == 0 || cont) {
        continue;
      }

      let c = new cell(x + cell_size * j, y + cell_size * i, cell_size, cell_size);
      c.kill();
      cells.push(c);
    }
  }
}

function applyRules(old_gen) {
  
  let new_gen = old_gen;
  
  // Births
  for (let i = 0; i < cells.length; i++) {
    let neighbors = 0;
    for (let j = 0; j < cells.length; j++) {
      
      if (cells[i].onClick(cells[j].x + 1, cells[j].y + 1)) {
        continue;
      }

      if (cells[i].neighbors(cells[j]) && cells[j].alive) {
        neighbors += 1;
      }
    }
    // Births
    if (neighbors == 3 && !cells[i].alive) {
      new_gen[i].born();
    }
    // Death by isolation
    if (neighbors < 2 && cells[i].alive) {
      new_gen[i].kill();
    }
    // Death by overcrowding
    if (neighbors > 5 && cells[i].alive) {
      new_gen[i].kill();
    }
  }
  //start = false;
  return new_gen;
}