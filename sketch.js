
let carX, carZ;
let car;
let moveSpeed;
let world;
let truck, fuelbox;

let trees = [];
let boxes = [];
let cx, cy, cz, total;

let pins = [];

let pump;

let field;

let lights = [];

let road1, road2, road3;

let reset = false;

let bowling;

let fuel;

let particles = [];

// user position & velocity
const accel = 0.01;
let position, velocity;

// friction
const frictionMag = 0.005;
let friction;

function setup() {
	// no canvas needed
	noCanvas();

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	// set a background color for the world using RGB values
	world.setBackground(192, 133, 201);
	// put the user up above the world
	world.setUserPosition(0,7,8);
	//
	// turn off WASD
	world.camera.cameraEl.removeAttribute('wasd-controls')

	// turn off the user's ability to freely rotate the camera
	// world.camera.cameraEl.removeAttribute('look-controls')

	// rotate the camera down at an angle
	world.camera.holder.object3D.rotation.set(radians(-15), 0, 0);

	fuel = 100;

	// add sky
	sky = new Sky({
		asset: 'sky'
	});
	world.add(sky);
	// bgSound.setVolume(0.3);

	// Grass field Model
	field = new GLTF({
		asset: 'field',
		x: 0,
		y: -0.6,
		z: 0,
		scaleX:2,
		scaleY:2,
		scaleZ:2
	});

	// add trees
	for (let i = 0; i < 40; i++) {
		trees.push(new Tree(random(10, 50), random(-40, 50), random(2.5, 3.3)));
		trees.push(new Tree(random(-50, -10), random(-40, 50), random(2.5, 3.3)));
	}

	placebowling();
	placefuel();
	placebrick();
	placelamps();
	placecar();
	// placeRoadBlocks();
	playground();
	placeroad();
	placefence();

  // Adding a random cylinder to make it solid

  let grey = random(75,225);
  let xyz = new Box({
    x: 0,
    y: 2,
    z: -10,
    height: 4,
    red: grey, green: grey, blue: grey
  });

  // important -- set a property on the box to tell the system that this is
  // an entity that we can collide with!
  xyz.tag.object3D.userData.solid = true;

  // add the box to the world
  world.add(xyz);

  // set up vectors to hold the user's position & accelration
  position = createVector(0, -5);
  velocity = createVector(0, 0);
}

function draw() {

	world.camera.holder.object3D.rotation.set(radians(-25), 0, 0);
	// always create a new rain particle
	var temp = new Particle(random(-20, 20), 15, random(-80,10));

	particles.push( temp );

	// draw all rain
	for (var i = 0; i < particles.length; i++) {
		var result = particles[i].move();
		if (result == "gone") {
			particles.splice(i, 1);
			i-=1;
		}
	}

	if (frameCount % 1000 == 0 && fuelbox.getWidth() > 0.08){
		fuelbox.setWidth(fuelbox.getWidth()-0.09);
	}
	if (fuelbox.getWidth() > 0) {
		carMovement();
	}
}

function placefence (){
	// gate Model
	let gate = new GLTF({
		asset: 'gate',
		x: -5,y: 0,z:-55,
		scaleX:2,scaleY:2,scaleZ:2,
		rotationY:90
	});
	world.add(gate);

	// fence Model
	let cx = -25;
	for (let i = 0; i < 3; i++){
		let fence = new GLTF({
			asset: 'fence',
			x: cx,y: 0,z:-55,
			scaleX:2,scaleY:2,scaleZ:2,
			rotationY:70
		});
		world.add(fence);
		cx -= 10;
	}
}

function playground() {
	// create a plane to serve as our "ground"
	let g = new Plane({
		x:0, y:0.2, z:-75,
		width:100, height:40,
		red:64, green:128, blue:0,
		rotationX:-90});

	// add the plane to our world
	world.add(g);
}

