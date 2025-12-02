var Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite

var engine = Engine.create();

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

Composite.add(engine.world, [boxA, boxB, ground]);

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(144);
}

function draw() {
  background(1);
  Engine.update(engine, 1000 / frameRate());
  var bodies = Composite.allBodies(engine.world);

  for (var i = 0; i < bodies.length; i++) {
    var vertices = bodies[i].vertices;

    beginShape(QUADS)
    for (var j = 0; j < vertices.length; j++) {
      vertex(vertices[j].x, vertices[j].y);
    }
    endShape();
  }
}
