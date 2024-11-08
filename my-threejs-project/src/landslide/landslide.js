import * as THREE from 'three';
import * as CANNON from 'cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Load the landslide model
export function loadLandslide(scene, world) {
    const landslideLoader = new GLTFLoader();
  
    landslideLoader.load('../../models/landslide2.glb', (gltf) => {
      window.landslide = gltf.scene;
      window.landslide.scale.set(0.2, 0.2, 0.2);
      window.landslide.position.set(0, 0, 0);
      window.landslide.castShadow = true;
      scene.add(window.landslide);
    }, undefined, (error) => {
      console.error('An error occurred while loading the landslide model:', error);
    });
  }