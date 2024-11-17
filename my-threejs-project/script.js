import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Background
scene.background = new THREE.Color(0x000033);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffaa00, 1);
pointLight.position.set(5, 10, 10);
pointLight.castShadow = true;
scene.add(pointLight);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const particlesPositions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  particlesPositions[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Text Geometry
const fontLoader = new FontLoader();
fontLoader.load(
  'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/fonts/droid/droid_serif_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry('Disaster Simulation', {
      font: font,
      size: 1.5,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.05,
      bevelSegments: 5,
    });

    // Center the text
    textGeometry.center();

    // Shader Material for Gradient Effect
    const textMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: new THREE.Color(0x7ed957) }, // Red from the left
        uColor2: { value: new THREE.Color(0x00badb) }, // Blue from the right
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec3 vPosition;
        void main() {
          // Calculate gradient based on X position
          float gradient = (vPosition.x + 8.0) / 16.0; // Adjust range based on text width
          vec3 color = mix(uColor1, uColor2, gradient);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.castShadow = true;
    textMesh.receiveShadow = true;
    textMesh.position.set(0, 0, 0);
    scene.add(textMesh);
  }
);


// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false; // Disable zooming

// Camera Position
camera.position.set(0, 3, 10);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  // Update Particles
  particles.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Responsive Canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


let lastTap = 0;
window.addEventListener('click', () => {
  const currentTime = new Date().getTime();
  const tapGap = currentTime - lastTap;
  if (tapGap < 300 && tapGap > 0) {
    window.location.href = 'home.html';
  }
  lastTap = currentTime;
});