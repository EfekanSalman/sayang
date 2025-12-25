/**
 * wishing_star.js - Shooting Star and Wishing Modal
 */

(function () {
    // Styles for the star and modal
    const style = document.createElement('style');
    style.textContent = `
        .shooting-star {
            position: fixed;
            top: 0;
            left: 0;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 10px 2px #fff;
            z-index: 10000;
            pointer-events: auto;
            cursor: pointer;
            display: none;
        }
        .shooting-star::after {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, #fff, transparent);
            left: -100px;
        }
        
        #wish-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 10001;
            display: none;
            place-items: center;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        #wish-modal-overlay.active {
            display: grid;
            opacity: 1;
        }
        .wish-content {
            background: #1e293b;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            width: 100%;
            max-width: 450px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            color: white;
        }
        .wish-content input {
            width: 100%;
            padding: 12px;
            margin: 20px 0;
            border-radius: 10px;
            border: 1px solid #334155;
            background: #0f172a;
            color: white;
        }
        .wish-btn {
            background: #e11d48;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    const star = document.createElement('div');
    star.className = 'shooting-star';
    document.body.appendChild(star);

    const modal = document.createElement('div');
    modal.id = 'wish-modal-overlay';
    modal.innerHTML = `
        <div class="wish-content">
            <h2 data-i18n="wishingStar.title">2026 Dileğin Nedir?</h2>
            <input type="text" id="wish-input" data-i18n="wishingStar.placeholder">
            <button class="wish-btn" onclick="submitWish()" data-i18n="wishingStar.submit">Gönder</button>
        </div>
    `;
    document.body.appendChild(modal);

    function triggerStar() {
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight / 2);
        const endX = startX + 400;
        const endY = startY + 200;

        star.style.left = startX + 'px';
        star.style.top = startY + 'px';
        star.style.display = 'block';
        star.style.transition = 'none';

        setTimeout(() => {
            star.style.transition = 'all 2s linear';
            star.style.left = endX + 'px';
            star.style.top = endY + 'px';
            star.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            star.style.display = 'none';
            star.style.opacity = '1';
        }, 2050);
    }

    star.addEventListener('click', () => {
        modal.classList.add('active');
        if (window.updateTranslations) window.updateTranslations();
    });

    window.submitWish = () => {
        const input = document.getElementById('wish-input').value;
        if (input) {
            alert(getTrans('wishingStar.success') || "Dileğin Alındı!");
            modal.classList.remove('active');
            document.getElementById('wish-input').value = "";
        }
    };

    function getTrans(path) {
        const lang = localStorage.getItem('lang') || 'id';
        const t = (typeof translations !== 'undefined') ? translations[lang] : {};
        return path.split('.').reduce((obj, key) => obj && obj[key], t) || "";
    }

    // Attempt to trigger star every 30-60 seconds
    setInterval(() => {
        if (Math.random() > 0.5) triggerStar();
    }, 45000);
})();
