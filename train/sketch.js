
//**************************** NEAT ****************************//
// Make all NEAT-JavaScript components available in the global namespace
Object.assign(window, NEATJavaScript);

// Create a new instance of Config
const config = new Config({
    // Basic network structure
    inputSize: 4, // Number of input nodes (dist to other slime, dir to other slime, dist to mouse, dir to mouse)
    outputSize: 2, // Number of output nodes (jump, dir)

    // Activation function (string-based selection)
    activationFunction: "Sigmoid", // Options: 'Sigmoid', 'NEATSigmoid', 'Tanh', 'ReLU', 'LeakyReLU', 'Gaussian'

    // Bias settings
    bias: 1.0, // Bias value
    connectBias: true, // When true, automatically connects the bias node to all output nodes during network construction
    biasMode: "WEIGHTED_NODE", // Bias implementation mode

    // Fitness function
    fitnessFunction: "XOR", // Default XOR fitness function

    // Weight initialization
    weightInitialization: {
        type: "Random",
        params: [-1, 1], // Min and max values for random weights
    },

    // Network topology parameters
    c1: 1.0, // Coefficient for excess genes
    c2: 1.0, // Coefficient for disjoint genes
    c3: 0.4, // Coefficient for weight differences
    compatibilityThreshold: 3.0, // Species compatibility threshold
    interspeciesMatingRate: 0.001, // Rate of interspecies mating

    // Mutation parameters
    mutationRate: 1.0, // Overall mutation rate
    weightMutationRate: 0.8, // Mutation rate for weights
    addConnectionMutationRate: 0.05, // Rate for adding new connections
    addNodeMutationRate: 0.03, // Rate for adding new nodes
    minWeight: -4.0, // Minimum allowed weight
    maxWeight: 4.0, // Maximum allowed weight
    reinitializeWeightRate: 0.1, // Rate to completely reinitialize weights
    minPerturb: -0.5, // Minimum perturbation value
    maxPerturb: 0.5, // Maximum perturbation value

    // Evolution parameters
    populationSize: 150, // Size of the population
    generations: 100, // Number of generations
    targetFitness: 0.95, // Target fitness to achieve
    survivalRate: 0.2, // Proportion that survives each generation
    numOfElite: 10, // Number of elite individuals to retain
    dropOffAge: 15, // Maximum age before dropping off
    populationStagnationLimit: 20, // Generations with no improvement before reset
    keepDisabledOnCrossOverRate: 0.75, // Probability of keeping connections disabled during crossover if they are disabled in either parent
    mutateOnlyProb: 0.25, // Probability for mutation-only

    // Recurrent network options
    allowRecurrentConnections: true, // Allow recurrent connections
    recurrentConnectionRate: 1.0, // Rate for recurrent connections
});

let population = new Population(config);
//**************************** PHYS ****************************//
var Engine = Matter.Engine,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite

var engine = Engine.create();

//**************************** SLIME ****************************//
class slime {
    constructor(x, y, genome) {
        this.x = x;
        this.y = y;
        this.body = createSlimeBody(x, y);
        this.genome = genome;
    }
}

function createSlimeBody(x, y) {
    var body = Bodies.circle(x, y, 10);
    Composite.add(engine.world, body);
    return body;
}

let slimes = []

console.log(slimes)



function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(144);

    var ground = Bodies.rectangle(width/2, height, width, 60, { isStatic: true });
    var wall_left = Bodies.rectangle(0, height/2, 60, height, { isStatic: true });
    var wall_right = Bodies.rectangle(width, height/2, 60, height, { isStatic: true });
    var ceiling = Bodies.rectangle(width/2, 0, width, 60, { isStatic: true });
    Composite.add(engine.world, [ground, wall_left, wall_right, ceiling])

    population.genomes.forEach(genome => {
    slimes.push(new slime(Math.random()*width, Math.random()*height, genome));
});
}

function draw() {
    background(1);
    Engine.update(engine, 1000 / 144);
    var bodies = Composite.allBodies(engine.world);

    for (var i = 0; i < bodies.length; i++) {
        if (bodies[i].circleRadius) {
            circle(bodies[i].position.x, bodies[i].position.y, bodies[i].circleRadius * 2);
        } else {
            beginShape(QUADS);
            for (var j = 0; j < bodies[i].vertices.length; j++) {
                vertex(bodies[i].vertices[j].x, bodies[i].vertices[j].y);
            }
            endShape();
        }
        
    }
}
