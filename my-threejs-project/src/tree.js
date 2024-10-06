// trees.js
import * as THREE from 'three';
import * as CANNON from 'cannon';

// Function to create a tree with physics body
export function createTree(scene, world, x, y, z) {
  const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, y + 0.5, z);

  const foliageGeometry = new THREE.ConeGeometry(0.5, 1, 8);
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.set(x, y + 1.5, z);

  // Add trunk and foliage to the scene
  scene.add(trunk);
  scene.add(foliage);

  // Create a physics body for the tree trunk
  const treeShape = new CANNON.Cylinder(0.1, 0.15, 1, 8); // Collision shape for trunk
  const treeBody = new CANNON.Body({
    mass: 0, // Static body
    position: new CANNON.Vec3(x, y + 0.5, z), // Position adjusted for height
  });
  treeBody.addShape(treeShape);
  world.addBody(treeBody); // Add tree body to the physics world
}

// Function to create multiple trees
export function createForest(scene, world) {
  const trees = [
    { x: 2, y: 0, z: 2 },
    { x: -2, y: 0, z: -2 },
    { x: 3, y: 0, z: -3 },
    { x: -1, y: 0, z: 1 },
  ];

  trees.forEach(tree => {
    createTree(scene, world, tree.x, tree.y, tree.z);
  });
}
