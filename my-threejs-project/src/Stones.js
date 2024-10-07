import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon';
import { stones } from './globals.js';

// Function to load stones and add them to the scene and physics world
export function loadStones(scene, world) {
    const stoneLoader = new GLTFLoader();

    stoneLoader.load('../models/stones.glb', (gltf) => {
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
            const randomX = Math.random() * -3;
            // Random z-coordinate between +4 and -4
            const randomZ = Math.random() * 8 - 4; // Generates a value between +4 and -4
            const startY = -4; // Stones start from ceiling height

            // Set the stone's initial position
            stone.position.set(randomX, startY, randomZ);
            scene.add(stone);
            console.log(`Stone ${i} added at position: (${randomX}, ${startY}, ${randomZ})`);

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

// Function to update stone positions based on their physics bodies
export function updateStones() {
    stones.forEach(({ stone, stoneBody }) => {
        // Synchronize Three.js stone position with Cannon.js body position
        stone.position.copy(stoneBody.position);
        stone.quaternion.copy(stoneBody.quaternion); // Sync rotation if needed
    });
}
export function removeStones(world, scene) {
    stones.forEach(({ stone, stoneBody }) => {
        // Remove stone from the scene
        scene.remove(stone);
        // Remove stone from the physics world
        world.removeBody(stoneBody);
        // console.log(`Stone ${index} removed from scene and world.`);

    });

    // Clear the stones array
    stones.length = 0;
    console.log(`Total stones remaining: ${stones.length}`);
}
