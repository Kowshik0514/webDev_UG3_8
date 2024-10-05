import './style.css';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();

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

// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
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
  player.scale.set(0.5, 0.5, 0.5);
  player.position.set(0, 0, 0);
  player.rotation.y = Math.PI;
  scene.add(player);

  mixer = new THREE.AnimationMixer(player);

  // Extract and store each animation by name
  const animations = gltf.animations;
  animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    actions[clip.name.toLowerCase()] = action;
  });
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
createTree(2, 0, 2); 
createTree(-2, 0, -2); 

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
let pitch = 0; // Vertical angle for camera rotation
const radius = 3;
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

// Mouse
document.addEventListener('mousemove', (event) => {
  if (controls.isLocked) {
    yaw -= event.movementX * 0.002; 
    pitch -= event.movementY * (-0.002); 
    pitch = Math.max(-pitchLimit, Math.min(pitchLimit, pitch));
    // console.log("Player rotation (yaw):", player.rotation.y, "Pitch:", pitch);
  }
});


const clock = new THREE.Clock();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  if (player) {
    movePlayer();
    const cameraX = player.position.x + radius * Math.sin(yaw) * Math.cos(pitch);
    const cameraY = player.position.y + radius * Math.sin(pitch);
    const cameraZ = player.position.z + radius * Math.cos(yaw) * Math.cos(pitch);

    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(player.position);
  }


  renderer.render(scene, camera);
}

function getPlayerForwardDirection() {
  const forward = new THREE.Vector3(
    -Math.sin(player.rotation.y),0,-Math.cos(player.rotation.y)
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
  if (keys.w) 
  moveDirection.add(forward);
  if (keys.s) moveDirection.add(forward.clone().negate());
  if (keys.a) moveDirection.add(right.clone().negate());
  if (keys.d) moveDirection.add(right);
  if (keys.shift) isRunning = true;
  if (moveDirection.length() > 0) {
    velocity.add(moveDirection.normalize().multiplyScalar(isRunning ? speed.run : speed.walk));
    // console.log(velocity);
    const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
    // console.log(targetRotation);
    player.rotation.y = THREE.MathUtils.lerp(player.rotation.y+Math.PI, targetRotation, 0.1); // Smooth transition
    
  }
  //  jumping
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
