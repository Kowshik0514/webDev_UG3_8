// wall.js

import * as THREE from 'three';
import * as CANNON from 'cannon';

// Material for the walls
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const wallHeight = 5;
const wallThickness = 0.2;
const wallWidth = 10;

// Function to create walls with matching physics bodies
export function createWall(scene, world, geometry, position, rotationY, rotationX) {
  // Three.js Wall Mesh
  const wall = new THREE.Mesh(geometry, wallMaterial);
  wall.position.set(position.x, position.y, position.z);
  wall.rotation.y = rotationY;
  wall.rotation.x = rotationX;
  wall.castShadow = true;
  scene.add(wall);

  // Cannon.js Wall Body
  const halfExtents = new CANNON.Vec3(geometry.parameters.width / 2, geometry.parameters.height / 2, geometry.parameters.depth / 2);
  const wallShape = new CANNON.Box(halfExtents);
  const wallBody = new CANNON.Body({
    mass: 0, // Static wall
    position: new CANNON.Vec3(position.x, position.y, position.z)
  });
  wallBody.addShape(wallShape);
  wallBody.quaternion.setFromEuler(rotationX, rotationY, 0);
  world.addBody(wallBody);
}

// Function to create all walls
export function createAllWalls(scene, world) {
  // Back Wall
  // const backWallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness);
  // createWall(scene, world, backWallGeometry, { x: 0, y: wallHeight / 2, z: -5 }, 0, 0);

  // // Left Wall
  // const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallWidth);
  // createWall(scene, world, leftWallGeometry, { x: -5, y: wallHeight / 2, z: 0 }, 0, 0);

  // // Right Wall
  // const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, wallWidth);
  // createWall(scene, world, rightWallGeometry, { x: 5, y: wallHeight / 2, z: 0 }, 0, 0);

  // // Front Wall
  // const frontWallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness);
  // createWall(scene, world, frontWallGeometry, { x: 0, y: wallHeight / 2, z: 5 }, 0, 0);

  // // Above Wall
  // const aboveWallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight * 2, 0);
  // createWall(scene, world, aboveWallGeometry, { x: 0, y: wallHeight, z: 0 }, 0, Math.PI / 2);
}
