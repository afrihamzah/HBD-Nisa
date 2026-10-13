// DOM Elements
const sections = document.querySelectorAll('.section');
const menuButtons = document.querySelectorAll('.menu-btn');
const backButtons = document.querySelectorAll('.back-btn');
const openSurpriseBtn = document.getElementById('open-surprise-btn');
const confettiCanvas = document.getElementById('confetti-canvas');
const openLetterBtn = document.getElementById('open-letter-btn');
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letter-content');
const letterText = document.getElementById('letter-text');
const reasonsGrid = document.getElementById('reasons-grid');
const openSecretBtn = document.getElementById('open-secret-btn');
const secretEnvelope = document.getElementById('secret-envelope');
const secretMessage = document.getElementById('secret-message');
const secretText = document.getElementById('secret-text');
const openFinalBtn = document.getElementById('open-final-btn');
const finalMessage = document.getElementById('final-message');
const finalText = document.getElementById('final-text');

let currentSection = 'home';
let isNavigating = false;
let confettiActive = false;
const NAVIGATION_DURATION = 400;

function init() {
    loadContent();
    setupNavigation();
    setupLetter();
    setupForYou();

    // Refresh selalu mulai dari halaman pembuka, tanpa state tersimpan.
    sections.forEach(section => {
        section.classList.toggle('active', section.id === 'home-section');
        section.classList.remove('is-leaving');
        section.scrollTop = 0;
    });
}

function triggerMenuAnimations() {
    // Trigger animations when page loads
    const menuSection = document.getElementById('menu-section');
    if (menuSection && menuSection.classList.contains('active')) {
        const cards = menuSection.querySelectorAll('.animate-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${0.1 + index * 0.1}s`;
        });
    }
}

function loadContent() {
    document.getElementById('recipient-name').textContent = CONTENT.recipientName;
    const homeMessageElement = document.getElementById('home-message');
    homeMessageElement.innerHTML = CONTENT.homeMessage.replace(/\n/g, '<br>');
    letterText.textContent = CONTENT.letter;
    secretText.textContent = CONTENT.secretMessage;
    finalText.textContent = CONTENT.finalMessage;
}

function setupNavigation() {
    menuButtons.forEach(btn => {
        btn.addEventListener('click', event => {
            createSparkle(event);
            navigateTo(btn.dataset.target);
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', () => navigateTo('menu'));
    });

    openSurpriseBtn.addEventListener('click', event => {
        startSurpriseTransition(event);
    });
}

function startSurpriseTransition(event) {
    if (isNavigating || currentSection !== 'home') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigateTo('menu');
        return;
    }

    const app = document.getElementById('app');
    const menuSection = document.getElementById('menu-section');
    if (!app || !menuSection) {
        navigateTo('menu');
        return;
    }

    isNavigating = true;
    openSurpriseBtn.classList.add('is-pressed');
    createSparkle(event);

    const overlay = document.createElement('div');
    overlay.className = 'romantic-transition';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <span class="romantic-heart">♡</span>
        <span class="romantic-particle"></span>
        <span class="romantic-particle"></span>
        <span class="romantic-particle"></span>
        <span class="romantic-particle"></span>
    `;
    app.appendChild(overlay);

    setTimeout(() => openSurpriseBtn.classList.remove('is-pressed'), 250);

    // Mulai menu ketika heart sudah muncul; navigasi umum menangani fade dan active state.
    setTimeout(() => {
        isNavigating = false;
        menuSection.classList.add('surprise-reveal');
        navigateTo('menu');
    }, 1000);

    // Cleanup berbasis waktu tetap bekerja saat animationend tidak dipicu.
    setTimeout(() => {
        overlay.remove();
        menuSection.classList.remove('surprise-reveal');
    }, 1600);
}

function navigateTo(sectionName) {
    const targetSection = document.getElementById(`${sectionName}-section`);
    const currentElement = document.getElementById(`${currentSection}-section`);

    if (!targetSection || isNavigating || sectionName === currentSection) return;

    isNavigating = true;
    targetSection.scrollTop = 0;
    targetSection.classList.remove('is-leaving');
    targetSection.classList.add('active');

    if (currentElement) {
        currentElement.classList.add('is-leaving');
    }

    // Reset amplop saat keluar dari Letter agar kunjungan berikutnya mulai tertutup.
    if (sectionName !== 'letter' && envelope && letterContent) {
        envelope.classList.remove('opened');
        letterContent.classList.add('hidden');
    }

    currentSection = sectionName;

    if (sectionName === 'menu') {
        setTimeout(triggerMenuAnimations, 50);
    }

    setTimeout(() => {
        if (currentElement) {
            currentElement.classList.remove('active', 'is-leaving');
        }
        sections.forEach(section => {
            if (section !== targetSection) section.classList.remove('active', 'is-leaving');
        });
        isNavigating = false;
    }, NAVIGATION_DURATION);
}

function createSparkle(event) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
}

function triggerConfetti() {
    if (confettiActive) return;
    confettiActive = true;
    
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#F8D7E3', '#F4B8CC', '#C85B7C', '#B78394'];
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * confettiCanvas.width,
            y: -20,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 5 - 2.5
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        particles.forEach((p, index) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(-p.size/4, -p.size/4, p.size/4, 0, Math.PI * 2);
            ctx.arc(p.size/4, -p.size/4, p.size/4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            
            if (p.y > confettiCanvas.height) {
                particles.splice(index, 1);
            }
        });
        
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            confettiActive = false;
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }
    animate();
}

function setupLetter() {
    openLetterBtn.addEventListener('click', (e) => {
        createSparkle(e);
        envelope.classList.add('opened');
        setTimeout(() => {
            letterContent.classList.remove('hidden');
        }, 500);
    });
}

function setupForYou() {
    // Reasons grid
    CONTENT.reasons.forEach((reason, index) => {
        const reasonCard = document.createElement('div');
        reasonCard.className = 'reason-card';
        reasonCard.innerHTML = `
            <div class="reason-front">
                <div class="reason-number">${index + 1}</div>
            </div>
            <div class="reason-back">
                <p class="reason-text">${reason}</p>
            </div>
        `;
        reasonCard.addEventListener('click', () => {
            reasonCard.classList.toggle('flipped');
        });
        reasonsGrid.appendChild(reasonCard);
    });
    
    // Secret message
    openSecretBtn.addEventListener('click', (e) => {
        createSparkle(e);
        secretEnvelope.style.display = 'none';
        secretMessage.classList.remove('hidden');
        
        // Create multiple sparkles
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    sparkle.style.left = `${e.clientX + (Math.random() - 0.5) * 100}px`;
                    sparkle.style.top = `${e.clientY + (Math.random() - 0.5) * 100}px`;
                    document.body.appendChild(sparkle);
                    setTimeout(() => sparkle.remove(), 1000);
                }, i * 100);
            }
        }
    });
    
    // Final message
    openFinalBtn.addEventListener('click', (e) => {
        createSparkle(e);
        openFinalBtn.style.display = 'none';
        finalMessage.classList.remove('hidden');
    });
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('resize', () => {
    if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});

