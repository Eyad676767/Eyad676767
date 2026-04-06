// Control page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    setupControlListeners();
    updateControlDisplay();
});

// Setup control specific event listeners
function setupControlListeners() {
    // Power button
    const powerBtn = document.getElementById('power-btn');
    if (powerBtn) {
        powerBtn.addEventListener('click', togglePower);
    }

    // Temperature buttons
    document.getElementById('temp-up')?.addEventListener('click', () => adjustTemp('up'));
    document.getElementById('temp-down')?.addEventListener('click', () => adjustTemp('down'));

    // Temperature slider
    const tempSlider = document.getElementById('temp-slider');
    if (tempSlider) {
        tempSlider.addEventListener('input', (e) => {
            acState.temperature = parseInt(e.target.value);
            updateControlDisplay();
            saveState();
        });
    }

    // Quick action buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.classList[1];
            handleQuickAction(mode);
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 150);
        });
    });
}

// Update control page displays
function updateControlDisplay() {
    // Target temperature
    document.getElementById('target-temp').textContent = acState.temperature;
    document.getElementById('visual-temp').textContent = acState.temperature;
    document.getElementById('temp-slider').value = acState.temperature;

    // Power button state
    const powerBtn = document.getElementById('power-btn');
    const powerText = document.getElementById('power-text');
    if (powerBtn && powerText) {
        powerBtn.classList.toggle('on', acState.power);
        powerText.textContent = acState.power ? 'ON' : 'OFF';
    }

    // Current temp (simulated)
    document.querySelector('.current-temp').innerHTML = `${Math.round(acState.currentTemp)}°<span>C</span>`;

    // Humidity
    document.querySelector('.humidity-display').textContent = `${acState.humidity}%`;

    // Visual mode
    document.getElementById('visual-mode').textContent = acState.mode.toUpperCase();

    // Airflow animation
    const airflow = document.querySelector('.airflow-visual');
    if (airflow) {
        airflow.style.opacity = acState.power ? '1' : '0.3';
    }
}

// Quick actions
function handleQuickAction(action) {
    switch(action) {
        case 'sleep-mode':
            acState.temperature = 27;
            acState.mode = 'sleep';
            break;
        case 'eco-mode':
            acState.energySaving = true;
            acState.temperature = 26;
            acState.mode = 'eco';
            break;
        case 'turbo':
            acState.temperature = 18;
            acState.mode = 'turbo';
            break;
        case 'auto':
            acState.mode = 'auto';
            break;
    }
    updateControlDisplay();
    updateDisplay();
    saveState();
}

// Enhanced power toggle for control
function togglePower() {
    acState.power = !acState.power;
    if (!acState.power) {
        // Reset to comfortable defaults when turning off
        acState.temperature = 24;
    }
    updateControlDisplay();
    updateDisplay();
    saveState();
}

// Add particle animation for airflow
function animateAirflow() {
    const particles = document.querySelectorAll('.air-particle');
    particles.forEach((particle, index) => {
        const delay = index * 0.5;
        particle.animate([
            { transform: 'translateX(0) translateY(0) scale(1)', opacity: 1 },
            { transform: `translateX(${50 + Math.random()*50}px) translateY(-100px) scale(0)`, opacity: 0 }
        ], {
            duration: 3000,
            delay: delay * 1000,
            iterations: Infinity
        });
    });
}

if (acState.power) {
    animateAirflow();
}
