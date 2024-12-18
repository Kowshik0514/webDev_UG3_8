import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon"; // Import Cannon.js
import { AnimationMixer } from "three";
import { Euler } from "three";
// Scene
export const scene = new THREE.Scene();
export let playerBody = null;
playerBody = new CANNON.Body({
  mass: 1, // Set player mass to 1 to respond to gravity
  position: new CANNON.Vec3(0.5, 2.5, 0), // Initial position
  fixedRotation: true, // Prevent unwanted rolling
});
let playerHealth = 100; // Initialize player's health
const healthBarContainer = document.createElement("div");
const healthBar = document.createElement("div");
const loadingScreen = document.getElementById('loadingScreen');
let loaded1 = false;
let loaded2 = false;


// Style the health bar container
healthBarContainer.style.position = "absolute";
healthBarContainer.style.bottom = "20px"; // Position at the bottom
healthBarContainer.style.left = "20px"; // Position to the left
healthBarContainer.style.width = "200px"; // Fixed width for container
healthBarContainer.style.height = "30px"; // Fixed height for container
healthBarContainer.style.border = "2px solid black";
healthBarContainer.style.backgroundColor = "#555"; // Darker background behind the health bar
healthBarContainer.style.borderRadius = "5px";

// Style the actual health bar
healthBar.style.height = "100%"; // Full height of the container
healthBar.style.width = "100%"; // Full width initially (100%)
healthBar.style.backgroundColor = "green"; // Green to indicate health
healthBar.style.borderRadius = "5px";

// Add the health bar to the container and then the container to the document
healthBarContainer.appendChild(healthBar);
document.body.appendChild(healthBarContainer);
let names = [];
export function update(health) {
  playerHealth = Math.min(100, playerHealth + health);
}

export function refill_health() {
  playerHealth = 100; // Reset health for testing purposes
  // playerBody.position.set(0, 1.6, 0); // Reset player position (if applicable)
  healthBar.style.width = "100%"; // Reset health bar
  healthBar.style.backgroundColor = "green"; // Reset health bar color
}
export function updateHealth() {
  // Calculate the health percentage
  const healthPercentage = Math.max(playerHealth, 0); // Prevent negative width
  healthBar.style.width = `${healthPercentage}%`;

  // Change color based on health level
  if (healthPercentage > 50) {
    healthBar.style.backgroundColor = "green";
  } else if (healthPercentage > 25) {
    healthBar.style.backgroundColor = "yellow";
  } else {
    healthBar.style.backgroundColor = "red";
  }

  // If player's health reaches 0, end the game
  if (playerHealth <= 0) {
    // alert('Game Over!');
    if(diedPole) document.getElementById("go").innerHTML = "Game Over! You touched the pole!";
    else if(diedWater) document.getElementById("go").innerHTML = "Game Over! You drowned in the water!";
    else{
      let won ="";
      if( names.includes("Fruits") == false && names.includes("Certificates") == false)
      {
          won = won + "\nbut you didn't carry food and important documents";
      }
      else if( names.includes("Fruits") == false)
      {
        won = won + "\nbut you didn't carry food";
      }
      else if( names.includes("Rabbit") == false)
      {
        won = won + "\n, be kind to animals during flood";
      }
      else if(names.includes("Certificates") == false)
      {
        won = won + "\nbut you didn't carry important documents";
      }
      document.getElementById("go").innerHTML = "You Won !" + won;
    } 
    document.getElementById("gameOverPopup").style.display = "flex";
    // restartGame();
    // refill_health(playerBody)
    playerHealth = 100; // Reset health for testing purposes
    playerBody.position.set(0, 1.6, 0); // Reset player position (if applicable)
    healthBar.style.width = "100%"; // Reset health bar
    healthBar.style.backgroundColor = "green"; // Reset health bar color
  }
}
let diedPole = false;
let diedWater = false;
let isAlive = true;
// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.6, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
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
  mass: 0, // Mass of 0 for static objects
});
planeBody1.addShape(planeShape1);
planeBody1.position.set(1, 0, 0);
planeBody1.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody1); // Add planeBody to the world

