import * as CANNON from 'cannon';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export var tornadoGroup = null;

export function createTornado(scene, world) {
    const loader = new GLTFLoader();
    tornadoGroup = new THREE.Group();
    tornadoGroup.visible = true; // Initially, tornado is visible.
    const tornadoColliders = [];

    loader.load('../../models/tornado/tornado.glb', (gltf) => {
        const tornado = gltf.scene;
        tornado.scale.set(10, 10, 10);
        tornadoGroup.add(tornado);
        scene.add(tornadoGroup);
    });

    scene.background = new THREE.Color(0x7A7A7A); // Change background to grey

    let tornadoAngle = 0;
    const radiusLimit = 10;

    // Create a texture for the raindrop (a thin vertical line)
    const rainTexture = new THREE.TextureLoader().load('../../images/raindrop.jpg'); // A vertical line texture
    rainTexture.wrapS = THREE.RepeatWrapping;
    rainTexture.wrapT = THREE.RepeatWrapping;

    // Initialize rain particles (using Sprite for a rectangular shape)
    const rainSprites = [];
    const rainCount = 1000;
    let rainDensity = 0;  // Start with no rain
    let isRainActive = false;  // Rain starts inactive

    // Create the rain sprites (rectangular shape using the texture)
    for (let i = 0; i < rainCount; i++) {
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: rainTexture,
            color: 0xaaaaaa,   // Light grey color for rain
            transparent: true,
            opacity: 0.6,
        }));

        // Set random positions for raindrops
        sprite.position.set(
            Math.random() * 100 - 50,  // Random x
            Math.random() * 100 + 50,  // Random y (start high)
            Math.random() * 100 - 50   // Random z
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
    function startRain() {
        rainSprites.forEach(sprite => {
            sprite.visible = true;  // Make the rain visible
        });
        isRainActive = true;  // Mark rain as active
    }

    // Function to stop the rain animation when the tornado stops
    function stopRain() {
        rainSprites.forEach(sprite => {
            sprite.visible = false;  // Hide the rain
        });
        isRainActive = false;  // Mark rain as inactive
    }

    // Function to add tornado colliders and physics body
    function createTornadoColliders() {
        const tornadoHeight = 70;
        const tornadoRadius = 20;

        // Create the collider shape for the tornado
        const cylinderShape = new CANNON.Cylinder(tornadoRadius, tornadoRadius, tornadoHeight, 8);
        const tornadoBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(tornadoGroup.position.x, tornadoGroup.position.y, tornadoGroup.position.z)
        });

        // Add the shape to the body
        tornadoBody.addShape(cylinderShape);
        world.addBody(tornadoBody);

        // Store the tornado body for future updates
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
                sprite.position.y -= 1;  // Move each raindrop down by 1 unit

                // Reset raindrop to a higher position when it falls off-screen
                if (sprite.position.y < -50) {
                    sprite.position.y = Math.random() * 100 + 50; // Reset to random height
                }
            });

            // Gradually increase rain intensity based on tornado visibility
            if (tornadoGroup.visible && rainDensity < 1) {
                rainDensity += 0.01;  // Increase density gradually
                rainSprites.forEach((sprite) => {
                    sprite.material.opacity = rainDensity * 0.6;  // Increase opacity
                    sprite.material.size = 1.0 + rainDensity * 1.5;  // Increase size of raindrops (stretch out)
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
    const tornadoSound = new Audio('../../sounds/tornado.mp3');
    tornadoSound.loop = true; // Loop the sound as long as the tornado is active

    // Function to start tornado sound
    function startSound() {
        if (!isSoundMuted) {
            tornadoSound.play();
        }
    }

    // Function to stop tornado sound
    function stopSound() {
        tornadoSound.pause();
        tornadoSound.currentTime = 0; // Reset to start
    }

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
