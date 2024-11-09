import './flood.css';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon'; // Import Cannon.js
import { AnimationMixer } from 'three';
import { Euler } from 'three';
// Scene
export const scene = new THREE.Scene();
export let playerBody = null;
playerBody = new CANNON.Body({
  mass: 1, // Set player mass to 1 to respond to gravity
  position: new CANNON.Vec3(0.5, 2.5, 0), // Initial position
  fixedRotation: true, // Prevent unwanted rolling
});
let playerHealth = 100; // Initialize player's health
const healthBarContainer = document.createElement('div');
const healthBar = document.createElement('div');

// Style the health bar container
healthBarContainer.style.position = 'absolute';
healthBarContainer.style.bottom = '20px'; // Position at the bottom
healthBarContainer.style.left = '20px';   // Position to the left
healthBarContainer.style.width = '200px'; // Fixed width for container
healthBarContainer.style.height = '30px'; // Fixed height for container
healthBarContainer.style.border = '2px solid black';
healthBarContainer.style.backgroundColor = '#555'; // Darker background behind the health bar
healthBarContainer.style.borderRadius = '5px';

// Style the actual health bar
healthBar.style.height = '100%'; // Full height of the container
healthBar.style.width = '100%';  // Full width initially (100%)
healthBar.style.backgroundColor = 'green'; // Green to indicate health
healthBar.style.borderRadius = '5px';

// Add the health bar to the container and then the container to the document
healthBarContainer.appendChild(healthBar);
document.body.appendChild(healthBarContainer);


export function update(health) {
    playerHealth = Math.min(100, playerHealth + health);
}

export function refill_health() {
    playerHealth = 100; // Reset health for testing purposes
    // playerBody.position.set(0, 1.6, 0); // Reset player position (if applicable)
    healthBar.style.width = '100%'; // Reset health bar
    healthBar.style.backgroundColor = 'green'; // Reset health bar color
}
export function updateHealth() {
  // Calculate the health percentage
  const healthPercentage = Math.max(playerHealth, 0); // Prevent negative width
  healthBar.style.width = `${healthPercentage}%`;

  // Change color based on health level
  if (healthPercentage > 50) {
      healthBar.style.backgroundColor = 'green';
  } else if (healthPercentage > 25) {
      healthBar.style.backgroundColor = 'yellow';
  } else {
      healthBar.style.backgroundColor = 'red';
  }

  // If player's health reaches 0, end the game
  if (playerHealth <= 0) {
      // alert('Game Over!');
      document.getElementById('go').innerHTML = "Wasted";
      document.getElementById('gameOverPopup').style.display = 'flex';
      // restartGame();
      // refill_health(playerBody)
      playerHealth = 100; // Reset health for testing purposes
      playerBody.position.set(0, 1.6, 0); // Reset player position (if applicable)
      healthBar.style.width = '100%'; // Reset health bar
      healthBar.style.backgroundColor = 'green'; // Reset health bar color
  }
}
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
planeBody1.position.set(1, 0, 0);
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

// export let plane001;
export let texture1;
export let texture2;

