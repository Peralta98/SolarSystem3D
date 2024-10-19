let scene, camera, renderer, solarSystem, cameraController, ui;
let lastTime = performance.now();

function init() {
    

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 100);

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarSystem'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);

    

    solarSystem = new SolarSystem(scene);
    solarSystem.init();
   

    cameraController = new CameraController(camera, renderer.domElement);
    cameraController.setPlanets(solarSystem.getAllObjects());


    ui = new UI(solarSystem, cameraController);
    

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    

    window.addEventListener('resize', onWindowResize, false);

    
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const currentTime = performance.now();
    TWEEN.update(); // Adicione esta linha
    solarSystem.update(currentTime);
    cameraController.update();
    renderer.render(scene, camera);
}

// Inicia o carregamento
init();
