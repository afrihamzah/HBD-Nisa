// DOM Elements
const sections = document.querySelectorAll('.section');
const menuButtons = document.querySelectorAll('.menu-btn');
const backButtons = document.querySelectorAll('.back-btn');
const openSurpriseBtn = document.getElementById('open-surprise-btn');
const letterText = document.getElementById('letter-text');
const reasonsGrid = document.getElementById('reasons-grid');
const openSecretBtn = document.getElementById('open-secret-btn');
const secretEnvelope = document.getElementById('secret-envelope');
const secretMessage = document.getElementById('secret-message');
const secretText = document.getElementById('secret-text');
const openFinalBtn = document.getElementById('open-final-btn');
const finalMessage = document.getElementById('final-message');
const finalText = document.getElementById('final-text');

let currentSection = 'gate';
let isNavigating = false;
const NAVIGATION_DURATION = 400;

// ─── Typewriter ───────────────────────────────────────────────────────────────
const TYPEWRITER_TEXT = 'Happy Birthday Sayang ♡';
let typewriterDone = false;

function runTypewriter() {
    if (typewriterDone) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.getElementById('home-title').textContent = TYPEWRITER_TEXT;
        typewriterDone = true;
        return;
    }
    typewriterDone = true;
    const el = document.getElementById('home-title');
    el.textContent = '';
    el.classList.add('typewriter-active');
    let i = 0;
    function type() {
        if (i < TYPEWRITER_TEXT.length) {
            el.textContent += TYPEWRITER_TEXT[i];
            i++;
            setTimeout(type, 60);
        } else {
            el.classList.remove('typewriter-active');
        }
    }
    setTimeout(type, 300);
}

// ─── Ambient falling hearts ───────────────────────────────────────────────────
const ambientSections = ['home', 'foryou'];
let ambientRaf = null;
let ambientCanvas = null;
let ambientCtx = null;
let ambientParticles = [];
const HEART_CHARS = ['♡', '♡', '♡', '❤'];

function createAmbientCanvas() {
    if (ambientCanvas) return;
    ambientCanvas = document.createElement('canvas');
    ambientCanvas.className = 'ambient-canvas';
    ambientCanvas.setAttribute('aria-hidden', 'true');
    document.getElementById('app').appendChild(ambientCanvas);
    ambientCtx = ambientCanvas.getContext('2d');
    resizeAmbientCanvas();
}

function resizeAmbientCanvas() {
    if (!ambientCanvas) return;
    const app = document.getElementById('app');
    ambientCanvas.width = app.offsetWidth;
    ambientCanvas.height = app.offsetHeight;
}

function spawnAmbientParticle() {
    const size = 10 + Math.random() * 10;
    ambientParticles.push({
        x: Math.random() * ambientCanvas.width,
        y: -size,
        size,
        opacity: 0.12 + Math.random() * 0.2,
        speedY: 0.4 + Math.random() * 0.6,
        speedX: (Math.random() - 0.5) * 0.3,
        drift: Math.random() * Math.PI * 2,
        char: HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
    });
}

function animateAmbient() {
    if (!ambientCanvas) return;
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    if (ambientParticles.length < 18 && Math.random() < 0.03) spawnAmbientParticle();
    ambientParticles = ambientParticles.filter(p => {
        p.y += p.speedY;
        p.drift += 0.01;
        p.x += Math.sin(p.drift) * 0.35 + p.speedX;
        ambientCtx.save();
        ambientCtx.globalAlpha = p.opacity;
        ambientCtx.font = `${p.size}px Georgia, serif`;
        ambientCtx.fillStyle = '#C85B7C';
        ambientCtx.fillText(p.char, p.x, p.y);
        ambientCtx.restore();
        return p.y < ambientCanvas.height + p.size;
    });
    ambientRaf = requestAnimationFrame(animateAmbient);
}

function startAmbient() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    createAmbientCanvas();
    if (!ambientRaf) animateAmbient();
}

function stopAmbient() {
    if (ambientRaf) { cancelAnimationFrame(ambientRaf); ambientRaf = null; }
    ambientParticles = [];
    if (ambientCtx && ambientCanvas) ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
}

// ─── Tap-to-heart ─────────────────────────────────────────────────────────────
function setupTapHeart() {
    const app = document.getElementById('app');
    function spawnTapHeart(clientX, clientY) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const el = document.createElement('span');
        el.className = 'tap-heart';
        el.textContent = '♡';
        el.style.left = clientX + 'px';
        el.style.top  = clientY + 'px';
        el.style.setProperty('--drift', `${(Math.random() - 0.5) * 40}px`);
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove(), { once: true });
    }
    app.addEventListener('touchstart', e => {
        if (e.target.closest('button, a, input')) return;
        const t = e.changedTouches[0];
        spawnTapHeart(t.clientX, t.clientY);
    }, { passive: true });
    app.addEventListener('click', e => {
        if (e.target.closest('button, a, input')) return;
        spawnTapHeart(e.clientX, e.clientY);
    });
}


