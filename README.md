
# 3D Earthquake Simulator Team 8 UG 3

This project provides an immersive experience of an earthquake scenario where users can navigate through a 3D environment and interact with objects.


## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Kowshik0514/webDev_UG3_8
   ```
2. Navigate to the project directory:
   ```bash
   cd my-threejs-project
   ```
3. Install the required dependencies using npm:
   ```bash
   npm install
   ```

## Usage
- Start the development server:
  ```bash
  npm run dev
  ```
- Open your browser and navigate to [http://localhost:5173](http://localhost:3000) to view the simulator.

## Controls
- **Movement**: Use W, A, S, D keys to navigate.
- **Interact**: Press Y to enter or leave the room when prompted.
- **Stay Outside/Inside**: Press N to cancel the action.
- **Crawl**: Use the shfit key with the keys used for movement.

## Instructions

1. **Earthquake Alert**: Once the earthquake begins, be prepared for falling debris and tremors.
2. **Find a Safe Spot**: Quickly navigate to a safe area to avoid being hit by falling objects
3. **Hide Under a Table**: You can crouch and take cover under a table to shield yourself from falling debris.
4. **Leave the Room**: Alternatively, you can interact with the door to exit the room and find safety outside.
5. **Stay Alert**: Keep an eye on your surroundings and be ready to move as the earthquake continues, as new debris may fall.


## Features

- **Realistic 3D Environment**: Navigate through a detailed 3D room with various interactive objects and a dynamically changing environment.
- **Health System**: Players start with 100 health points, which decrease upon collision with falling objects (stones) or other environmental hazards. Health can be restored by collecting health kits scattered around the scene.
- **Interactive Objects**: Players can interact with various objects in the environment, including a door to enter or leave a room and the ability to hide under tables to avoid falling debris.
- **Health Bar**: A dynamic health bar that visually updates based on the player’s health status. It changes color depending on the player's health percentage (Green: >50%, Yellow: 25-50%, Red: <25%).
- **Dynamic Debris**: Stones and other debris, like a chandelier, dynamically fall from the ceiling during earthquakes, simulating a real-life earthquake scenario.
- **Chandelier Mechanics**: A chandelier falls during seismic events, adding another obstacle for the player to avoid.
- **Tremor Visualization**: The environment visually reacts to tremors, adding immersive earthquake effects.
- **Game Over & Restart**: If the player's health reaches zero, the game ends with a "Game Over" message, and players can restart the game with their health and environment reset.


## Implementation Details

1. **3D Environment Setup**:
   - **Three.js**: Used for rendering 3D graphics, creating scenes, cameras, lights, and controls.
   - **Scene Creation**: The simulation starts with a basic scene, where all objects like stones, the player, and the environment are added.
   - **Camera**: A perspective camera provides depth and realism to the environment.
   - **Lighting**: Ambient and directional lights are used to illuminate the scene.

2. **Model Loading**:
   - **GLTFLoader**: Used for loading 3D models (like stones and the chandelier) in the GLB format.
   - **Scaling and Positioning**: After loading, models are scaled and positioned appropriately in the environment.

3. **Physics Simulation**:
   - **Cannon.js**: Integrated for simulating realistic object interactions, gravity effects, and collisions.
   - **Physics Bodies**: 3D objects like stones and doors are assigned physical properties like mass, shape, and collision detection.
   - **Collision Detection**: Checks for collisions between the player and falling debris to manage health.

4. **Health Management System**:
   - **Health Bar**: Updates dynamically based on the player's health. The health bar changes color according to the player's health percentage.
   - **Health Kit**: Players can collect health kits to restore their health during gameplay.

5. **Player Interaction**:
   - **Object Interaction**: Players can interact with certain objects (e.g., doors) when close enough. Players can also hide under tables to avoid falling debris during earthquakes.
   - **Keyboard Input**: Movement and interaction controls are managed through keyboard events.

6. **Dynamic Environment Interactions**:
   - **Falling Debris**: Stones are loaded dynamically, each given a random position and scale, to simulate debris falling during earthquakes.
   - **Chandelier Simulation**: A chandelier can fall during seismic activity, adding another layer of interactivity.
   - **Tremor Effects**: The simulation visualizes tremors, enhancing the earthquake experience.

7. **Game Restart Mechanism**:
   - **Reset Game**: After the player’s health reaches zero, the game can be restarted, resetting health and positions of objects.




## Contributions

- **Aarya**: House model design with colliders, health bar, door with functionality.
- **Akash**: Chandelier, sound effects, table with colliders, and furniture.
- **Jyothiraditya**: Earth quake tremors, stones falling , health reduction .
- **Kowshik**: Character design, animations and movements with camera control.
- **Madhav**: Health-kit functionality, floor design, entry and exit system.
- **Sanjay**: Floor cracks, front pages, road and street lights, light effects.


