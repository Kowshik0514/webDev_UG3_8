import * as THREE from 'three';
import * as CANNON from 'cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { chandelier, chandelierBody } from './globals.js';

// Button to drop chandelier
const dropChandelierBtn = document.getElementById('dropChandelierBtn');
dropChandelierBtn.addEventListener('click', () => {
  // dropChandelier(playerBody); // Pass the player's body to check the position
  
  const chandelierPosition = window.chandelier.position;
  const playerPosition = playerBody.position;

  // Check if player's x and z positions match chandelier's x and z positions
  const isDirectlyBelow = Math.abs(playerPosition.x) - Math.abs(chandelierPosition.x) < 0.8 &&
                          Math.abs(playerPosition.z) - Math.abs(chandelierPosition.z) < 0.8;

  if (isDirectlyBelow) {
    console.log("Dropping chandelier");
        // Set chandelier body mass to 1 to allow it to fall
    dropChandelier(); // Pass the player's body to check the position
  } else {
    console.log("Player is not directly below the chandelier.");
  }
});

// Load the chandelier model
export function loadChandelier(scene, world) {
  const chandelierLoader = new GLTFLoader();

  chandelierLoader.load('../models/chandelier.glb', (gltf) => {
    window.chandelier = gltf.scene;
    window.chandelier.scale.set(0.0004, 0.0004, 0.0004);  // Adjust the scale if needed
    window.chandelier.position.set(0, 4.5, -0.85);  // Set the chandelier position
    window.chandelier.castShadow = true;  // Enable shadow casting
    scene.add(window.chandelier);  // Add chandelier to the scene

    // Add a collider for the chandelier
    const chandelierShape = new CANNON.Box(new CANNON.Vec3(0.8, 1, 0.8)); // Box collider with width, height, depth
    window.chandelierBody = new CANNON.Body({
      mass: 0, // Set mass to allow it to fall
      position: new CANNON.Vec3(0, 4.5, -0.85) // Same position as the chandelier
    });
    window.chandelierBody.addShape(chandelierShape);
    world.addBody(window.chandelierBody); // Add the body to the physics world
  }, undefined, (error) => {
    console.error('An error occurred while loading the chandelier model:', error);
  });
}

export function dropChandelier(){
  // Animate the chandelier falling
  const fallDuration = 1; // seconds
  const initialY = window.chandelier.position.y;
  const targetY = 1; // Y position to drop to

  const startTime = performance.now();

  function animate2() {
      const currentTime = performance.now();
      const elapsedTime = (currentTime - startTime) / 1000; // in seconds
      const t = Math.min(elapsedTime / fallDuration, 1); // Normalize t to [0, 1]
        
      window.chandelier.position.y = initialY - ((initialY - targetY) * t); // Update chandelier position
        
      if (t < 1) {
          requestAnimationFrame(animate2); // Continue the animation
      } else {
        // Update the chandelier's physical body once it has dropped
        window.chandelierBody.position.set(
          window.chandelier.position.x,
          window.chandelier.position.y,
          window.chandelier.position.z
        );
        window.chandelierBody.mass = 1; // Allow the chandelier to respond to physics after falling
        window.chandelierBody.updateMassProperties(); // Update mass properties to reflect the new mass 
        document.getElementById('gameOverPopup').style.display = 'flex';
      }
  }

  animate2();
}

// Event listener for the restart button
document.getElementById('restartButton').addEventListener('click', () => {
  restartGame();
});

export function restartGame() {
  // Hide the Game Over pop-up
  document.getElementById('gameOverPopup').style.display = 'none';

  // Reset the chandelier position
  window.chandelier.position.set(0, 4.5, -0.85);
  window.chandelierBody.position.set(0, 4.5, -0.85);
  window.chandelierBody.mass = 0; // Reset mass to prevent falling

  // Optionally, reset player position and other game states if necessary
  playerBody.position.set(0, 1, 0); // Example of resetting player position
}

// Function to handle dropping the chandelier
// export function dropChandelier() {
//   requestAnimationFrame(dropChandelier);
//   const delta = clock.getDelta();

//   // Step the physics world
//   world.step(1 / 60);

//   if (mixer) mixer.update(delta);
  // const chandelierPosition = window.chandelier.position;
  // const playerPosition = playerBody.position;

  // // Check if player's x and z positions match chandelier's x and z positions
  // const isDirectlyBelow = Math.abs(playerPosition.x) - Math.abs(chandelierPosition.x) < 0.8 &&
  //                         Math.abs(playerPosition.z) - Math.abs(chandelierPosition.z) < 0.8;

  // if (isDirectlyBelow) {
    // console.log("Dropping chandelier");
    // window.chandelier.position.copy(window.chandelierBody.position);
    // window.chandelier.quaternion.copy(window.chandelierBody.quaternion);
    // renderer.render(scene, camera);
        // Set chandelier body mass to 1 to allow it to fall
    // window.chandelierBody.mass = 1; 
    // window.chandelierBody.velocity.y = -10; // Apply a downward velocity to drop the chandelier
  // } else {
  //   console.log("Player is not directly below the chandelier.");
  // }
// }