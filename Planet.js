class Planet {
    constructor(name, radius, textureUrl, position, rotationSpeed, ringTextureUrl = null, ringInnerRadius = 0, ringOuterRadius = 0) {
        this.name = name;
        this.radius = radius;
        this.textureUrl = textureUrl;
        this.position = position;
        this.rotationSpeed = rotationSpeed;
        this.ringTextureUrl = ringTextureUrl;
        this.ringInnerRadius = ringInnerRadius;
        this.ringOuterRadius = ringOuterRadius;
        this.mesh = null;
        this.ringMesh = null;
        this.group = null;
        this.createMesh();
    }

    createMesh() {
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial();
        this.mesh = new THREE.Mesh(geometry, material);
        
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(this.textureUrl, (texture) => {
            this.mesh.material.map = texture;
            this.mesh.material.needsUpdate = true;
        });

        this.group = new THREE.Group();
        this.group.add(this.mesh);
        
        if (this.ringTextureUrl) {
            this.createRings();
        }

        this.group.position.x = this.position;
    }

    createRings() {
        const ringGeometry = new THREE.RingGeometry(
            this.ringInnerRadius,
            this.ringOuterRadius,
            128,
            8,
            0,
            Math.PI * 2
        );

        const textureLoader = new THREE.TextureLoader();
        const ringTexture = textureLoader.load(this.ringTextureUrl);

        const ringMaterial = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: ringTexture },
                innerRadius: { value: this.ringInnerRadius },
                outerRadius: { value: this.ringOuterRadius },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                uniform float innerRadius;
                uniform float outerRadius;
                varying vec2 vUv;
                void main() {
                    vec2 uv = vUv;
                    gl_FragColor = texture2D(map, vec2(uv.x, uv.y));
                    if (gl_FragColor.a < 0.1) discard;
                }
            `,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
        });

        this.ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        
        // Mantém o anel direito
        this.ringMesh.rotation.x = -0.5 * Math.PI;
        
        // Adiciona o anel ao grupo
        this.group.add(this.ringMesh);
    }

    update(deltaTime) {
        if (this.mesh) {
            this.mesh.rotation.y += this.rotationSpeed * deltaTime;
        }
    }
}
