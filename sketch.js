
let carX, carZ;
let car;
let moveSpeed;
let world;
let truck;

let trees = [];
let boxes = [];
let cx, cy, cz, total;

let pins = [];

let pump;

let field;

let road1, road2, road3;

let accel;

let reset = false;

let bowling;

let fuel;

function setup() {
	// no canvas needed
	noCanvas();

	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	// set a background color for the world using RGB values
	world.setBackground(173, 216, 230);

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
	// Road Model
	road3 = new GLTF({
		asset: 'road',
		x: 0,
		y: 0,
		z:-80,
		scaleX:0.015,
		scaleY:0.015,
		scaleZ:0.015
		// rotationX:radians(80)
	});

	// road.tag.setAttribute('dynamic-Body');
	world.add(road1);
	world.add(road2);
	world.add(road3);

	carX = 0;
	carZ = 0;
	moveSpeed = 0.15;

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

	// Making the truck collidable with other objects
	truck.tag.setAttribute('static-Body', "shape: box; halfExtents: 1.5 1.5 1.5");
	world.add(truck);

	// Pump Model
	pump = new GLTF({
		asset: 'pump',
		x: 6,
		y: 1,
		z:-20,
		scaleX:0.04,
		scaleY:0.04,
		scaleZ:0.04,
		rotationY:-90
	});

	// Making the truck collidable with other objects
	// pump.tag.setAttribute('static-Body', "shape: box; halfExtents: 1.5 1.5 1.5");
	world.add(pump);

	// Pump Model
	field = new GLTF({
		asset: 'field',
		x: 0,
		y: -1,
		z:-90,
		scaleX:3,
		scaleY:3,
		scaleZ:3
	});

	// Making the truck collidable with other objects
	// pump.tag.setAttribute('static-Body', "shape: box; halfExtents: 1.5 1.5 1.5");
	world.add(field);


	// add trees
	for (let i = 0; i < 100; i++) {
		trees.push(new Tree(random(10, 50), random(-90, 50), random(2.5, 3.3)));
		trees.push(new Tree(random(-50, -10), random(-90, 50), random(2.5, 3.3)));
	}

	// add bricks
	for (let j = 0; j < 10; j++ ){
		total = random(1, 7)
		cx = random(-25, 25);
		cy = 0.25;
		cz = random(-120, -140);
		for (let i = 0; i < total; i++) {
			// first layer of boxes
			boxes.push(new Cube(cx, cy, cz));
			// second layer
			if (total >= 2 && i < total-1){
				boxes.push(new Cube(cx+0.5, cy+0.5, cz))
			}
			// // third layer
			// if (total >= 3 && i < total-2){
			// 	boxes.push(new Cube(cx+1.0, cy+1.0, cz))
			// }
			// // fourth layer
			// if (total >= 4 && i < total-3){
			// 	boxes.push(new Cube(cx+1.5, cy+1.5, cz))
			// }
			cx += 0.9;
		}
	}

	// add bowling pins
	cx = -15.0
	cz = -120
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
		y: 0.2,
		z: cz,
		scaleX:0.4,
		scaleY:0.4,
		scaleZ:0.4
		// rotationY:30
	});

	ball.tag.setAttribute('dynamic-Body', "linearDamping: 0.01");
	world.add(ball);


}

