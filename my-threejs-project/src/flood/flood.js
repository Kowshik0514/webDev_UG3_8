// import './style.css';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon'; // Import Cannon.js


// Scene
export const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Set gravity


// Ground Plane
const planeShape1 = new CANNON.Plane();
const planeBody1 = new CANNON.Body({
  mass: 0 // Mass of 0 for static objects
});
planeBody1.addShape(planeShape1);
planeBody1.position.set(1, 0.1, 0);
planeBody1.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody1); // Add planeBody to the world

// Sky Sphere (for a 360-degree sky effect)
const skyGeometry = new THREE.SphereGeometry(500, 100, 100);
const skyMaterial = new THREE.MeshBasicMaterial({
  color: 0x87CEEB, // Sky blue color
  side: THREE.BackSide // Render the inside of the sphere
});
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);
const planeGeometry1 = new THREE.PlaneGeometry(1000, 1000); // Visual ground plane
const planeMaterial1 = new THREE.MeshStandardMaterial({ color: 0x808080 });
export const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
plane1.rotation.x = -Math.PI / 2; // Rotate the mesh to lie horizontally
plane1.position.set(1, 0, 0); // Set ground position at Y = 0
plane1.receiveShadow = true;
scene.add(plane1);

// Ground Plane
export let planeShape = new CANNON.Plane();
export let planeBody = new CANNON.Body({
  mass: 0 // Mass of 0 for static objects
});
planeBody.addShape(planeShape);
planeBody.position.set(0, 0, 0);
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody); // Add planeBody to the world

const planeShapeFront = new CANNON.Box(new CANNON.Vec3(15, 0.01, 15)); // Length 5, Breadth 5
const planeBodyFront = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyFront.addShape(planeShapeFront);
planeBodyFront.position.set(0.48, 0.48, -6.5);
planeBodyFront.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBodyFront); // Add to physics world

const planeShapeRight = new CANNON.Box(new CANNON.Vec3(4, 0.01, 2)); // Length 5, Breadth 5
const planeBodyRight = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyRight.addShape(planeShapeRight);
planeBodyRight.position.set(7.6, 0.42, -3.8);
planeBodyRight.quaternion.setFromEuler(-Math.PI / 2, Math.PI, -Math.PI / 2);
world.addBody(planeBodyRight); // Add to physics world

const planeShapeLeft = new CANNON.Box(new CANNON.Vec3(4, 0.01, 2)); // Length 5, Breadth 5
const planeBodyLeft = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyLeft.addShape(planeShapeLeft);
planeBodyLeft.position.set(-7.5, 0.42, -3.8);
planeBodyLeft.quaternion.setFromEuler(-Math.PI / 2, Math.PI, -Math.PI / 2);
world.addBody(planeBodyLeft); // Add to physics world
const planeShapeBack1 = new CANNON.Box(new CANNON.Vec3(2.2, 0.01, 3)); // Length 5, Breadth 5
const planeBodyBack1 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack1.addShape(planeShapeBack1);
planeBodyBack1.position.set(6.23, 0.4, -1.5);
planeBodyBack1.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBodyBack1); // Add to physics world

const planeShapeBack2 = new CANNON.Box(new CANNON.Vec3(2.2, 0.01, 3)); // Length 5, Breadth 5
const planeBodyBack2 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack2.addShape(planeShapeBack2);
planeBodyBack2.position.set(-6.5, 0.4, -1.5);
planeBodyBack2.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBodyBack2); // Add to physics world
const planeShapeBack3 = new CANNON.Box(new CANNON.Vec3(2.2, 0.01, 3)); // Length 5, Breadth 5
const planeBodyBack3 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack3.addShape(planeShapeBack3);
planeBodyBack3.position.set(3.1, 0.42, 0.27);
planeBodyBack3.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBodyBack3); // Add to physics world
const planeShapeBack4 = new CANNON.Box(new CANNON.Vec3(2.2, 0.01, 3)); // Length 5, Breadth 5
const planeBodyBack4 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack4.addShape(planeShapeBack4);
planeBodyBack4.position.set(-3.4, 0.42, 0.19);
planeBodyBack4.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBodyBack4); // Add to physics world
const planeShapeBack5 = new CANNON.Box(new CANNON.Vec3(1.2, 0.01, 2)); // Length 5, Breadth 5
const planeBodyBack5 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack5.addShape(planeShapeBack5);
planeBodyBack5.position.set(4.4, 0.42, -0.24);
planeBodyBack5.quaternion.setFromEuler(-Math.PI / 2, Math.PI, -Math.PI / 2);
world.addBody(planeBodyBack5); // Add to physics world
const planeShapeBack6 = new CANNON.Box(new CANNON.Vec3(1.2, 0.01, 2)); // Length 5, Breadth 5
const planeBodyBack6 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack6.addShape(planeShapeBack6);
planeBodyBack6.position.set(-4.4, 0.42, -0.24);
planeBodyBack6.quaternion.setFromEuler(-Math.PI / 2, Math.PI, -Math.PI / 2);
world.addBody(planeBodyBack6); // Add to physics world