// Sky Sphere (for a 360-degree sky effect)
const skyGeometry = new THREE.SphereGeometry(500, 100, 100);
const skyMaterial = new THREE.MeshBasicMaterial({
  color:0xB0C4DE, // Sky blue color
  side: THREE.BackSide, // Render the inside of the sphere
});
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);
const planeGeometry1 = new THREE.PlaneGeometry(1000, 1000); // Visual grouplanend 
const planeMaterial1 = new THREE.MeshStandardMaterial({ 
  color: 0x323b2c, // A slightly greyish blue
  //emissive: 0x3a4a62, // A darker, less saturated blue-grey for emissive
  //emissiveIntensity: 0.5, // Subtle emissive effect
  // metalness: 0.3, // Slight metallic sheen
  // roughness: 0.7, 
    transparent: true,
    opacity:1  // Transparent
 });
export const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
plane1.rotation.x = -Math.PI / 2; // Rotate the mesh to lie horizontally
plane1.position.set(1, 0, 0); // Set ground position at Y = 0
plane1.receiveShadow = true;
scene.add(plane1);

// Ground Plane
export let planeShape = new CANNON.Plane();
export let planeBody = new CANNON.Body({
  mass: 0, // Mass of 0 for static objects
});
planeBody.addShape(planeShape);
planeBody.position.set(0, 0, 0);
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody); // Add planeBody to the world

const planeShapeFront = new CANNON.Box(new CANNON.Vec3(15, 0.01, 15)); // Length 5, Breadth 5
const planeBodyFront = new CANNON.Body({
  mass: 0, // Static object
});




const houseCollider1 = new CANNON.Box(new CANNON.Vec3(0.4, 100, 1.5)); 
const houseColliderbody1 = new CANNON.Body({
  mass: 0 ,
  color: "blue"
});
houseColliderbody1.addShape(houseCollider1);
houseColliderbody1.position.set(1.35, 0, 1.5);
houseColliderbody1.quaternion.setFromEuler(0, 0, 0);
world.addBody(houseColliderbody1);

const houseCollider2 = new CANNON.Box(new CANNON.Vec3(0.4, 100, 1.5)); 
const houseColliderbody2 = new CANNON.Body({
  mass: 0 ,
  color: "blue"
});
houseColliderbody2.addShape(houseCollider2);
houseColliderbody2.position.set(1.35, 0, -2.5);
houseColliderbody2.quaternion.setFromEuler(0, 0, 0);
world.addBody(houseColliderbody2);

const houseCollider3 = new CANNON.Box(new CANNON.Vec3(0.6, 100, 4)); 
const houseColliderbody3 = new CANNON.Body({
  mass: 0 ,
  color: "blue"
});
houseColliderbody3.addShape(houseCollider3);
houseColliderbody3.position.set(-2.85, 0, 0);
houseColliderbody3.quaternion.setFromEuler(0, 0, 0);
world.addBody(houseColliderbody3);

const houseCollider4 = new CANNON.Box(new CANNON.Vec3(1.7, 100, 0.4)); 
const houseColliderbody4 = new CANNON.Body({
  mass: 0 ,
  color: "blue"
});
houseColliderbody4.addShape(houseCollider4);
houseColliderbody4.position.set(-0.4, 0, 3.52);
houseColliderbody4.quaternion.setFromEuler(0, 0, 0);
world.addBody(houseColliderbody4);

const houseCollider5 = new CANNON.Box(new CANNON.Vec3(1.7, 100, 0.5)); 
const houseColliderbody5 = new CANNON.Body({
  mass: 0 ,
  color: "blue"
});
houseColliderbody5.addShape(houseCollider5);
houseColliderbody5.position.set(-0.4, 0, -3.9);
houseColliderbody5.quaternion.setFromEuler(0, 0, 0);
world.addBody(houseColliderbody5);

const tableCollider1 = new CANNON.Box(new CANNON.Vec3(0.6, 100, 0.5)); 
const tableColliderBody1 = new CANNON.Body({
  mass: 0 ,
  color: "blue"
});
tableColliderBody1.addShape(tableCollider1);
tableColliderBody1.position.set(-1.0, 0, 1.95);
tableColliderBody1.quaternion.setFromEuler(0, 0, 0);
world.addBody(tableColliderBody1);

