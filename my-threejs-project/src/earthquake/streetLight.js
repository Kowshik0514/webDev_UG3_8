import * as THREE from 'three';
import * as CANNON from 'cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const streetLights = []; // Array to store street light objects and their physics bodies

// Function to load street lights from a .glb file and add them to the scene and physics world
export function loadStreetLights1(scene, world, positions) {
    const loader = new GLTFLoader();

    loader.load('../models/earthquake/street_light.glb', (gltf) => {
        const model = gltf.scene;
        let a=1;

        positions.forEach((position) => {
            // Clone the street light model to place at multiple positions
            const streetLight = model.clone();
            
            // Set position for the street light
            streetLight.position.copy(position);
            
            // Scale the street light model if needed
            streetLight.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed

            let plane=streetLight.getObjectByName('Plane');
            streetLight.remove(plane);

            let light2=streetLight.getObjectByName('Cylinder010');
            streetLight.remove(light2);

            let obj=streetLight.getObjectByName('Cylinder004');
            obj.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

            obj=streetLight.getObjectByName('Cylinder003');
            obj.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

            obj=streetLight.getObjectByName('Cylinder006');
            obj.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

            obj=streetLight.getObjectByName('Cylinder013');
            obj.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

            if(a==1){
                streetLight.rotation.y = Math.PI;
                a=0;
            }
            else a=1;

            // Add the street light to the scene
            scene.add(streetLight);

            // Create a physics body for the street light
            const streetLightBody = new CANNON.Body({
                position: new CANNON.Vec3(position.x, position.y, position.z),
                mass: 0 // Set mass to 0 for static objects
            });

            // Define the shape of the street light in the physics world
            const streetLightShape = new CANNON.Box(new CANNON.Vec3(0.5, 3, 0.5)); // Adjust size to match the model
            streetLightBody.addShape(streetLightShape);
            world.addBody(streetLightBody);

            // Store the street light and its physics body
            streetLights.push({ streetLight, streetLightBody });
        });
    }, undefined, (error) => {
        console.error('An error occurred while loading the street light model:', error);
    });
}

export function loadStreetLights2(scene, world, positions) {
    const loader = new GLTFLoader();

    loader.load('../models/earthquake/street_light.glb', (gltf) => {
        const model = gltf.scene;
        let a=0;

        positions.forEach((position) => {
            // Clone the street light model to place at multiple positions
            const streetLight = model.clone();
            
            // Set position for the street light
            streetLight.position.copy(position);
            
            // Scale the street light model if needed
            streetLight.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed

            let plane=streetLight.getObjectByName('Plane');
            streetLight.remove(plane);

            let light=streetLight.getObjectByName('Cylinder004');
            streetLight.remove(light);

            if(a==1){
                streetLight.rotation.y = Math.PI;
                a=0;
            }
            else a=1;

            let obj=streetLight.getObjectByName('Circle');
            obj.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

            obj=streetLight.getObjectByName('Cylinder010');
            obj.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

            obj=streetLight.getObjectByName('Cylinder012');
            obj.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

            obj=streetLight.getObjectByName('Cylinder015');
            obj.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

            

            // Add the street light to the scene
            scene.add(streetLight);

            // Create a physics body for the street light
            const streetLightBody = new CANNON.Body({
                position: new CANNON.Vec3(position.x, position.y, position.z),
                mass: 0 // Set mass to 0 for static objects
            });

            // Define the shape of the street light in the physics world
            const streetLightShape = new CANNON.Box(new CANNON.Vec3(0.5, 3, 0.5)); // Adjust size to match the model
            streetLightBody.addShape(streetLightShape);
            world.addBody(streetLightBody);

            // Store the street light and its physics body
            streetLights.push({ streetLight, streetLightBody });
        });
    }, undefined, (error) => {
        console.error('An error occurred while loading the street light model:', error);
    });
}

// Function to update street light positions based on their physics bodies
export function updateStreetLights() {
    streetLights.forEach(({ streetLight, streetLightBody }) => {
        // Synchronize Three.js street light position with Cannon.js body position
        streetLight.position.copy(streetLightBody.position);
        streetLight.quaternion.copy(streetLightBody.quaternion); // Sync rotation if needed
    });
}

export function removeStreetLight(index, scene, world) {
    const { streetLight, streetLightBody } = streetLights[index];
    
    // Remove street light from the Three.js scene
    scene.remove(streetLight);
    
    // Remove street light body from the Cannon.js world
    world.remove(streetLightBody);

    // Remove the street light and its physics body from the array
    streetLights.splice(index, 1);
}