// Lighting
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
export let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);
export let directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(10, 10, 10);
directionalLight2.castShadow = true;
scene.add(directionalLight2);

// Load Character Model
const gltfLoader = new GLTFLoader();
let player;
let mixer;
let actions = {};
let activeAction, previousAction;

// Player physics body
export let playerBody = null;
// export let plane001;
export let texture1;
export let texture2;

// Load the character model
gltfLoader.load('../../models/earthquake/mixed46.glb', (gltf) => {
  player = gltf.scene;
  player.scale.set(0.5, 0.5, 0.5);
  player.rotation.y = Math.PI;
  scene.add(player);
  console.log(player);

  // Add physics body for the player
  // Define the player capsule (capsule shape made of two spheres and a cylinder)
  const capsuleRadius = 0.25; // Player's radius (thickness)
  const capsuleHeight = 0.5; // Player's height

  // Create a capsule collider using two spheres and a cylinder
  const sphereTop = new CANNON.Sphere(0.25); // Top of the capsule
  const sphereBottom = new CANNON.Sphere(0); // Bottom of the capsule
  const cylinder = new CANNON.Cylinder(0, 0, capsuleHeight - 2 * capsuleRadius, 8); // The middle cylinder

  // Create playerBody with mass
  playerBody = new CANNON.Body({
    mass: 1, // Player mass
    position: new CANNON.Vec3(0.5, 2.5, 0), // Initial player position
    fixedRotation: true, // Prevent rolling
  });

  // Add the shapes to the playerBody to form a capsule
  playerBody.addShape(sphereTop, new CANNON.Vec3(0, (capsuleHeight - capsuleRadius) / 2, 0));  // Position top sphere
  playerBody.addShape(sphereBottom, new CANNON.Vec3(0, -(capsuleHeight - capsuleRadius) / 2, 0));  // Position bottom sphere
  playerBody.addShape(cylinder); // Add the cylinder in the middle

  // Add playerBody to the physics world
  world.addBody(playerBody);

  mixer = new THREE.AnimationMixer(player);
  const animations = gltf.animations;
  animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    actions[clip.name.toLowerCase()] = action;
  });
  activeAction = actions['idle'];
  activeAction.play();
});



let model;
gltfLoader.load('../../models/newwater.glb', (gltf) => {
  model = gltf.scene;
  model.scale.set(1, 0.01,1); // Adjust scale if necessary
  scene.add(model);
  model.position.set(4, 0.7, 0); 

  // Add physics body for the model
  const modelShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1)); // Adjust shape based on model
  const modelTransform = new Ammo.btTransform();
  modelTransform.setIdentity();
  modelTransform.setOrigin(new Ammo.btVector3(0, 0, 0)); // Adjust position
  const modelMass = 1;
  const modelLocalInertia = new Ammo.btVector3(0, 0, 0);
  modelShape.calculateLocalInertia(modelMass, modelLocalInertia);
  const modelMotionState = new Ammo.btDefaultMotionState(modelTransform);
  const modelBodyInfo = new Ammo.btRigidBodyConstructionInfo(modelMass, modelMotionState, modelShape, modelLocalInertia);
  const modelBody = new Ammo.btRigidBody(modelBodyInfo);
  physicsWorld.addRigidBody(modelBody);
});


let cloud;
gltfLoader.load('../../models/ship_in_clouds.glb', (gltf) => {
  cloud = gltf.scene;
  cloud.scale.set(10, 9,10); // Adjust scale if necessary
  scene.add(cloud);
  cloud.position.set(1,1,1); 

  // Add physics body for the cloud
  const cloudShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1)); // Adjust shape based on cloud
  const cloudTransform = new Ammo.btTransform();
  cloudTransform.setIdentity();
  cloudTransform.setOrigin(new Ammo.btVector3(0, 0, 0)); // Adjust position
  const cloudMass = 1;
  const cloudLocalInertia = new Ammo.btVector3(0, 0, 0);
  cloudShape.calculateLocalInertia(cloudMass, cloudLocalInertia);
  const cloudMotionState = new Ammo.btDefaultMotionState(cloudTransform);
  const cloudBodyInfo = new Ammo.btRigidBodyConstructionInfo(cloudMass, cloudMotionState, cloudShape, cloudLocalInertia);
  const cloudBody = new Ammo.btRigidBody(cloudBodyInfo);
  physicsWorld.addRigidBody(cloudBody);
});


const riseButton = document.createElement('button');
riseButton.innerText = 'Raise Water Level';
riseButton.style.position = 'absolute';
riseButton.style.top = '10px';
riseButton.style.left = '10px';
document.body.appendChild(riseButton);

