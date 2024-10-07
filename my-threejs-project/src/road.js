import * as THREE from 'three';
import * as CANNON from 'cannon';

const roads = []; // Array to store road objects and their physics bodies

// Function to load roads as planes and add them to the scene and physics world
export function loadRoads(scene, world, positions) {
    const textureLoader = new THREE.TextureLoader();

    // Load the texture with callbacks for debugging
    const roadTexture = textureLoader.load(
        '../models/road.jpg',
        (texture) => {
            console.log('Texture loaded successfully');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the texture:', error);
        }
    );

    positions.forEach((position) => {
        // Create a BoxGeometry for the road
        const roadGeometry = new THREE.BoxGeometry(10, 10, 0.2); // Adjust size as needed
        const material = new THREE.MeshBasicMaterial({ map: roadTexture });
        const road = new THREE.Mesh(roadGeometry, material);
        
        // Set position for the road
        road.rotation.x = Math.PI / 2; // Correct rotation to lay flat
        road.position.copy(position);

        // Add road to the scene
        scene.add(road);

        // Create a physics body for the road
        // const roadBody = new CANNON.Body({
        //     position: new CANNON.Vec3(position.x, position.y, position.z),
        //     mass: 0 // Set mass to 0 for static objects
        // });

        // // Define the shape of the road in the physics world
        // const roadShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5)); // Half dimensions
        // roadBody.addShape(roadShape);
        // world.addBody(roadBody);

        // // Store the road and its physics body
        // roads.push({ road, roadBody });
    });
}

// Function to update road positions based on their physics bodies
export function updateRoads() {
    roads.forEach(({ road, roadBody }) => {
        // Synchronize Three.js road position with Cannon.js body position
        // road.position.copy(roadBody.position);
        // road.quaternion.copy(roadBody.quaternion); // Sync rotation if needed
    });
}
