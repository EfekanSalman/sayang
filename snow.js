/**
 * snow.js - Romantic Snowfall Effect
 * Adds a background canvas with soft falling snowflakes.
 */

(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999'; // On top of everything but doesn't block clicks
    canvas.style.opacity = '0.7';

    document.body.appendChild(canvas);

    let width, height, snowflakes;
    const snowflakeCount = 100;

    function init() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        snowflakes = [];
        for (let i = 0; i < snowflakeCount; i++) {
            snowflakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 1,
                speedY: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';

        snowflakes.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.globalAlpha = p.opacity;
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.y > height) {
                p.y = -p.radius;
                p.x = Math.random() * width;
            }
            if (p.x > width) p.x = 0;
            if (p.x < 0) p.x = width;
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', init);
    init();
    draw();
})();