function placeroad (){
	// Road Model
	road1 = new GLTF({
		asset: 'road',
		x: 0,
		y: 0,
		z:10,
		scaleX:0.015,
		scaleY:0.015,
		scaleZ:0.015
		// rotationX:radians(80)
	});
	// Road Model
	road2 = new GLTF({
		asset: 'road',
		x: 0,
		y: 0,
		z:-35,
		scaleX:0.015,
		scaleY:0.015,
		scaleZ:0.015
		// rotationX:radians(80)
	});

	world.add(road1);
	world.add(road2);
}

function placeRoadBlocks(){
	let rblock = new GLTF({
		asset: 'rblock',
		x: 1,y: 1.5,z:-15,
		scaleX:2, scaleY:2,scaleZ:2,
		rotationY:-47
	});
	console.log("road blokkk")
	world.add(rblock)
}

function carMovement () {
  if (keyIsDown(65)) {
    //world.camera.nudgePosition(-moveSpeed, 0, 0);
    velocity.add(-accel, 0);
  }
  if (keyIsDown(68)) {
    //world.camera.nudgePosition(moveSpeed, 0, 0);
    velocity.add(accel, 0);
  }

  if (keyIsDown(87)) {
    //world.camera.nudgePosition(0, 0, -moveSpeed);
    velocity.add(0, -accel);
  }
  if (keyIsDown(83)) {
    //world.camera.nudgePosition(0, 0, moveSpeed);
    velocity.add(0, accel);
  }

  // apply friction
  friction = velocity.copy();
  friction.mult(-1);
  friction.normalize();
  friction.mult(frictionMag);
  velocity.add(friction);

  // add velocity to avatar
  position.add(velocity);

  // speed limits
  if (velocity.mag() > 1) {
    velocity.setMag(1);
  }
  if (velocity.mag() < 0.005) {
    velocity.setMag(0);
  }
  moveSpeed = map(velocity.y,-1,1,0.6,-0.6)

	// car movement
	if(truck.rotationY<0){
		rotationY = truck.rotationY%360 + 360;
	}
	else{
		rotationY = truck.rotationY%360;
	}
	if(rotationY<=90 && rotationY>=0){
		moveX = map(rotationY, 0, 90, moveSpeed, 0)
		truck.nudge(0,0,moveX-moveSpeed);
		fuelbox.nudge(0,0,moveX-moveSpeed)
		truck.nudge(moveX,0,0);
		fuelbox.nudge(moveX,0,0);
		// world.camera.nudgePosition((moveX*2), 0, (moveX-moveSpeed)*2);
    world.setUserPosition(truck.x, 7, truck.z+10);
	}
	else if((rotationY<=180 && rotationY>90)){
		moveX = map(rotationY, 90, 180, 0, moveSpeed)
		truck.nudge(0,0,moveX-moveSpeed);
		fuelbox.nudge(0,0,moveX-moveSpeed);
		truck.nudge(-moveX,0,0);
		fuelbox.nudge(-moveX,0,0);
		// world.camera.nudgePosition((-moveX*2), 0, (moveX-moveSpeed)*2);
    world.setUserPosition(truck.x, 7, truck.z+10);
	}
	else if((rotationY<=270 && rotationY>180)){
		moveX = map(rotationY, 270, 180, 0, moveSpeed)
		truck.nudge(0,0,-(moveX-moveSpeed));
		fuelbox.nudge(0,0,-(moveX-moveSpeed));
		truck.nudge(-moveX,0,0);
		fuelbox.nudge(-moveX,0,0);
		// world.camera.nudgePosition((-moveX*2), 0, -(moveX-moveSpeed)*2);
    world.setUserPosition(truck.x, 7, truck.z+10);
	}
	else if((rotationY<=360 && rotationY>270)){
		moveX = map(rotationY, 270, 360, 0, moveSpeed)
		truck.nudge(0,0,-(moveX-moveSpeed));
		fuelbox.nudge(0,0,-(moveX-moveSpeed));
		truck.nudge(moveX,0,0);
		fuelbox.nudge(moveX,0,0);
		// world.camera.nudgePosition((moveX*2), 0, -(moveX-moveSpeed)*2);
    world.setUserPosition(truck.x, 7, truck.z+10);
	}

	if (keyIsDown(68)){
		truck.spinY(-2);
		fuelbox.spinY(-2);
	}
	if (keyIsDown(65)){
		truck.spinY(2);
		fuelbox.spinY(2);
	}
}

