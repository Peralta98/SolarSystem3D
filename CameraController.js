class CameraController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.moveSpeed = 1.0; // Velocidade de movimento para WASD
        this.rotateSpeed = 1.0; // Velocidade de rotação
        this.pitch = 0;
        this.yaw = 0;

        this.maxDistance = 200; // Distância máxima do centro do sistema solar

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        // Bind methods
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.domElement.addEventListener('mousedown', this.onMouseDown, false);
        this.domElement.addEventListener('contextmenu', this.onContextMenu, false);
        document.addEventListener('mousemove', this.onMouseMove, false);
        document.addEventListener('mouseup', this.onMouseUp, false);
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
    }

    setPlanets(planets) {
        this.planets = planets;
    }

    onMouseDown(event) {
        event.preventDefault();
        
        this.isMouseDown = true;
        this.mouseButton = event.button;

        if (event.button === 0) { // Botão esquerdo
            this.rotateStart = new THREE.Vector2(event.clientX, event.clientY);
        }
    }

    onMouseMove(event) {
        if (!this.isMouseDown || this.mouseButton !== 0) return;

        event.preventDefault();
        this.isDragging = true;

        this.rotateEnd = new THREE.Vector2(event.clientX, event.clientY);
        this.rotateDelta = new THREE.Vector2().subVectors(this.rotateEnd, this.rotateStart);
        this.rotate(this.rotateDelta.x, this.rotateDelta.y);
        this.rotateStart.copy(this.rotateEnd);
    }

    onMouseUp(event) {
        this.isMouseDown = false;
        this.isDragging = false;
        this.mouseButton = -1;
    }

    onContextMenu(event) {
        event.preventDefault();
    }

    onKeyDown(event) {
        switch (event.key) {
            case 'w':
            case 'W':
                this.keys.forward = true;
                break;
            case 's':
            case 'S':
                this.keys.backward = true;
                break;
            case 'a':
            case 'A':
                this.keys.right = true;
                break;
            case 'd':
            case 'D':
                this.keys.left = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.key) {
            case 'w':
            case 'W':
                this.keys.forward = false;
                break;
            case 's':
            case 'S':
                this.keys.backward = false;
                break;
            case 'a':
            case 'A':
                this.keys.right = false;
                break;
            case 'd':
            case 'D':
                this.keys.left = false;
                break;
        }
    }

    rotate(deltaX, deltaY) {
        const element = this.domElement;

        // Converter pixels para radianos
        const radianLeft = 2 * Math.PI * deltaX / element.clientWidth * this.rotateSpeed;
        const radianUp = 2 * Math.PI * deltaY / element.clientHeight * this.rotateSpeed;

        // Atualizar yaw (rotação horizontal)
        this.yaw -= radianLeft;

        // Atualizar pitch (rotação vertical) com limites
        this.pitch -= radianUp;
        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));

        // Aplicar rotação à câmara
        const rotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
        
        this.camera.quaternion.copy(rotationQuaternion);
    }

    update() {
        // Obter a direção da câmara
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);

        // Calcular o vetor "right" perpendicular à direção da câmara
        const right = new THREE.Vector3();
        right.crossVectors(this.camera.up, direction).normalize();

        // Calcular o novo movimento
        const movement = new THREE.Vector3();

        if (this.keys.forward) movement.add(direction);
        if (this.keys.backward) movement.sub(direction);
        if (this.keys.left) movement.sub(right);
        if (this.keys.right) movement.add(right);

        movement.normalize().multiplyScalar(this.moveSpeed);

        // Calcular a nova posição
        const newPosition = this.camera.position.clone().add(movement);

        // Verificar se a nova posição está dentro do limite
        if (newPosition.length() <= this.maxDistance) {
            this.camera.position.copy(newPosition);
        } else {
            // Se estiver fora do limite, mover a câmara para o ponto mais próximo dentro do limite
            newPosition.clampLength(0, this.maxDistance);
            this.camera.position.copy(newPosition);
        }

        return true;
    }

    focusOnObject(object) {
        // Calcular a posição alvo da câmera
        const offset = new THREE.Vector3(0, object.radius * 2, object.radius * 5);
        const targetPosition = object.mesh.position.clone().add(offset);
        
        // Calcular a direção para o objeto
        const direction = new THREE.Vector3().subVectors(object.mesh.position, targetPosition).normalize();
        
        // Criar um quaternion a partir da direção
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), direction);
        
        // Animação suave para a nova posição
        new TWEEN.Tween(this.camera.position)
            .to(targetPosition, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        // Animação suave para a nova rotação
        new TWEEN.Tween(this.camera.quaternion)
            .to(quaternion, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.camera.lookAt(object.mesh.position);
            })
            .start();

        // Atualizar o yaw e pitch da câmera
        const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
        this.yaw = euler.y;
        this.pitch = euler.x;
    }
}
