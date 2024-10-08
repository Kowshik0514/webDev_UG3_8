// legs.js
import * as THREE from 'three';
import * as CANNON from 'cannon';

// Function to create a table with physics body
export function createTable(scene, world, x, y, z) {
  // Create the table legs
  const legGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1, 20);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const leg1 = new THREE.Mesh(legGeometry, legMaterial);
  const leg2 = new THREE.Mesh(legGeometry, legMaterial);
  const leg3 = new THREE.Mesh(legGeometry, legMaterial);
  const leg4 = new THREE.Mesh(legGeometry, legMaterial);
  leg1.position.set(-1.1, 0.35, -4.6);
  leg2.position.set(1.1, 0.35, -4.6);
  leg3.position.set(-1.1, 0.35, -5.4);
  leg4.position.set(1.1, 0.35, -5.4);

//   const foliageGeometry = new THREE.ConeGeometry(0.5, 1, 8);
//   const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
//   const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
//   foliage.position.set(x, y + 1.5, z);

  // Add leg and foliage to the scene
  scene.add(leg1);
  scene.add(leg2);
  scene.add(leg3);
  scene.add(leg4);

  // Create a physics body for the leg leg
//   const legShape = new CANNON.Cylinder(0.05, 0.05, 0.7, 2); // Collision shape for leg
//   const legBody = new CANNON.Body({
//     mass: 0, // Static body
//     position: new CANNON.Vec3(0, 1, -5), // Position adjusted for height
//   });
//   legBody.addShape(legShape);
//   world.addBody(legBody); // Add leg body to the physics world


  // Create the table top
  const topGeometry = new THREE.BoxGeometry(2.5, 0.1, 1);
  const topMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
  const tableTop = new THREE.Mesh(topGeometry, topMaterial);
  tableTop.position.set(0, 0.8, -5);
  scene.add(tableTop);

  // Create a physics body for the table top
  const tableShape = new CANNON.Box(new CANNON.Vec3(1.8, 0.1, 0.7));
  const tableBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0.6, -4.5), // Adjusted for height
  });
  tableBody.addShape(tableShape); // Table top shape
  world.addBody(tableBody);

  // Create legs as physics bodies
//   for (let i = 0; i < 4; i++) {
//     const legBody = new CANNON.Body({ mass: 1 });
//     legBody.addShape(new CANNON.Box(new CANNON.Vec3(0.05, 0.5, 0.05)));
//     legBody.position.set(
//       x + (i % 2 === 0 ? -0.5 : 0.5),
//       y + 0.5,
//       z + (i < 2 ? -0.5 : 0.5)
//     );
//     world.addBody(legBody);
//   }
}


