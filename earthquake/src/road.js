import * as THREE from 'three';
import * as CANNON from 'cannon';

export let roads = []; // Array to store road objects and their physics bodies

// Function to load roads as planes and add them to the scene and physics world
export function loadRoads(scene, world, positions) {
    const textureLoader = new THREE.TextureLoader();

    // Load the texture with callbacks for debugging
    const roadTexture = textureLoader.load(
        '/images/road.jpg',
        (texture) => {
            // console.log('Texture loaded successfully');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
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

        roads.push(road);
    });
}

export function removeRoad(index, scene, world) {
    const road  = roads[index];
    
    // Remove road from the Three.js scene
    scene.remove(road);

    // Remove the road and its physics body from the array
    roads.splice(index, 1);
}

