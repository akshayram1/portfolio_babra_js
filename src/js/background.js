class BackgroundAnimation {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        });
        this.particles = [];
        this.mouse = {
            x: 0,
            y: 0
        };
        this.init();
    }

    init() {
        // Configure renderer
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0a0a18, 1); // Dark background color for the canvas

        // Position camera
        this.camera.position.z = 5;

        // Create particles
        this.createParticles();

        // Add a subtle ambient light
        const ambientLight = new THREE.AmbientLight(0x332244, 0.5);
        this.scene.add(ambientLight);

        // Add mouse movement event listeners
        document.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Add window resize event listener
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation loop
        this.animate();
    }

    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1500; // Increased particle count

        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Dark theme color palette
        const colorOptions = [
            new THREE.Color(0xff3a5f), // Accent color (pink)
            new THREE.Color(0x4a6fff), // Primary color (blue)
            new THREE.Color(0x50e3c2), // Secondary color (teal)
            new THREE.Color(0x333366)  // Dark blue
        ];

        for (let i = 0; i < particleCount; i++) {
            // Position particles in a more spread out sphere
            const radius = 5 + Math.random() * 5; // Between 5 and 10
            const theta = Math.random() * Math.PI * 2; // 0 to 2π
            const phi = Math.acos((Math.random() * 2) - 1); // 0 to π

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
            positions[i * 3 + 2] = radius * Math.cos(phi);                   // z

            // Color - weightage towards accent color for more visual impact
            const colorIndex = Math.random() > 0.7 ? 0 : Math.floor(Math.random() * colorOptions.length);
            const color = colorOptions[colorIndex];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Randomized sizes for depth perception
            sizes[i] = Math.random() * 0.08 + 0.02;

            // Store particle data for animation
            this.particles.push({
                velocity: {
                    x: (Math.random() - 0.5) * 0.005,
                    y: (Math.random() - 0.5) * 0.005,
                    z: (Math.random() - 0.5) * 0.005
                },
                originalZ: positions[i * 3 + 2], // Store original z for parallax
                index: i
            });
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Create shader material for better looking particles
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: this.createPointTexture() }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        });

        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
    }

    createPointTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);

        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    onMouseMove(event) {
        // Calculate normalized device coordinates (-1 to +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Animate particles
        const positions = this.particleSystem.geometry.attributes.position.array;
        const sizes = this.particleSystem.geometry.attributes.size.array;

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            const idx = particle.index * 3;

            // Update position
            positions[idx] += particle.velocity.x;
            positions[idx + 1] += particle.velocity.y;
            positions[idx + 2] += particle.velocity.z;

            // Subtle size pulsation effect
            sizes[particle.index] = Math.abs(Math.sin(Date.now() * 0.001 + particle.index)) * 0.03 + 0.03;

            // Mouse interaction - create slight bulge towards mouse position
            const distanceX = this.mouse.x * 5 - positions[idx];
            const distanceY = this.mouse.y * 3 - positions[idx + 1];
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < 2) {
                positions[idx] += distanceX * 0.002;
                positions[idx + 1] += distanceY * 0.002;
            }

            // Boundary check and reverse direction if needed
            if (Math.abs(positions[idx]) > 10) particle.velocity.x *= -1;
            if (Math.abs(positions[idx + 1]) > 8) particle.velocity.y *= -1;
            if (Math.abs(positions[idx + 2]) > 10) particle.velocity.z *= -1;
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.size.needsUpdate = true;

        // Rotate particle system slowly for ambient movement
        this.particleSystem.rotation.x += 0.0002;
        this.particleSystem.rotation.y += 0.0003;

        // Subtle camera movement for more dynamic feel
        this.camera.position.x = Math.sin(Date.now() * 0.0001) * 0.5;
        this.camera.position.y = Math.cos(Date.now() * 0.0001) * 0.3;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize background animation when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundAnimation();
});
