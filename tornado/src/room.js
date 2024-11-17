// /tornado/src/room.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon';
import {player, restartGame} from './main.js';
import { playerHealth, updateHealth2} from './main.js';
import { isTornadoactive } from '/src/tornado.js';

export let load1=false;
export let load2=false;


export function loadHome(scene, world) {
    const loader = new GLTFLoader();
    const loadingScreen = document.getElementById('loadingScreen');
    // Create a road using PlaneGeometry
    const roadGeometry = new THREE.PlaneGeometry(250, 12);
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.rotation.z = -Math.PI / 2;
    road.position.set(-23, 0.01, 100); 
    scene.add(road);

    // Load the home model
    loader.load('../../models/tornado/tornadoHome.glb', (gltfHome) => {
        const homeModel = gltfHome.scene;
        homeModel.rotateOnAxis(new THREE.Vector3(0, 1, 0), 5*Math.PI/13);
        homeModel.position.set(0, 0, 40); 
        load1=true;
        homeModel.scale.set(0.002, 0.002, 0.002); 
        scene.add(homeModel);
    });

    const vehicles = [];

    function loadCar1() {
        loader.load('/models/tornado/car.glb', (gltfCar) => {
            const carModel = gltfCar.scene;
            carModel.scale.set(0.009, 0.009, 0.009); 
            carModel.position.set(-20, 0.4, -5); 
            carModel.rotation.x = Math.PI / 2;
            carModel.rotation.y = -Math.PI / 2;
            carModel.rotation.z = Math.PI / 2;
            carModel.hasFallen = false; 
            scene.add(carModel);
            vehicles.push({ model: carModel, speed: 0.06 });
        });
    }
    function loadCar2() {
        loader.load('/models/tornado/car2.glb', (gltfCar) => {
            const carModel = gltfCar.scene;
            carModel.scale.set(0.4, 0.4, 0.4);
            carModel.position.set(-20, -0.5, -5); 
            scene.add(carModel);
            carModel.hasFallen = false; 
            vehicles.push({ model: carModel, speed: 0.06 });
        });
    }
    
    loadCar1();
    setInterval(loadCar1, 9000); 
    // setTimeout(() => {
    //     loadCar1(); // Load car1 every 18 seconds starting after 9 seconds
    // }, 9000); // Delay the first load of car1 by 9 seconds

    // Load a truck model
    let truckModel;
    loader.load('/models/tornado/truck.glb', (gltfTruck) => {
        truckModel = gltfTruck.scene;
        truckModel.scale.set(0.05, 0.05, 0.05); 
        truckModel.position.set(-25, 1.7, 110);
        truckModel.rotation.set(0, Math.PI, 0);
        truckModel.hasFallen = false; 
        scene.add(truckModel);
        vehicles.push({ model: truckModel, speed: -0.1 }); 
    });

    let truckModel2;
    loader.load('/models/tornado/truck.glb', (gltfTruck) => {
        truckModel2 = gltfTruck.scene;
        truckModel2.scale.set(0.05, 0.05, 0.05); 
        truckModel2.position.set(-25, 1.7, 45);
        truckModel2.rotation.set(0, Math.PI, 0);
        truckModel2.hasFallen = false; 
        load2=true;
        scene.add(truckModel2);
        vehicles.push({ model: truckModel2, speed: -0.1 }); 
    });

    // Load a cycle model
    loader.load('/models/tornado/cycle.glb', (gltfCycle) => {
        const cycleModel = gltfCycle.scene;
        cycleModel.scale.set(1.2, 1.2, 1.2) ;
        cycleModel.position.set(-30, 0.001, -15);
        cycleModel.rotation.x = Math.PI/2;
        cycleModel.rotation.y = -Math.PI/2;
        cycleModel.rotation.z = Math.PI/2;
        scene.add(cycleModel);
        // vehicles.push({ model: cycleModel, speed: 0 }); 
    });

    function animateVehicles() {
        if(load1 && load2){
            loadingScreen.style.display = 'none';
        }
        vehicles.forEach(vehicle => {
            vehicle.model.position.z += vehicle.speed;
    
            if (vehicle.speed > 0) {
                if (vehicle.model.position.z > 170) {
                    vehicle.model.position.z = 10; 
                }
            }
            // console.log(player);
            let distanceToPlayer = 10; 
            if(player) {distanceToPlayer = vehicle.model.position.distanceTo(player.position); }

        // Check if the vehicle is near the player
        if (distanceToPlayer < 6 && isTornadoactive) { 
            // vehicle.model.position.y -= 0.1;
            // vehicle.model.rotation.x += 0.05; 
            if( vehicle.model===truckModel || vehicle.model===truckModel2){
                if(vehicle.model.rotation.z>-1.6){
            vehicle.model.rotation.z -=0.05;
            vehicle.speed = 0;
            vehicle.hasFallen = true;
                }
                else
                {
                    console.log("truck fallen");
                    // playerHealth=0;
                    vehicle.model.position.z = 100;
                    vehicle.model.rotation.z = 0;
                    vehicle.speed =-0.1;
                    vehicle.hasFallen = false;
                    updateHealth2();
                    // vehicle.model.hasFallen = false;
                    // vehicles.remove(vehicle);
                }
            }
            // if(player.position.x<vehicle.model.position.x){
                // restartGame();
            // }

        }    
        if (vehicle.speed < 0) { 
            if (vehicle.model.position.z < 0) {
                vehicle.model.position.z = 110;
            }
        }
        });
        requestAnimationFrame(animateVehicles);
    }

    animateVehicles();
}