const tableCollider2 = new CANNON.Box(new CANNON.Vec3(0.6, 100, 0.5)); 
const tableColliderBody2 = new CANNON.Body({
  mass: 0 ,
  color: "blue"
});
tableColliderBody2.addShape(tableCollider2);
tableColliderBody2.position.set(-1.0, 0, -1.95);
tableColliderBody2.quaternion.setFromEuler(0, 0, 0);
world.addBody(tableColliderBody2);


const tableCollider3 = new CANNON.Box(new CANNON.Vec3(3, 100, 2.35)); 
const tableColliderBody3 = new CANNON.Body({
  mass: 0 ,
  color: "blue"
});
tableColliderBody3.addShape(tableCollider3);
tableColliderBody3.position.set(10.0, 0, 9.7);
tableColliderBody3.quaternion.setFromEuler(0, 0, 0);
world.addBody(tableColliderBody3);

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
let field;
gltfLoader.load("/models/flood/grass_land.glb", (gltf) => {
  field = gltf.scene;
  field.scale.set(1, 1, 1); // Adjust scale if necessary
  field.rotation.x = -Math.PI / 100;
  scene.add(field);
  loaded1 = true;
  field.position.set(10, -4.7, 0);
});
let rabbit;
gltfLoader.load("/models/flood/rabbit.glb", (gltf) => {
  rabbit = gltf.scene;
  rabbit.scale.set(0.5, 0.5, 0.5); // Adjust scale if necessary
  scene.add(rabbit);
  rabbit.position.set(2, 0.3, 2);
});
// let house;
// gltfLoader.load("/models/flood/housed.glb", (gltf) => {
//   house = gltf.scene;
//   house.scale.set(10, 10, 10); // Adjust scale if necessary
//   scene.add(house);
//   house.position.set(15, 2, 10);
// });
// Load the character model
gltfLoader.load("/models/global_models/player2.glb", (gltf) => {
  player = gltf.scene;
  player.scale.set(0.5, 0.5, 0.5);
  player.rotation.y = Math.PI;
  scene.add(player);
  // console.log(player);

  const capsuleRadius = 0.25; // Player's radius (thickness)
  const capsuleHeight = 0.5; // Player's height

  // Create a capsule collider using two spheres and a cylinder
  const sphereTop = new CANNON.Sphere(0.25); // Top of the capsule
  const sphereBottom = new CANNON.Sphere(0); // Bottom of the capsule
  const cylinder = new CANNON.Cylinder(0,0,capsuleHeight - 2 * capsuleRadius,8); // The middle cylinder

  // Create playerBody with mass
  playerBody = new CANNON.Body({
    mass: 1, // Player mass
    position: new CANNON.Vec3(5, 10, 0), // Initial player position
    fixedRotation: true, // Prevent rolling
  });
  playerBody = new CANNON.Body({
    mass: 1, // Player mass
    position: new CANNON.Vec3(0.5, 0.1, 0), // Initial player position
    fixedRotation: true, // Prevent rolling
  });
  // Optionally add a tiny, nearly invisible shape if minimal collision is required

  // Add the shapes to the playerBody to form a capsule
  playerBody.addShape(sphereTop,new CANNON.Vec3(0, (capsuleHeight - capsuleRadius) / 2, 0)); // Position top sphere
  playerBody.addShape(sphereBottom,new CANNON.Vec3(0, -(capsuleHeight - capsuleRadius) / 2, 0)); // Position bottom sphere
  playerBody.addShape(sphereTop,new CANNON.Vec3(0, (capsuleHeight - capsuleRadius) / 2, 0)); // Position top sphere
  playerBody.addShape(sphereBottom,new CANNON.Vec3(0, -(capsuleHeight - capsuleRadius) / 2, 0)); // Position bottom sphere
  playerBody.addShape(cylinder); // Add the cylinder in the middle

  // Add playerBody to the physics world
  world.addBody(playerBody);

  mixer = new THREE.AnimationMixer(player);
  const animations = gltf.animations;
  animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    actions[clip.name.toLowerCase()] = action;
  });
  activeAction = actions["idle"];
  activeAction.play();
});
const raindropModel = [];
gltfLoader.load("/models/flood/raindrop.glb", (gltf) => {
  const raindrop = gltf.scene; // The raindrop model
  raindrop.scale.set(0.001, 0.001, 0.001); // Adjust scale if necessary

  // Create multiple instances of the raindrop model
  for (let i = 0; i < 3000; i++) {
      const drop = raindrop.clone(); // Clone the raindrop model
      drop.position.set(
          Math.random() * 200 - 100, // Random X position
          Math.random() * 200 - 100, // Random Y position
          Math.random() * 200 - 100  // Random Z position
      );
      scene.add(drop);
      raindropModel.push(drop); // Add to array to keep track of raindrops
  }
});
let water_mixer;
let model;
gltfLoader.load('/models/flood/opt_wave2.glb', (gltf) => {
  model = gltf.scene;
  model.rotation.x = Math.PI;
  model.scale.set(0.09, 0.005, 0.08); // Adjust scale if necessary
  scene.add(model);
  model.position.set(1, -1, 1);
  // model.material.transparent = true;
  water_mixer = new AnimationMixer(model);
  const action = water_mixer.clipAction(gltf.animations[0]);

  if (gltf.animations.length) {
    water_mixer = new AnimationMixer(model);

    // Play the first animation found
    const action = water_mixer.clipAction(gltf.animations[0]);
    action.play();
  } else {
    // console.warn('No animations found in the model');
  }

  // console.log("hi  ");
  // console.log(gltf.animations.length);
});

