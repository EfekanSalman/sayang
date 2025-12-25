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
    if (id === 8) initGame8();
    if (id === 9) initGame9();
    if (id === 10) initGame10();
}

function closeGame() {
    // Game 2 Constraint: Cannot close unless "Yes" is clicked
    if (currentGameId === 2 && !game2Completed) {
        showToast(getTrans('games.g2.warning'));
        return;
    }

    document.getElementById('modal-overlay').classList.remove('active');
    currentGameId = 0;
    // Stop any running animations by clearing intervals or flags if needed
    game8Active = false;
    game9Active = false;
    game10Active = false;
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

/* Common UI Helper */
function drawGameOver(ctx, canvas, score, best, titleKey) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(getTrans('games.g8.gameOver'), canvas.width / 2, canvas.height / 2 - 60);

    ctx.font = '20px sans-serif';
    ctx.fillText(`${getTrans('games.g8.score')}: ${score}`, canvas.width / 2, canvas.height / 2 - 10);
    if (best) {
        ctx.font = '16px sans-serif';
        ctx.fillStyle = 'var(--primary)';
        ctx.fillText(`${getTrans('games.g10.best')}: ${best}`, canvas.width / 2, canvas.height / 2 + 20);
    }

    ctx.fillStyle = 'white';
    ctx.font = '18px sans-serif';
    ctx.fillText(getTrans('games.g8.restart'), canvas.width / 2, canvas.height / 2 + 80);

    ctx.font = '40px serif';
    ctx.fillText('🔄', canvas.width / 2, canvas.height / 2 + 130);
}

/* Game 8: Catch the Love */
let game8Active = false;
let game8State = 'playing';
function initGame8() {
    game8Active = true;
    game8State = 'playing';
    const canvas = document.getElementById('g8-canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('g8-score');
    let score = 0;
    let basket = { x: 175, y: 350, w: 50, h: 20 };
    let items = [];

    canvas.onmousemove = (e) => {
        if (game8State !== 'playing') return;
        const rect = canvas.getBoundingClientRect();
        basket.x = (e.clientX - rect.left) * (canvas.width / rect.width) - basket.w / 2;
    };
    canvas.ontouchmove = (e) => {
        if (game8State !== 'playing') return;
        const rect = canvas.getBoundingClientRect();
        basket.x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width) - basket.w / 2;
        e.preventDefault();
    };
    canvas.onclick = () => {
        if (game8State === 'gameover') initGame8();
    };

    function spawn() {
        if (!game8Active || game8State !== 'playing') return;
        items.push({ x: Math.random() * (canvas.width - 20), y: -20, s: Math.random() * 2 + 1, char: Math.random() > 0.5 ? '❤️' : '🌸' });
        setTimeout(spawn, 1000);
    }
    spawn();

    function loop() {
        if (!game8Active) return;
        if (game8State === 'gameover') {
            drawGameOver(ctx, canvas, score, null, 'games.g8.title');
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e11d48';
        ctx.fillRect(basket.x, basket.y, basket.w, basket.h);
        ctx.fillStyle = 'white';
        ctx.font = '20px serif';
        ctx.textAlign = 'left';
        ctx.fillText('🧺', basket.x + 15, basket.y + 15);

        items.forEach((p, i) => {
            p.y += p.s;
            ctx.fillText(p.char, p.x, p.y);

            if (p.y > basket.y && p.y < basket.y + basket.h && p.x > basket.x && p.x < basket.x + basket.w) {
                score++;
                scoreEl.textContent = score;
                items.splice(i, 1);
            } else if (p.y > canvas.height) {
                game8State = 'gameover';
            }
        });

        requestAnimationFrame(loop);
    }
    loop();
}

/* Game 9: Long Distance Runner (Istanbul to Palu) */
let game9Active = false;
let game9State = 'playing';
function initGame9() {
    game9Active = true;
    game9State = 'playing';
    const canvas = document.getElementById('g9-canvas');
    const ctx = canvas.getContext('2d');
    let player = { x: 50, y: 150, w: 30, h: 30, dy: 0, jump: -8, ground: 150 };
    let gravity = 0.4;
    let obstacles = [];
    let frame = 0;
    const targetDistance = 14311;
    let jumpParticles = [];

    const handleAction = () => {
        if (game9State === 'gameover') initGame9();
        else if (player.y === player.ground) {
            player.dy = player.jump;
            createJumpParticle(player.x, player.y);
        }
    };

    window.onkeydown = (e) => { if (e.code === 'Space') handleAction(); };
    canvas.onclick = handleAction;

    function createJumpParticle(x, y) {
        for (let i = 0; i < 3; i++) jumpParticles.push({ x, y, vx: Math.random() - 0.5, vy: -Math.random() * 2, life: 1 });
    }

    function loop() {
        if (!game9Active) return;
        if (game9State === 'gameover') {
            drawGameOver(ctx, canvas, Math.floor((frame / 2000) * targetDistance), null, 'games.g9.title');
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;
        const bgX1 = -(frame * 0.5) % canvas.width;
        const bgX2 = -(frame * 1.5) % canvas.width;

        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.textAlign = 'left';
        ctx.fillText('🏙️      🏔️      🏙️', bgX1, 100);
        ctx.fillText('🏙️      🏔️      🏙️', bgX1 + canvas.width, 100);

        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillText('☁️    🌳    ☁️    🌲', bgX2, 140);
        ctx.fillText('☁️    🌳    ☁️    🌲', bgX2 + canvas.width, 140);

        const progress = Math.min((frame / 2000), 1);
        const currentKm = Math.floor(progress * targetDistance);

        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(50, 10, canvas.width - 100, 10);
        ctx.fillStyle = 'var(--primary)';
        ctx.fillRect(50, 10, (canvas.width - 100) * progress, 10);
        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        ctx.fillText(`TR ✈️ ID: ${currentKm} km`, canvas.width / 2 - 40, 35);

        jumpParticles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.02;
            ctx.globalAlpha = p.life;
            ctx.fillText('❤️', p.x, p.y);
            if (p.life <= 0) jumpParticles.splice(i, 1);
        });
        ctx.globalAlpha = 1;

        player.dy += gravity;
        player.y += player.dy;
        if (player.y > player.ground) { player.y = player.ground; player.dy = 0; }
        ctx.font = '30px serif';
        ctx.fillText('🏃‍♀️', player.x, player.y);

        if (frame % 100 === 0) obstacles.push({ x: 600, y: 155, char: Math.random() > 0.5 ? '🌵' : '🧱' });

        obstacles.forEach((o, i) => {
            o.x -= 4;
            ctx.fillText(o.char, o.x, o.y);
            if (o.x < -30) obstacles.splice(i, 1);
            if (Math.abs(player.x - o.x) < 25 && Math.abs(player.y - o.y) < 25) {
                game9State = 'gameover';
            }
        });

        if (progress >= 1) {
            game9State = 'success';
            drawGameOver(ctx, canvas, targetDistance, null, 'games.g9.success');
            return;
        }

        requestAnimationFrame(loop);
    }
    loop();
}

