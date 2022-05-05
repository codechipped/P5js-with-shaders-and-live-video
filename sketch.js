// Edited template from: https://github.com/aferriss/p5jsShaderExamples

let myShader;
let noise;
let spheres = []
let breakPoint = 0;
let attempts = 0;
let tX;
let tY;
let noiseYN = false;
let rotation = false;
let currCamera;
let webCam;

function preload() {
  myShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  webCam = createCapture(VIDEO);
  webCam.size(320, 240);
  webCam.hide();
  
  //camera controller
  player = new Player();

  frameRate(60);  
  //Create button to enable/disable noise
  // newNoiseBtn = createButton("Toggle Noise");
  // newNoiseBtn.position(210, 40);
  // newNoiseBtn.mouseClicked(toggleNoise);


  noStroke();
  tX = windowWidth;
  tY = windowWidth;
  // noLoop();

  player.position = p5.Vector.add(0.0, 0.0, createVector(0, -15, 0))
}


function draw() {
  background(0);

  player.update();

  // shader() sets the active shader with our shader
  // let currZ = zPosSlider.value();
  // currCamera.move(0, 0, currZ);
  shader(myShader);

  // Send the frameCount to the shader
  myShader.setUniform("uFrameCount", frameCount);
  myShader.setUniform("uNoiseTexture", webCam);
  myShader.setUniform("clicked", noiseYN);


  // Rotate our geometry on the X and Y axes
  if(rotation) {
    rotateX(frameCount * 0.001);
    rotateY(frameCount * 0.001);
    rotateZ(frameCount * 0.001);
  }

  


  let total = 100;
  let count = 0;
  
  while (count <  total) {
    if (attempts >= 100) {
      break;
    } 
    let newC = newSphere();
    if (newC != null) {
      spheres.push(newC);
      count++;
    }
    attempts++;
  }
  
  spheres.forEach((s)=> {
    if(s.growing) {
      spheres.forEach((o) => {
        if (s != o) {
          let d = dist(s.x, s.y, s.z, o.x, o.y, o.z);
          if (d - 2 < s.r + o.r) {
            s.growing = false;
            return;
          }
      }});
    }
    s.show();
    s.grow();
  });

}

newSphere = () => {
  let x = map(random(200), 0, 200, -tX, tX);
  let y = map(random(200), 0, 200, -tY, tY);
  let z = map(random(200), 0, 200, -tY, tY);

  let valid = true;

  spheres.forEach((c) => {
    let d = dist(x, y, z, c.x, c.y, c.z);
    if (d < c.r) {
      valid = false;
      return;
    }
  });

  if (valid) {
    return new Sphere(x, y, z);
  } else {
    return null;
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if(key === 'n') {
    // add noise when pressing n
    noiseYN = !noiseYN;
  } else if(key === 'r') {
    // rotate scene when pressing r
    rotation = !rotation;
  }
}

// this is needed to catch the exit from pointerLock when user presses ESCAPE
function onPointerlockChange() {
  if (document.pointerLockElement === canvas.elt ||
    document.mozPointerLockElement === canvas.elt)
    console.log("locked");
  else {
    console.log("unlocked");
    player.pointerLock = false;
  }
}
document.addEventListener('pointerlockchange', onPointerlockChange, false);

var player, maze, f, help = false,
  canvas;

class Player extends RoverCam {
  constructor() {
    super();
    this.dimensions = createVector(1, 3, 1);
    this.velocity = createVector(0, 0, 0);
    this.gravity = createVector(0, 0.03, 0);
    this.grounded = false;
    this.pointerLock = false;
    this.sensitivity = 0.002;
    this.speed = 2.5;
  }
  
  controller() { // override
    if (player.pointerLock) {
      this.yaw(movedX * this.sensitivity);   // mouse left/right
      this.pitch(movedY * this.sensitivity); // mouse up/down
      if(keyIsDown(65) || keyIsDown(LEFT_ARROW))  this.moveY(0.01); // a
      if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.moveY(-0.01);// d
    }
    else { // otherwise yaw/pitch with keys
      if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.yaw(-0.10); // a
      if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.yaw(0.10); // d
      if (keyIsDown(82)) this.pitch(-0.02); // r
      if (keyIsDown(70)) this.pitch(0.02);  // f
    }

    if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.moveX(this.speed);    // w
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.moveX(-this.speed); // s
    if (keyIsDown(69)) this.moveZ(0.05); // e
  }
  
  update() {
    if (keyIsPressed && key == 'e') {
      this.grounded = false;
      return;
    }
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);

    if (this.grounded && keyIsPressed && keyCode == 32) { // space
      this.grounded = false;
      this.velocity.y = -1.5;
      this.position.y -= 0.2;
    }
  }
}

function mouseClicked() {
  if (!player.pointerLock) {
    player.pointerLock = true;
    requestPointerLock();
  } else {
    exitPointerLock();
    player.pointerLock = false;
  }
}