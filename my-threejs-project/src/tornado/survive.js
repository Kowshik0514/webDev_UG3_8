import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon';

export function loadHome(scene, world) {
    const loader = new GLTFLoader();
    // Load the tornado home model
    loader.load('../../models/tornadoHome.glb', (gltfHome) => {
        const homeModel = gltfHome.scene;
        // Set the home model's position to (-20, 0, -20)
        homeModel.position.set(-20, 0, -20);
        // Scale the home model (adjust as necessary)
        homeModel.scale.set(0.001, 0.001, 0.001);
        // Add the home model to the scene
        scene.add(homeModel);
        // Create colliders for each mesh in the home model
        // homeModel.traverse((child) => {
        //     if (child.isMesh) {
        //         // Compute the bounding box for each mesh to create a collider
        //         const boundingBox = new THREE.Box3().setFromObject(child);
        //         const size = boundingBox.getSize(new THREE.Vector3());
        //         // Create a CANNON box collider based on the size of the mesh
        //         const homeShape = new CANNON.Box(new CANNON.Vec3(size.x / 10000, size.y / 10000, size.z / 10000));
        //         // Create a CANNON body for the mesh (static body)
        //         const homeBody = new CANNON.Body({
        //             mass: 0,  // Static object, so mass is 0
        //             position: new CANNON.Vec3(child.position.x - 20, child.position.y, child.position.z - 20),
        //             quaternion: new CANNON.Quaternion(child.rotation.x, child.rotation.y, child.rotation.z, child.rotation.w)
        //         });
        //         // Add the shape to the physics body
        //         homeBody.addShape(homeShape);
        //         world.addBody(homeBody);  // Add the physics body to the world
        //     }
        // });
    });
}