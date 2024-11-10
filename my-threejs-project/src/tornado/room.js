import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon';

export function loadHome(scene, world) {
    const loader = new GLTFLoader();

    // Create a road using PlaneGeometry
    const roadGeometry = new THREE.PlaneGeometry(250, 12); // Create a long road (width: 200, length: 10)
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.rotation.z = -Math.PI / 2;
    road.position.set(-23, 0.01, 100); // Position the road in front of the home
    scene.add(road);

    // Load the home model
    loader.load('../../models/tornado/tornadoHome.glb', (gltfHome) => {
        const homeModel = gltfHome.scene;
        homeModel.position.set(-20, 0, -20); // Position the home
        homeModel.scale.set(0.002, 0.002, 0.002); // Scale the home model
        scene.add(homeModel);
    });

    // Vehicle models array
    const vehicles = [];

    // Function to load a car model
    function loadCar1() {
        loader.load('../../models/tornado/car.glb', (gltfCar) => {
            const carModel = gltfCar.scene;
            carModel.scale.set(0.009, 0.009, 0.009); // Scale the car model
            carModel.position.set(-20, 0.4, -5); // Initial position of the car
            carModel.rotation.x = Math.PI / 2;
            carModel.rotation.y = -Math.PI / 2;
            carModel.rotation.z = Math.PI / 2;
            scene.add(carModel);

            // Push the car object into the vehicles array
            vehicles.push({ model: carModel, speed: 0.06 });
        });
    }
    function loadCar2() {
        loader.load('../../models/tornado/car2.glb', (gltfCar) => {
            const carModel = gltfCar.scene;
            carModel.scale.set(0.4, 0.4, 0.4); // Scale the car model
            carModel.position.set(-20, -0.5, -5); // Initial position of the car
            scene.add(carModel);

            // Push the car object into the vehicles array
            vehicles.push({ model: carModel, speed: 0.06 });
        });
    }
    
    loadCar1();
    // Start loading car2 at 0 seconds, then every 18 seconds (0, 18, 36, ...)
    setInterval(loadCar1, 9000); // Load car2 every 18 seconds starting immediately

    // Start loading car1 at 9 seconds, then every 18 seconds (9, 27, 45, ...)
    // setTimeout(() => {
    //     loadCar1(); // Load car1 every 18 seconds starting after 9 seconds
    // }, 9000); // Delay the first load of car1 by 9 seconds

    // Load a truck model
    loader.load('../../models/tornado/truck.glb', (gltfTruck) => {
        const truckModel = gltfTruck.scene;
        truckModel.scale.set(0.05, 0.05, 0.05); // Scale the truck model
        truckModel.position.set(-25, 1.7, 100); // Initial position of the truck
        truckModel.rotation.set(0, Math.PI, 0);
        scene.add(truckModel);
        vehicles.push({ model: truckModel, speed: -0.1 }); // Add the truck to vehicles array
    });

    // Load a cycle model
    loader.load('../../models/tornado/cycle.glb', (gltfCycle) => {
        const cycleModel = gltfCycle.scene;
        cycleModel.scale.set(1.2, 1.2, 1.2) ; // Scale the cycle model
        cycleModel.position.set(-30, 0.001, -15); // Initial position of the cycle
        cycleModel.rotation.x = Math.PI/2;
        cycleModel.rotation.y = -Math.PI/2;
        cycleModel.rotation.z = Math.PI/2;
        scene.add(cycleModel);
        // vehicles.push({ model: cycleModel, speed: 0 }); // Add the cycle to vehicles array
    });

    // Animation loop to move vehicles
    function animateVehicles() {
        vehicles.forEach(vehicle => {
            // Move each vehicle along the Z-axis
            vehicle.model.position.z += vehicle.speed;
    
            // Handle position reset for cars
            if (vehicle.speed > 0) { // For cars (moving forward)
                if (vehicle.model.position.z > 170) {
                    vehicle.model.position.z = 10; // Reset to the start of the road
                }
            }
    
            // Handle position reset for trucks
            if (vehicle.speed < 0) { // For trucks (moving backward)
                if (vehicle.model.position.z < 0) {
                    vehicle.model.position.z = 100; // Reset to the start of the road (on the other side)
                }
            }
        });

        // Call animateVehicles again in the next frame
        requestAnimationFrame(animateVehicles);
    }

    animateVehicles(); // Start animating vehicles
}
