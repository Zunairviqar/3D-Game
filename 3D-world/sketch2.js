// variable to hold a reference to our A-Frame world
let world;

// an off screen buffer to hold our dynamic texture
let buffer1, buffer2;
let texture1, texture2;

// our 3D box which will use this texture
let box, drawing;
let bgSound, click;

function setup() {
	// no canvas needed
	noCanvas();
	// bgSound.play();
	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	sky = new Sky({
		asset: 'sky'
	});
	world.add(sky);

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


	// create our three off screen graphics buffers, making sure that each is set up with dimensions
	// that are a power of 2
	buffer1 = createGraphics(512, 512);

	// set up these graphics buffers as dynamic textures
	texture1 = world.createDynamicTextureFromCreateGraphics( buffer1 );

	// box primitive
	drawing = new Box({
		x:10, y:3, z:-15,
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

		// create our off screen graphics buffer & texture
	buffer2 = createGraphics(512, 512);
	texture2 = world.createDynamicTextureFromCreateGraphics( buffer2 );

	box = new Box({
		x:0, y:3, z:-5,
		width:3, height:3, depth:3,
		asset: texture2,
		red: 220, green: 225, blue: 220,
		dynamicTexture: true,
		dynamicTextureWidth: 512,
		dynamicTextureHeight: 512,
		overFunction: function(entity, intersectionInfo) {
			buffer2.fill(random(255), random(255), random(255));
			buffer2.ellipse( intersectionInfo.point2d.x, intersectionInfo.point2d.y, 20, 20);
		}
	});
	world.add(box);
}

function draw() {

}
