import './style.css';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon'; // Import Cannon.js

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

const planeGeometry1 = new THREE.PlaneGeometry(10, 10); // Visual ground plane
const planeMaterial1 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
plane1.rotation.x = -Math.PI / 2; // Rotate the mesh to lie horizontally
plane1.position.set(1, 0, 0); // Set ground position at Y = 0
plane1.receiveShadow = true;
scene.add(plane1);

// Ground Plane
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({
  mass: 0 // Mass of 0 for static objects
});
planeBody.addShape(planeShape);
planeBody.position.set(0, 0, 0);
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody); // Add planeBody to the world

// Create Ground Mesh
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.set(0, 0, 0);
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

// Player physics body
let playerBody;

// Load the character model
gltfLoader.load('../models/player.glb', (gltf) => {
  player = gltf.scene;
  player.scale.set(0.5, 0.5, 0.5);
  player.rotation.y = Math.PI;
  scene.add(player);

  // Add physics body for the player
  // Define the player capsule (capsule shape made of two spheres and a cylinder)
  const capsuleRadius = 0.25; // Player's radius (thickness)
  const capsuleHeight = 1.6; // Player's height

  // Create a capsule collider using two spheres and a cylinder
  const sphereTop = new CANNON.Sphere(capsuleRadius); // Top of the capsule
  const sphereBottom = new CANNON.Sphere(capsuleRadius); // Bottom of the capsule
  const cylinder = new CANNON.Cylinder(capsuleRadius, capsuleRadius, capsuleHeight - 2 * capsuleRadius, 8); // The middle cylinder

  // Create playerBody with mass
  playerBody = new CANNON.Body({
    mass: 1, // Player mass
    position: new CANNON.Vec3(0, capsuleHeight / 2 + 10, 0), // Initial player position
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

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xFAD2A8 });
const wallHeight = 5;
const wallThickness = 0.2;
const wallWidth = 10;

// Create walls with matching physics bodies
function createWall(geometry, position, rotation = 0) {
  // Three.js Wall Mesh
  const wall = new THREE.Mesh(geometry, wallMaterial);
  wall.position.set(position.x, position.y, position.z);
  wall.rotation.y = rotation;
  wall.castShadow = true;
  scene.add(wall);

  // Cannon.js Wall Body
  const halfExtents = new CANNON.Vec3(geometry.parameters.width / 2, geometry.parameters.height / 2, geometry.parameters.depth / 2);
  const wallShape = new CANNON.Box(halfExtents);
  const wallBody = new CANNON.Body({
    mass: 0, // Static wall
    position: new CANNON.Vec3(position.x, position.y, position.z)
  });
  wallBody.addShape(wallShape);
  wallBody.quaternion.setFromEuler(0, rotation, 0); // Apply rotation
  world.addBody(wallBody);
}

// Back Wall
const backWallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness);
createWall(backWallGeometry, { x: 0, y: wallHeight / 2, z: -5 });

// Left Wall
const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallWidth);
createWall(leftWallGeometry, { x: -5, y: wallHeight / 2, z: 0 });

// Right Wall
const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallWidth);
createWall(rightWallGeometry, { x: 5, y: wallHeight / 2, z: 0 });

// Front Wall
const frontWallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness);
createWall(frontWallGeometry, { x: 0, y: wallHeight / 2, z: 5 });

// Create a simple tree
// Function to create a tree with physics body
function createTree(x, y, z) {
  const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, y + 0.5, z);

  const foliageGeometry = new THREE.ConeGeometry(0.5, 1, 8);
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.set(x, y + 1.5, z);

  scene.add(trunk);
  scene.add(foliage);

  // Create a physics body for the tree
  const treeShape = new CANNON.Cylinder(0.1, 0.15, 1, 8); // Collision shape
  const treeBody = new CANNON.Body({
    mass: 0, // Static
    position: new CANNON.Vec3(x, y + 0.5, z) // Position adjusted for height
  });
  treeBody.addShape(treeShape);
  world.addBody(treeBody); // Add the tree body to the world
}

// Create trees at specific coordinates
createTree(2, 1.5, 2);
createTree(-2, 1.5, -2);
createTree(3, 1.5, -3);
createTree(-3, 1.5, 3);
createTree(1, 1.5, -1);
createTree(-1, 1.5, 1);


// Controls
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => {
  controls.lock();
});

// Player Movement
const keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
const jumpForce = 5;
const speed = { walk: 5, run: 10 };
let isMoving = false;
let isRunning = false;

let yaw = 0;
const pitchLimit = Math.PI / 2 - 0.1;
let pitch = 0;
const radius = 3;

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() in keys) {
    keys[event.key.toLowerCase()] = true;
    isMoving = keys.w || keys.a || keys.s || keys.d;
    isRunning = keys.shift;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key.toLowerCase() in keys) {
    keys[event.key.toLowerCase()] = false;
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
    const cameraX = player.position.x + radius * Math.sin(yaw) * Math.cos(pitch);
    const cameraY = player.position.y + radius * Math.sin(pitch);
    const cameraZ = player.position.z + radius * Math.cos(yaw) * Math.cos(pitch);

    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(player.position);

    // Rotate the player based on camera's yaw
    player.rotation.y = yaw; // Set player rotation to match the camera's yaw
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
      newAction = actions['run']; // Play run animation
    } else {
      newAction = actions['walk']; // Play walk animation
    }
  } else {
    newAction = actions['idle']; // Player is idle
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
// Move player function
// Call updatePlayerAnimation within movePlayer
function movePlayer() {
  if (!player) return;

  let moveDirection = new THREE.Vector3();
  const forward = getPlayerForwardDirection();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  if (keys.w) moveDirection.add(forward);
  if (keys.s) moveDirection.add(forward.clone().negate());
  if (keys.a) moveDirection.add(right.clone().negate());
  if (keys.d) moveDirection.add(right);

  moveDirection.normalize();

  // Update player physics body
  if (moveDirection.length() > 0) {
    const speedValue = isRunning ? speed.run : speed.walk;
    playerBody.velocity.x = moveDirection.x * speedValue;
    playerBody.velocity.z = moveDirection.z * speedValue;

    const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
    player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetRotation, 0.1);
  }

  // Jumping
  if (keys.space && playerBody.position.y <= 1.6) {
    playerBody.velocity.y = jumpForce;
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

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();
