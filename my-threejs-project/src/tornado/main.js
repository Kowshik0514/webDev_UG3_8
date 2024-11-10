import * as CANNON from 'cannon';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import the GLTFLoader
import { createTornado, tornadoGroup } from './tornado.js';
import { loadHome } from './room.js';

// Scene setup
export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const startTornadoButton = document.getElementById('startTornado');
startTornadoButton.addEventListener('click', () => {
  createTornado(scene, world);
});

loadHome(scene, world);

// Sky background color
scene.background = new THREE.Color(0x87ceeb); // Light blue sky color

// Ground setup
const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Greenish ground color
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to lie flat
ground.receiveShadow = true;
scene.add(ground);

// Physics ground body
const groundBody = new CANNON.Body({
  mass: 0, // Static body
  position: new CANNON.Vec3(0, 0, 0), // Centered on the world origin
});
const groundShape = new CANNON.Plane();
groundBody.addShape(groundShape);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Controls
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => controls.lock());

// Create Stones (within 100 radius)
function createStones() {
  const stoneGeometry = new THREE.SphereGeometry(0.05, 1, 1);  // Small stones
  const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Grey color

  for (let i = 0; i < 500; i++) {  // Create 50 stones
    const stoneMesh = new THREE.Mesh(stoneGeometry, stoneMaterial);
    const randomX = Math.random() * 100 - 50;  // Random position within 100 radius
    const randomZ = Math.random() * 100 - 50;  // Random position within 100 radius
    const randomY = 0.25;  // Slightly above the ground
    stoneMesh.position.set(randomX, randomY, randomZ);
    stoneMesh.castShadow = true;
    stoneMesh.receiveShadow = true;
    scene.add(stoneMesh);

    // Create physics for the stone
    const stoneBody = new CANNON.Body({
      mass: 1, // Stone mass
      position: new CANNON.Vec3(randomX, randomY, randomZ),  // Position based on random location
      shape: new CANNON.Sphere(0.05), // Physics shape (sphere with radius 0.5)
    });

    stoneBody.addShape(new CANNON.Sphere(0.05)); // The stone's shape in physics world

    // Make sure the stone body is added to the physics world
    world.addBody(stoneBody);

    // Sync stone mesh position with physics body position
    stoneMesh.userData.body = stoneBody;  // Store the physics body on the mesh for later updates
  }
}

// Call the function to create stones
createStones();

// Load Character Model
const gltfLoader = new GLTFLoader();
let mixer;
let actions = {};
let activeAction, previousAction;

// Player physics body
export let playerBody = null;
export let player = null; // Declare player variable
let texture1, texture2;

// Load the character model
gltfLoader.load('../../models/earthquake/mixed46.glb', (gltf) => {
  player = gltf.scene;
  player.scale.set(0.5, 0.5, 0.5);
  player.rotation.y = Math.PI;
  scene.add(player);

  // Add physics body for the player
  const capsuleRadius = 0.25; // Player's radius (thickness)
  const capsuleHeight = 0.5; // Player's height

  const sphereTop = new CANNON.Sphere(0.25); // Top of the capsule
  const sphereBottom = new CANNON.Sphere(0); // Bottom of the capsule
  const cylinder = new CANNON.Cylinder(0, 0, capsuleHeight - 2 * capsuleRadius, 8); // The middle cylinder

  // Create playerBody with mass
  playerBody = new CANNON.Body({
    mass: 70, // Player mass
    position: new CANNON.Vec3(-35, 0, -10),
    // position: new CANNON.Vec3(30, 0, 30), // Initial player position
    fixedRotation: true, // Prevent rolling
    linearDamping: 0.3, // Helps to prevent the player from sliding when they are on the ground
    angularDamping: 0.3, // Damping for rotation to prevent spinning out of control
  });

  playerBody.addShape(sphereTop, new CANNON.Vec3(0, (capsuleHeight - capsuleRadius) / 2, 0));  // Position top sphere
  playerBody.addShape(sphereBottom, new CANNON.Vec3(0, -(capsuleHeight - capsuleRadius) / 2, 0));  // Position bottom sphere
  playerBody.addShape(cylinder); // Add the cylinder in the middle

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

// Player Movement
const keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
const jumpForce = 5;
const speed = { walk: 20, run: 20 };
let isMoving = false;
let isRunning = false;
// Define the maximum jump height near the tornado
const randomJumpForceMin = 4;
const randomJumpForceMax = 6;
const tornadoProximityDistance = 15; // The distance within which the player should jump randomly

let yaw = 0;
const pitchLimit = Math.PI / 2 - 0.1;
let pitch = 0;
const radius = 3;

window.addEventListener('keydown', (event) => {
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

document.addEventListener('mousemove', (event) => {
  if (controls.isLocked) {
    yaw -= event.movementX * 0.002;
    pitch -= event.movementY * (-0.002);
    pitch = Math.max(-pitchLimit, Math.min(pitchLimit, pitch));
  }
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  world.step(1 / 60);
  if (mixer) mixer.update(delta);
  movePlayer();

  if (player) {
    player.position.copy(playerBody.position);
    player.quaternion.copy(playerBody.quaternion);

    const cameraX = player.position.x - radius * Math.sin(yaw) * Math.cos(pitch);
    const cameraY = player.position.y + radius * Math.sin(pitch);
    const cameraZ = player.position.z - radius * Math.cos(yaw) * Math.cos(pitch);

    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(player.position);
    player.rotation.y = yaw;
  }

    // Update stone mesh positions based on their physics bodies
    scene.traverse((object) => {
      if (object.userData.body) {  // Check if the object has an associated physics body
        const stoneBody = object.userData.body;
        object.position.copy(stoneBody.position);  // Sync mesh position with physics body
        object.quaternion.copy(stoneBody.quaternion);  // Sync mesh rotation with physics body
      }
    });

  renderer.render(scene, camera);
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

  if (moveDirection.length() > 0) {
    const speedValue = isRunning ? speed.run : speed.walk;
    playerBody.velocity.x = moveDirection.x * speedValue;
    playerBody.velocity.z = moveDirection.z * speedValue;

    const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
    player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetRotation, 0.1) + Math.PI;
  }

  if (keys.space) {
    if (keys.shift) {
      // Shift + Space: Fly upward
      playerBody.velocity.y = jumpForce; // Ascend upwards with a custom force
    } else if (playerBody.position.y <= 1.6) {
      // playerBody.velocity.y = jumpForce;
    }
  }

    // Check for proximity to the tornado and apply random jump
    checkTornadoProximity();

  playerBody.velocity.y = Math.max(playerBody.velocity.y, -20);
  updatePlayerAnimation();
}


// Function to check if the player is close to the tornado and make them jump randomly
function checkTornadoProximity() {
  if (!tornadoGroup || !player) return;

  // Calculate distance from the player to the tornado
  const tornadoPos = tornadoGroup.position;
  const playerPos = player.position;

  const distanceToTornado = playerPos.distanceTo(tornadoPos);

  // If the player is within the proximity range of the tornado, make them jump randomly
  if (distanceToTornado < tornadoProximityDistance) {
    // Apply a random jump force vertically when close to the tornado
    playerBody.velocity.y = THREE.MathUtils.randFloat(randomJumpForceMin, randomJumpForceMax);
  }
}

function updatePlayerAnimation() {
  if (!player || !mixer) return;
  let newAction;

  if (isMoving) {
    if (isRunning) {
      newAction = actions['crawl']; // Play run animation
    } else {
      newAction = actions['walk']; // Play walk animation
      // newAction = actions['run']; 
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

// Start the animation loop
animate();
