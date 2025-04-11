let scene, camera, renderer;
let geometry, material, mesh;
let animationId;

function initWebGL() {
    // Create scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add mesh to scene
    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateWebGL() {
    // Update WebGL elements based on current page
    console.log('Updating WebGL for new page');
}

function disposeWebGL() {
    cancelAnimationFrame(animationId);
    scene.remove(mesh);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
}
