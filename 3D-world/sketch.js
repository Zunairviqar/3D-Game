// variable to hold a reference to our A-Frame world
let world, sky;

// array to hold some particles
let particles = [];
let trees  = [];
let boxes = [];
let cx, cy, cz, total;

// to handle multiple dynamic textures we can use a series of separate variables to hold
// a few off screen graphics buffers created using the 'createGraphics' function in p5
let buffer1;

// we will also need three variables to hold the dynamic textures that will be created using
let texture1;

// 3d models
let cat, dog, ball;

// objects
let playBall, c, drawing;

// sounds
let click;

// robot
let robHead, robHead2, robBody, robContain, rx=0.05, rz=0.05;

// load sounds
function preload() {
	bgSound = loadSound("sounds/bg.mp3");
	click = loadSound("sounds/click.mp3");
}

function setup() {
	// no canvas needed
	noCanvas();
	// bgSound.play();
	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	// add sky
	sky = new Sky({
		asset: 'sky'
	});
	world.add(sky);
	bgSound.setVolume(0.3);


	// set a background color for our world
	world.setBackground(192, 133, 201);

	// create a plane to serve as our "ground"
	let g = new Plane({
		x:0, y:0, z:0,
		width:1000, height:1000,
		red:255, green:212, blue:133,
		rotationX:-90});

	// add the plane to our world
	world.add(g);

	// add trees
	for (let i = 0; i < 100; i++) {
		trees.push(new Tree(random(-50, 50), random(-50, 50), random(1.5, 2.3)));
	}

	// add bricks
	for (let j = 0; j < 10; j++ ){
		total = random(1, 7)
		cx = random(-20, 20);
		cy = 0.15;
		cz = random(-20, 20);
		for (let i = 0; i < total; i++) {
			// first layer of boxes
			boxes.push(new Cube(cx, cy, cz));
			// second layer
			if (total >= 2 && i < total-1){
				boxes.push(new Cube(cx+0.3, cy+0.3, cz))
			}
			// third layer
			if (total >= 3 && i < total-2){
				boxes.push(new Cube(cx+0.6, cy+0.6, cz))
			}
			// fourth layer
			if (total >= 4 && i < total-3){
				boxes.push(new Cube(cx+0.9, cy+0.9, cz))
			}
			cx += 0.7;
		}
	}
	// c = new Cube(10,10,1);
	playBall = new Ball(6,0.2,-3);

	// dog model
	dog = new GLTF({
		asset: 'dog',
		x: 10,
		y: 1,
		z: -5
	});
	world.add(dog);

	// cat model
	cat = new GLTF({
		asset: 'cat',
		x: 15,
		y: 0,
		z: -5,
		scaleX:0.02,
		scaleY:0.02,
		scaleZ:0.02
	});
	world.add(cat);

	// maze model
	maze = new GLTF({
		asset: 'maze',
		x: 100,
		y: -5,
		z: -100,
		red: 50,
		green: 50,
		blue: 0,
		scaleX:1,
		scaleY:1,
		scaleZ:1,
		// clickFunction: function(m) {
		// 	world.slideToObject( m );
		// }
	});
	world.add(maze);

// prison model
	prison = new GLTF({
		asset: 'prison',
		x: -30,
		y: 0.1,
		z: -35,
		// rotationX:0,
		rotationY:90,
		scaleX:0.1,
		scaleY:0.1,
		scaleZ:0.1,
		// clickFunction: function(p) {
		// 	world.slideToObject( p );
		// }
	});
	world.add(prison);

	// create our three off screen graphics buffers, making sure that each is set up with dimensions
	// that are a power of 2
	buffer1 = createGraphics(512, 512);

	// set up these graphics buffers as dynamic textures
	texture1 = world.createDynamicTextureFromCreateGraphics( buffer1 );

	// drawing primitive
	drawing = new Box({
		x:25, y:3, z:-25,
		width:4, height: 3, depth: 0.1,
		asset: texture1,
		red: 220, green: 225, blue: 220,
		dynamicTexture: true,
		dynamicTextureWidth: 512,
		dynamicTextureHeight: 512,
		clickFunction:  function(entity, intersectionInfo) {
			buffer1.fill(random(255), random(255), random(255));
		},
		overFunction: function(entity, intersectionInfo) {
			if (mouseIsPressed) {
				buffer1.ellipse( intersectionInfo.point2d.x, intersectionInfo.point2d.y, 12, 12);
			}
		}
	});
	world.add(drawing);

	robContain = new Container3D({x:-15, y:0, z:-5});

	// robot head primitive
	robHead = new Dodecahedron({
		x:-0.25, y:1.2, z:0,
		radius: 0.25,
		red: 0, green: 225, blue: 0
	});

	// robot head primitive
	robHead2 = new Dodecahedron({
		x:0.25, y:1.2, z:0,
		radius: 0.25,
		red: 0, green: 225, blue: 0
	});

	// robot body primitive
	robBody = new Box({
		x:0, y:0.5, z:0,
		width:1, height: 1, depth: 1,
		red: 0, green: 0, blue: 220
	});

	// add robot to world
	world.add(robContain);
	robContain.addChild(robHead);
	robContain.addChild(robHead2);
	robContain.addChild(robBody);

	// write text on drawing
	var drawtext = new Text({
		text: 'Draw On Me!',
		red: 128, green: 0, blue: 0,
		side: 'double',
		x: 25, y: 5, z: -25,
		scaleX: 15, scaleY: 15, scaleZ: 15
	});
	world.add(drawtext);

	// text on maze
	var mazetext = new Text({
		text: 'MAZE IN CONSTRUCTION!',
		red: 128, green: 128, blue: 0,
		side: 'double',
		x: 100, y: 10, z: -60,
		scaleX: 105, scaleY: 105, scaleZ: 105
	});
	world.add(mazetext);
}

