/* Modal Logic */
let currentGameId = 0;
let game2Completed = false;

function openGame(id) {
    currentGameId = id;
    // Reset trap for game 2
    if (id === 2) game2Completed = false;

    document.getElementById('modal-overlay').classList.add('active');

    // Hide all views
    document.querySelectorAll('.game-view').forEach(el => el.classList.remove('active'));

    // Show specific view
    document.getElementById(`view-game-${id}`).classList.add('active');

    // Initialize specific game if needed
    if (id === 6) initGame6();
    if (id === 2) resetGame2();
    if (id === 7) resetGame7();
}

function closeGame() {
    // Game 2 Constraint: Cannot close unless "Yes" is clicked
    if (currentGameId === 2 && !game2Completed) {
        showToast(getTrans('games.g2.warning'));
        return;
    }

    document.getElementById('modal-overlay').classList.remove('active');
    currentGameId = 0;
}

// Helpers for translations
function getTrans(path) {
    const lang = localStorage.getItem('lang') || 'id';
    const t = translations[lang];
    return path.split('.').reduce((obj, key) => obj && obj[key], t) || "";
}

/* Game 1: Heart Grow - DISTINCT EFFECTS */
let heartScale = 1;
const MAX_HEART_SCALE = 2.5; // Limit growth
function game1Choose(key) {
    const heart = document.querySelector('.big-heart');

    // Limit growth
    if (heartScale < MAX_HEART_SCALE) {
        if (key === 'opt1') heartScale += 0.1;
        else if (key === 'opt2') heartScale += 0.25;
        else if (key === 'opt3') heartScale += 0.4; // Slightly reduced jump
    }

    // Effect always plays
    if (key === 'opt1') createFloatingParticles(heart, '💗', 5, 'slow');
    else if (key === 'opt2') {
        createFloatingParticles(heart, '💖', 12, 'medium');
        createFloatingParticles(heart, '✨', 5, 'medium');
    } else if (key === 'opt3') {
        createFloatingParticles(heart, '❤️', 25, 'fast');
        createFloatingParticles(heart, '😍', 10, 'fast');
        createFloatingParticles(heart, '🔥', 5, 'fast');
    }

    heart.style.transform = `scale(${heartScale})`;
}

