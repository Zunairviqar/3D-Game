let carX, carZ;
let car;
let moveSpeed;
let world;
let truck;
let brick;
let brick2;
let bricks;


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
	world.camera.cameraEl.removeAttribute('look-controls')

	// rotate the camera down at an angle
	world.camera.holder.object3D.rotation.set(radians(-45), 0, 0);

	carX = 0;
	carY = 0;
	moveSpeed = 0.08;

	// Truck Model
	truck = new GLTF({
		asset: 'truck',
		x: carX,
		y: 0.5,
		z:carY,
		scaleX:0.005,
		scaleY:0.005,
		scaleZ:0.005,
		rotationY:30
	});
	// Making the truck collidable with other objects
	truck.tag.setAttribute('static-Body', "shape: box; halfExtents: 1.5 1.5 1.5");
	world.add(truck);

	brick = new Cube(2,0.5,-5);
	brick2 = new Cube(2,1,-5);
}

function draw() {
	world.camera.holder.object3D.rotation.set(radians(-45), 0, 0);

	if (keyIsDown(87)){
		if(truck.rotationY<0){
			rotationY = truck.rotationY%360 + 360;
		}
		else{
			rotationY = truck.rotationY%360;
		}
		if(rotationY<=90 && rotationY>=0){
			moveX = map(rotationY, 0, 90, 0.08, 0)
			truck.nudge(0,0,moveX-0.08);
			truck.nudge(moveX,0,0);
			// world.camera.nudgePosition((moveX*2), 0, (moveX-0.08)*2);
		}
		else if((rotationY<=180 && rotationY>90)){
			moveX = map(rotationY, 90, 180, 0, 0.08)
			truck.nudge(0,0,moveX-0.08);
			truck.nudge(-moveX,0,0);
			// world.camera.nudgePosition((-moveX*2), 0, (moveX-0.08)*2);
		}
		else if((rotationY<=270 && rotationY>180)){
			moveX = map(rotationY, 270, 180, 0, 0.08)
			truck.nudge(0,0,-(moveX-0.08));
			truck.nudge(-moveX,0,0);
			// world.camera.nudgePosition((-moveX*2), 0, -(moveX-0.08)*2);
		}
		else if((rotationY<=360 && rotationY>270)){
			moveX = map(rotationY, 270, 360, 0, 0.08)
			truck.nudge(0,0,-(moveX-0.08));
			truck.nudge(moveX,0,0);
			// world.camera.nudgePosition((moveX*2), 0, -(moveX-0.08)*2);
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
			moveX = map(rotationY, 0, 90, 0.08, 0)
			truck.nudge(0,0,-(moveX-0.08));
			truck.nudge(-moveX,0,0);
			// world.camera.nudgePosition((-moveX*2), 0, -(moveX-0.08)*2);
		}
		else if((rotationY<=180 && rotationY>90)){
			moveX = map(rotationY, 90, 180, 0, 0.08)
			truck.nudge(0,0,-(moveX-0.08));
			truck.nudge(moveX,0,0);
			// world.camera.nudgePosition((moveX*2), 0, -(moveX-0.08)*2);
		}
		else if((rotationY<=270 && rotationY>180)){
			moveX = map(rotationY, 270, 180, 0, 0.08)
			truck.nudge(0,0,(moveX-0.08));
			truck.nudge(moveX,0,0);
			// world.camera.nudgePosition((moveX*2), 0, (moveX-0.08)*2);
		}
		else if((rotationY<=360 && rotationY>270)){
			moveX = map(rotationY, 270, 360, 0, 0.08)
			truck.nudge(0,0,(moveX-0.08));
			truck.nudge(-moveX,0,0);
			// world.camera.nudgePosition((-moveX*2), 0, (moveX-0.08)*2);
		}
	}
	if (keyIsDown(68)){
		truck.spinY(-2);
	}
	if (keyIsDown(65)){
		truck.spinY(2);
	}
}
function keyPressed(){

}

// Brick class
class Cube {
	constructor(x,y,z) {
		// new brick
		this.box = new Box({
			x:x, y:y, z:z,
			width:0.7, height: 0.3, depth: 0.3,
			// iron asset
			// asset: 'iron',
			red:255, green:217, blue:179,
			// change color upon clicking and slide to brick
			clickFunction: function(theBox) {
				// console.log("TOUCHED bOX")
				theBox.setColor( random(255), random(255), random(255) );
				// world.slideToObject( theBox, 1000 );
				// click.play();
			}
		});
		this.box.tag.setAttribute('dynamic-Body', true);
		world.add(this.box);
	}
}