let tank;
gltfLoader.load("/models/flood/snowy_water_tank.glb", (gltf) => {
  tank = gltf.scene;
  // tank.setRotationFromEuler(new Euler(0, Math.PI, 0));

  tank.scale.set(8, 6, 8); // Adjust scale if necessary
  scene.add(tank);
  tank.position.set(10, 4, 10);
});

let room;
gltfLoader.load("/models/flood/house.glb", (gltf) => {
  room = gltf.scene;
  loaded2 = true;
  scene.add(room);
  room.position.set(0, -0.2, 0);
});

let pole;
gltfLoader.load("/models/flood/pole.glb", (gltf) => {
  pole = gltf.scene;
  // pole.setRotationFromEuler(new Euler(0, Math.PI, 0));

  pole.scale.set(1, 1, 1); // Adjust scale if necessary
  scene.add(pole);
  pole.position.set(15, 5, 3);
});

function checkDistanceToPole() {
  if (pole) {
    // Replace with the actual character position
    // Example position, adjust accordingly
    let distancex;
    let distancez;
    if(player)  distancex = Math.abs(pole.position.x - player.position.x);
    if(player) distancez = Math.abs(pole.position.z - player.position.z);

    if (distancex < 0.7 && distancez < 0.7 && model.position.y>0) {
      playerHealth = 0;
      diedPole = true;
      updateHealth();
    } else if (distancex < 1.5 && distancez < 1.5) {
      showWarning();
    } else if (distancex >= 1.5 || distancez >= 1.5) {
      hideWarning();
    }
  }
}

function showWarning() {
  if(model.position.y>0) document.getElementById("warningPopup").style.display = "block";
}

function hideWarning() {
  document.getElementById("warningPopup").style.display = "none";
}

let table;
gltfLoader.load("/models/flood/table2.glb", (gltf) => {
  table = gltf.scene;
  // table.setRotationFromEuler(new Euler(0, Math.PI, 0));

  table.scale.set(0.1, 0.11, 0.1); // Adjust scale if necessary
  scene.add(table);
  table.position.set(-1, 0.2, 2);
});

let table2;
gltfLoader.load("/models/flood/table2.glb", (gltf) => {
  table2 = gltf.scene;
  // table2.setRotationFromEuler(new Euler(0, Math.PI, 0));

  table2.scale.set(0.1, 0.11, 0.1); // Adjust scale if necessary
  scene.add(table2);
  table2.position.set(-1, 0.2, -2);
});

let fruit;
gltfLoader.load("/models/flood/fruit_bowl.glb", (gltf) => {
  fruit = gltf.scene;
  // fruit.setRotationFromEuler(new Euler(0, Math.PI, 0));

  fruit.scale.set(2, 2, 2); // Adjust scale if necessary
  scene.add(fruit);
  fruit.position.set(-0.7, 0.93, 2);
});



