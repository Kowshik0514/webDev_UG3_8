const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

const degreesToRadians = (degrees) => {
	return degrees * (Math.PI / 180)
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Helpers
const center = (group) => {
	new THREE.Box3().setFromObject(group).getCenter( group.position ).multiplyScalar(-1)
	scene.add(group)
}

const random = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min

  if (float) {
    return val
  }

  return Math.floor(val)
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })

const render = () => {
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.render(scene, camera)
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5
scene.add(camera)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
})

// Material
const material = new THREE.MeshLambertMaterial({ color: 0xffffff })

// Lighting
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.5)
scene.add(lightAmbient)

const lightDirectional = new THREE.DirectionalLight(0xffffff, 0.8)
scene.add(lightDirectional)

// Move the light source towards us
lightDirectional.position.set(5, 5, 5)

// Figure
class Figure {
	constructor(params) {
		this.params = {
			x: 0,
			y: 0,
			z: 0,
			ry: 0,
			...params
		}
		
		// Create group and add to scene
		this.group = new THREE.Group()
		scene.add(this.group)
		
		// Position according to params
		this.group.position.x = this.params.x
		this.group.position.y = this.params.y
		this.group.position.z = this.params.z
		// this.group.rotation.y = this.params.ry
		// this.group.scale.set(5, 5, 5)
		
		// Material
		this.headHue = random(0, 360)
		this.bodyHue = random(0, 360)
		this.headLightness = random(40, 65)
		this.headMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.headHue}, 30%, ${this.headLightness}%)` })
		this.bodyMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.bodyHue}, 85%, 50%)` })
		
		this.arms = []
	}
	
	createBody() {
		this.body = new THREE.Group()
		const geometry = new THREE.BoxGeometry(1, 1.5, 1)
		const bodyMain = new THREE.Mesh(geometry, this.bodyMaterial)
		
		this.body.add(bodyMain)
		this.group.add(this.body)
		
		this.createLegs()
	}
	
	createHead() {
		// Create a new group for the head
		this.head = new THREE.Group()
		
		// Create the main cube of the head and add to the group
		const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4)
		const headMain = new THREE.Mesh(geometry, this.headMaterial)
		this.head.add(headMain)
		
		// Add the head group to the figure
		this.group.add(this.head)
		
		// Position the head group
		this.head.position.y = 1.65
		
		// Add the eyes
		this.createEyes()
	}
	
	createArms() {
		const height = 0.85
		
		for(let i = 0; i < 2; i++) {
			const armGroup = new THREE.Group()
			const geometry = new THREE.BoxGeometry(0.25, height, 0.25)
			const arm = new THREE.Mesh(geometry, this.headMaterial)
			const m = i % 2 === 0 ? 1 : -1
			
			// Add arm to group
			armGroup.add(arm)
			
			// Add group to figure
			this.body.add(armGroup)
			
			// Translate the arm by half the height
			arm.position.y = height * -0.5
			
			// Position the arm relative to the figure
			armGroup.position.x = m * 0.8
			armGroup.position.y = 0.6
			
			// Rotate the arm
			armGroup.rotation.z = degreesToRadians(30 * m)
			
			// Push to the array
			this.arms.push(armGroup)
		}
	}
	
	createEyes() {
		const eyes = new THREE.Group()
		const geometry = new THREE.SphereGeometry(0.15, 12, 8)
		const material = new THREE.MeshLambertMaterial({ color: 0x44445c })
		
		for(let i = 0; i < 2; i++) {
			const eye = new THREE.Mesh(geometry, material)
			const m = i % 2 === 0 ? 1 : -1
			
			eyes.add(eye)
			eye.position.x = 0.36 * m
		}
		
		this.head.add(eyes)
		
		eyes.position.y = -0.1
		eyes.position.z = 0.7
	}
	
	createLegs() {
		const legs = new THREE.Group()
		const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25)
		
		for(let i = 0; i < 2; i++) {
			const leg = new THREE.Mesh(geometry, this.headMaterial)
			const m = i % 2 === 0 ? 1 : -1
			
			legs.add(leg)
			leg.position.x = m * 0.22
		}
		
		this.group.add(legs)
		legs.position.y = -1.15
		
		this.body.add(legs)
	}
	
	bounce() {
		this.group.rotation.y = this.params.ry
		this.group.position.y = this.params.y
		this.arms.forEach((arm, index) => {
			const m = index % 2 === 0 ? 1 : -1
			arm.rotation.z = this.params.armRotation * m
		})
	}
	
	init() {
		this.createBody()
		this.createHead()
		this.createArms()
	}
}

const figure = new Figure()
figure.init()

gsap.set(figure.params, {
	y: -1.5
})

gsap.to(figure.params, {
	ry: degreesToRadians(360),
	repeat: -1,
	duration: 20
})

gsap.to(figure.params, {
	y: 0,
	armRotation: degreesToRadians(90),
	repeat: -1,
	yoyo: true,
	duration: 0.5
})

gsap.ticker.add(() => {
	figure.bounce()
	render()
})
export default Figure;
