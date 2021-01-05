//some global variables
var seed,
  sides,
  r,
  recurrences = 0,
  mpVariance,
  angleVariance,
  magVariance,
  numDesiredPaintLayers,
  numPaintLayersDrawn,
  numDeformationLayers,
  vertices = [],
  ogPolygon = [],
  baseDeformedPolygon = [],
  tmp = [],
  m = 1,
  sd = 1,
  imageScale = 1,
  frameCount = 1, //set to 0 for gif creation, else set to 1
  img;

//seed = Math.round(Math.random() * Number.MAX_SAFE_INTEGER); //random seed
seed = 3693199348549950; //use this line for a specific seed

//edit this to increase the number of recursions
//on the deformation function
//numDeformationLayers = 3;

//choose a basic drawing mode, 0 for lines 1 for color fill
let drawingMode = 1;

function setup() {
  //frameRate(1)
  //createLoop({duration:10, gif:true})
  let myCanvas = createCanvas(imageScale * 1100, imageScale * 930);
  background(230,230,230);
  angleMode(DEGREES);
  myCanvas.parent("container");

  randomSeed(seed);

  sides = 360 / 10;
  r = imageScale * 160;

  // this generates a set of (x,y)
  // coordinates that define a 10 sided ellipse like polygon

  for (let a = 0; a <= 360; a += sides) {
    let x = r * sin(a + 18) + width / 2;
    let y = r * cos(a + 18) + height / 2;
    vert = [x, y];
    vertices.push(vert);
    ogPolygon.push(vert);
    //xCoords.push(x)
    //yCoords.push(y)
    //console.log(vert)
  }

  for (let i = 0; i < vertices.length; i++) {
    //ellipsePolygon.push(createVector(xCoords[i],yCoords[i]))
  }
}

function draw() {
  if (drawingMode == 0) {
    stroke(255);
    noFill();
  } else {
    fill(255, 40, 45, 2);
    noStroke();
  }

  for (let i = 1; i <= 3; i++) {
    numDeformationLayers = i;
    baseDeformedPolygon = deform(vertices);
    tmp = [...baseDeformedPolygon];

    for (let i = 0; i < 17; i++) {
      numDeformationLayers = 3;
      //let details = deform(baseDeformedPolygon);
      splotch(baseDeformedPolygon);
      vertices = [...tmp];
    }
  }

  // if (frameCount == 5) {
  //   clear();
  //   background(35);
  //   frameCount = 0;
  //   numDeformationLayers = 1;
  //   vertices = [];
  //   vertices = [...ogPolygon];
  // } //code block above only used for animated gif rendering

  noLoop();
  //loop();
}

function splotch(arg) {
  //this if/else is for making gifs of the deformation process
  if (frameCount == 0) {
    //base polygon before any deformations
    beginShape();
    arg.forEach((vert) => vertex(vert[0], vert[1]));
    endShape();
    //console.log(vertices);

    frameCount++;
  } else {
    center = createVector(width / 2, height / 2);

    let deformed = deform(arg);

    //recursively deformed polygon
    beginShape();
    deformed.forEach((vert) => vertex(vert[0], vert[1]));
    endShape();

    //draw red stuff
    //stroke(255, 0, 0);
    //strokeWeight(5);

    //these are exclusively used for making animated gif versions for documentation purposes
    // frameCount++;
    // numDeformationLayers++;
  }
}

//custom function to deform by add 'jutting' between polygon edges
function deform(arg, layers) {
  push();
  //stroke(255, 0, 0);
  //strokeWeight(3);

  //deep copy arg array
  arr = [];
  for (let i = 0; i < arg.length; i++) {
    arr.push(arg[i]);
  }

  for (let i = 0; i < arr.length - 1; i += 2) {
    //for fine tuning the randomness on polygon deformation
    mpVariance = 0; //randomGaussian(1, 10)
    angleVariance = 0; //randomGaussian(1, 10);
    magVariance = 1; //posRandomGaussian(20, 50);

    midpoint = calcMidpoint(arr[i], arr[i + 1]);
    midpoint.add(mpVariance); //this adds imperfection to the midpoint location
    //point(midpoint);

    //angleMode(RADIANS);

    base = createVector(0, 0);
    //drawArrow(base,midpoint,'red')

    vect = createVector(arr[i + 1][0] - arr[i][0], arr[i + 1][1] - arr[i][1]);
    vect.mult(random()); // / (numDeformationLayers - 1));
    //vect.setMag( vect.mag()*magVariance / (1 * numDeformationLayers)); //add imperfection to the mag of jut
    vect.rotate(90 + angleVariance); //add imperfection to the rotation of the jut
    vect.add(midpoint);

    //console.log(vect);
    //point(vect);

    jut = [vect.x, vect.y];
    //console.log(jut);
    arr.splice(i + 1, 0, jut);
    //i++;

    //drawArrow(base,vect,'blue')
  }

  pop();

  recurrences++;
  if (recurrences == numDeformationLayers) {
    recurrences = 0;
    return arr;
  } else {
    return deform(arr);
  }
}

//calculate the midpoint between two vertices in a 2d pixel plane
function calcMidpoint(v1, v2) {
  let midpoint = createVector(0, 0);
  midpoint.add(v1);
  midpoint.add(v2);
  return midpoint.div(vert.length);
}

//truncate random gaussian, making mean value more likely(?)
function posRandomGaussian(m, sd) {
  let s = randomGaussian(m, sd);
  if (s < 0) {
    s = 0;
  }
  return s;
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

let seedtext = document.getElementById("seed");
seedtext.innerHTML =
  `
<p>
  seed value: ` +
  seed +
  ` 
</p>
`;