// Load the character model
gltfLoader.load('../../models/earthquake/mixed46.glb', (gltf) => {
  player = gltf.scene;
  player.scale.set(0.5, 0.5, 0.5);
  player.rotation.y = Math.PI;
  scene.add(player);
  // console.log(player);

  // Add physics body for the player
  // Define the player capsule (capsule shape made of two spheres and a cylinder)
  const capsuleRadius = 0.25; // Player's radius (thickness)
  const capsuleHeight = 0.5; // Player's height

  // Create a capsule collider using two spheres and a cylinder
  const sphereTop = new CANNON.Sphere(0.25); // Top of the capsule
  const sphereBottom = new CANNON.Sphere(0); // Bottom of the capsule
  const cylinder = new CANNON.Cylinder(0, 0, capsuleHeight - 2 * capsuleRadius, 8); // The middle cylinder

  // Create playerBody with mass
 
  
  // Optionally add a tiny, nearly invisible shape if minimal collision is required
  playerBody.addShape(new CANNON.Sphere(0.01), new CANNON.Vec3(0, 0, 0));
  

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
gltfLoader.load('../../models/opt_wave2.glb', (gltf) => {
  model = gltf.scene;
  model.rotation.x = Math.PI; 
  // console.log("rotate \n");
  // console.log(model.rotation); 
  model.scale.set(0.09, 0.005, 0.08); // Adjust scale if necessary
  scene.add(model);
  model.position.set(1, 0.5, 1); 
  
  mixer = new AnimationMixer(model);
  const action = mixer.clipAction(gltf.animations[0]);

  if (gltf.animations.length) {
    mixer = new AnimationMixer(model);

    // Play the first animation found
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
  } else {
    // console.warn('No animations found in the model');
  }

  // console.log("hi  ");
  // console.log(gltf.animations.length);
});


let tank;
gltfLoader.load('../../models/snowy_water_tank.glb', (gltf) => {
  tank = gltf.scene;
  // tank.setRotationFromEuler(new Euler(0, Math.PI, 0));

  tank.scale.set(10, 10,10); // Adjust scale if necessary
  scene.add(tank);
  tank.position.set(10, 8, 10); 

  // console.log("hi  ");

  // Add physics body for the tank
  const tankShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1)); // Adjust shape based on tank
  const tankTransform = new Ammo.btTransform();
  tankTransform.setIdentity();
  tankTransform.setOrigin(new Ammo.btVector3(0, 0, 0)); // Adjust position
  const tankMass = 1;
  const tankLocalInertia = new Ammo.btVector3(0, 0, 0);
  tankShape.calculateLocalInertia(tankMass, tankLocalInertia);
  const tankMotionState = new Ammo.btDefaultMotionState(tankTransform);
  const tankBodyInfo = new Ammo.btRigidBodyConstructionInfo(tankMass, tankMotionState, tankShape, tankLocalInertia);
  const tankBody = new Ammo.btRigidBody(tankBodyInfo);
  physicsWorld.addRigidBody(tankBody);

});



let room;
gltfLoader.load('../../models/apartment_plan.glb', (gltf) => {
  room = gltf.scene;
  // room.setRotationFromEuler(new Euler(0, Math.PI, 0));

  room.scale.set(1, 1,1); // Adjust scale if necessary
  scene.add(room);
  room.position.set(-10, 0, 10); 

  // console.log("hi  ");

  // Add physics body for the room
  const roomShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1)); // Adjust shape based on room
  const roomTransform = new Ammo.btTransform();
  roomTransform.setIdentity();
  roomTransform.setOrigin(new Ammo.btVector3(0, 0, 0)); // Adjust position
  const roomMass = 1;
  const roomLocalInertia = new Ammo.btVector3(0, 0, 0);
  roomShape.calculateLocalInertia(roomMass, roomLocalInertia);
  const roomMotionState = new Ammo.btDefaultMotionState(roomTransform);
  const roomBodyInfo = new Ammo.btRigidBodyConstructionInfo(roomMass, roomMotionState, roomShape, roomLocalInertia);
  const roomBody = new Ammo.btRigidBody(roomBodyInfo);
  physicsWorld.addRigidBody(roomBody);

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
  // console.log(event.key);  // Debug key presses

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
let animationEnabled = true; 
function animate() {
  if (!animationEnabled) return;
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);
  
  // Step the physics world
  world.step(1 / 60);

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

  if (isRising && model) {
    
        model.position.y += 0.01;
        if(model.position.y-player.position.y>=0.75)
          {
            // console.log("svsvs");
            playerHealth -= 1;
            updateHealth();
          }
        // console.log(model.position.y);
  
     // Adjust the speed of rising water here

  }

  renderer.render(scene, camera);
}

// Function to update animation based on player's movement
function updatePlayerAnimation() {
  if (!player || !mixer) return;
  // console.log("player position: ");
  // console.log(player.position.y);
  // console.log(player.position.z);
  let newAction;

  // Check if the player is moving and if they're running

  if (isMoving) {
    if (isRunning) {
      newAction = actions['walk'];
      // newAction = actions['crawl']; // Play run animation
    } else {
      newAction = actions['walk']; // Play walk animation
    }
  } else {
    newAction = actions['idle']; // PlayerBplayerBody is idle
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


