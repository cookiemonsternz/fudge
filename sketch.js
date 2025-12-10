var genome = `{
  "id": 1370,
  "nodeGenes": [
    {
      "id": 0,
      "type": "INPUT"
    },
    {
      "id": 1,
      "type": "INPUT"
    },
    {
      "id": 2,
      "type": "INPUT"
    },
    {
      "id": 3,
      "type": "INPUT"
    },
    {
      "id": 4,
      "type": "INPUT"
    },
    {
      "id": 5,
      "type": "INPUT"
    },
    {
      "id": 6,
      "type": "OUTPUT"
    },
    {
      "id": 7,
      "type": "OUTPUT"
    },
    {
      "id": 8,
      "type": "BIAS"
    },
    {
      "id": 9,
      "type": "HIDDEN"
    },
    {
      "id": 22,
      "type": "HIDDEN"
    }
  ],
  "connectionGenes": [
    {
      "innovationNumber": 0,
      "inNodeId": 0,
      "outNodeId": 6,
      "enabled": true,
      "weight": 4.539478174642101,
      "recurrent": false
    },
    {
      "innovationNumber": 1,
      "inNodeId": 0,
      "outNodeId": 7,
      "enabled": true,
      "weight": 2.935398511628484,
      "recurrent": false
    },
    {
      "innovationNumber": 2,
      "inNodeId": 1,
      "outNodeId": 6,
      "enabled": false,
      "weight": 4.638958917354696,
      "recurrent": false
    },
    {
      "innovationNumber": 3,
      "inNodeId": 1,
      "outNodeId": 7,
      "enabled": true,
      "weight": 0.19749067646321128,
      "recurrent": false
    },
    {
      "innovationNumber": 4,
      "inNodeId": 2,
      "outNodeId": 6,
      "enabled": true,
      "weight": -4.061751324961411,
      "recurrent": false
    },
    {
      "innovationNumber": 5,
      "inNodeId": 2,
      "outNodeId": 7,
      "enabled": true,
      "weight": -3.417532594548078,
      "recurrent": false
    },
    {
      "innovationNumber": 6,
      "inNodeId": 3,
      "outNodeId": 6,
      "enabled": true,
      "weight": 3.4369067999691256,
      "recurrent": false
    },
    {
      "innovationNumber": 7,
      "inNodeId": 3,
      "outNodeId": 7,
      "enabled": true,
      "weight": -0.8063877894037327,
      "recurrent": false
    },
    {
      "innovationNumber": 8,
      "inNodeId": 4,
      "outNodeId": 6,
      "enabled": true,
      "weight": 3.852016737843686,
      "recurrent": false
    },
    {
      "innovationNumber": 9,
      "inNodeId": 4,
      "outNodeId": 7,
      "enabled": true,
      "weight": 6.792661604924676,
      "recurrent": false
    },
    {
      "innovationNumber": 10,
      "inNodeId": 5,
      "outNodeId": 6,
      "enabled": true,
      "weight": -3.776143802804209,
      "recurrent": false
    },
    {
      "innovationNumber": 11,
      "inNodeId": 5,
      "outNodeId": 7,
      "enabled": true,
      "weight": 1.9361385232832533,
      "recurrent": false
    },
    {
      "innovationNumber": 12,
      "inNodeId": 8,
      "outNodeId": 6,
      "enabled": true,
      "weight": 2.5492526575767807,
      "recurrent": false
    },
    {
      "innovationNumber": 13,
      "inNodeId": 8,
      "outNodeId": 7,
      "enabled": false,
      "weight": 1.6395872242739018,
      "recurrent": false
    },
    {
      "innovationNumber": 14,
      "inNodeId": 1,
      "outNodeId": 9,
      "enabled": true,
      "weight": -2.1199478000630663,
      "recurrent": false
    },
    {
      "innovationNumber": 15,
      "inNodeId": 9,
      "outNodeId": 6,
      "enabled": true,
      "weight": -5.000578480893302,
      "recurrent": false
    },
    {
      "innovationNumber": 23,
      "inNodeId": 5,
      "outNodeId": 9,
      "enabled": true,
      "weight": 3.304622649142872,
      "recurrent": false
    },
    {
      "innovationNumber": 81,
      "inNodeId": 8,
      "outNodeId": 22,
      "enabled": true,
      "weight": 1.004560771588587,
      "recurrent": false
    },
    {
      "innovationNumber": 82,
      "inNodeId": 22,
      "outNodeId": 7,
      "enabled": true,
      "weight": 3.206619744462464,
      "recurrent": false
    }
  ],
  "fitness": 5.685707438310252,
  "populationId": 0
}`

