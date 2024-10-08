import './style.css';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon'; // Import Cannon.js
import { createForest } from './tree'; // Import tree functions
import { createWall, createAllWalls } from './wall'; // Import wall creation functions
import { loadChandelier, dropChandelier, startEarthquake } from './chandelier';
import { chandelier, chandelierBody } from './globals.js';
import { loadStones, updateStones, removeStones , playerHealth , updateHealth , update} from './Stones.js';
import { loadRoads, roads } from './road.js';
import { loadStreetLights1, loadStreetLights2 } from './streetLight.js';
import { createTable  } from './table.js';

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

const streetLight1Positions = [
  new THREE.Vector3(4.2, 0, 10),
  new THREE.Vector3(-7.2, 0, 10)
];

// Load street lights into the scene and physics world
loadStreetLights1(scene, world, streetLight1Positions);

const streetLight2Positions = [
  new THREE.Vector3(-11.2, 0, 23),
  new THREE.Vector3(8.2, 0, 23)
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
  }, 10000);
});

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
const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
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
// CANNON.js setup (Physics)
// const planeShapeTop = new CANNON.Box(new CANNON.Vec3(15, 0.01, 15)); // Length 5, Breadth 5
// const planeBodyTop = new CANNON.Body({
//   mass: 0 // Static object
// });
// planeBodyTop.addShape(planeShapeTop);
// planeBodyTop.position.set(0, 5.5, -3);
// planeBodyTop.quaternion.setFromEuler(0, 0, 0);
// world.addBody(planeBodyTop); // Add to physics world

const planeShapeFront = new CANNON.Box(new CANNON.Vec3(15, 0.01, 15)); // Length 5, Breadth 5
const planeBodyFront = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyFront.addShape(planeShapeFront);
planeBodyFront.position.set(0.48, 0.48, -6);
planeBodyFront.quaternion.setFromEuler(-Math.PI/2, 0, 0);
world.addBody(planeBodyFront); // Add to physics world

const planeShapeRight = new CANNON.Box(new CANNON.Vec3(4, 0.01, 2)); // Length 5, Breadth 5
const planeBodyRight = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyRight.addShape(planeShapeRight);
planeBodyRight.position.set(7.4, 0.42, -3.8);
planeBodyRight.quaternion.setFromEuler(-Math.PI/2,Math.PI , -Math.PI/2);
world.addBody(planeBodyRight); // Add to physics world

const planeShapeLeft = new CANNON.Box(new CANNON.Vec3(4, 0.01, 2)); // Length 5, Breadth 5
const planeBodyLeft = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyLeft.addShape(planeShapeLeft);
planeBodyLeft.position.set(-6.8, 0.42, -3.8);
planeBodyLeft.quaternion.setFromEuler(-Math.PI/2,Math.PI , -Math.PI/2);
world.addBody(planeBodyLeft); // Add to physics world
const planeShapeBack1 = new CANNON.Box(new CANNON.Vec3(2.2, 0.01, 3)); // Length 5, Breadth 5
const planeBodyBack1 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack1.addShape(planeShapeBack1);
planeBodyBack1.position.set(6.23, 0.4, -1.5);
planeBodyBack1.quaternion.setFromEuler(-Math.PI/2, 0, 0);
world.addBody(planeBodyBack1); // Add to physics world

const planeShapeBack2 = new CANNON.Box(new CANNON.Vec3(2.2, 0.01, 3)); // Length 5, Breadth 5
const planeBodyBack2 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack2.addShape(planeShapeBack2);
planeBodyBack2.position.set(-6.5, 0.4, -1.5);
planeBodyBack2.quaternion.setFromEuler(-Math.PI/2, 0, 0);
world.addBody(planeBodyBack2); // Add to physics world
const planeShapeBack3 = new CANNON.Box(new CANNON.Vec3(2.2, 0.01, 3)); // Length 5, Breadth 5
const planeBodyBack3 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack3.addShape(planeShapeBack3);
planeBodyBack3.position.set(3.1,0.42,0.27);
planeBodyBack3.quaternion.setFromEuler(-Math.PI/2, 0, 0);
world.addBody(planeBodyBack3); // Add to physics world
const planeShapeBack4 = new CANNON.Box(new CANNON.Vec3(2.2, 0.01, 3)); // Length 5, Breadth 5
const planeBodyBack4 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack4.addShape(planeShapeBack4);
planeBodyBack4.position.set(-3.4,0.42,0.19);
planeBodyBack4.quaternion.setFromEuler(-Math.PI/2, 0, 0);
world.addBody(planeBodyBack4); // Add to physics world
const planeShapeBack5 = new CANNON.Box(new CANNON.Vec3(1.2, 0.01, 2)); // Length 5, Breadth 5
const planeBodyBack5 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack5.addShape(planeShapeBack5);
planeBodyBack5.position.set(4.4,0.42,-0.24);
planeBodyBack5.quaternion.setFromEuler(-Math.PI/2,Math.PI , -Math.PI/2);
world.addBody(planeBodyBack5); // Add to physics world
const planeShapeBack6 = new CANNON.Box(new CANNON.Vec3(1.2, 0.01, 2)); // Length 5, Breadth 5
const planeBodyBack6 = new CANNON.Body({
  mass: 0 // Static object
});
planeBodyBack6.addShape(planeShapeBack6);
planeBodyBack6.position.set(-4.4,0.42,-0.24);
planeBodyBack6.quaternion.setFromEuler(-Math.PI/2,Math.PI , -Math.PI/2);
world.addBody(planeBodyBack6); // Add to physics world
// THREE.js setup (Rendering)
// const planeGeometryTop = new THREE.BoxGeometry(5, 0.02, 5); // Length 5, Breadth 5
// const planeMaterialTop = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
// const planeMeshTop = new THREE.Mesh(planeGeometryTop, planeMaterialTop);
// scene.add(planeMeshTop); // Add to the THREE.js scene

