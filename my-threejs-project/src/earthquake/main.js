import './style.css';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon'; // Import Cannon.js
import { createForest } from './tree.js'; // Import tree functions
import { createWall, createAllWalls } from './wall.js'; // Import wall creation functions
import { loadChandelier, dropChandelier, startEarthquake } from './chandelier';
import { chandelier, chandelierBody } from './globals';
import { loadStones, updateStones, removeStones, playerHealth, updateHealth, update } from './Stones.js';
import { loadRoads, roads } from './road.js';
import { loadStreetLights1, loadStreetLights2 } from './streetLight.js';
import { createTable } from './table.js';
import { loadSofa } from './sofa.js';

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

// Call the function to create the forest (multiple trees)
createForest(scene, world);

// Create all walls
createAllWalls(scene, world);

// Load the chandelier
loadChandelier(scene, world);

createTable(scene, world);

// Load sofa1 and sofa2 with different positions and rotations
loadSofa(scene, world, { x: 6.5, y: 0.2, z: -4 }, -Math.PI / 2);
loadSofa(scene, world, { x: -6.5, y: 0.2, z: -4 }, Math.PI / 2);

// Load roads into the scene and physics world

const roadPositions = [
  new THREE.Vector3(0, 0.3, 6.8),
  new THREE.Vector3(0, 0.3, 16.8),
  new THREE.Vector3(0, 0.3, 26.8),
];

loadRoads(scene, world, roadPositions);

const streetLight1Positions = [
  new THREE.Vector3(6.5, 0, 7),
  new THREE.Vector3(-6.1, 0, 7)
];

// Load street lights into the scene and physics world
loadStreetLights1(scene, world, streetLight1Positions);

const streetLight2Positions = [
  new THREE.Vector3(-10.8, 0, 17),
  new THREE.Vector3(10.7, 0, 17)
];

// Load street lights into the scene and physics world
loadStreetLights2(scene, world, streetLight2Positions);

// Button to drop chandelier
document.getElementById('dropChandelierBtn').addEventListener('click', () => {
  // dropChandelier(playerBody); // Pass the player's body to check the position

  const chandelierPosition = window.chandelier.position;
  const playerPosition = playerBody.position;

  // Check if player's x and z positions match chandelier's x and z positions
  const isDirectlyBelow = Math.abs(playerPosition.x) - Math.abs(chandelierPosition.x) < 0.8 &&
    Math.abs(playerPosition.z) - Math.abs(chandelierPosition.z) < 0.8;

  startEarthquake(world, scene);
  setTimeout(() => {
    dropChandelier(world, scene); // Reset the flag
  }, 30000);
  // simulateEarthquake(100000);
  // if (isDirectlyBelow) {
  //   console.log("Dropping chandelier");
  //       // Set chandelier body mass to 1 to allow it to fall
  //   dropChandelier(); // Pass the player's body to check the position
  // } else {
  //   console.log("Player is not directly below the chandelier.");
  // }
});
// loadStones(scene,world);

// const greyPlaneGeometry = new THREE.PlaneGeometry(2, 4); // Adjust size as needed
// const greyPlaneMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Grey color
// const greyPlane = new THREE.Mesh(greyPlaneGeometry, greyPlaneMaterial);

// // Position the plane near the door
// greyPlane.position.set(-1.5, 2, 3.8); // Adjust position relative to the door's position
// greyPlane.rotation.z = -Math.PI / 2; // Rotate the plane vertically

// // Add the plane to the scene
// scene.add(greyPlane);

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
let floor;
//Door
let door1;
gltfLoader.load('../../models/earthquake/door.glb', (gltf) => {
  door1 = gltf.scene;
  door1.scale.set(0.5, 0.5, 0.5);
  door1.position.set(-0.1, 0.42, 2);
  scene.add(door1);
})
let door;
gltfLoader.load('../../models/earthquake/door.glb', (gltf) => {
  door = gltf.scene;
  door.scale.set(0.5, 0.5, 0.5);
  door.position.set(-0.13, 0.42, 1.8);
  scene.add(door);
  door.traverse((object) => {
    const box = new THREE.Box3().setFromObject(object); // Calculate bounding box after scaling

    // Calculate the center and size of the bounding box
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Create a Cannon.js box shape based on the size of the bounding box
    const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);
    const shape = new CANNON.Box(halfExtents);

    // Create a physical body in Cannon.js
    const body = new CANNON.Body({
      mass: 0, // Mass of the object
      position: new CANNON.Vec3(center.x, center.y, center.z), // Use the center of the bounding box for positioning
      shape: shape,
    });

    // Add the body to the physics world
    world.addBody(body);
  })
});