var started = false

var slime_wings_down;
var slime_wings_up;
var fudge_img;
var bgimg;
//**************************** NEAT ****************************//

// Make all NEAT-JavaScript components available in the global namespace
Object.assign(window, NEATJavaScript);

// Create a new instance of Config
const config = new Config({
    // Basic network structure
    inputSize: 6, // Number of input nodes (dist to other slime, dir to other slime, dist to mouse, dir to mouse)
    outputSize: 2, // Number of output nodes (jump, dir)

    // Activation function (string-based selection)
    activationFunction: "Tanh", // Options: 'Sigmoid', 'NEATSigmoid', 'Tanh', 'ReLU', 'LeakyReLU', 'Gaussian'

    // Bias settings
    bias: 1.0, // Bias value
    connectBias: true, // When true, automatically connects the bias node to all output nodes during network construction
    biasMode: "WEIGHTED_NODE", // Bias implementation mode

    // Weight initialization
    weightInitialization: {
        type: "Random",
        params: [-5, 5], // Min and max values for random weights
    },

    // Network topology parameters
    c1: 0.9, // Coefficient for excess genes
    c2: 1.0, // Coefficient for disjoint genes
    c3: 0.4, // Coefficient for weight differences
    compatibilityThreshold: 3.0, // Species compatibility threshold
    interspeciesMatingRate: 0.001, // Rate of interspecies mating

    // Mutation parameters
    mutationRate: 1.0, // Overall mutation rate
    weightMutationRate: 0.9, // Mutation rate for weights
    addConnectionMutationRate: 0.15, // Rate for adding new connections
    addNodeMutationRate: 0.03, // Rate for adding new nodes
    minWeight: -15.0, // Minimum allowed weight
    maxWeight: 15.0, // Maximum allowed weight
    reinitializeWeightRate: 0.2, // Rate to completely reinitialize weights
    minPerturb: -0.7, // Minimum perturbation value
    maxPerturb: 0.7, // Maximum perturbation value

    // Evolution parameters
    populationSize: 150, // Size of the population
    generations: 5000, // Number of generations
    targetFitness: 250, // Target fitness to achieve
    survivalRate: 0.1, // Proportion that survives each generation
    numOfElite: 10, // Number of elite individuals to retain
    dropOffAge: 15, // Maximum age before dropping off
    populationStagnationLimit: 20, // Generations with no improvement before reset
    keepDisabledOnCrossOverRate: 0.75, // Probability of keeping connections disabled during crossover if they are disabled in either parent
    mutateOnlyProb: 0.25, // Probability for mutation-only

    // Recurrent network options
    allowRecurrentConnections: false, // Allow recurrent connections
    recurrentConnectionRate: 1.0, // Rate for recurrent connections
});

let population = []
//**************************** PHYS ****************************//
var Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Body = Matter.Body

var engine = Engine.create();

//**************************** SLIME ****************************//
class Slime {
    constructor(x, y) {
        this.body = createSlimeBody(x, y);
        this.genome = GenomeBuilder.loadGenome(genome, config);
        this.jumpTime = 0;
        this.flapped = 0;
    }
}

function createSlimeBody(x, y) {
    var body = Bodies.circle(x, y, 60);
    body.angle = Math.random() / 10 - 0.05
    Composite.add(engine.world, body);
    return body;
}

let slimes = []

console.log(slimes)


function isInArea(x, y) {
  if (x > mouseX - 56 && x < mouseX + 56 && y > mouseY - 56 && y < mouseY + 56) return true;
} 


function preload() {
  slime_wings_down = loadImage("wings_down.png");
  slime_wings_up = loadImage("wings_up.png");
  fudge_img = loadImage("fudge.png");
  bgimg = loadImage("background.png")
}

var canvasElement = document.querySelector("#canvas");

