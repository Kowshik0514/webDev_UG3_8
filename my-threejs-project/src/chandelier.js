import * as THREE from 'three';
import * as CANNON from 'cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { chandelier, chandelierBody } from './globals.js';
import { playerBody } from './main.js';

let earthquakeActive = false; // Flag to control earthquake
let earthquakeInterval;

// Button to drop chandelier
const dropChandelierBtn = document.getElementById('dropChandelierBtn');
dropChandelierBtn.addEventListener('click', () => {
  const chandelierPosition = window.chandelier.position;
  const playerPosition = playerBody.position;

  // Check if player's x and z positions match chandelier's x and z positions
  const isDirectlyBelow = Math.abs(playerPosition.x) - Math.abs(chandelierPosition.x) < 0.8 &&
    Math.abs(playerPosition.z) - Math.abs(chandelierPosition.z) < 0.8;

  startEarthquake();

  setTimeout(() => {
    dropChandelier();
  }, 10000);

  if (isDirectlyBelow) {
    console.log("Dropping chandelier");
  } else {
    console.log("Player is not directly below the chandelier.");
  }
});

// Load the chandelier model
export function loadChandelier(scene, world) {
  const chandelierLoader = new GLTFLoader();

  chandelierLoader.load('../models/chandelier.glb', (gltf) => {
    window.chandelier = gltf.scene;
    window.chandelier.scale.set(0.0004, 0.0004, 0.0004);
    window.chandelier.position.set(0, 4.5, -0.85);
    window.chandelier.castShadow = true;
    scene.add(window.chandelier);

    const chandelierShape = new CANNON.Box(new CANNON.Vec3(0.8, 1, 0.8));
    window.chandelierBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 4.5, -0.85)
    });
    window.chandelierBody.addShape(chandelierShape);
    world.addBody(window.chandelierBody);
  }, undefined, (error) => {
    console.error('An error occurred while loading the chandelier model:', error);
  });
}

export function dropChandelier() {
  const fallDuration = 1;
  const initialY = window.chandelier.position.y;
  const targetY = 1;

  const startTime = performance.now();

  function animate2() {
    const currentTime = performance.now();
    const elapsedTime = (currentTime - startTime) / 1000;
    const t = Math.min(elapsedTime / fallDuration, 1);

    window.chandelier.position.y = initialY - ((initialY - targetY) * t);

    if (t < 1) {
      requestAnimationFrame(animate2);
    } else {
      startEarthquake(); // Start the earthquake effect
      const playerPosition = playerBody.position;
      const chandelierPosition = window.chandelier.position;

      const isNear = Math.abs(playerPosition.x) - Math.abs(chandelierPosition.x) < 0.8 &&
        Math.abs(playerPosition.z) - Math.abs(chandelierPosition.z) < 0.8;

      window.chandelierBody.position.set(
        window.chandelier.position.x,
        window.chandelier.position.y,
        window.chandelier.position.z
      );
      window.chandelierBody.mass = 1;
      window.chandelierBody.updateMassProperties();

      if (isNear) {
        document.getElementById('go').innerHTML = "You Lost";
      } else {
        document.getElementById('go').innerHTML = "You Won";
      }
      document.getElementById('restartButton').innerHTML = "Restart";
      document.getElementById('gameOverPopup').style.display = 'flex';
    }
  }

  animate2();
}

// Function to simulate earthquake effect
function startEarthquake() {
  earthquakeActive = true;
  let shakeStrength = 0.1;

  earthquakeInterval = setInterval(() => {
    if (earthquakeActive) {
      const shakeX = (Math.random() - 0.5) * shakeStrength;
      const shakeY = (Math.random() - 0.5) * shakeStrength;

      // Apply shaking to player's position or camera
      playerBody.position.x += shakeX;
      playerBody.position.z += shakeY;

      // You can also apply shaking to other objects in the scene if needed
    }
  }, 50);
}

// Stop the earthquake
function stopEarthquake() {
  earthquakeActive = false;
  clearInterval(earthquakeInterval);
}

// Event listener for the restart button
document.getElementById('restartButton').addEventListener('click', () => {
  restartGame();
});

export function restartGame() {
  document.getElementById('gameOverPopup').style.display = 'none';

  // Reset the chandelier position
  window.chandelier.position.set(0, 4.5, -0.85);
  window.chandelierBody.position.set(0, 4.5, -0.85);
  window.chandelierBody.mass = 0;

  // Reset player position and stop earthquake
  playerBody.position.set(0, 1, 0);
  stopEarthquake(); // Stop the earthquake effect
}