function placecar() {
	carX = 0;
	carZ = 0;
	moveSpeed = 0.3;

	// Truck Model
	truck = new GLTF({
		asset: 'truck',
		x: carX,
		y: 0.5,
		z:carZ,
		scaleX:0.005,
		scaleY:0.005,
		scaleZ:0.005,
		rotationY:90
	});
	// Fuel bar
	fuelbox = new Box({
		x:carX, y:2, z:carZ,
		width:0.9, height: 0.1, depth: 0.05,
		red:255, green:0, blue:0,
	});

	world.add(fuelbox);

	// Making the truck collidable with other objects
	truck.tag.setAttribute('static-Body', "shape: box; mass: 100");
	world.add(truck);
}

function placelamps() {
	// Street Light Model
	cz = 20
	let light;
	for (let i = 0; i < 8; i++){
		light = new GLTF({
			asset: 'light',
			x: 6,
			y: -0.4,
			z: cz,
			scaleX:0.003,
			scaleY:0.003,
			scaleZ:0.003
		})
		world.add(light)
		lights.push(light)
		light = new GLTF({
			asset: 'light',
			x: -6,
			y: -0.4,
			z: cz,
			scaleX:0.003,
			scaleY:0.003,
			scaleZ:0.003,
			rotationY:-90
		})
		world.add(light)
		lights.push(light)
		cz -= 10
	}
}

function placebrick () {
	// add bricks
	for (let j = 0; j < 10; j++ ){
		total = random(1, 7)
		cx = random(-30, 30);
		cy = 0;
		cz = random(-50, -85);
		for (let i = 0; i < total; i++) {
			// first layer of boxes
			boxes.push(new Cube(cx, cy, cz));
			// second layer
			if (total >= 2 && i < total-1){
				boxes.push(new Cube(cx+0.5, cy+0.5, cz))
			}
			cx += 0.9;
		}
	}

	cy = 0.25;
	cz = -80;
	for (let i = 0; i < 7; i++) {
		cx = 15;
		for (let i = 0; i < 5; i++) {
			// first layer of boxes
			boxes.push(new Cube(cx, cy, cz));
			cx+=0.9
		}
		cy += 0.5
	}

	cy = 0.25;
	cx = -15;
	for (let i = 0; i < 6; i++) {
		cz = -70;
		for (let i = 0; i < 6; i++) {
			// first layer of boxes
			boxes.push(new Cube(cx, cy, cz));
			cz+=0.9
		}
		cy += 0.5
	}
}

function placebowling () {
	// add bowling pins
	let cx = -22
	let cz = -80
	pins.push(new BowlingPins(cx,cz));
	pins.push(new BowlingPins(cx-0.5,cz-0.5));
	pins.push(new BowlingPins(cx-0.5,cz+0.5));
	pins.push(new BowlingPins(cx-1.0,cz-1.0));
	pins.push(new BowlingPins(cx-1.0,cz+0.0));
	pins.push(new BowlingPins(cx-1.0,cz+1.0));
	pins.push(new BowlingPins(cx-1.5,cz-1.5));
	pins.push(new BowlingPins(cx-1.5,cz-0.5));
	pins.push(new BowlingPins(cx-1.5,cz+0.5));
	pins.push(new BowlingPins(cx-1.5,cz+1.5));

	// Bowling ball Model
	ball = new GLTF({
		asset: 'ball',
		x: cx+9,
		y: 1,
		z: cz,
		scaleX:0.8,
		scaleY:0.8,
		scaleZ:0.8
		// rotationY:30
	});

	ball.tag.setAttribute('dynamic-Body', "shape: sphere; radius:15; mass: 50");
  // bowling.tag.setAttribute('dynamic-Body', "shape: cylinder; radiusTop: 0.05; radiusBottom: 0.05; cylinderAxis: y; mass: 25");

	world.add(ball);
}

