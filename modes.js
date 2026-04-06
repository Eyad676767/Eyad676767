// Modes page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    setupModeListeners();
    updateModeDisplay();
    initModeCanvas();
});

// Mode card click handlers
function setupModeListeners() {
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', function() {
            const mode = this.dataset.mode;
            selectMode(mode);
            
            // Visual feedback
            document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Fan speed buttons
    document.querySelectorAll('.fan-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const speed = this.dataset.speed;
            setFanSpeed(speed);
            
            document.querySelectorAll('.fan-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Select operating mode
function selectMode(mode) {
    acState.mode = mode;
    updateModeDisplay();
    updateDisplay();
    saveState();
    
    // Visual feedback with animation
    animateModeTransition(mode);
}

// Set fan speed
function setFanSpeed(speed) {
    acState.fanSpeed = speed;
    updateFanSpeedVisualization();
    saveState();
}

// Update mode page displays
function updateModeDisplay() {
    document.getElementById('current-mode-display').textContent = 
        acState.mode.charAt(0).toUpperCase() + acState.mode.slice(1);
    
    // Highlight active mode card
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.toggle('active', card.dataset.mode === acState.mode);
    });
    
    // Highlight fan speed
    document.querySelectorAll('.fan-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.speed === acState.fanSpeed);
    });
}

// Mode transition animation
function animateModeTransition(mode) {
    const modeIcon = document.querySelector(`[data-mode="${mode}"] .mode-icon`);
    if (modeIcon) {
        modeIcon.style.transform = 'scale(1.2)';
        modeIcon.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            modeIcon.style.transform = '';
        }, 300);
    }
}

// Canvas visualization for current mode
function initModeCanvas() {
    const canvas = document.getElementById('modeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function drawModeVisualization() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 153, 204, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Mode-specific visualization
        drawModePattern(ctx, acState.mode);
        
        animationId = requestAnimationFrame(drawModeVisualization);
    }
    
    drawModeVisualization();
    
    // Cleanup on page leave
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

function drawModePattern(ctx, mode) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 120;
    
    switch(mode) {
        case 'auto':
            drawAutoPattern(ctx, centerX, centerY, radius);
            break;
        case 'cool':
            drawCoolPattern(ctx, centerX, centerY, radius);
            break;
        case 'dry':
            drawDryPattern(ctx, centerX, centerY, radius);
            break;
        case 'fan':
            drawFanPattern(ctx, centerX, centerY, radius);
            break;
        case 'sleep':
            drawSleepPattern(ctx, centerX, centerY, radius);
            break;
        case 'turbo':
            drawTurboPattern(ctx, centerX, centerY, radius);
            break;
    }
}

function drawAutoPattern(ctx, x, y, r) {
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 15;
    
    for(let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * r * 0.7, y + Math.sin(angle) * r * 0.7, 8, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawCoolPattern(ctx, x, y, r) {
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 20;
    
    for(let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const dist = r * 0.8;
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 6, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawDryPattern(ctx, x, y, r) {
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    for(let i = 0; i < 6; i++) {
        const yPos = y - r * 0.5 + (i / 5) * r;
        ctx.beginPath();
        ctx.moveTo(x - 40, yPos);
        ctx.lineTo(x + 40, yPos);
        ctx.stroke();
    }
}

function drawFanPattern(ctx, x, y, r) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    
    // Fan blades
    for(let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Date.now() * 0.01;
        const endX = x + Math.cos(angle) * r;
        const endY = y + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

function drawSleepPattern(ctx, x, y, r) {
    ctx.strokeStyle = '#aa88ff';
    ctx.lineWidth = 2;
    
    // Wave pattern
    ctx.beginPath();
    for(let i = 0; i <= 100; i++) {
        const t = i / 100 * Math.PI * 4;
        const waveY = y + Math.sin(t) * 20;
        const xPos = x - r + (i / 100) * r * 2;
        if (i === 0) ctx.moveTo(xPos, waveY);
        else ctx.lineTo(xPos, waveY);
    }
    ctx.stroke();
}

function drawTurboPattern(ctx, x, y, r) {
    ctx.fillStyle = '#ff4444';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 25;
    
    // Explosive pattern
    for(let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const speed = 1 + Math.sin(Date.now() * 0.01 + i) * 0.5;
        const dist = r * speed * 0.6;
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateFanSpeedVisualization() {
    const fanBtns = document.querySelectorAll('.fan-btn');
    fanBtns.forEach(btn => {
        btn.style.transform = btn.classList.contains('active') ? 'scale(1.05)' : 'scale(1)';
    });
}