/* Game 10: Flappy Heart */
let game10Active = false;
let game10State = 'playing';
function initGame10() {
    game10Active = true;
    game10State = 'playing';
    const canvas = document.getElementById('g10-canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('g10-score');
    let score = 0;
    let bestScore = localStorage.getItem('g10_best') || 0;
    let heart = { x: 50, y: 250, v: 0, gravity: 0.2, jump: -4.5, angle: 0 };
    let pipes = [];
    let bgScroll = 0;

    canvas.onclick = () => {
        if (game10State === 'gameover') initGame10();
        else heart.v = heart.jump;
    };

    function loop() {
        if (!game10Active) return;
        if (game10State === 'gameover') {
            drawGameOver(ctx, canvas, score, bestScore, 'games.g10.title');
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bgScroll -= 0.5;
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.font = '40px serif';
        ctx.textAlign = 'left';
        for (let i = 0; i < 5; i++) {
            ctx.fillText('☁️', (bgScroll % 200) + i * 200, 100);
            ctx.fillText('☁️', (bgScroll * 1.5 % 300) + i * 300, 300);
        }

        heart.v += heart.gravity;
        heart.y += heart.v;
        heart.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, heart.v * 0.1));

        ctx.save();
        ctx.translate(heart.x + 15, heart.y - 15);
        ctx.rotate(heart.angle);
        ctx.font = '30px serif';
        ctx.fillText('❤️', -15, 15);
        ctx.restore();

        if (pipes.length === 0 || pipes[pipes.length - 1].x < 220) {
            let gap = 160;
            let topH = 50 + Math.random() * (canvas.height - gap - 100);
            pipes.push({ x: 400, top: topH, bottom: topH + gap, passed: false });
        }

        pipes.forEach((p, i) => {
            p.x -= 2;
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.beginPath();
            ctx.roundRect(p.x, 0, 45, p.top, [0, 0, 10, 10]);
            ctx.fill();
            ctx.beginPath();
            ctx.roundRect(p.x, p.bottom, 45, canvas.height - p.bottom, [10, 10, 0, 0]);
            ctx.fill();

            if (!p.passed && p.x < heart.x) {
                score++;
                p.passed = true;
                scoreEl.innerHTML = `${score} <small>(Best: ${bestScore})</small>`;
            }
            if (p.x < -50) pipes.splice(i, 1);

            if (p.x < heart.x + 25 && p.x + 45 > heart.x && (heart.y - 20 < p.top || heart.y > p.bottom)) {
                game10State = 'gameover';
                if (score > bestScore) localStorage.setItem('g10_best', score);
            }
        });

        if (heart.y > canvas.height || heart.y < 0) {
            game10State = 'gameover';
            if (score > bestScore) localStorage.setItem('g10_best', score);
        }

        requestAnimationFrame(loop);
    }
    loop();
}