function placefuel () {
	// Pump Model
	pump = new GLTF({
		asset: 'pump',
		x: 6,
		y: 0.5,
		z:-25,
		scaleX:0.04,
		scaleY:0.04,
		scaleZ:0.04,
		rotationY:-90
	});
	// fuel park boundaries
	let parking = new Plane ({
		x:4, y:0.3, z:-24.9,
		width:2.8, height:2.5,
		red:255, green:153, blue:153,
		rotationX:-90
	});
	// Fuel button
	let fuelbutton = new Cylinder ({
		x: 6, y:4.5, z:-24.2,
		height: 0.03,
		radius: 0.2,
		red: 0, green:255, blue:0,
		rotationX: 90,
		enterFunction: function(theBox) {
			// make the cube change color
			theBox.setColor(0, 153, 51);
		},
		leaveFunction: function(theBox) {
			// make the cube original color
			theBox.setColor(0, 255, 0);
		},
		clickFunction:  function(entity) {
			console.log(truck.x, truck.z)
			if (truck.x >= 3.75 &&
				truck.x <= 4.60 &&
				truck.z <= -23.8 &&
				truck.z >= -25.25) {

					fuelbox.setWidth(0.9);
			}

		},
	})

	// fuel text
	let fueltext = new Text({
		text: 'FILL',
		red: 0, green: 51, blue: 0,
		side: 'double',
		x: 6, y: 4.5, z: -24.16,
		scaleX: 4, scaleY: 4, scaleZ: 4
	});

	world.add(fueltext);
	world.add(fuelbutton);
	world.add(parking);
	world.add(pump);

}

function keyPressed(){
	if (keyCode == 66){
		reset = true
		// for (let i = 0; i < boxes.length; i++){
			console.log("currX " + boxes[0].box.x)
			boxes[0].box.x = boxes[0].px;
			console.log("newX " + boxes[0].box.x)
			boxes[0].box.y = boxes[0].py;
			console.log("newy " + boxes[0].box.x)
			boxes[0].box.z = boxes[0].pz;
			console.log("newz " + boxes[0].box.x)
	}
}

// Brick class
class Cube {
	constructor(x,y,z) {
		// new brick
		this.box = new Box({

			x:x, y:y, z:z,
			width:0.9, height: 0.5, depth: 0.5,
			// iron asset
			asset: 'iron',
			red:255, green:217, blue:179,
			// change color upon clicking and slide to brick
			clickFunction: function(theBox) {
				// console.log("TOUCHED bOX")
				theBox.setColor( random(255), random(255), random(255) );
				// world.slideToObject( theBox, 1000 );
				// click.play();
			}
		});
		this.px = x;
		this.py = y;
		this.pz = z;

		this.box.tag.setAttribute('dynamic-Body', "linearDamping: 0.5; mass: 10");
		world.add(this.box);
	}

}

class BowlingPins {
	constructor(x,z) {
		// bowling pins Model
		bowling = new GLTF({
			asset: 'bowling',
			x: x,
			y: 1,
			z:z,
			scaleX:0.0015,
			scaleY:0.0015,
			scaleZ:0.0015
			// rotationY:30
		});
    bowling.tag.setAttribute('dynamic-Body', "shape: cylinder; radiusTop: 0.05; radiusBottom: 0.05; cylinderAxis: y; mass: 25");
		world.add(bowling);
		}
}

// tree class
class Tree {
	constructor(x, z, h) {

		// tree stem
		this.stem = new Cylinder({
			x: x, y:h/2, z:z,
			height: h,
			radius: 0.5,
			red: 150, green:98, blue:72
		});

		// tree leaves
		this.leaves = new Cone({
			x: x, y:h, z:z,
			height:random(2.3, 4),
			radiusBottom: 1.4, radiusTop: 0.01,
			red: random(20, 40), green:random(120, 140), blue:0
		});

		// add stem and leaves to container
		// this.stem.tag.setAttribute('dynamic-Body');
		// this.leaves.tag.setAttribute('dynamic-Body');
		world.add(this.stem);
		world.add(this.leaves);
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