function draw() {
	world.camera.holder.object3D.rotation.set(radians(-25), 0, 0);

	if (keyIsDown(87)){
		if(truck.rotationY<0){
			rotationY = truck.rotationY%360 + 360;
		}
		else{
			rotationY = truck.rotationY%360;
		}
		if(rotationY<=90 && rotationY>=0){
			moveX = map(rotationY, 0, 90, moveSpeed, 0)
			truck.nudge(0,0,moveX-moveSpeed);
			truck.nudge(moveX,0,0);
			world.camera.nudgePosition((moveX*2), 0, (moveX-moveSpeed)*2);
		}
		else if((rotationY<=180 && rotationY>90)){
			moveX = map(rotationY, 90, 180, 0, moveSpeed)
			truck.nudge(0,0,moveX-moveSpeed);
			truck.nudge(-moveX,0,0);
			world.camera.nudgePosition((-moveX*2), 0, (moveX-moveSpeed)*2);
		}
		else if((rotationY<=270 && rotationY>180)){
			moveX = map(rotationY, 270, 180, 0, moveSpeed)
			truck.nudge(0,0,-(moveX-moveSpeed));
			truck.nudge(-moveX,0,0);
			world.camera.nudgePosition((-moveX*2), 0, -(moveX-moveSpeed)*2);
		}
		else if((rotationY<=360 && rotationY>270)){
			moveX = map(rotationY, 270, 360, 0, moveSpeed)
			truck.nudge(0,0,-(moveX-moveSpeed));
			truck.nudge(moveX,0,0);
			world.camera.nudgePosition((moveX*2), 0, -(moveX-moveSpeed)*2);
		}
	}
	if (keyIsDown(83)){
		if(truck.rotationY<0){
			rotationY = truck.rotationY%360 + 360;
		}
		else{
			rotationY = truck.rotationY%360;
		}
		if(rotationY<=90 && rotationY>=0){
			moveX = map(rotationY, 0, 90, moveSpeed, 0)
			truck.nudge(0,0,-(moveX-moveSpeed));
			truck.nudge(-moveX,0,0);
			world.camera.nudgePosition((-moveX*2), 0, -(moveX-moveSpeed)*2);
		}
		else if((rotationY<=180 && rotationY>90)){
			moveX = map(rotationY, 90, 180, 0, moveSpeed)
			truck.nudge(0,0,-(moveX-moveSpeed));
			truck.nudge(moveX,0,0);
			world.camera.nudgePosition((moveX*2), 0, -(moveX-moveSpeed)*2);
		}
		else if((rotationY<=270 && rotationY>180)){
			moveX = map(rotationY, 270, 180, 0, moveSpeed)
			truck.nudge(0,0,(moveX-moveSpeed));
			truck.nudge(moveX,0,0);
			world.camera.nudgePosition((moveX*2), 0, (moveX-moveSpeed)*2);
		}
		else if((rotationY<=360 && rotationY>270)){
			moveX = map(rotationY, 270, 360, 0, moveSpeed)
			truck.nudge(0,0,(moveX-moveSpeed));
			truck.nudge(-moveX,0,0);
			world.camera.nudgePosition((-moveX*2), 0, (moveX-moveSpeed)*2);
		}
	}
	if (keyIsDown(68)){
		truck.spinY(-2);
	}
	if (keyIsDown(65)){
		truck.spinY(2);
	}
	// console.log("ogX " + boxes[0].box.x)
	// console.log("ogy " + boxes[0].box.y)
	// console.log("ogz " + boxes[0].box.z)
	// if (reset == true) {

	// }

	// if (frameCount % 300){
	// 	fuel -= 1;
	// }
	// // text on maze
	// var fueltext = new Text({
	// 	text: 'Fuel!',
	// 	red: 0, green: 0, blue: 0,
	// 	side: 'double',
	// 	x: 0, y: height, z: 0,
	// 	scaleX: 100, scaleY: 100, scaleZ: 1
	// });
	// world.add(fueltext);

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
			y: 0,
			z:z,
			scaleX:0.0015,
			scaleY:0.0015,
			scaleZ:0.0015
			// rotationY:30
		});
		bowling.tag.setAttribute('dynamic-Body', "linearDamping: 0.1");
		world.add(bowling);
		}
}

// tree class
class Tree {
	constructor(x, z, h) {

		// tree stem
		this.stem = new Cylinder({
			x: x, y:h, z:z,
			height: h,
			radius: 0.5,
			red: 150, green:98, blue:72
		});

		// tree leaves
		this.leaves = new Cone({
			x: x, y:h+h/2, z:z,
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
