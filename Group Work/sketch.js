let margin = 2;
let N = 16;
let u, v;
let backCol = "#fffcf2";
let palette = ["#050505", "#2b67af", "#ef562f", "#f2eac1"], mainCol = "#f9d531";
let allColors = [...palette.slice(1), mainCol];

let rectangles = [];

let randInt = (a, b) => (Math.floor(Math.random() * (b - a) + a));



// Setting the canvas size
function setup() {
  createCanvas(500, 500);
 noLoop()
  // Calculate the width of each small square
  u = width / N;
  // Calculate the boundary of each small square
  v = u / 4;
 
  createComposition();

}

// plotting function
function draw() {
  // Drawing background color
  background(backCol);
  // No Stroke
  noStroke()
  randomSeed(2)
  
  if(frameCount>300&&frameCount%60==0){
     palette = []
    createComposition();
      for (let i = 0; i < 12; i++) {
    let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16); // 生成随机的十六进制颜色
   palette.push(randomColor); // Add the generated color to the array
  }
  mainCol = '#' + Math.floor(Math.random()*16777215).toString(16)
    allColors = [...palette.slice(1), mainCol]
  }
  // Iterate over all the cubes
  for (let recta of rectangles) {
    // Drawing small squares
    drawRectangle(recta.i * u, recta.j * u, recta.si * u, recta.sj * u, recta.insideCol);
  }
}

// Creating Combined Pattern Functions
function createComposition() {
  // Generate random cubes and add to the array until a certain number is reached
  for (let i = 0; i < 2000; i++) {
    let newRecta = generateRectangle();
    let canAdd = true;
    // Checks if the newly generated cube intersects an existing cube in the array.
    for (let recta of rectangles) {
      if (rectanglesIntersect(newRecta, recta)) {
        canAdd = false;
        break;
      }
    }
    // If they do not intersect then add to the array
    if (canAdd) {
      rectangles.push(newRecta);
    }
  }

  // Generate a circle of small squares around the edge
  for (let i = margin; i < N - margin; i++) {
    for (let j = margin; j < N - margin; j++) {
      let newRecta = {
        i: i,
        j: j,
        si: 1,
        sj: 1
      }
      let canAdd = true;
      // Checks if the newly generated cube intersects an existing cube in the array.
      for (let recta of rectangles) {
        if (rectanglesIntersect(newRecta, recta)) {
          canAdd = false;
          break;
        }
      }
      // If they do not intersect then add to the array
      if (canAdd) {
        rectangles.push(newRecta);
      }
    }
  }

  // Assigning internal colors to some small squares
  let colors = [...allColors, ...allColors];
  let i = 0;
  while (colors.length > 0) {
    if (rectangles[i].si > 1 && rectangles[i].sj > 1 && (rectangles[i].si + rectangles[i].sj) < 7) rectangles[i].insideCol = colors.pop();
    i++;
    if (i >= rectangles.length) break;
  }
}

// Determine if two cubes intersect
function rectanglesIntersect(recta1, recta2) {
  return ((recta1.i <= recta2.i && recta1.i + recta1.si > recta2.i) || (recta2.i <= recta1.i && recta2.i + recta2.si > recta1.i)) && ((recta1.j <= recta2.j && recta1.j + recta1.sj > recta2.j) || (recta2.j <= recta1.j && recta2.j + recta2.sj > recta1.j));
}

// Generate randomized cubes
function generateRectangle() {
  let si, sj;
  do {
    // Random generation of si and sj
    si = Math.floor(randInt(3, 10) / 2);
    sj = Math.floor(randInt(3, 10) / 2);
  } while ((si == 1 && sj == 1) || (si >= 4 && sj >= 4))
  // Randomly generate i and j
  let i = randInt(margin, N - margin - si + 1);
  let j = randInt(margin, N - margin - sj + 1);
  let recta = {
    i: i,
    j: j,
    si: si,
    sj: sj
  };
  return recta;
}