// ─── Init ─────────────────────────────────────────────────────────────────────
function init() {
    loadContent();
    setupNavigation();
    setupGate();
    setupTapHeart();
    setupForYou();

    sections.forEach(section => {
        section.classList.toggle('active', section.id === 'gate-section');
        section.classList.remove('is-leaving');
        section.scrollTop = 0;
    });

    // Typewriter and ambient run only when home is actually shown
    // (they are triggered inside setupGate after the yes-button transition)
}

function setupGate() {
    const yesBtn  = document.getElementById('gate-yes-btn');
    const noBtn   = document.getElementById('gate-no-btn');
    const hintEl  = document.getElementById('gate-hint');
    const responseEl = document.getElementById('gate-response');
    const burstEl    = document.getElementById('gate-hearts-burst');

    if (!yesBtn || !noBtn) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── YES button ──────────────────────────────────────────────────────────────
    yesBtn.addEventListener('click', () => {
        yesBtn.disabled = true;
        noBtn.disabled  = true;

        if (reducedMotion) {
            navigateTo('home');
            runTypewriter();
            startAmbient();
            return;
        }

        // Show response text
        responseEl.classList.remove('hidden');
        requestAnimationFrame(() => responseEl.classList.add('visible'));

        // Heart burst
        burstEl.classList.remove('hidden');
        const angles = [0, 45, 90, 135, 180, 225, 270, 315];
        angles.forEach((deg, i) => {
            const rad  = deg * (Math.PI / 180);
            const dist = 38 + Math.random() * 20;
            const bx   = Math.round(Math.cos(rad) * dist);
            const by   = Math.round(Math.sin(rad) * dist);
            const h    = document.createElement('span');
            h.className = 'gate-burst-heart';
            h.textContent = '♡';
            h.style.setProperty('--bx', bx + 'px');
            h.style.setProperty('--by', by + 'px');
            h.style.animationDelay = (i * 0.06) + 's';
            burstEl.appendChild(h);
        });

        // Navigate to home after brief pause
        setTimeout(() => {
            navigateTo('home');
            setTimeout(() => {
                runTypewriter();
                startAmbient();
            }, 50);
        }, 1100);
    });

    // ── NO button — runaway logic ────────────────────────────────────────────────
    let noAttempts = 0;
    const hints = [
        'Pilih yang jujur yaa adek ♡',
        'Yakin nih? 🥺',
        'Coba pikir lagi deh!',
        'Gabisaaa, pilih iya aja WKWKWK',
    ];

    let lastNoMove = 0;

    function getNoPosition(wrapperRect) {
        const rect = noBtn.getBoundingClientRect();
        return {
            left: rect.left - wrapperRect.left,
            top: rect.top - wrapperRect.top,
            centerX: rect.left - wrapperRect.left + rect.width / 2,
            centerY: rect.top - wrapperRect.top + rect.height / 2,
        };
    }

    function moveNoBtn(pointerX, pointerY, forceMove = false) {
        const now = Date.now();
        if (!forceMove && now - lastNoMove < 260) return;

        const wrapper = noBtn.parentElement;
        const wrapperRect = wrapper.getBoundingClientRect();
        const containerW = wrapper.offsetWidth || 300;
        const containerH = wrapper.offsetHeight || 180;
        const btnW = noBtn.offsetWidth  || 110;
        const btnH = noBtn.offsetHeight || 48;
        const padding = 8;

        // Button stays inside local gate-buttons area, below the yes button.
        const minLeft = padding;
        const maxLeft = Math.max(minLeft, containerW - btnW - padding);
        const minTop  = 74;
        const maxTop  = Math.max(minTop, containerH - btnH - padding);
        const current = getNoPosition(wrapperRect);

        const pointer = {
            x: typeof pointerX === 'number' ? pointerX - wrapperRect.left : current.centerX,
            y: typeof pointerY === 'number' ? pointerY - wrapperRect.top  : current.centerY,
        };

        const safeMaxDistance = Math.hypot(maxLeft - minLeft, maxTop - minTop);
        const minJump = Math.min(120, safeMaxDistance * 0.65);
        const candidates = [];
        const cols = 5;
        const rows = 4;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const left = minLeft + ((maxLeft - minLeft) * col) / Math.max(1, cols - 1);
                const top  = minTop + ((maxTop - minTop) * row) / Math.max(1, rows - 1);
                candidates.push({ left, top });
            }
        }

        // Extra diagonal/random candidates keep movement playful but bounded.
        for (let i = 0; i < 8; i++) {
            candidates.push({
                left: minLeft + Math.random() * (maxLeft - minLeft),
                top: minTop + Math.random() * (maxTop - minTop),
            });
        }

        let best = null;
        let bestScore = -Infinity;
        candidates.forEach(candidate => {
            const cx = candidate.left + btnW / 2;
            const cy = candidate.top + btnH / 2;
            const distFromPointer = Math.hypot(cx - pointer.x, cy - pointer.y);
            const distFromCurrent = Math.hypot(cx - current.centerX, cy - current.centerY);
            const farEnoughBonus = distFromCurrent >= minJump ? 300 : distFromCurrent;
            const score = distFromPointer * 1.8 + farEnoughBonus + Math.random() * 20;

            if (score > bestScore) {
                bestScore = score;
                best = candidate;
            }
        });

        if (!best) return;

        noBtn.classList.add('is-running');
        noBtn.style.left = Math.round(best.left) + 'px';
        noBtn.style.top  = Math.round(best.top) + 'px';
        noBtn.style.transform = reducedMotion ? 'none' : 'scale(1.04) rotate(-1deg)';
        lastNoMove = now;

        setTimeout(() => {
            noBtn.classList.remove('is-running');
            noBtn.style.transform = 'none';
        }, reducedMotion ? 0 : 260);

        noAttempts++;
        const hintIdx = Math.min(noAttempts, hints.length - 1);
        hintEl.textContent = hints[hintIdx];
    }

    function getPointerDistanceFromNoBtn(clientX, clientY) {
        const rect = noBtn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return Math.hypot(clientX - cx, clientY - cy);
    }

    // Desktop: move before click when pointer gets close enough.
    noBtn.parentElement.addEventListener('pointermove', e => {
        if (e.pointerType === 'touch') return;
        if (getPointerDistanceFromNoBtn(e.clientX, e.clientY) < 95) {
            moveNoBtn(e.clientX, e.clientY);
        }
    });

    noBtn.addEventListener('mouseenter', e => moveNoBtn(e.clientX, e.clientY, true));

    // Touch: move on touchstart, prevent scroll/click.
    noBtn.addEventListener('touchstart', e => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        moveNoBtn(touch.clientX, touch.clientY, true);
    }, { passive: false });

    // Also intercept click just in case.
    noBtn.addEventListener('click', e => {
        e.preventDefault();
        moveNoBtn(e.clientX, e.clientY, true);
    });
}


