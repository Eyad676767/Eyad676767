// Settings page functionality
document.addEventListener('DOMContentLoaded', function() {
    setupSettingsListeners();
    loadSettings();
});

// Setup all setting interactions - Enhanced checkout functionality
function setupSettingsListeners() {
    // Promo code
    document.querySelector('.promo-code button')?.addEventListener('click', function() {
        const code = this.previousElementSibling.value.toUpperCase();
        if (code === 'WELCOME10' || code === 'COOL10') {
            const totalEl = document.getElementById('live-total');
            let total = parseFloat(totalEl.textContent.replace('$', ''));
            total *= 0.9;
            totalEl.textContent = `$${total.toFixed(0)}`;
            this.textContent = 'Applied! -10%';
            this.classList.add('neon-btn');
        } else {
            this.textContent = 'Invalid Code';
            setTimeout(() => this.textContent = 'Apply', 2000);
        }
    });
    
    // Delivery options update total
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const totalEl = document.getElementById('live-total');
            let total = parseFloat(totalEl.textContent.replace('$', ''));
            if (this.value === 'express') total += 29;
            totalEl.textContent = `$${total.toFixed(0)}`;
        });
    });

    // Temperature unit toggle (existing)
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const group = this.parentElement;
            group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            saveSetting(this.dataset.unit, 'tempUnit');
        });
    });

    // Theme previews
    document.querySelectorAll('.theme-preview').forEach(preview => {
        preview.addEventListener('click', function() {
            document.querySelectorAll('.theme-preview').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            applyTheme(this.dataset.theme);
        });
    });

    // Toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            this.parentElement.classList.toggle('active', this.checked);
            saveSetting(this.checked, this.dataset.setting || 'toggle');
        });
    });

    // Slider
    const slider = document.querySelector('.setting-slider');
    if (slider) {
        slider.addEventListener('input', function() {
            document.querySelector('.slider-value').textContent = `${this.value}/5`;
        });
    }

    // Reset button
    document.querySelector('.reset-btn')?.addEventListener('click', function() {
        this.textContent = 'Reset Complete!';
        this.style.background = '#00ff88';
        setTimeout(() => {
            this.textContent = 'Reset Filter Counter';
            this.style.background = '';
        }, 2000);
    });

    // Update button
    document.querySelector('.update-btn')?.addEventListener('click', checkUpdates);
}

// Apply theme
function applyTheme(theme) {
    document.body.dataset.theme = theme;
    saveSetting(theme, 'theme');
}

// Save setting to localStorage and AC state
function saveSetting(value, key) {
    localStorage.setItem(`smartAC_${key}`, value);
    if (acState[key] !== undefined) {
        acState[key] = value;
        saveState();
    }
}

// Load saved settings
function loadSettings() {
    const tempUnit = localStorage.getItem('smartAC_tempUnit') || 'celsius';
    document.querySelector(`[data-unit="${tempUnit}"]`).classList.add('active');

    const theme = localStorage.getItem('smartAC_theme') || 'dark';
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    applyTheme(theme);

    // Apply toggle states
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        const saved = localStorage.getItem(`smartAC_${toggle.dataset.setting || 'toggle' + toggle.id}`);
        if (saved !== null) {
            toggle.checked = saved === 'true';
            toggle.parentElement.classList.toggle('active', toggle.checked);
        }
    });
}

// Check for updates simulation
function checkUpdates() {
    const btn = event.target;
    btn.textContent = 'Checking...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = 'No updates available';
        btn.style.background = '#00ff88';
        setTimeout(() => {
            btn.textContent = 'Check for Updates';
            btn.disabled = false;
            btn.style.background = '';
        }, 2000);
    }, 1500);
}

// Swing animation
function animateSwing() {
    const swingPos = document.querySelector('.swing-position');
    let pos = 0;
    setInterval(() => {
        pos = (pos + 2) % 100;
        swingPos.style.setProperty('--position', `${pos}%`);
    }, 100);
}

animateSwing();

