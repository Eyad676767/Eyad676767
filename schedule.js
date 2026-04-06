// Schedule page functionality
document.addEventListener('DOMContentLoaded', function() {
    setupScheduleListeners();
    initScheduleCanvas();
    updateScheduleDisplay();
});

// Tab switching
function setupScheduleListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const event = this.closest('.schedule-event');
            event.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => event.remove(), 300);
        });
    });

    // Add schedule button
    document.querySelector('.add-schedule-btn')?.addEventListener('click', showScheduleModal);
}

// Switch between schedule tabs
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Schedule canvas visualization (clock)
function initScheduleCanvas() {
    const canvas = document.getElementById('scheduleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    function drawClock() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 130;
        
        // Clock face
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 15;
        ctx.stroke();
        
        // Hour markers
        for(let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const markerLength = i % 3 === 0 ? 20 : 12;
            
            ctx.beginPath();
            ctx.moveTo(
                centerX + Math.cos(angle) * (radius - 20),
                centerY + Math.sin(angle) * (radius - 20)
            );
            ctx.lineTo(
                centerX + Math.cos(angle) * (radius - markerLength),
                centerY + Math.sin(angle) * (radius - markerLength)
            );
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#00d4ff';
            ctx.stroke();
        }
        
        // Next event indicator
        const nextEventAngle = (time * Math.PI * 2) / 1440; // 1440 minutes in a day
        ctx.beginPath();
        ctx.arc(
            centerX + Math.cos(nextEventAngle) * (radius - 40),
            centerY + Math.sin(nextEventAngle) * (radius - 40),
            12, 0, Math.PI * 2
        );
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.fill();
        
        time += 0.5;
        requestAnimationFrame(drawClock);
    }
    
    drawClock();
}

// Update schedule displays
function updateScheduleDisplay() {
    // Countdown to next event
    updateCountdown();
}

// Countdown timer
function updateCountdown() {
    const now = new Date();
    const nextEvent = new Date(now.getTime() + 3 * 60 * 60 * 1000 + 45 * 60 * 1000); // 3h45m
    
    const diff = nextEvent - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    document.querySelector('.countdown span:first-child').textContent = `${hours}h`;
    document.querySelector('.countdown span:last-child').textContent = `${minutes}m`;
}

// Modal for adding schedules (placeholder)
function showScheduleModal() {
    // Create modal dynamically
    const modal = document.createElement('div');
    modal.className = 'schedule-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Add New Schedule</h3>
            <input type="time" id="schedule-time" placeholder="Time">
            <input type="number" id="schedule-temp" placeholder="Temperature" min="16" max="30">
            <select id="schedule-mode">
                <option>Auto</option>
                <option>Cool</option>
                <option>Sleep</option>
            </select>
            <div class="modal-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="save-btn">Save Schedule</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Auto-remove modal after interaction
    setTimeout(() => {
        modal.remove();
    }, 5000);
}

// NEW: Product detail enhancements
document.querySelectorAll('.pill-item').forEach(item => {
    item.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.pill-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Carousel functionality
const carousel = document.getElementById('relatedCarousel');
if (carousel) {
    let currentSlide = 0;
    const slides = carousel.querySelectorAll('.carousel-slide');
    
    document.querySelector('.carousel-nav.prev')?.addEventListener('click', () => {
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
        carousel.parentElement.querySelector('.carousel-track').style.transform = `translateX(-${currentSlide * 33}%)`;
    });
    
    document.querySelector('.carousel-nav.next')?.addEventListener('click', () => {
        currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
        carousel.parentElement.querySelector('.carousel-track').style.transform = `translateX(-${currentSlide * 33}%)`;
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.schedule-event, .day-card, .fade-in-up');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