riseButton.addEventListener('click', () => {
  isRising = true;
});

// Controls
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => {
  controls.lock();
});

// Player Movement
const keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
const jumpForce = 5;
const speed = { walk: 10, run: 8 };
let isMoving = false;
let isRunning = false;

let yaw = 0;
const pitchLimit = Math.PI / 2 - 0.1;
let pitch = 0;
const radius = 3;

window.addEventListener('keydown', (event) => {
  console.log(event.key);  // Debug key presses

  if (event.key === ' ' || event.key.toLowerCase() in keys) {
    if (event.key === ' ') {
      keys.space = true;
    } else {
      keys[event.key.toLowerCase()] = true;
    }
    isMoving = keys.w || keys.a || keys.s || keys.d;
    isRunning = keys.shift;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === ' ' || event.key.toLowerCase() in keys) {
    if (event.key === ' ') {
      keys.space = false;
    } else {
      keys[event.key.toLowerCase()] = false;
    }
    isMoving = keys.w || keys.a || keys.s || keys.d;
    isRunning = keys.shift;
  }
});

// Mouse movement
document.addEventListener('mousemove', (event) => {
  if (controls.isLocked) {
    yaw -= event.movementX * 0.002;
    pitch -= event.movementY * (-0.002);
    pitch = Math.max(-pitchLimit, Math.min(pitchLimit, pitch));
  }
});

const clock = new THREE.Clock();

let isRising = false;
// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  
  // Step the physics world
  world.step(1 / 60);

  if (mixer) mixer.update(delta);

  // Call movePlayer every frame
  movePlayer();


  if (player) {
    // Sync player position with physics body
    player.position.copy(playerBody.position);
    player.quaternion.copy(playerBody.quaternion);

    // Calculate the camera position based on player and pitch/yaw
    const cameraX = player.position.x - radius * Math.sin(yaw) * Math.cos(pitch);
    const cameraY = player.position.y + radius * Math.sin(pitch);
    const cameraZ = player.position.z - radius * Math.cos(yaw) * Math.cos(pitch);

    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(player.position);

    // Rotate the player to match the camera's yaw
    player.rotation.y = yaw; // Sync player's Y rotation with the camera's yaw
  }

let rf = true;
  if (isRising && model) {
    if(rf)
    {
        model.position.y += 0.0001;
        rf = false;
    }
    else
    {
        model.position.y-=0.005;
        rf = true;
    }
     // Adjust the speed of rising water here

  }

  renderer.render(scene, camera);
}

// Function to update animation based on player's movement
function updatePlayerAnimation() {
  if (!player || !mixer) return;

  let newAction;

  // Check if the player is moving and if they're running

  if (isMoving) {
    if (isRunning) {
      newAction = actions['crawl']; // Play run animation
    } else {
      newAction = actions['walk']; // Play walk animation
    }
  } else {
    newAction = actions['idle']; // PlayerBplayerBody is idle
  }
  if ((player.position.x > -1.5 && playerBody.position.x < 1.5) && (playerBody.position.z > -6 && playerBody.position.z <-4)) {
    newAction = actions['crawl'];
    playerBody.position.y = -0.05;

  }
  // If the new action is different from the active action, blend the animations
  if (newAction && newAction !== activeAction) {
    previousAction = activeAction;
    activeAction = newAction;

    // Smoothly blend between animations
    previousAction.fadeOut(0.2);
    activeAction.reset().fadeIn(0.2).play();
  }
}
function movePlayer() {
  if (!player) return;

  let moveDirection = new THREE.Vector3();
  const forward = getPlayerForwardDirection();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  if (keys.s) moveDirection.add(forward);
  if (keys.w) moveDirection.add(forward.clone().negate());
  if (keys.d) moveDirection.add(right.clone().negate());
  if (keys.a) moveDirection.add(right);

  moveDirection.normalize();

  // Update player physics body
  if (moveDirection.length() > 0) {
    const speedValue = isRunning ? speed.run : speed.walk;
    playerBody.velocity.x = moveDirection.x * speedValue;
    playerBody.velocity.z = moveDirection.z * speedValue;

    const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
    player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetRotation, 0.1) + Math.PI;
  }

  // Jumping
  if (keys.space) {
    if (keys.shift) {
      // Shift + Space: Fly upward
      // playerBody.velocity.y = jumpForce; // Ascend upwards with a custom force
    } else if (playerBody.position.y <= 1.6) {

    }
  }

  // Reset Y velocity for better control
  playerBody.velocity.y = Math.max(playerBody.velocity.y, -20);


  // Update animation based on movement
  updatePlayerAnimation();
}


// Get player forward direction
function getPlayerForwardDirection() {
  const forward = new THREE.Vector3(
    -Math.sin(player.rotation.y), 0, -Math.cos(player.rotation.y)
  );
  return forward.normalize();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();


