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
  leg1.position.set(-1.1, 0.55, -4.6);
  leg2.position.set(1.1, 0.55, -4.6);
  leg3.position.set(-1.1, 0.55, -5.4);
  leg4.position.set(1.1, 0.55, -5.4);
  scene.add(leg1);
  scene.add(leg2);
  scene.add(leg3);
  scene.add(leg4);

  // Create the table top
  const topGeometry = new THREE.BoxGeometry(2.5, 0.1, 1);
  const topMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
  const tableTop = new THREE.Mesh(topGeometry, topMaterial);
  tableTop.position.set(0, 1, -5);
  scene.add(tableTop);

  // Create a physics body for the table top
  const tableShape = new CANNON.Box(new CANNON.Vec3(1.8, 0.1, 0.5));
  const tableBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0.75, -5), // Adjusted for height
  });
  tableBody.addShape(tableShape); // Table top shape
  world.addBody(tableBody);
}