function showPopup() {
  document.getElementById("popup").style.display = "block";
}

function hidePopup() {
  document.getElementById("popup").style.display = "none";
}
let flag = true;
let taken = true;
document.getElementById("yesButton").addEventListener("click", () => {
  names.push("Fruits"); // Add fruit to the bag
  flag = false;
  hidePopup();
  taken = false;
  scene.remove(fruit);
});

document.getElementById("noButton").addEventListener("click", () => {
  flag = false;
  hidePopup();
});





function showPopup3() {
  document.getElementById("popup3").style.display = "block";
}

function hidePopup3() {
  document.getElementById("popup3").style.display = "none";
}
let flag3 = true;
let taken3 = true;

function checkDistanceToRabbit() {
  if (rabbit) {
    // Replace with the actual character position
    // Example position, adjust accordingly
    const distancex = Math.abs(rabbit.position.x - player.position.x);
    const distancez = Math.abs(rabbit.position.z - player.position.z);

    hidePopup3();
    if (distancex < 0.6 && flag3 === true && taken3 == true && distancez < 0.6) {
      showPopup3();
    } else if (distancex >= 0.6 || distancez >= 0.6) {
      hidePopup3();
      flag3= true;
    }
  }
}
document.getElementById("yesButton3").addEventListener("click", () => {
  names.push("Rabbit"); // Add fruit to the bag
  flag3 = false;
  hidePopup3();
  taken3 = false;
  scene.remove(rabbit);
});
document.getElementById("noButton3").addEventListener("click", () => {
  flag3 = false;
  hidePopup3();
});


let checkClimb = false;
let checkClimb1=false;
let climbMessageDisplayed = false;
let offset=0.5;

function checkNearLadder() {
  if (
    playerBody.position.x <= 10.27 + offset &&
    playerBody.position.x >= 10.27 - offset &&
    playerBody.position.z <= 6.97 + offset &&
    playerBody.position.z >= 6.97 - offset
  ) {
    checkClimb = true;
    showClimbMessage();
  } else {
    removeClimbMessage();
    checkClimb = false;
  }
}

function showClimbMessage() {
  if (checkClimb && !climbMessageDisplayed) {
    const message = document.createElement("div");
    message.id = "climbMessage";
    message.textContent = "Press and hold 'C' if you want to climb the ladder";
    message.style.position = "absolute";
    message.style.top = "50%";
    message.style.left = "50%";
    message.style.transform = "translate(-50%, -50%)";
    message.style.padding = "10px";
    message.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    message.style.color = "white";
    message.style.borderRadius = "5px";
    document.body.appendChild(message);

    climbMessageDisplayed = true;
  }
}

function removeClimbMessage() {
  const message = document.getElementById("climbMessage");
  if (message) {
    document.body.removeChild(message);
    climbMessageDisplayed = false;
  }
}
function checkDistanceToFruit() {
  if (fruit) {
    // Replace with the actual character position
    // Example position, adjust accordingly
    const distancex = Math.abs(fruit.position.x - player.position.x);
    const distancez = Math.abs(fruit.position.z - player.position.z);

    hidePopup();
    if (distancex < 0.6 && flag === true && taken == true && distancez < 0.6) {
      showPopup();
    } else if (distancex >= 0.6 || distancez >= 0.6) {
      hidePopup();
      flag = true;
    }
  }
}

document.getElementById("displayButton").addEventListener("click", showOverlay);
document.getElementById("closeButton").addEventListener("click", hideOverlay);

function showOverlay() {
  // Display overlay
  document.getElementById("overlay").style.display = "flex";

  // Populate overlay with names in a horizontal layout
  const nameList = document.getElementById("nameList");
  nameList.innerHTML = names.map((name) => `<span>${name}</span>`).join("");
}

function hideOverlay() {
  // Hide overlay
  document.getElementById("overlay").style.display = "none";
}

let radio;
gltfLoader.load("/models/flood/radio.glb", (gltf) => {
  radio = gltf.scene;
  // radio.setRotationFromEuler(new Euler(0, Math.PI, 0));
  radio.rotation.y = Math.PI / 2;
  radio.scale.set(0.0008, 0.001, 0.001); // Adjust scale if necessary
  scene.add(radio);
  radio.position.set(-1.2, 1.1, 2);
});

