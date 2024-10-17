import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon';
import { stones } from './globals.js';
import { restartGame } from './chandelier.js';
// Add reference to the player object and playerHealth
export let playerHealth = 100; // Initialize player's health
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
// Function to update health bar based on player's health
export function updateHealth(playerBody) {
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
        document.getElementById('restartButton').innerHTML = "Restart";
        document.getElementById('gameOverPopup').style.display = 'flex';
        // restartGame();
        // refill_health(playerBody)
        playerHealth = 100; // Reset health for testing purposes
        playerBody.position.set(0, 1.6, 0); // Reset player position (if applicable)
        healthBar.style.width = '100%'; // Reset health bar
        healthBar.style.backgroundColor = 'green'; // Reset health bar color
    }
}

function updateHealth1() {
    healthBar.style.width = `${playerHealth}%`; // Initialize health bar width
    healthBar.style.backgroundColor = 'green'; // Initial color is green
}
updateHealth1(); // Initialize health bar

// Function to load stones and add them to the scene and physics world
export function loadStones(scene, world) {
    const stoneLoader = new GLTFLoader();

    stoneLoader.load('../models/earthquake/stones.glb', (gltf) => {
        console.log("Stones model loaded");

        // Loop to create multiple stones
        for (let i = 0; i < 2; i++) {
            const stone = gltf.scene.clone();
            // Set random scale for each stone between 0.0001 and 0.001
            const randomScaleX = Math.random() * (0.001 - 0.0001) + 0.0001;
            const randomScaleY = Math.random() * (0.001 - 0.0001) + 0.0001;
            const randomScaleZ = Math.random() * (0.001 - 0.0001) + 0.0001;
            stone.scale.set(randomScaleX, randomScaleY, randomScaleZ);

            // Random x-coordinate between 0 and -3
            const randomZ = Math.random() * (-1.5 - (-5.5)) + (-5.5); // Generates a value between -1.5 and -5.5
            const randomX = Math.random() * (2.5 - (-2.5)) + (-2.5); // Generates a value between -2.5 and 2.5
            // const randomX=0;
            // const randomZ=-0.85;
            const startY = 4; // Stones start from ceiling height

            // Set the stone's initial position
            stone.position.set(randomX, startY, randomZ);
            scene.add(stone);
            // console.log(`Stone ${i} added at position: (${randomX}, ${startY}, ${randomZ})`);

            // Create Cannon.js physics body for the stone
            const stoneShape = new CANNON.Sphere(0.1); // Adjust radius if needed
            const stoneBody = new CANNON.Body({
                mass: 1, // Set mass for falling
                position: new CANNON.Vec3(randomX, startY, randomZ),
            });

            // Add the shape to the stone's body
            stoneBody.addShape(stoneShape);
            world.addBody(stoneBody); // Add the physics body to the world

            // Store the stone and its physics body
            stones.push({ stone, stoneBody });
        }
    }, undefined, (error) => {
        console.error('An error occurred while loading the stones model:', error);
    });
}

// Function to check collision between player and stones
function checkStoneCollision(stoneBody, playerBody) {
    const distance = stoneBody.position.distanceTo(playerBody.position);

    // Check if the stone is close enough to the player to be considered a hit
    if (distance < 1 && stoneBody.position.y > 1) {
        console.log(stoneBody.position); // Adjust this distance based on your game's scale
        if (playerBody.position.x > -1.5 && playerBody.position.x < 1.5 && playerBody.position.z > -6 && playerBody.position.z < -4) {
            //donothing
            console.log("Do Nothing");
        }
        else if (playerHealth > 0) {
            playerHealth -= 1; // Decrease health by 10%
            updateHealth(playerBody); // Update the health UI
        }
    }
}

// Function to update stone positions based on their physics bodies
export function updateStones(playerBody, world, scene) {
    stones.forEach(({ stone, stoneBody }) => {
        // Synchronize Three.js stone position with Cannon.js body position
        stone.position.copy(stoneBody.position);
        stone.quaternion.copy(stoneBody.quaternion); // Sync rotation if needed
        if (stoneBody.position.y < 0.5) {
            scene.remove(stone);
            // Remove stone from the physics world
            world.removeBody(stoneBody);
        }
        // Check for collisions with the player
        checkStoneCollision(stoneBody, playerBody); // Check if the stone hits the player
    });
}

// Function to remove stones from the scene and physics world
export function removeStones(world, scene) {
    stones.forEach(({ stone, stoneBody }) => {
        // Remove stone from the scene
        scene.remove(stone);
        // Remove stone from the physics world
        world.removeBody(stoneBody);
    });

    // Clear the stones array
    stones.length = 0;
    // console.log(`Total stones remaining: ${stones.length}`);
}