export let first_aid_box1;
export let first_aid_box2;
let first_aid_body;
gltfLoader.load('../../models/earthquake/first_aid_box.glb', (gltf) => {
  first_aid_box1 = gltf.scene;
  first_aid_box1.scale.set(0.11, 0.11, 0.11);
  first_aid_box1.position.set(4.4, 1, -0.8);
  scene.add(first_aid_box1);

});
gltfLoader.load('../../models/earthquake/first_aid_box.glb', (gltf) => {
  first_aid_box2 = gltf.scene;
  first_aid_box2.scale.set(0.11, 0.11, 0.11);
  first_aid_box2.position.set(-4.4, 1, -0.8);
  scene.add(first_aid_box2);

});
// Define a flag to show if the player is near the door
let nearDoor = false;
const doorLeaveDistance = 2; // The distance within which the player can interact with the door
let isMessageDisplayed = false;

// Position outside the room (where you want the player to be moved after leaving)
const outsidePosition = new CANNON.Vec3(0, 1.6, 7); // Set this to where you want the player to appear after leaving

// Function to check if the player is near the door
let isOutsideRoom = false; // Track whether the player is inside or outside the room
const insidePosition = new CANNON.Vec3(0, 1.6, 0); // Position inside the room near the door

// Check if the player is near the door (either inside or outside the room)
function hideLeaveRoomMessage() {
  const messageBox = document.getElementById('leaveRoomMessage');
  if (messageBox) {
    messageBox.remove();
  }
}

function checkProximityToDoor() {
  if (!playerBody || !door) return;

  const playerPosition = playerBody.position;
  const doorPosition = door.position;

  const distanceToDoor = playerPosition.distanceTo(doorPosition);

  if (distanceToDoor < doorLeaveDistance) {
    if (!isMessageDisplayed) {
      displayDoorInteractionMessage();
      isMessageDisplayed = true; // Set flag to true to avoid multiple messages
    }
    nearDoor = true;
  } else {
    nearDoor = false;
    isMessageDisplayed = false;
    hideLeaveRoomMessage();
    // Reset flag when player moves away from the door
  }
}

// Display a message for entering/leaving the room based on the player's position
function displayDoorInteractionMessage() {
  const messageBox = document.createElement('div');
  messageBox.id = 'leaveRoomMessage';
  messageBox.style.position = 'absolute';
  messageBox.style.top = '20%';
  messageBox.style.left = '50%';
  messageBox.style.transform = 'translate(-50%, -50%)';
  messageBox.style.padding = '10px';
  messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  messageBox.style.color = '#fff';
  messageBox.style.fontSize = '20px';

  if (isOutsideRoom) {
    messageBox.innerText = 'Do you want to enter the room? Press Y to enter or N to stay outside.';
  } else {
    messageBox.innerText = 'Do you want to leave the room? Press Y to leave or N to stay inside.';
  }

  document.body.appendChild(messageBox);
}

// Handle player input for entering or leaving
window.addEventListener('keydown', (event) => {
  if (nearDoor && isMessageDisplayed) {
    if (event.key.toLowerCase() === 'y') {
      if (isOutsideRoom) {
        // Move player inside the room
        playerBody.position.copy(insidePosition);
        isOutsideRoom = false;
      } else {
        // Move player outside the room
        playerBody.position.copy(outsidePosition);
        isOutsideRoom = true;
      }
      hideLeaveRoomMessage();
      isMessageDisplayed = false;
    } else if (event.key.toLowerCase() === 'n') {
      hideLeaveRoomMessage();
      isMessageDisplayed = false;
    }
  }
});

