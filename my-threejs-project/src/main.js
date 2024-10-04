import './style.css';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3); // Initial camera position behind the player

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
plane.receiveShadow = true;
scene.add(plane);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Load Character Model
const gltfLoader = new GLTFLoader();
let player;
let mixer;
let actions = {};
let activeAction, previousAction;

// Load the character model
gltfLoader.load('../models/player.glb', (gltf) => {
  player = gltf.scene;
  player.scale.set(0.5, 0.5, 0.5); // Adjust size if needed
  player.position.set(0, 1.6, 0); // Position the model on the ground
  player.rotation.y = Math.PI; // Rotate 180 degrees
  scene.add(player);

  mixer = new THREE.AnimationMixer(player);

  // Extract and store each animation by name
  const animations = gltf.animations;
  animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    actions[clip.name.toLowerCase()] = action; // Store actions by animation name
  });

  // Set the idle animation as the default
  activeAction = actions['idle'];
  activeAction.play();
});



// Create a simple tree
function createTree(x, y, z) {
  // Create the trunk of the tree
  const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown color
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, y + 0.5, z); // Position the trunk on the ground

  // Create the foliage of the tree
  const foliageGeometry = new THREE.ConeGeometry(0.5, 1, 8);
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Green color
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.set(x, y + 1.5, z); // Position the foliage above the trunk

  // Add trunk and foliage to the scene
  scene.add(trunk);
  scene.add(foliage);
}

// Create a tree at specific coordinates
createTree(2, 0, 2); // Adjust position as needed
createTree(-2, 0, -2); // Adjust position as needed

// Controls
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => {
  controls.lock();
});

// Player Movement
const keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
const velocity = new THREE.Vector3();
let canJump = false;
const gravity = -0.1;
const jumpForce = 0.2;
const speed = { walk: 0.1, run: 0.2 };
let isMoving = false;
let isRunning = false;

// Mouse movement variables
let yaw = 0; // Horizontal angle for character rotation
const pitchLimit = Math.PI / 2 - 0.1; // Limit for vertical camera angle

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() in keys) {
    keys[event.key.toLowerCase()] = true;
    isMoving = keys.w || keys.a || keys.s || keys.d;
    isRunning = keys.shift;
    // console.log(isRunning);
    // console.log("****************");
    updatePlayerMovement(); 
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key.toLowerCase() in keys) {
    keys[event.key.toLowerCase()] = false;
    isMoving = keys.w || keys.a || keys.s || keys.d;
    isRunning = keys.shift;
    
    updatePlayerMovement();
  }
});

// Mouse movement event to control character rotation
document.addEventListener('mousemove', (event) => {
  if (controls.isLocked) {
    yaw -= event.movementX * 0.002; // Adjust sensitivity for horizontal rotation
    player.rotation.y = yaw; // Rotate the player model based on yaw
    camera.rotation.y = yaw; // Rotate the camera based on yaw
    // console.log(camera.rotation.y+"{{{{{{{{{{{{{[[");
  }
});
const clock = new THREE.Clock();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); // Time between frames

  if (mixer) mixer.update(delta); // Update the animation mixer

  if (player) {
    movePlayer();
    
    
    // You can also use this forward direction for movement or camera logic
  }

  // const forwardDirection = getPlayerForwardDirection(); // Safe to call once the player is defined
  // console.log('Player Forward Direction:', forwardDirection);
  // Update camera position to follow player
  if (player) {
    const cameraOffset = new THREE.Vector3(0, 1.6, 3); // Fixed position behind the player
    camera.position.copy(player.position).add(cameraOffset); // Set camera behind player
    console.log(camera.position+"=================");
    camera.lookAt(player.position); // Make the camera look at the player
  }

  renderer.render(scene, camera);
}

function getPlayerForwardDirection() {
  const forward = new THREE.Vector3(
    -Math.sin(player.rotation.y), // X component based on horizontal angle (yaw)
    0,                            // Y component is zero for horizontal movement
    -Math.cos(player.rotation.y)  // Z component based on horizontal angle (yaw)
  );

  return forward.normalize();
}

// Move player function
function movePlayer() {
  if (!player) return;

  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  controls.getDirection(forward);
  forward.y = 0;
  forward.normalize();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  let moveDirection = new THREE.Vector3();
  // console.log(moveDirection);
  // Move forward and backward
  if (keys.w) 
    moveDirection.add(forward);

  if (keys.s) moveDirection.add(forward.clone().negate());

  // Move left and right
  if (keys.a) moveDirection.add(right.clone().negate());
  if (keys.d) moveDirection.add(right);
  if (keys.shift) isRunning = true;
  if (moveDirection.length() > 0) {
    velocity.add(moveDirection.normalize().multiplyScalar(isRunning ? speed.run : speed.walk));
    // console.log(velocity);
    // Rotate character towards movement direction
    const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
    // console.log(targetRotation);
    player.rotation.y = THREE.MathUtils.lerp(player.rotation.y+Math.PI, targetRotation, 0.1); // Smooth transition
  }

  // Handle jumping
  if (keys.space && canJump) {
    velocity.y += jumpForce;
    canJump = false;
  }

  // Apply gravity
  velocity.y += gravity;

  // Update player position
  player.position.add(velocity);

  // Ground collision detection
  if (player.position.y < 1.6) {
    player.position.y = 1.6;
    velocity.y = 0;
    canJump = true;
  }

  // Reset velocity for horizontal movement
  velocity.set(0, velocity.y, 0);
}

function updatePlayerMovement() {
  if (!player || !mixer) return;
  // console.log(isMoving);
  // console.log("++++++++++++++++");
  if (isMoving) {
    // console.log(isRunning);
    // console.log("-------");
    if (isRunning) {
      switchAnimation('run');
    } else {
      switchAnimation('walk');
    }
  } else {
    switchAnimation('idle');
  }
}
// Function to switch animations
function switchAnimation(newActionName) {
  const newAction = actions[newActionName.toLowerCase()];
  if (newAction !== activeAction) {
    previousAction = activeAction;
    activeAction = newAction;
    previousAction.fadeOut(0.5);
    activeAction.reset().fadeIn(0.5).play();
  }
}
// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();