function setup() {
    createCanvas(windowWidth, windowHeight, canvasElement);
  
    frameRate(144);

    var ground = Bodies.rectangle(width/2, height + 30, width, 60, { isStatic: true });
    var wall_left = Bodies.rectangle(-30, height/2, 60, height, { isStatic: true });
    var wall_right = Bodies.rectangle(width + 30, height/2, 60, height, { isStatic: true });
    var ceiling = Bodies.rectangle(width/2, -30, width, 60, { isStatic: true });
    Composite.add(engine.world, [ground, wall_left, wall_right, ceiling])

    for (var i = 0; i < 12; i++) {
      slimes.push(new Slime(Math.random()*width, Math.random()*height));
    }
}

function getNearestSlime(position, selfBody = null) {
    var nearest = Vector.create(Infinity, Infinity);
    var nearest_dis = Infinity;
    for (var slime of slimes) {
        var slimePos = slime.body.position
        var offset = Vector.sub(position, slimePos);
        var dist = Vector.magnitude(offset);
        if (selfBody && slime.body === selfBody) continue;
        if (dist < nearest_dis) {
            nearest_dis = dist;
            nearest = slimePos;
        }
    }
    return nearest;
}

var speed = 200;
var t = 0
let currentGen = 0;
function draw() {
    t += 1
    image(bgimg, 0, 0, width, height)
    Engine.update(engine, 1000 / frameRate() * (speed / 144));

    var targetPos = createVector(mouseX, mouseY)
    fill(32, 128, 64);
    image(fudge_img, targetPos.x - 24, targetPos.y - 24, 48, 48);
    fill(255, 255, 255);
    
    for (var slime of slimes) {
        slime.jumpTime++;

        var body = slime.body;
        var genome = slime.genome;
        var nearest_pos = getNearestSlime(body.position, body);
        var nearest_dist = Vector.magnitude(Vector.sub(body.position, nearest_pos));
        var nearest_direction = (body.position.x - nearest_pos.x > 0.0) ? 1.0 : -1.0;
        var mouse_dist = createVector(body.position.x, body.position.y).dist(targetPos)
        var mouse_x_dir = (body.position.x < targetPos.x) ? 1.0 : -1.0;
        var mouse_y_dir = (body.position.y < targetPos.y) ? 1.0 : -1.0;
        var can_jump = (slime.jumpTime > 60) ? 1.0 : 0.0
        var outputs = genome.propagate([nearest_dist / 100.0, nearest_direction, can_jump, mouse_dist / 1000.0, mouse_x_dir, mouse_y_dir])
        var doJump = outputs[0];
        var dir = outputs[1];

        // circle(body.position.x, body.position.y, body.circleRadius * 2)

        if (doJump > 0 && slime.jumpTime > 60) {
            Body.applyForce(body, body.position, Vector.create(dir*0.25, -0.8));
            Body.setAngularVelocity(body, body.angle > 0 ? -0.02 : 0.02)
            slime.jumpTime = 0;
            slime.flapped = 32;
        }

        // console.log(body.angle)
        push()
        translate(body.position.x, body.position.y);
        rotate(body.angle);
        if (slime.flapped > 0 && slime.flapped < 20) {
          image(slime_wings_down, -64, -64, 128, 128)
        } else {
          image(slime_wings_up, -64, -64, 128, 128)
        }
        pop()
        slime.flapped--;
        
        if (isInArea(body.position.x, body.position.y) && started) {
          console.log("LOSS")
          started = false
          speed = 144
          document.querySelector(".loss-screen").style.display = "block";
        }
    }

    // var bodies = Composite.allBodies(engine.world);
    // for (var i = 0; i < bodies.length; i++) {
    //     if (bodies[i].circleRadius == null) {
    //         beginShape(QUADS);
    //         for (var j = 0; j < bodies[i].vertices.length; j++) {
    //             vertex(bodies[i].vertices[j].x, bodies[i].vertices[j].y);
    //         }
    //         endShape();
    //     }
    // }
}

function start() {
  started = true
  document.querySelector(".content").style.display = 'none';
  speed = 90;
}

function harder() {
  for (var i = 0; i < 8; i++) {
    slimes.push(new Slime(Math.random()*width, Math.random()*height));
  }
}

function retry() {
  document.querySelector(".loss-screen").style.display = 'none';
  speed = 90;
  started = true;
}

document.querySelector("#start-button").addEventListener('click', start)
document.querySelector("#harder-button").addEventListener('click', harder)
document.querySelector("#retry-button").addEventListener('click', retry)