gltfLoader.load('../../models/earthquake/room.glb', (gltf) => {
  const room = gltf.scene;
  room.scale.set(0.5, 0.5, 0.5);
  room.position.set(0, -4.3, 0);
  scene.add(room);
  // Load the textures
  const textureLoader = new THREE.TextureLoader();
  texture1 = textureLoader.load('../../models/earthquake/crack.jpg'); // Replace with your texture path

  // // Find the existing plane named 'Plane001'

  texture2 = plane1.material.map;

  // // Apply the texture to the plane's material;

  // // Animation loop (if needed)
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  // // Start the animation
  animate();

  // Traverse through each object in the room and create colliders
  // room.traverse((object) => {
  //   // if (object.isMesh && object.name === 'Cube010') {
  //   const box = new THREE.Box3().setFromObject(object); // Calculate bounding box after scaling

  //   // Calculate the center and size of the bounding box
  //   const center = new THREE.Vector3();
  //   box.getCenter(center);
  //   const size = new THREE.Vector3();
  //   box.getSize(size);

  //   // Create a Cannon.js box shape based on the size of the bounding box
  //   const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);
  //   const shape = new CANNON.Box(halfExtents);

  //   // Create a physical body in Cannon.js
  //   const body = new CANNON.Body({
  //     mass: 0, // Mass of the object
  //     position: new CANNON.Vec3(center.x, center.y, center.z), // Use the center of the bounding box for positioning
  //     shape: shape,
  //   });

  //   // Add the body to the physics world
  //   world.addBody(body);
  //   // }
  // });
}, undefined, (error) => {
  console.error('An error occurred while loading the GLB model:', error);
});

export let crack1; // Declare the crack object

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

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (camera.position.y > 0) {
    // Set floor opacity to 1 if camera Y is greater than 0
    if (floor) {
      floor.material.opacity = 1;
      floor.material.needsUpdate = true;  // Ensure material updates
    }

    // Set road opacity to 1
    roads.forEach((road) => {
      if (road && road.material) {
        road.material.opacity = 1;
        road.material.transparent = true;
        road.material.needsUpdate = true;
      }
    });
  } else {
    // Set floor opacity to 0 if camera Y is less than or equal to 0
    // arr = [floor2,floor3,floor4,floor5,floor6,floor,floor7];
    if (floor) {
      floor.material.opacity = 0.2;
      floor.material.transparent = true;
      floor.material.needsUpdate = true;  // Ensure material updates
    }

    // console.log(3);
    // Set road opacity to 0
    roads.forEach((road) => {
      // console.log(road);
      if (road) {
        road.material.opacity = 0.6;
        // console.log(1);
        road.material.transparent = true;
        road.material.needsUpdate = true;
      }
    });
  }
  // Step the physics world
  world.step(1 / 60);
  // Update stones position
  checkProximityToDoor();
  updateStones(playerBody, world, scene);  // Add this to sync stone positions with physics bodies

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

  // if (tableTop){
  //   tableTop.position.copy(tableBody.position);
  //   tableTop.quaternion.copy(tableBody.quaternion);
  // }
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
    newAction = actions['sleep'];
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
// Move player function
// Call updatePlayerAnimation within movePlayer
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
      // Normal jump (only if player is grounded)
      /* The above code is setting the vertical velocity of the player's body to a value specified by
      the variable `jumpForce`, which likely represents the force applied to make the player
      character jump in a game or simulation. This line of code is responsible for implementing a
      regular jump action for the player character. */
      // playerBody.velocity.y = jumpForce; // Regular jump
    }
  }

  // Reset Y velocity for better control
  playerBody.velocity.y = Math.max(playerBody.velocity.y, -20);

  if ((playerBody.position.x - first_aid_box1.position.x >= -0.5 && playerBody.position.x - first_aid_box1.position.x <= 0.5) && (playerBody.position.z - first_aid_box1.position.z >= -0.5 && playerBody.position.z - first_aid_box1.position.z <= 0.5)) {
    update(30);
    updateHealth(playerBody);
    if (first_aid_box1) {
      scene.remove(first_aid_box1); // Remove the object from the scene
      // world.remove(first_aid_body);
    }

  }
  if ((playerBody.position.x - first_aid_box2.position.x >= -0.5 && playerBody.position.x - first_aid_box2.position.x <= 0.5) && (playerBody.position.z - first_aid_box2.position.z >= -0.5 && playerBody.position.z - first_aid_box2.position.z <= 0.5)) {
    update(30);
    updateHealth(playerBody);
    if (first_aid_box2) {
      scene.remove(first_aid_box2); // Remove the object from the scene
      // world.remove(first_aid_body);
    }

  }
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





