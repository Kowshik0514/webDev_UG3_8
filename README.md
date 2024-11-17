# Disaster Simulation Website

Welcome to the **Disaster Simulation Website**! This interactive website simulates three realistic disaster scenarios—**Earthquake**, **Flood**, and **Tornado**—designed to test your decision-making and survival skills in high-pressure environments. Follow the scenarios, utilize the controls, and make quick decisions to survive the challenges.

---

## Table of Contents
1. [Features](#features)
2. [Getting Started](#getting-started)
3. [Game Controls](#game-controls)
4. [Scenarios](#scenarios)
   - [Earthquake](#earthquake-scenario)
   - [Flood](#flood-scenario)
   - [Tornado](#tornado-scenario)
5. [Technical Details](#technical-details)
6. [Contributing](#contributing)
7. [License](#license)

---

## Features
- **Three Disaster Scenarios:** Earthquake, Flood, and Tornado, each with unique challenges.
- **Immersive Gameplay:** Navigate through realistic disaster conditions using intuitive controls.
- **Health System:** Health Bar and replenish health using first aid kits during scenarios.
- **Interactive News Section:** Stay updated with the "Latest News" for realism and context.
- **Dynamic Obstacles:** Avoid hazards like falling debris, rising waters, and dangerous winds.

---

## Getting Started
### Installation
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

## Game Controls

#### Movement
- **W, A, S, D**: Move your character.

#### Climbing
- **C**: Press to climb objects.

#### Crawling
- **Shift + W, A, S, D**: Hold Shift and use WASD keys to crawl.

#### View Rotation
- **Mouse**: Move your mouse to rotate the view.

#### Action Buttons
- Click on scenario-specific buttons to start (e.g., **"Start Earthquake"**).

---

## Scenarios

### Earthquake Scenario
- **Start**: Click the **"Start Earthquake"** button.
- **Objective**: Survive falling debris and ground tremors.
- **Actions**:
  - Hide under a table.
  - Exit the house to avoid collapsing structures.
  - Use first aid kits to heal if injured.
- **Goal**: Find safety and survive until the tremors subside.

### Flood Scenario
- **Start**: Click the **"Start Flood"** button.
- **Objective**: Collect essentials and reach high ground.
- **Actions**:
  - Gather items like fruits and certificates before water levels rise.
  - Avoid contact with current poles to prevent electrocution.
  - Climb to the top of a water tank to stay safe.
- **Goal**: Survive the flood by preparing and avoiding hazards.

### Tornado Scenario
- **Start**: Click the **"Start Tornado"** button.
- **Objective**: Reach safety indoors while avoiding tornado hazards.
- **Actions**:
  - Stay clear of large vehicles that may be lifted by the winds.
  - Quickly head indoors for safety.
- **Goal**: Avoid being swept away by the tornado.

---

## Technical Details

- **Frontend**: Built with React.js for an interactive user interface.
- **Physics Simulation**: Powered by Three.js and Cannon.js for realistic disaster effects.
- **News Integration**: Uses a news API for the **"Latest News"** segment.
- **Environment**: Tested on modern browsers (Chrome, Firefox, Edge).

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

Enjoy the challenges and test your survival instincts in the Disaster Simulation Website! 🌪️🌊🌍