// // Sync CANNON.js body position with THREE.js mesh
// planeMeshTop.position.copy(planeBodyTop.position);
// planeMeshTop.quaternion.copy(planeBodyTop.quaternion);



// Create Ground Mesh
// const planeGeometry = new THREE.PlaneGeometry(10, 10);
// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xA1662F  });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.rotation.x = -Math.PI / 2;
// plane.position.set(0, 0, 0);
// plane.receiveShadow = true;
// scene.add(plane);

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
gltfLoader.load('../models/mixed46.glb', (gltf) => {
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
let door;
gltfLoader.load('../models/door.glb', (gltf) => {
  door = gltf.scene;
  door.scale.set(0.5, 0.5, 0.5); // Scale adjustment
  door.position.set(-0.13,0.42,1.8); // Position adjustment
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



export let first_aid_box;
let first_aid_body;
gltfLoader.load('../models/first_aid_box.glb', (gltf) => {
  first_aid_box = gltf.scene;
  first_aid_box.scale.set(0.022, 0.022, 0.022); // Scale adjustment
  first_aid_box.position.set(-1, 0.1, 2); // Position adjustment
  scene.add(first_aid_box);
  // first_aid_box.traverse((object) => {
  //   const box = new THREE.Box3().setFromObject(object); // Calculate bounding box after scaling

  //   // Calculate the center and size of the bounding box
  //   const center = new THREE.Vector3();
  //   box.getCenter(center);
  //   const size = new THREE.Vector3();
  //   box.getSize(size);

  //   // Create a Cannon.js box shape based on the size of the bounding box
  //   const halfExtents = new CANNON.Vec3(0.022, 0.022, 0.022);
  //   const shape = new CANNON.Box(halfExtents);

  //   // Create a physical body in Cannon.js
  //   const first_aid_body = new CANNON.Body({
  //     mass: 0, // Mass of the object
  //     position: new CANNON.Vec3(-1, 0.1, 2), // Use the center of the bounding box for positioning
  //     shape: shape,
  //   });

  //   // Add the body to the physics world
  //   world.addBody(first_aid_body);
  // })

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
gltfLoader.load('../models/room.glb', (gltf) => {
  const room = gltf.scene;
  room.scale.set(0.5, 0.5, 0.5); // Scale adjustment
  room.position.set(0, -4.3, 0); // Position adjustment
  scene.add(room);
}, undefined, (error) => {
  console.error('An error occurred while loading the GLB model:', error);
});

export let crack; // Declare the crack object

const textureLoader = new THREE.TextureLoader();



// Controls
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => {
  controls.lock();
});

// Player Movement
const keys = { w: false, a: false, s: false, d: false, space: false, shift: false };
const jumpForce = 5;
const speed = { walk: 7, run: 10 };
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
  updateStones(playerBody);  // Add this to sync stone positions with physics bodies

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
    player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetRotation, 0.1)+Math.PI;
  }

  // Jumping
  if (keys.space) {
    if (keys.shift) {
      // Shift + Space: Fly upward
      playerBody.velocity.y = jumpForce; // Ascend upwards with a custom force
    } else if (playerBody.position.y <= 1.6) {
      // Normal jump (only if player is grounded)
      playerBody.velocity.y = jumpForce; // Regular jump
    }
  }

  // Reset Y velocity for better control
  playerBody.velocity.y = Math.max(playerBody.velocity.y, -20);

  if((playerBody.position.x - first_aid_box.position.x >= -0.5 &&  playerBody.position.x - first_aid_box.position.x <= 0.5 ) && (playerBody.position.z - first_aid_box.position.z >= -0.5 &&  playerBody.position.z - first_aid_box.position.z <= 0.5 ))
  {
    update(30);
     updateHealth(playerBody);
     if (first_aid_box ) {
      scene.remove(first_aid_box); // Remove the object from the scene
      // world.remove(first_aid_body);
    }
    console.log("mingey");
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


// Start the animation
animate();


export function rstgame() {
  removeStones(world, scene)
}