export let floor2;
gltfLoader.load('../../models/earthquake/floor2.glb', (gltf) => {
  floor2 = gltf.scene;
  floor2.scale.set(1, 1, 1); // Scale adjustment
  floor2.position.set(-1, 0.2, 0); // Position adjustment
  floor2.visible = true;
  scene.add(floor2);
});

export let floor3;
gltfLoader.load('../../models/earthquake/floor2.glb', (gltf) => {
  floor3 = gltf.scene;
  floor3.scale.set(1, 1, 1); // Scale adjustment
  floor3.position.set(4.63, 0.2, 0); // Position adjustment
  floor3.visible = true;
  scene.add(floor3);
});

export let floor4;
gltfLoader.load('../../models/earthquake/floor2.glb', (gltf) => {
  floor4 = gltf.scene;
  floor4.scale.set(1, 1, 1); // Scale adjustment
  floor4.position.set(-6.6, 0.2, 0); // Position adjustment
  floor4.visible = true;
  scene.add(floor4);
});

export let floor5;
gltfLoader.load('../../models/earthquake/floor2.glb', (gltf) => {
  floor5 = gltf.scene;
  floor5.scale.set(1, 1, 1); // Scale adjustment
  floor5.position.set(-1, 0.2, -8.54); // Position adjustment
  floor5.visible = true;
  scene.add(floor5);
});


export let floor6;
gltfLoader.load('../../models/earthquake/floor2.glb', (gltf) => {
  floor6 = gltf.scene;
  floor6.scale.set(1, 1, 1); // Scale adjustment
  floor6.position.set(4.63, 0.2, -8.54); // Position adjustment
  floor6.visible = true;
  scene.add(floor6);
});

export let floor7;
gltfLoader.load('../../models/earthquake/floor2.glb', (gltf) => {
  floor7 = gltf.scene;
  floor7.scale.set(1, 1, 1); // Scale adjustment
  floor7.position.set(-6.6, 0.2, -8.53); // Position adjustment
  floor7.visible = true;
  scene.add(floor7);
});



gltfLoader.load('../../models/earthquake/crack.glb', (gltf) => {
  crack1 = gltf.scene;
  crack1.scale.set(2, 1, 3); // Scale adjustment
  crack1.position.set(3, 0.05, 0.53); // Position adjustment
  crack1.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0x808080); // Change color to red
    }
  });
  crack1.visible = false;
  scene.add(crack1);
  console.log(1);
});

export let crack2;

gltfLoader.load('../../models/earthquake/crack.glb', (gltf) => {
  crack2 = gltf.scene;
  crack2.scale.set(2, 1, 3); // Scale adjustment
  crack2.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0x808080); // Change color to red
    }
  });
  crack2.position.set(3, 0.05, -4.5); // Position adjustment
  crack2.visible = false;
  scene.add(crack2);
  console.log(1);
});

export let crack3;

gltfLoader.load('../../models/earthquake/crack.glb', (gltf) => {
  crack3 = gltf.scene;
  crack3.scale.set(2, 1, 2); // Scale adjustment
  crack3.position.set(-4, 0.05, -4.5); // Position adjustment
  crack3.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0x808080); // Change color to red
    }
  });
  crack3.visible = false;
  scene.add(crack3);
  console.log(1);
});

export let crack4;

gltfLoader.load('../../models/earthquake/crack.glb', (gltf) => {
  crack4 = gltf.scene;
  crack4.scale.set(2, 1, 2); // Scale adjustment
  crack4.position.set(-4, 0.05, -0.53); // Position adjustment
  crack4.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0x808080); // Change color to red
    }
  });
  crack4.visible = false;
  scene.add(crack4);
  console.log(1);
});




// Start the animation
animate();


export function rstgame() {
  removeStones(world, scene)
}