let paper;
gltfLoader.load("/models/flood/papers__envelopes.glb", (gltf) => {
  paper = gltf.scene;
  // paper.setRotationFromEuler(new Euler(0, Math.PI, 0));
  paper.rotation.y = Math.PI / 2;
  paper.scale.set(0.8, 1, 1); // Adjust scale if necessary
  scene.add(paper);
  paper.position.set(-1.2, 0.95, -2);
});

function showPopup2() {
  document.getElementById("popup2").style.display = "block";
}

function hidePopup2() {
  document.getElementById("popup2").style.display = "none";
}

let flag2 = true;
let taken2 = true;


document.getElementById("yesButton2").addEventListener("click", () => {
  names.push("Certificates"); // Add fruit to the bag
  flag2 = false;
  hidePopup2();
  taken2 = false;
  scene.remove(paper);
  paper=NULL;
});

document.getElementById("noButton2").addEventListener("click", () => {
  flag2 = false;
  hidePopup2();
});
function checkDistanceToPaper() {
  if (paper) {
    // Replace with the actual character position
    // Example position, adjust accordingly
    let distancex;
    let distancez;
    if(player)  distancex = Math.abs(paper.position.x - player.position.x);
    if(player) distancez = Math.abs(paper.position.z - player.position.z);
    hidePopup2();
    if (
      distancex < 0.7 &&
      flag2 === true &&
      taken2 == true &&
      distancez < 0.7
    ) {
      showPopup2();
    } else if (distancex >= 0.7 || distancez >= 0.7) {
      hidePopup2();
      flag2 = true;
    }
  }
}


let paper2; 
document.getElementById("restartButton").addEventListener("click", async () => {
  await restartGame();
});

const riseButton = document.createElement("button");
riseButton.innerText = "Raise Water Level";
riseButton.style.position = "absolute";
riseButton.style.backgroundColor = "cyan";
riseButton.style.top = "10px";
riseButton.style.left = "10px";
document.body.appendChild(riseButton);

riseButton.addEventListener("click", () => {
  // const audio = document.getElementById("myAudio");
  // audio.play();
  isRising = true;
});

// Controls
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener("click", () => {
  controls.lock();
});

// Player Movement
const keys = {
  w: false,
  a: false,
  c: false,
  s: false,
  d: false,
  space: false,
  shift: false,
};
const jumpForce = 2;
const speed = { walk: 25, run: 8, climb: 4 };
let isMoving = false;
let isRunning = false;
let isClimbing = false;
let isMoving_back = false;
let yaw = 0;
const pitchLimit = Math.PI / 2 - 0.1;
let pitch = 0;
const radius = 3;

window.addEventListener("keydown", (event) => {
  // console.log(event.key);  // Debug key presses

  if (event.key === " " || event.key.toLowerCase() in keys) {
    if (event.key === " ") {
      keys.space = true;
    } else {
      keys[event.key.toLowerCase()] = true;
    }
    isMoving = keys.w || keys.a || keys.d;
    isMoving_back = keys.s;
    isRunning = keys.shift;
    isClimbing = keys.c;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === " " || event.key.toLowerCase() in keys) {
    if (event.key === " ") {
      keys.space = false;
    } else {
      keys[event.key.toLowerCase()] = false;
    }
    isMoving = keys.w || keys.a || keys.d;
    isRunning = keys.shift;
    isClimbing = keys.c;
    isMoving_back = keys.s;
  }
});