function createFloatingParticles(element, char, count = 8, speed = 'medium') {
    const rect = element.getBoundingClientRect();
    const durationMap = { slow: 2000, medium: 1200, fast: 800 };
    const d = durationMap[speed];

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.textContent = char;
        p.style.position = 'fixed';
        p.style.left = (rect.left + rect.width / 2) + 'px';
        p.style.top = (rect.top + rect.height / 2) + 'px';
        p.style.pointerEvents = 'none';
        p.style.transition = `all ${d}ms cubic-bezier(0.19, 1, 0.22, 1)`;
        p.style.fontSize = Math.random() * 20 + 10 + 'px';
        p.style.zIndex = '2000';
        document.body.appendChild(p);

        setTimeout(() => {
            const x = (Math.random() - 0.5) * (speed === 'fast' ? 400 : 200);
            const y = -100 - Math.random() * (speed === 'fast' ? 300 : 150);
            const rot = (Math.random() - 0.5) * 360;
            p.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${speed === 'fast' ? 1.5 : 1})`;
            p.style.opacity = '0';
        }, 50);

        setTimeout(() => p.remove(), d);
    }
}

/* Game 2: Unsure Button Logic Update */
let unsureClicks = 0;
function resetGame2() {
    unsureClicks = 0;
    game2Completed = false;
    const btnYes = document.getElementById('btn-yes');
    // Reset styles
    btnYes.style.transform = 'none';
    btnYes.style.fontSize = ''; // Reset to CSS default
    btnYes.style.padding = '';

    document.getElementById('btn-unsure').style.display = 'inline-block';
    document.getElementById('game2-buttons').style.display = 'flex';
    document.getElementById('game2-message').textContent = "";
    document.getElementById('game2-message').style.fontSize = '18px';
}
function game2Unsure() {
    unsureClicks++;
    const btnYes = document.getElementById('btn-yes');
    const btnUnsure = document.getElementById('btn-unsure');
    const msg = document.getElementById('game2-message');

    // Grow using font-size to push layout instead of overlapping
    // Base size assumption ~16px. We grow significantly.
    const newSize = 16 + (unsureClicks * 12);
    const newPadX = 20 + (unsureClicks * 5);
    const newPadY = 10 + (unsureClicks * 2);

    btnYes.style.fontSize = `${newSize}px`;
    btnYes.style.padding = `${newPadY}px ${newPadX}px`;

    if (unsureClicks === 1) msg.textContent = getTrans('games.g2.msg1');
    else if (unsureClicks >= 3 && unsureClicks < 12) msg.textContent = getTrans('games.g2.msg2');
    else if (unsureClicks >= 12) {
        btnUnsure.style.display = 'none';
        msg.textContent = getTrans('games.g2.msg3');
    } else {
        msg.textContent = getTrans('games.g2.msg3');
    }
}

function game2Yes() {
    game2Completed = true;
    const msg = document.getElementById('game2-message');
    msg.textContent = getTrans('games.g2.final');
    msg.style.fontSize = '32px';
    msg.style.fontWeight = 'bold';

    document.getElementById('game2-buttons').style.display = 'none';

    createFloatingParticles(document.getElementById('game2-message'), '🎉', 20, 'fast');
    createFloatingParticles(document.getElementById('game2-message'), '🥰', 20, 'fast');
}

function showToast(text) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '10%';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '3000';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.textContent = text;
    toast.style.background = 'rgba(255,255,255,0.95)';
    toast.style.color = '#333';
    toast.style.padding = '8px 16px';
    toast.style.marginTop = '8px';
    toast.style.borderRadius = '20px';
    toast.style.fontSize = '14px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.style.animation = 'float 0.5s ease-out';

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

/* Game 4: RNG Message */
function game4Spin() {
    const display = document.getElementById('rng-display');
    const msgs = getTrans('games.g4.messages');
    if (!Array.isArray(msgs)) return;

    let count = 0;
    let interval = setInterval(() => {
        display.textContent = msgs[Math.floor(Math.random() * msgs.length)];
        count++;
        if (count > 15) {
            clearInterval(interval);
            display.style.color = 'var(--primary)';
        }
    }, 100);
}

/* Game 5: Hack - UPDATED LOGIC */
function game5Check() {
    const input = document.getElementById('hack-input').value.toLowerCase().trim();
    const lock = document.getElementById('lock-icon');
    const hint = document.getElementById('hack-hint');

    // Acceptable colors: red, white in TR, EN, ID
    const accepted = [
        'red', 'white',             // EN
        'kırmızı', 'beyaz',         // TR
        'merah', 'putih'            // ID
    ];

    if (accepted.includes(input)) {
        lock.style.filter = 'grayscale(0)';
        lock.textContent = '🔓💖';
        hint.textContent = getTrans('games.g5.success');
        hint.style.color = "var(--accent)";
    } else {
        hint.textContent = getTrans('games.g5.fail');
        hint.style.color = "var(--muted)";
    }
}

/* Game 6: Future Sim */
function initGame6() {
    const container = document.getElementById('sim-content');
    container.innerHTML = `
    <p style="font-size:18px;">${getTrans('games.g6.step1')}</p>
    <div class="sim-choice" onclick="game6Step(1)">${getTrans('games.g6.c1')}</div>
    <div class="sim-choice" onclick="game6Step(2)">${getTrans('games.g6.c2')}</div>
    <div class="sim-choice" onclick="game6Step(3)">${getTrans('games.g6.c3')}</div>
  `;
}

function game6Step() {
    const container = document.getElementById('sim-content');
    container.innerHTML = `
    <p style="font-size:18px;">${getTrans('games.g6.step2')}</p>
    <div class="sim-choice" onclick="game6Finish()">${getTrans('games.g6.c4')}</div>
    <div class="sim-choice" onclick="game6Finish()">${getTrans('games.g6.c5')}</div>
  `;
}

function game6Finish() {
    const container = document.getElementById('sim-content');
    container.innerHTML = `
    <h3 style="color:var(--primary); font-size:24px;">${getTrans('games.g6.finalTitle')}</h3>
    <p>${getTrans('games.g6.finalText')}</p>
  `;
}

/* Game 7: Time */
function resetGame7() {
    document.getElementById('game7-options').style.display = 'flex';
    document.getElementById('game7-result').style.display = 'none';
}
function game7Choose(optIndex) {
    const result = document.getElementById('game7-result');
    const options = document.getElementById('game7-options');

    options.style.display = 'none';
    result.style.display = 'block';

    let text = "";
    if (optIndex === 1) text = getTrans('games.g7.result1');
    else if (optIndex === 2) text = getTrans('games.g7.result2');
    else text = getTrans('games.g7.result3');

    result.textContent = text;
}
