class SolarSystem {
    constructor(scene) {
        this.planets = [];
        this.scene = scene;
        this.sun = null;
        this.lastUpdateTime = performance.now();
    }

    init() {
        this.createSun();
        this.createPlanets();
        this.createSkybox();
    }

    createPlanets() {
        const baseRotationSpeed = 0.01; 

        const planetData = [
            { name: 'Mercúrio', radius: 0.383, texture: 'textures/mercury.jpg', position: 20, rotationSpeed: baseRotationSpeed * 10 },
            { name: 'Vénus', radius: 0.949, texture: 'textures/venus.jpg', position: 30, rotationSpeed: baseRotationSpeed * 10 },
            { name: 'Terra', radius: 1, texture: 'textures/earth.jpg', position: 40, rotationSpeed: baseRotationSpeed * 10 },
            { name: 'Marte', radius: 0.532, texture: 'textures/mars.jpg', position: 50, rotationSpeed: baseRotationSpeed * 10 },
            { name: 'Júpiter', radius: 2.5, texture: 'textures/jupiter.jpg', position: 70, rotationSpeed: baseRotationSpeed * 10 },
            { name: 'Saturno', radius: 2.2, texture: 'textures/saturn.jpg', position: 90, rotationSpeed: baseRotationSpeed * 10, ringTexture: 'textures/saturn_rings.png', ringInner: 2.5, ringOuter: 4.0 },
            { name: 'Urano', radius: 1.5, texture: 'textures/uranus.jpg', position: 110, rotationSpeed: baseRotationSpeed * 10 },
            { name: 'Neptuno', radius: 1.4, texture: 'textures/neptune.jpg', position: 130, rotationSpeed: baseRotationSpeed * 10 }
        ];

        const scaleFactor = 3; // Fator de escala para aumentar o tamanho dos planetas

        planetData.forEach(data => {
            const planet = new Planet(
                data.name, 
                data.radius * scaleFactor, 
                data.texture, 
                data.position, 
                data.rotationSpeed, 
                data.ringTexture, 
                data.ringInner * scaleFactor, 
                data.ringOuter * scaleFactor
            );
            this.planets.push(planet);
            if (planet.group) {
                this.scene.add(planet.group);
            } else if (planet.mesh) {
                this.scene.add(planet.mesh);
            }
        });
    }

    createSun() {
        const baseRotationSpeed = 0.01;
        const sunRotationSpeed = baseRotationSpeed * 10; // Mesma velocidade base dos planetas
        
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const sunTexture = textureLoader.load('textures/sun.jpg');
        const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);

        const sunLight = new THREE.PointLight(0xffffff, 1.5, 1000);
        this.sun.add(sunLight);

        // Adicionando a propriedade de rotação ao Sol
        this.sun.rotationSpeed = sunRotationSpeed;
    }

    createSkybox() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('textures/background.jpg');
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            map: texture
        });
        const skybox = new THREE.Mesh(geometry, material);
        this.scene.add(skybox);
    }

    update(currentTime) {
        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Converte para segundos
        this.planets.forEach(planet => planet.update(deltaTime));
        
        // Atualizando a rotação do Sol
        if (this.sun) {
            this.sun.rotation.y += this.sun.rotationSpeed * deltaTime;
        }
        
        this.lastUpdateTime = currentTime;
    }

    getAllObjects() {
        return [
            { 
                name: 'Sol', 
                mesh: this.sun, 
                radius: 5
            }, 
            ...this.planets.map(planet => ({
                name: planet.name,
                mesh: planet.group || planet.mesh,
                radius: planet.radius
            }))
        ];
    }
}
