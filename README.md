# slime-site

Welcome to my amazingly epic site i made for fudge

its my first foray into evolutionary ai, using the NEAT algorithm. 

For this project I first set up the training, which works by spawing in a bunch of slimes (which are just matter.js rigidbodies) and scoring their 'fitness' after a few seconds. The slimes with the highest fitness are preserved while the others are brutally murdered, and then the surviving slimes are forced to repopulate up to the desired number of slimes, propogating their genetics, before the cycle continues. 

Once the training is complete, you can save a sample genome and chuck it into the actual game site, which is pretty much the same thing minus the fitness and evolution, and with a couple added features and art.