function draw() {

	// robContain.spinY(1);

	// move our robot in x and z direction
	robContain.nudge(rx, 0, rz);

	// every 1000 frames change its x direction and spin it
	if (frameCount%1000 == 0) {
		rx *= -1;
		robContain.spinY(30);
	}
	// every 599 frames change its z direction and spin it
	else if (frameCount%599 == 0) {
		rz *= -1;
		robContain.spinY(30);
	}


	// always create a new rain particle
	var temp = new Particle(random(-20, 20), 15, random(-20,20));

	particles.push( temp );

	// draw all rain
	for (var i = 0; i < particles.length; i++) {
		var result = particles[i].move();
		if (result == "gone") {
			particles.splice(i, 1);
			i-=1;
		}
	}
}

// tree class
class Tree {
	constructor(x, z, h) {

		// create a "container" object
		this.container = new Container3D({
			x:x, y:h, z:z,
		});
		// add the container to the world
		world.add(this.container);

		// tree stem
		this.stem = new Cylinder({
			x: 0, y:-h/2, z:0,
			height: h,
			radius: 0.18,
			red: 150, green:98, blue:72
		});

		// tree leaves
		this.leaves = new Cone({
			x: 0, y:0, z:0,
			height:random(1, 1.8),
			radiusBottom: 0.6, radiusTop: 0.01,
			red: random(20, 40), green:random(120, 140), blue:0
		});

		// add stem and leaves to container
		this.container.addChild(this.stem);
		this.container.addChild(this.leaves);
	}
}

// Brick class
class Cube {
	constructor(x,y,z) {

		// new brick
		this.box = new Box({
			x:x, y:y, z:z,
			width:0.7, height: 0.3, depth: 0.3,
			// iron asset
			asset: 'iron',
			red:255, green:217, blue:179,
			// change color upon clicking and slide to brick
			clickFunction: function(theBox) {
				// console.log("TOUCHED bOX")
				theBox.setColor( random(255), random(255), random(255) );
				world.slideToObject( theBox, 1000 );
				click.play();
			}
		});

		world.add(this.box);
	}
}

// ball to be played with
class Ball {
	constructor (x, y, z) {
	// box primitive
		this.ball = new Sphere({
			x:x, y:y, z:z,
			radius: 0.2,
			red:255, green:0, blue:0
		});

		world.add(this.ball);
	}
}

// class to describe a rain particle's behavior
class Particle {

	constructor(x,y,z) {

		// construct a new Box that lives at this position
		this.myBox = new Cone({
			x:x, y:y, z:z,
			red: 179, green: 224, blue: 255,
			height: 0.3,
			radiusBottom: 0.03, radiusTop: 0.001
		});

		// add the box to the world
		world.add(this.myBox);

		// keep track of an offset in Perlin noise space
		this.xOffset = random(1000);
		this.zOffset = random(2000, 3000);
	}

	// function to move our box
	move() {
		// compute how the particle should move
		// the particle should always move up by a small amount
		var yMovement = -0.15;

		// the particle should randomly move in the x & z directions
		var xMovement = map( noise(this.xOffset), 0, 1, -0.01, 0.01);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.01, 0.01);

		// update our poistions in perlin noise space
		this.xOffset += 0.01;
		this.yOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.myBox.nudge(xMovement, yMovement, zMovement);

		// make the boxes shrink a little bit
		var boxScale = this.myBox.getScale();
		this.myBox.setScale( boxScale.x, boxScale.y, boxScale.z);

		// if we get too small we need to indicate that this box is now no longer viable
		if (boxScale.x <= 0) {
			// remove the box from the world
			world.remove(this.myBox);

			return "gone";
		}
		else {
			return "ok";
		}
	}
}

// play sound
function keyPressed(){
	if(!bgSound.isPlaying())
	bgSound.loop();
}
