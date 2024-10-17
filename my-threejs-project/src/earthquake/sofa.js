import * as THREE from 'three';
import * as CANNON from 'cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();

export function loadSofa(scene, world, position, rotationY) {
  gltfLoader.load('../../models/earthquake/sofa.glb', (gltf) => {
    const sofa = gltf.scene;
    sofa.scale.set(0.01, 0.01, 0.01); // Scale adjustment
    sofa.position.set(position.x, position.y, position.z); // Position adjustment
    sofa.rotation.y = rotationY;
    scene.add(sofa);

    sofa.traverse((object) => {
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
    });
  });
}