// Mouse movement
document.addEventListener("mousemove", (event) => {
  if (controls.isLocked && !checkClimb1) {
    yaw -= event.movementX * 0.002;
    pitch -= event.movementY * -0.002;
    pitch = Math.max(-pitchLimit, Math.min(pitchLimit, pitch));
  }
});
const clock = new THREE.Clock();
let isFloodWaterReached = false;
let isRising = false;
// Animation Loop
let animationEnabled = true;
function animate() {
  if (!animationEnabled) return;
  checkNearLadder();
  // console.log("x:");
  // console.log(playerBody.position.x);
  // console.log("y:");
  // console.log(playerBody.position.y);
  // console.log("z:");
  // console.log(playerBody.position.z);
  if(loaded1 && loaded2) {
    loadingScreen.style.display = 'none';
  }
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);
  if (water_mixer) water_mixer.update(delta);

  world.step(1 / 60);
  movePlayer();

  if(isAlive) checkDistanceToFruit();
  if(isAlive) checkDistanceToPaper();
  if(isAlive) checkDistanceToPole();
  if(isAlive) checkDistanceToRabbit();
  raindropModel.forEach((drop) => {
    drop.position.y -= 0.4; // Move the Y coordinate downward
    if (drop.position.y < -100) {
        drop.position.y = Math.random() * 100;
    }
  });
  if(camera.position.y <=0) {
    // model.material.transparent = true;
    // field.material.transparent = true;
  }
  else {
    // model.material.transparent = false;
    // field.material.transparent = false;
  }
  if(player.position.y >= 7.9  && isRising)
    {
       playerHealth = 0;
       isRising = false;
       updateHealth();
    }
  else if (player && !checkClimb1) {
    
    // Sync player position with physics body
    player.position.copy(playerBody.position);
    player.quaternion.copy(playerBody.quaternion);

    const cameraX = player.position.x - radius * Math.sin(yaw) * Math.cos(pitch);
    const cameraY = player.position.y + radius * Math.sin(pitch);
    const cameraZ = player.position.z - radius * Math.cos(yaw) * Math.cos(pitch);
      
    camera.position.set(cameraX, cameraY, cameraZ);
    camera.lookAt(player.position);

    // Rotate the player to match the camera's yaw
    player.rotation.y = yaw; // Sync player's Y rotation with the camera's yaw
    // console.log("x");
    //   console.log(player.rotation.x);
    //   console.log("y");
    //   console.log(player.rotation.y);
    //   console.log("z");
    //   console.log(player.rotation.z);
  }
  else if(player && checkClimb1)
    {
    
      player.position.copy(playerBody.position);
      player.quaternion.copy(playerBody.quaternion);
  
      const cameraX =10.1;
      const cameraY = player.position.y + radius * Math.sin(pitch);
      const cameraZ =3.296;
      camera.position.set(cameraX, cameraY, cameraZ);
      camera.lookAt(player.position);
      player.rotation.y = 0.022;
    }

    if (isRising && model) {
      if(model.position.y<5) model.position.y += 0.001;
      if (model.position.y - player.position.y >= 0.75) {
        if(model.position.y>=0.5) {
          playerHealth -= 0.05;
          if(playerHealth<=0) {
            diedWater = true;
            isAlive = false;
          }
        }
        updateHealth();
      }
    }
    if (model) {
      if (!isFloodWaterReached && model.position.y >= 0.5 && isAlive ) {
        isFloodWaterReached = true;
        Swal.fire({
            title: 'Flood Warning',
            text: 'The flood water is rising. Please evacuate immediately and reach high altitude areas!',
            icon: 'warning',
            background: '#2e2c2f',
            color: 'red',
            confirmButtonColor: 'green',
            customClass: {
                popup: 'rpg-popup'
            }
        });
      } 
    }
  renderer.render(scene, camera);
}

function updatePlayerAnimation() {
  if (!player || !mixer) return;
  let newAction;
  if (isMoving) {
    if (isRunning && !checkClimb1) {
      newAction = actions["crawl"];
    } else if(!checkClimb1) {
      if(model.position.y<=0.5){
        newAction = actions["walk_forward"];
      }
      else {
        newAction = actions["swim_no"];
      }
      // newAction = actions['run'];
    }
  } else if (isMoving_back&&!checkClimb1) {
    if(model.position.y<=0.5){
      newAction = actions["walk_backward"];
    }
    else {
      newAction = actions["swim_no"];
    }
  } else if (isClimbing && checkClimb) {
    removeClimbMessage();
    checkClimb1=true;
    newAction = actions["climb_up"];
  } else {
    checkClimb1=false;
    if(model && model.position.y<=0.5){
      newAction = actions["idle"];
    }else{
      newAction = actions["swim_no"];
    }
  }
  if (newAction && newAction !== activeAction) {
    previousAction = activeAction;
    activeAction = newAction;

    previousAction.fadeOut(0.2);
    activeAction.reset().fadeIn(0.2).play();
  }
}

