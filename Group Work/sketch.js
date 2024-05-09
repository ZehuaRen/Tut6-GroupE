let margin = 2;
let N = 16;
let u, v;
let backCol = "#fffcf2";
let palette = ["#050505", "#2b67af", "#ef562f", "#f2eac1"], mainCol = "#f9d531";
let allColors = [...palette.slice(1), mainCol];

let rectangles = [];

let randInt = (a, b) => (Math.floor(Math.random() * (b - a) + a));

function setup() {
  createCanvas(500, 500);
  u = width / N;
  v = u / 4;
  noLoop();
  createComposition();

 
}

function draw() {
  background(backCol);
  noStroke()

  for (let recta of rectangles) {
    drawRectangle(recta.i * u, recta.j * u, recta.si * u, recta.sj * u, recta.insideCol);
  }
}

function createComposition() {
  for (let i = 0; i < 2000; i++) {
    let newRecta = generateRectangle();
    let canAdd = true;
    for (let recta of rectangles) {
      if (rectanglesIntersect(newRecta, recta)) {
        canAdd = false;
        break;
      }
    }
    if (canAdd) {
      rectangles.push(newRecta);
    }
  }

  for (let i = margin; i < N - margin; i++) {
    for (let j = margin; j < N - margin; j++) {
      let newRecta = {
        i: i,
        j: j,
        si: 1,
        sj: 1
      }
      let canAdd = true;
      for (let recta of rectangles) {
        if (rectanglesIntersect(newRecta, recta)) {
          canAdd = false;
          break;
        }
      }
      if (canAdd) {
        rectangles.push(newRecta);
      }
    }
  }

  shuffle(rectangles, true);
  let colors = [...allColors, ...allColors];
  let i = 0;
  while (colors.length > 0) {
    if (rectangles[i].si > 1 && rectangles[i].sj > 1 && (rectangles[i].si + rectangles[i].sj) < 7) rectangles[i].insideCol = colors.pop();
    i++;
    if (i >= rectangles.length) break;
  }
}

function rectanglesIntersect(recta1, recta2) {
  return ((recta1.i <= recta2.i && recta1.i + recta1.si > recta2.i) || (recta2.i <= recta1.i && recta2.i + recta2.si > recta1.i)) && ((recta1.j <= recta2.j && recta1.j + recta1.sj > recta2.j) || (recta2.j <= recta1.j && recta2.j + recta2.sj > recta1.j));
}

function generateRectangle() {
  let si, sj;
  do {
    si = Math.floor(randInt(3, 10) / 2);
    sj = Math.floor(randInt(3, 10) / 2);
  } while ((si == 1 && sj == 1) || (si >= 4 && sj >= 4))
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

function drawRectangle(x0, y0, si, sj, insideCol) {
  if (insideCol) {
    fill(insideCol);
    rect(x0 + 2 * v, y0 + 2 * v, si - 3 * v, sj - 3 * v);
    if (Math.abs(si - sj) < 2 * u) {
      fill(random(allColors));
      if (si < sj) {
        rect(x0 + 3 * v, y0 + (sj - (si - 6 * v)) / 2, si - 5 * v, si - 5 * v);
      } else if (sj < si) {
        rect(x0 + (si - (sj - 6 * v)) / 2, y0 + 3 * v, sj - 5 * v, sj - 5 * v);
      }
    }
  }

  let prevCol1, prevCol2, newCol;
  for (let x = x0; x < x0 + si + v / 2; x += v) {
    do {
      newCol = random(palette);
    } while (newCol == prevCol1)
    if (Math.random() < 2 / 3) newCol = mainCol;
    fill(newCol);
    prevCol1 = newCol;
    rect(x, y0, v, v);

    do {
      newCol = random(palette);
    } while (newCol == prevCol2)
    if (Math.random() < 2 / 3) newCol = mainCol;
    fill(newCol);
    prevCol2 = newCol;
    rect(x, y0 + sj, v, v);
  }
}