// Define a function that draws a rectangle with an inner color
function drawRectangle(x0, y0, si, sj, insideCol) {
  // If there is an internal color parameter
  if (insideCol) {
    // Fill interior color
    fill(insideCol);
    // Drawing internal rectangles
    rect(x0 + 2 * v, y0 + 2 * v, si - 3 * v, sj - 3 * v);
    // If the difference between the length and width of the rectangle is less than 2 * u
    if (Math.abs(si - sj) < 2 * u) {
      // Choose a color at random
      fill(random(allColors));
      // Drawing internal rectangles with different aspect sizes
      if (si < sj) {
        rect(x0 + 3 * v, y0 + (sj - (si - 6 * v)) / 2, si - 5 * v, si - 5 * v);
      } else if (sj < si) {
        rect(x0 + (si - (sj - 6 * v)) / 2, y0 + 3 * v, sj - 5 * v, sj - 5 * v);
      }
    }
  }

  // Initialization variables for storing colors
  let prevCol1, prevCol2, newCol;
  // Horizontal Loop Drawing Rectangle
  for (let x = x0; x < x0 + si + v / 2; x += v) {
    // Select a new color that is different from the previous one
    do {
      newCol = random(palette);
    } while (newCol == prevCol1)
    // Use the primary color with a 2/3 probability
    if (Math.random() < 2 / 3) newCol = mainCol;
    // Fill colors and draw rectangles
    fill(newCol);
    prevCol1 = newCol;
    rect(x, y0, v, v);

    // Select a new color that is different from the previous one
    do {
      newCol = random(palette);
    } while (newCol == prevCol2)
    // Use the primary color with a 2/3 probability
    // if (Math.random() < 2 / 3) newCol = mainCol;
    // Fill colors and draw rectangles
    fill(newCol);
    prevCol2 = newCol;
    rect(x, y0 + sj, v, v);
  }

  // Vertical Loop Drawing Rectangles
  for (let y = y0 + v; y < y0 + sj - v / 2; y += v) {
    // Select a new color that is different from the previous one
    do {
      newCol = random(palette);
    } while (newCol == prevCol1)
    // Use the primary color with a 2/3 probability
    if (Math.random() < 2 / 3) newCol = mainCol;
    // Fill colors and draw rectangles
    fill(newCol);
    prevCol1 = newCol;
    rect(x0, y, v, v);

    // Select a new color that is different from the previous one
    do {
      newCol = random(palette);
    } while (newCol == prevCol2)
    // Use the primary color with a 2/3 probability
    if (Math.random() < 2 / 3) newCol = mainCol;
    // Fill colors and draw rectangles
    fill(newCol);
    prevCol2 = newCol;
    rect(x0 + si, y, v, v);
  }
}

// Vertical Loop Drawing Rectangles
for (let y = y0 + v; y < y0 + sj - v / 2; y += v) {
  // Select a new color that is different from the previous one
  do {
    newCol = random(palette);
  } while (newCol == prevCol1)
  // Use the primary color with a 2/3 probability
  if (random(1) < 2 / 3) newCol = mainCol;
  // Fill colors and draw rectangles
  fill(newCol);
  prevCol1 = newCol;
  rect(x0, y, v, v);

      // Select a new color that is different from the previous one
      do {
        newCol = random(palette);
      } while (newCol == prevCol2)
      // Use the primary color with a 2/3 probability
      if (random(1) < 2 / 3) newCol = mainCol;
      // Fill colors and draw rectangles
      fill(newCol);
      prevCol2 = newCol;
      rect(x0 + si, y, v, v);
    }
    class Ball
    {
      // Constructor to initialize the properties of the ball
      constructor(diam_, _angle)
      {
        this.center = createVector(width/2, height/2); // Set the center of the ball to the center of the canvas
        this.dir = createVector(cos(_angle), sin(_angle)); // Calculate the direction of motion from a given angle
        this.pos = this.center.copy().add(this.dir.mult(1)); // Calculate position based on center point and direction
        this.diam = diam_; // Setting the initial diameter
        this.col = color(map(this.dir.heading(), -PI, PI, 0, 100), 90, 100); // Maps colors according to orientation angle
      }
    }
    // Control the movement of the ball
  move()
  {
    this.pos.add(this.dir); // Move position according to direction
    const d = dist(this.pos.x, this.pos.y, this.center.x, this.center.y); // Calculate the distance of the ball from the center point
    const s = min(width, height); // Gets the smaller of the canvas width or height.
    
    // Adjust the ball diameter according to the distance
    if (d > s * 0.4) this.diam = map(d, s * 0.4, s * 0.45, s * 0.04, 0, true);
    else if (d > s * 0.3) this.diam = map(d, s * 0.3, s * 0.4, s * 0.023, s * 0.042, true);
    else this.diam = map(d, 0, s * 0.1, 0, s * 0.021, true);
  }

    // Show ball on canvas
    display()
    {
      noStroke(); // Do not show border
      fill(this.col); // fill color
      ellipse(this.pos.x, this.pos.y, this.diam, this.diam); // Drawing Circles
    }
    
    // Check if the ball moves out of the canvas range
    isDead()
    {
      if (dist(this.pos.x, this.pos.y, this.center.x, this.center.y) > min(width, height)) return true;
      else return false;
    }
  
  