function movePlayer() {
  if (!player) return;

  let moveDirection = new THREE.Vector3();
  const forward = getPlayerForwardDirection();
  const right = new THREE.Vector3()
    .crossVectors(forward, new THREE.Vector3(0, 1, 0))
    .normalize();
  // console.log(forward);
  if (keys.s ) moveDirection.add(forward);
  if (keys.w) moveDirection.add(forward.clone().negate());
  if (keys.d) moveDirection.add(right.clone().negate());
  if (keys.a) moveDirection.add(right);
  if (keys.c) moveDirection.add(new THREE.Vector3(0, 1, 0));

  moveDirection.normalize();

  if (moveDirection.length() > 0 && !checkClimb1) {
    const speedValue = isRunning ? speed.run : speed.walk;
    playerBody.velocity.x = moveDirection.x * speedValue;
    playerBody.velocity.z = moveDirection.z * speedValue;

    const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
    player.rotation.y =
      THREE.MathUtils.lerp(player.rotation.y, targetRotation, 0.1) + Math.PI;
  }
 
  if (keys.c&&checkClimb) {
    // Shift + Space: Fly upward
    checkClimb1=true;
    playerBody.velocity.y = jumpForce; // Ascend upwards with a custom force
  } else if (playerBody.position.y <= 1.6) {
    checkClimb1=false;
    // playerBody.velocity.y = jumpForce;
  }

  playerBody.velocity.y = Math.max(playerBody.velocity.y, -20);
  updatePlayerAnimation();
}

// Get player forward direction
function getPlayerForwardDirection() {
  const forward = new THREE.Vector3(
    -Math.sin(player.rotation.y),
    0,
    -Math.cos(player.rotation.y)
  );
  return forward.normalize();
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
async function restartGame() {
  if(!taken2)
    {
      // alert("Loaded");
        gltfLoader.load("/models/flood/papers__envelopes.glb", async (gltf) => {
        paper2 = gltf.scene;
        // paper.setRotationFromEuler(new Euler(0, Math.PI, 0));
        paper2.rotation.y = Math.PI / 2;
        paper2.scale.set(0.8, 1, 1); // Adjust scale if necessary
        scene.add(paper2);
        paper2.position.set(-1.2, 0.95, -2);
      });
    }
  flag2=true;
  taken2=true;
  if(!taken)
  {
    gltfLoader.load("/models/flood/fruit_bowl.glb", (gltf) => {
      fruit = gltf.scene;
      // fruit.setRotationFromEuler(new Euler(0, Math.PI, 0));
    
      fruit.scale.set(2, 2, 2); // Adjust scale if necessary
      scene.add(fruit);
      fruit.position.set(-0.7, 0.93, 2);
    });
  }
  taken=true;
  flag=true;
  if(!taken3)
  {
    gltfLoader.load("/models/flood/rabbit.glb", (gltf) => {
      rabbit = gltf.scene;
      rabbit.scale.set(0.5, 0.5, 0.5); // Adjust scale if necessary
      scene.add(rabbit);
      rabbit.position.set(2, 0.3, 2);
    });
  }
  taken3=true;
  flag3=true;
  names=[];
  isRising = false;
  const audio = document.getElementById("myAudio");
  audio.pause();
    audio.currentTime = 0;
  if(model) model.position.y = -1;
  refill_health();
  diedPole = false;
  diedWater = false;
  isFloodWaterReached = false;
  isAlive = true;
  return;
}
document.getElementById("restartGameBtn").addEventListener("click",() => {
  // const audio = document.getElementById("myAudio");
  // audio.play();
  isRising = false;
  isAlive = true;
  const audio = document.getElementById("myAudio");
  audio.pause();
    audio.currentTime = 0;
  if(model)
    {
      model.position.y = -1;
      model.position.x = 0;
      model.position.z = 0;
    } 
  refill_health();
  diedPole = false;
  diedWater = false;
  isFloodWaterReached = false;
})

document.getElementById("startFloodBtn").addEventListener("click" ,() => {
  isRising = true;
  isAlive = true;
  const audio = document.getElementById("myAudio");
  audio.play();
})
animate();