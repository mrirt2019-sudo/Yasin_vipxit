class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        
        this.init();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        document.getElementById('three-container').appendChild(this.renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0x00ff88, 0.3);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x0099ff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xff0088, 0.5, 100);
        pointLight.position.set(-5, -5, 5);
        this.scene.add(pointLight);

        // Create floating geometric shapes
        this.createGeometricShapes();
        
        // Create particle system
        this.createParticles();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createGeometricShapes() {
        const geometries = [
            new THREE.TetrahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.TorusGeometry(1, 0.4, 16, 100),
            new THREE.SphereGeometry(1, 32, 32)
        ];

        const materials = [
            new THREE.MeshPhongMaterial({ 
                color: 0x00ff88, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0x0099ff, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0xff0088, 
                transparent: true, 
                opacity: 0.3,
                wireframe: true 
            })
        ];

        geometries.forEach((geometry, index) => {
            const material = materials[index % materials.length];
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position randomly
            mesh.position.x = (Math.random() - 0.5) * 20;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 10;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            // Store original positions for animation
            mesh.userData = {
                originalX: mesh.position.x,
                originalY: mesh.position.y,
                originalZ: mesh.position.z,
                speed: 0.5 + Math.random() * 1.5
            };
            
            this.scene.add(mesh);
        });
    }

    createParticles() {
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Positions
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            // Colors
            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.8, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Animate geometric shapes
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.userData.speed) {
                child.rotation.x += 0.01 * child.userData.speed;
                child.rotation.y += 0.01 * child.userData.speed;
                
                // Floating animation
                child.position.y = child.userData.originalY + Math.sin(Date.now() * 0.001 * child.userData.speed) * 2;
            }
        });

        // Animate particles
        if (this.particles) {
            this.particles.rotation.x += 0.001;
            this.particles.rotation.y += 0.002;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize Three.js scene when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ThreeScene();
});