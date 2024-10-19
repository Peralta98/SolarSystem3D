class UI {
    constructor(solarSystem, cameraController) {
        this.solarSystem = solarSystem;
        this.cameraController = cameraController;
        this.createPlanetPanel();
        this.createInfoBox();
        this.createControlsHUD(); // Novo método para criar o HUD
        this.createFullscreenButton(); // Novo método para criar o botão de tela cheia
    }

    createPlanetPanel() {
        const panel = document.createElement('div');
        panel.id = 'planet-panel';

        const title = document.createElement('h2');
        title.textContent = 'Planetas';
        panel.appendChild(title);

        this.solarSystem.getAllObjects().forEach(object => {
            const button = document.createElement('button');
            button.textContent = object.name;
            button.classList.add('planet-button');

            button.addEventListener('click', () => {
                this.focusOnPlanet(object);
            });

            panel.appendChild(button);
        });

        document.body.appendChild(panel);
    }

    createInfoBox() {
        const infoBox = document.createElement('div');
        infoBox.id = 'info-box';
        infoBox.style.display = 'none';

        const infoText = document.createElement('p');
        infoBox.appendChild(infoText);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '✓';
        confirmButton.addEventListener('click', () => this.hideInfoBox());
        infoBox.appendChild(confirmButton);

        document.body.appendChild(infoBox);
    }

    focusOnPlanet(object) {
        this.cameraController.focusOnObject(object);
        this.showInfoBox(object);
    }

    showInfoBox(object) {
        const infoBox = document.getElementById('info-box');
        const infoText = infoBox.querySelector('p');
        infoText.textContent = this.getPlanetInfo(object.name);
        infoBox.style.display = 'block';
    }

    hideInfoBox() {
        const infoBox = document.getElementById('info-box');
        infoBox.style.display = 'none';
    }

    getPlanetInfo(planetName) {
        // Implemente as informações dos planetas aqui
        const planetInfo = {
            'Sol': 'O Sol é a estrela central do Sistema Solar.',
            'Mercúrio': 'Mercúrio é o planeta mais próximo do Sol e o menor do Sistema Solar.',
            'Vénus': 'Vénus é o segundo planeta do Sistema Solar em ordem de distância a partir do Sol.',
            'Terra': 'A Terra é o terceiro planeta mais próximo do Sol e o único conhecido a abrigar vida.',
            'Marte': 'Marte é o quarto planeta a partir do Sol e é frequentemente descrito como o "Planeta Vermelho".',
            'Júpiter': 'Júpiter é o maior planeta do Sistema Solar e o quinto a partir do Sol.',
            'Saturno': 'Saturno é o sexto planeta a partir do Sol e é conhecido por seus anéis proeminentes.',
            'Urano': 'Urano é o sétimo planeta a partir do Sol e o terceiro maior do Sistema Solar.',
            'Neptuno': 'Neptuno é o oitavo e mais distante planeta conhecido do Sistema Solar.'
        };
        return planetInfo[planetName] || 'Informação não disponível.';
    }

    createControlsHUD() {
        const hud = document.createElement('div');
        hud.id = 'controls-hud';
        hud.innerHTML = `
            <div class="key-row">
                <div class="key">W</div>
            </div>
            <div class="key-row">
                <div class="key">A</div>
                <div class="key">S</div>
                <div class="key">D</div>
            </div>
            <div class="hud-text">Movimento</div>
        `;
        document.body.appendChild(hud);
    }

    createFullscreenButton() {
        const fullscreenButton = document.createElement('button');
        fullscreenButton.id = 'fullscreen-button';
        fullscreenButton.innerHTML = '&#x26F6;'; // Ícone de tela cheia
        fullscreenButton.addEventListener('click', this.toggleFullscreen.bind(this));
        document.body.appendChild(fullscreenButton);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
}
