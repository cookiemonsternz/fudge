//**************************** NEAT ****************************//

// Make all NEAT-JavaScript components available in the global namespace
Object.assign(window, NEATJavaScript);

// Create a new instance of Config
const config = new Config({
    // Basic network structure
    inputSize: 4, // Number of input nodes (dist to other slime, dir to other slime, dist to mouse, dir to mouse)
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
    populationSize: 16, // Size of the population
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

let population = new Population(config);
//**************************** PHYS ****************************//
var Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Body = Matter.Body

var engine = Engine.create();

//**************************** SLIME ****************************//
class Slime {
    constructor(x, y, genome) {
        this.body = createSlimeBody(x, y);
        this.genome = genome;
        this.jumpTime = 0;
    }
}

function createSlimeBody(x, y) {
    var body = Bodies.circle(x, y, 60);
    Composite.add(engine.world, body);
    return body;
}

let slimes = []

console.log(slimes)



function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(144);

    var ground = Bodies.rectangle(width/2, height + 30, width, 60, { isStatic: true });
    var wall_left = Bodies.rectangle(-30, height/2, 60, height, { isStatic: true });
    var wall_right = Bodies.rectangle(width + 30, height/2, 60, height, { isStatic: true });
    var ceiling = Bodies.rectangle(width/2, -30, width, 60, { isStatic: true });
    Composite.add(engine.world, [ground, wall_left, wall_right, ceiling])

    population.genomes.forEach(genome => {
        genome.fitness = 0;
        slimes.push(new Slime(Math.random()*width, Math.random()*height, genome));
    });
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

var t = 0
let currentGen = 0;
function draw() {
    t += 1
    background(1);
    Engine.update(engine, 1000 / 90);

    var targetPos = createVector(sin(frameCount * 0.005)*300 + width / 2, cos(frameCount * 0.007)*100 + height / 2)
    fill(32, 128, 64);
    circle(targetPos.x, targetPos.y, 50.0);
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
        var outputs = genome.propagate([can_jump, mouse_dist / 1000.0, mouse_x_dir, mouse_y_dir])
        var doJump = outputs[0];
        var dir = outputs[1];

        if (doJump > 0 && slime.jumpTime > 60) {
            Body.applyForce(body, body.position, Vector.create(dir*0.25, -0.8));
            slime.jumpTime = 0;
        }

        circle(body.position.x, body.position.y, body.circleRadius * 2)

        var posY = body.position.y
        var posX = body.position.x
        var dist_to_wall = min(posX, width - posX, posY, height - posY);
        dist_to_wall = max(dist_to_wall, 1.0);

        genome.fitness -= 20.0 / dist_to_wall;
        genome.fitness += 15.0 / (mouse_dist+0.01);
        genome.fitness -= 10.0 / (nearest_dist+0.01);

        fill(255 / (genome.fitness* 0.01), 0, 0);
        circle(posX, posY, 12);
        fill(255, 255, 255);
        // console.log(genome.fitness)
    }

    var bodies = Composite.allBodies(engine.world);
    for (var i = 0; i < bodies.length; i++) {
        if (bodies[i].circleRadius == null) {
            beginShape(QUADS);
            for (var j = 0; j < bodies[i].vertices.length; j++) {
                vertex(bodies[i].vertices[j].x, bodies[i].vertices[j].y);
            }
            endShape();
        }
    }

    if (t > 1200) {
        const bestGenome = population.getBestGenome();

        console.log(`Generation ${currentGen}: Best fitness = ${bestGenome.fitness}`);
        population.evolve();

        for (let s of slimes) {
            Composite.remove(engine.world, s.body);
        }
        slimes = [];
        population.genomes.forEach(genome => {
                genome.fitness = 0; // reset fitness for the next evaluation
                slimes.push(new Slime(Math.random() * width, Math.random() * height, genome));
        });

        t = 0;
        currentGen += 1;
    }
}

// Source - https://stackoverflow.com/a/30832210
// Posted by Kanchu, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-07, License - CC BY-SA 3.0

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function saveGenome() {
    download(population.getBestGenome().toJSON(), "bestGenome.json", "json")
}

document.querySelector("#save").addEventListener("click", saveGenome);