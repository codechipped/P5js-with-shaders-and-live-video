let myShader;
let noise;
let spheres = []
let breakPoint = 0;
let attempts = 0;
let tX;
let tY;
let noiseYN = false;
let currCamera;
let webCam;

function preload() {
  myShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  webCam = createCapture(VIDEO);
  webCam.size(320, 240);
  webCam.hide();

  currCamera = createCamera();
  zPosSlider = createSlider(-20, 20, 0);
  zPosSlider.position(20, 100);

  // Set the angle mode in degrees
  angleMode(DEGREES);
  
  //Create button to enable/disable noise
  newNoiseBtn = createButton("Toggle Noise");
  newNoiseBtn.position(210, 40);
  newNoiseBtn.mouseClicked(toggleNoise);

  // Create the buttons for panning the camera
  newCameraBtn = createButton("Pan Left");
  newCameraBtn.position(60, 40);
  newCameraBtn.mouseClicked(panCameraLeft);
  
  newCameraBtn = createButton("Pan Right");
  newCameraBtn.position(360, 40);
  newCameraBtn.mouseClicked(panCameraRight);
  noStroke();
  tX = windowWidth;
  tY = windowWidth;
  // noLoop();
}

function draw() {
  background(0);
  // shader() sets the active shader with our shader

  let currZ = zPosSlider.value();
  currCamera.move(0, 0, currZ);
  shader(myShader);

  // Send the frameCount to the shader
  myShader.setUniform("uFrameCount", frameCount);
  myShader.setUniform("uNoiseTexture", webCam);
  myShader.setUniform("clicked", noiseYN);

  // Rotate our geometry on the X and Y axes
  // rotateX(mouseY * 0.1);
  // rotateY(mouseX * 0.1);
  // rotateZ(frameCount * 0.01);
  


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

function panCameraLeft() {
  
  // Pan the camera to the left
  // that is, rotate counterclockwise
  // using a value greater than 0
  currCamera.pan(10);
}
  
function panCameraRight() {
  
  // Pan the camera to the right
  // that is, rotate clockwise
  // using a value less than 0
  currCamera.pan(-10);
}

function toggleNoise() {
  noiseYN = !noiseYN;
}