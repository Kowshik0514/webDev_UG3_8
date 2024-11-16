import * as CANNON from 'cannon';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export var tornadoBody = null;
export var tornadoGroup=null;
export let isTornadoactive=false;
const rainSprites = [];
let isRainActive = false;
const tornadoSound = new Audio('/sounds/tornado.mp3');
export function startRain() {
    rainSprites.forEach(sprite => {
        sprite.visible = true;  
    });
    isRainActive = true;  // Mark rain as active
}

// Function to stop the rain animation when the tornado stops
export function stopRain() {
    rainSprites.forEach(sprite => {
        sprite.visible = false;  // Hide the rain
    });
    isRainActive = false;  // Mark rain as inactive
}
export function stopSound() {
    tornadoSound.pause();
    tornadoSound.currentTime = 0; // Reset to start
}
export function createTornado(scene, world) {
    isTornadoactive=true;
    if(tornadoGroup)scene.remove(tornadoGroup);
    const loader = new GLTFLoader();
    tornadoGroup = new THREE.Group();
    tornadoGroup.visible = true; // Initially, tornado is visible.
    const tornadoColliders = [];

    loader.load('/models/tornado/tornado.glb', (gltf) => {
        const tornado = gltf.scene;
        tornado.scale.set(10, 10, 10);
        tornadoGroup.add(tornado);
        scene.add(tornadoGroup);
    });

    scene.background = new THREE.Color(0x7A7A7A); // grey

    let tornadoAngle = 0;
    const radiusLimit = 10;

    const rainTexture = new THREE.TextureLoader().load('/images/raindrop.jpg'); // A vertical line texture
    rainTexture.wrapS = THREE.RepeatWrapping;
    rainTexture.wrapT = THREE.RepeatWrapping;

    const rainCount = 1000;
    let rainDensity = 0;

    // Create the rain sprites
    for (let i = 0; i < rainCount; i++) {
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: rainTexture,
            color: 0xaaaaaa,   // Light grey color for rain
            transparent: true,
            opacity: 0.6,
        }));

        sprite.position.set(
            Math.random() * 100 - 50,
            Math.random() * 100 + 50,
            Math.random() * 100 - 50
        );

        // Make the sprite's scale rectangular (height > width)
        const scaleFactor = Math.random() * 1.5 + 1.5; // Scale factor for the size (height larger than width)
        sprite.scale.set(0.3, scaleFactor, 1); // Adjust width and height

        // Initially make the rain invisible
        sprite.visible = false;

        scene.add(sprite);
        rainSprites.push(sprite);
    }

    // Function to start the rain animation when the tornado starts

    // Function to add tornado colliders and physics body
    function createTornadoColliders() {
        const tornadoHeight = 70;
        const tornadoRadius = 20;

        // Create the collider shape for the tornado
        const cylinderShape = new CANNON.Cylinder(tornadoRadius, tornadoRadius, tornadoHeight, 8);
        tornadoBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(tornadoGroup.position.x, tornadoGroup.position.y, tornadoGroup.position.z)
        });

        tornadoBody.addShape(cylinderShape);
        world.addBody(tornadoBody);
        tornadoColliders.push(tornadoBody);
    }

    function animateTornado() {
        tornadoAngle += 0.01;
        tornadoGroup.rotation.y += 0.02;
        tornadoGroup.position.x = Math.cos(tornadoAngle) * radiusLimit;
        tornadoGroup.position.z = Math.sin(tornadoAngle) * radiusLimit;

        // Update tornado collider position
        tornadoColliders.forEach((collider) => {
            collider.position.set(
                tornadoGroup.position.x,
                tornadoGroup.position.y,
                tornadoGroup.position.z
            );
        });

        // Update the position of each raindrop (falling effect)
        if (isRainActive) {
            rainSprites.forEach((sprite) => {
                sprite.position.y -= 1;
                if (sprite.position.y < -50) {
                    sprite.position.y = Math.random() * 100 + 50; 
                }
            });

            if (tornadoGroup.visible && rainDensity < 1) {
                rainDensity += 0.01;
                rainSprites.forEach((sprite) => {
                    sprite.material.opacity = rainDensity * 0.6;
                    sprite.material.size = 1.0 + rainDensity * 1.5;
                });
            }
        }

        requestAnimationFrame(animateTornado);
    }

    animateTornado();

    // Button handlers for controlling tornado and sound
    const restartGame = document.getElementById('restartGame');
    const soundToggleButton = document.getElementById('soundToggleBtn');
    
    let isSoundMuted = false;

    // Load tornado sound (replace the path with your actual sound path)
    tornadoSound.loop = true; // Loop the sound as long as the tornado is active

    // Function to start tornado sound
    function startSound() {
        if (!isSoundMuted) {
            tornadoSound.play();
        }
    }

    // Function to stop tornado sound


    startRain();  // Start the rain animation

    // Only create tornado colliders and physics body once the tornado is visible
    createTornadoColliders();

    // Ensure tornado sound is playing if tornado is visible
    if (tornadoGroup.visible && !isSoundMuted) {
        startSound();
    }

    // Sound toggle button event listener
    soundToggleButton.addEventListener('click', () => {
        if (isSoundMuted) {
            isSoundMuted = false;
            startSound(); // Play sound again
            soundToggleButton.textContent = 'Turn Sound Off'; // Change button text
        } else {
            isSoundMuted = true;
            stopSound(); // Stop sound
            soundToggleButton.textContent = 'Turn Sound On'; // Change button text
        }
    });

    // Hide tornado, reset background to original color, and stop sound when "Exit Game" button is clicked
    restartGame.addEventListener('click', () => {
        tornadoGroup.visible = false;
        scene.background = new THREE.Color(0x87CEEB); // Reset background to sky blue or original color
        
        stopRain();  // Stop the rain animation
        stopSound(); // Stop the sound when exiting the game
    });

}
export function removeTornado(scene,world)
{
    isTornadoactive=false;
    scene.background = new THREE.Color(0x87ceeb);
    if(tornadoGroup){
        console.log("ygfs");
    scene.remove(tornadoGroup);
    world.removeBody(tornadoBody);
    }

}