function triggerMenuAnimations() {
    // No-op: animasi cardPop diatur via CSS .animate-card (hanya transform)
    // dengan animation-delay inline di HTML. Kartu settle di posisi akhir
    // (forwards) saat DOM render pertama kali, sehingga tidak perlu re-trigger
    // saat masuk menu dari tombol back. Surprise-reveal punya animasi sendiri.
    // Fungsi ini dipertahankan sebagai placeholder bila nanti butuh hook animasi.
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

    currentSection = sectionName;

    // Ambient: nyala di Home & For You, mati di lainnya
    if (ambientSections.includes(sectionName)) {
        startAmbient();
    } else {
        stopAmbient();
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

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', resizeAmbientCanvas);

function createSparkle(event) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    const rect = event.target.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;

    sparkle.style.left = `${x}px`;
    sparkle.style.top  = `${y}px`;

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
}

function setupForYou() {
    const REASON_EMOJIS = ['♡', '🌷', '✨', '🤍', '🌙', '🌼', '🍃', '💫'];
    CONTENT.reasons.forEach((reason, index) => {
        const reasonCard = document.createElement('div');
        reasonCard.className = 'reason-card';
        const emoji = REASON_EMOJIS[index % REASON_EMOJIS.length];
        reasonCard.innerHTML = `
            <div class="reason-front">
                <span class="reason-emoji">${emoji}</span>
            </div>
            <div class="reason-back">
                <p class="reason-text">${reason}</p>
            </div>
        `;
        reasonCard.setAttribute('role', 'button');
        reasonCard.setAttribute('tabindex', '0');
        reasonCard.setAttribute('aria-label', `Alasan ${index + 1}, tap untuk buka`);
        const toggle = () => reasonCard.classList.toggle('flipped');
        reasonCard.addEventListener('click', toggle);
        reasonCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
        reasonsGrid.appendChild(reasonCard);
    });

    openSecretBtn.addEventListener('click', (e) => {
        createSparkle(e);
        secretEnvelope.style.display = 'none';
        secretMessage.classList.remove('hidden');
        setTimeout(() => secretMessage.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    sparkle.style.left = `${e.clientX + (Math.random() - 0.5) * 100}px`;
                    sparkle.style.top  = `${e.clientY + (Math.random() - 0.5) * 100}px`;
                    document.body.appendChild(sparkle);
                    setTimeout(() => sparkle.remove(), 1000);
                }, i * 100);
            }
        }
    });

    openFinalBtn.addEventListener('click', (e) => {
        createSparkle(e);
        openFinalBtn.style.display = 'none';
        finalMessage.classList.remove('hidden');
        setTimeout(() => finalMessage.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    });
}


