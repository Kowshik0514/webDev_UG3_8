import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon';

export function createTornado(scene, world) {
    const loader = new GLTFLoader();
    const tornadoGroup = new THREE.Group();
    tornadoGroup.visible = false;
    const tornadoColliders = [];

    loader.load('../../models/tornado.glb', (gltf) => {
        const tornado = gltf.scene;
        tornado.scale.set(10, 10, 10);
        tornadoGroup.add(tornado);
        scene.add(tornadoGroup);

        const tornadoHeight = 70;
        const tornadoRadius = 20;

        const cylinderShape = new CANNON.Cylinder(tornadoRadius, tornadoRadius, tornadoHeight, 8);
        const tornadoBody = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(tornadoGroup.position.x, tornadoGroup.position.y, tornadoGroup.position.z)
        });

        tornadoBody.addShape(cylinderShape);
        world.addBody(tornadoBody);
        tornadoColliders.push(tornadoBody);
    });

    let tornadoAngle = 0;
    const radiusLimit = 10;

    // Load and set up tornado sound
    const listener = new THREE.AudioListener();
    scene.add(listener);
    const tornadoSound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('../../sounds/tornado.mp3', (buffer) => {
        tornadoSound.setBuffer(buffer);
        tornadoSound.setLoop(true);
        tornadoSound.setVolume(0.5); // Adjust volume as needed
    });

    // Create a texture for the raindrop (a thin vertical line)
    const rainTexture = new THREE.TextureLoader().load('../../images/raindrop.jpg'); // A vertical line texture
    rainTexture.wrapS = THREE.RepeatWrapping;
    rainTexture.wrapT = THREE.RepeatWrapping;

    // Initialize the rain particles (now using Sprite for a rectangular shape)
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

    function animateTornado() {
        tornadoAngle += 0.01;
        tornadoGroup.rotation.y += 0.02;
        tornadoGroup.position.x = Math.cos(tornadoAngle) * radiusLimit;
        tornadoGroup.position.z = Math.sin(tornadoAngle) * radiusLimit;

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
    const startTornadoButton = document.getElementById('startTornado');
    const exitButton = document.getElementById('exitButton1');
    const soundToggleButton = document.getElementById('soundToggleBtn');
    
    let isSoundMuted = false;

    // Show tornado, change background color to grey, and play sound when "Start Tornado" button is clicked
    startTornadoButton.addEventListener('click', () => {
        tornadoGroup.visible = true;
        scene.background = new THREE.Color(0x7A7A7A); // Change background to grey
        if (!tornadoSound.isPlaying && !isSoundMuted) tornadoSound.play();
        
        startRain();  // Start the rain animation
    });

    // Hide tornado, reset background to original color, and stop sound when "Exit Game" button is clicked
    exitButton.addEventListener('click', () => {
        tornadoGroup.visible = false;
        scene.background = new THREE.Color(0x87CEEB); // Reset background to sky blue or original color
        if (tornadoSound.isPlaying) tornadoSound.stop();
        
        stopRain();  // Stop the rain animation
    });

    // Toggle sound on/off when "Turn Sound Off" button is clicked
    soundToggleButton.addEventListener('click', () => {
        isSoundMuted = !isSoundMuted;
        if (isSoundMuted) {
            tornadoSound.pause();
            soundToggleButton.textContent = "Turn Sound On";
        } else {
            if (tornadoGroup.visible) tornadoSound.play();
            soundToggleButton.textContent = "Turn Sound Off";
        }
    });
}
