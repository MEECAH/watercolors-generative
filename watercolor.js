//some global variables
var sides, r, recurrences;
var vertices = [];
var m = 1;
var sd = 1;
var imageScale = 1;
var seed = Math.round(Math.random()*Number.MAX_SAFE_INTEGER)

let seedtext = document.getElementById("seed")
seedtext.innerHTML = `
<p>
seed value: `+seed+` 
</p>
`

//edit this to increase the number of recursions
//on the deformation function
var numDeformationLayers = 1;

function setup() {
  //frameRate(1)
  let myCanvas = createCanvas(imageScale * 1100, imageScale * 990);
  background(35);
  angleMode(DEGREES);
  myCanvas.parent("container");

  randomSeed(seed)

  sides = 360 / 10;
  r = imageScale * 280;

  // this generates a set of (x,y)
  // coordinates that define a 10 sided ellipse like polygon

  for (let a = 0; a <= 360; a += sides) {
    let x = r * sin(a + 18) + width / 2;
    let y = r * cos(a + 18) + height / 2;
    vert = [x, y];
    vertices.push(vert);
    //xCoords.push(x)
    //yCoords.push(y)
    //console.log(vert)
  }

  for (let i = 0; i < vertices.length; i++) {
    //ellipsePolygon.push(createVector(xCoords[i],yCoords[i]))
  }
}

function draw() {
  //fill(237, 34, 93);
  //noStroke();

  //draw white stuff
  stroke(255);
  noFill();

  beginShape();
  vertices.forEach((vert) => vertex(vert[0], vert[1]));
  endShape();
  //console.log(vertices);

  center = createVector(width / 2, height / 2);

  recurrences = 0;
  let deformed = deform(vertices);

  beginShape();
  deformed.forEach((vert) => vertex(vert[0], vert[1]));
  endShape();

  //draw red stuff
  stroke(255, 0, 0);
  strokeWeight(5);

  noLoop();
}

//custom function to deform by add 'jutting' between polygon edges
function deform(vertices) {
  push();
  stroke(255, 0, 0);
  strokeWeight(3);

  for (let i = 0; i < vertices.length - 1; i += 2) {
    midpoint = calcMidpoint(vertices[i], vertices[i + 1]);
    midpoint.add(randomGaussian(1, 40)); //this adds imperfection to the midpoint location
    point(midpoint);

    angleMode(RADIANS);

    base = createVector(0, 0);
    //drawArrow(base,midpoint,'red')

    vect = createVector(
      vertices[i + 1][0] - vertices[i][0],
      vertices[i + 1][1] - vertices[i][1]
    );
    //vect.mult(Math.random()); // / (numDeformationLayers - 1));
    vect.setMag(vect.mag() / (1 * numDeformationLayers));
    vect.rotate(PI / 2);
    vect.add(midpoint);

    //console.log(vect);
    //point(vect);

    jut = [vect.x, vect.y];
    //console.log(jut);
    vertices.splice(i + 1, 0, jut);
    //i++;

    //drawArrow(base,vect,'blue')
  }

  pop();

  recurrences++;
  if (recurrences == numDeformationLayers) {
    return vertices;
  } else {
    return deform(vertices);
  }
}

//calculate the midpoint between two vertices in a 2d pixel plane
function calcMidpoint(v1, v2) {
  let midpoint = createVector(0, 0);
  midpoint.add(v1);
  midpoint.add(v2);
  return midpoint.div(vert.length);
}

// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}