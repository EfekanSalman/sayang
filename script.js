// Envelope click + gentle pulse on hover
const envelope = document.getElementById("envelope");
if (envelope) {
  envelope.addEventListener("click", () => {
    envelope.classList.toggle("open");
  });
}

// Game logic
const canvas = document.getElementById("gameCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let cat = { x: 50, y: 200, speed: 2 };
  let hearts = [
    { x: 200, y: 100 }, { x: 420, y: 80 }, { x: 150, y: 260 }, { x: 320, y: 180 }
  ];
  let letters = [
    { x: 260, y: 220 }, { x: 120, y: 140 }
  ];
  let score = 0;
  let love = 0; // 0..100

  function drawCat() { ctx.fillText("🐱", cat.x, cat.y); }
  function drawHearts() { hearts.forEach(h => ctx.fillText("❤️", h.x, h.y)); }
  function drawLetters() { letters.forEach(l => ctx.fillText("💌", l.x, l.y)); }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCat(); drawHearts(); drawLetters();
    hearts.forEach((h, i) => { if (Math.abs(cat.x - h.x) < 20 && Math.abs(cat.y - h.y) < 20) { score += 1; love = Math.min(100, love + 8); hearts.splice(i, 1); } });
    letters.forEach((l, i) => { if (Math.abs(cat.x - l.x) < 20 && Math.abs(cat.y - l.y) < 20) { love = Math.min(100, love + 15); letters.splice(i, 1); } });
    // Use translation if available, else default
    const t = (window.translations && window.currentLang) ? window.translations[window.currentLang].game : { score: "Score:" };
    document.getElementById("score").innerText = t.score + " " + score;
    const fill = document.getElementById("loveFill");
    if (fill) fill.style.width = love + "%";
    if (love >= 100) {
      const win = document.getElementById("winText");
      if (win) {
        win.style.display = "block";
        const tWin = (window.translations && window.currentLang) ? window.translations[window.currentLang].game.win : "You Won! 💖";
        win.innerText = tWin;
      }
    }
  }

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") cat.x += cat.speed;
    if (e.key === "ArrowLeft") cat.x -= cat.speed;
    if (e.key === "ArrowUp") cat.y -= cat.speed;
    if (e.key === "ArrowDown") cat.y += cat.speed;
    update();
  });
  update();
}

// Leaflet Map Logic
const mapContainer = document.getElementById('map');
if (mapContainer && typeof L !== 'undefined') {
  // Istanbul coordinates: 41.0082, 28.9784
  // Palu coordinates: -0.9003, 119.8781
  const istanbul = [41.0082, 28.9784];
  const palu = [-0.9003, 119.8781];

  const map = L.map('map', {
    center: [20, 80],
    zoom: 3,
    zoomControl: false,
    attributionControl: false
  });

  // Dark Matter Tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Custom Icons
  const createIcon = (emoji) => L.divIcon({
    className: 'custom-marker',
    html: `<div>${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const markerIstanbul = L.marker(istanbul, { icon: createIcon('🕌') }).addTo(map);
  const markerPalu = L.marker(palu, { icon: createIcon('🏝️') }).addTo(map);

  // Bind Popups with translated text (will be updated by i18n logic if needed, but let's set initial)
  // We can use a small helper or just set them. script.js runs after translations.js so we can try.
  // Warning: race condition if i18n runs after. But i18n.js updates DOM, doesn't return strings.
  // Let's rely on basic text or the text update function.
  markerIstanbul.bindPopup("<b>Istanbul</b><br>Turkiye").openPopup();
  markerPalu.bindPopup("<b>Palu</b><br>Indonesia");

  // Flight Path (Geodesic-like curve is hard without plugins, straight line for now or simple arc points)
  // Simple Polyline
  const flightPath = L.polyline([istanbul, palu], {
    color: '#f472b6',
    weight: 2,
    opacity: 0.6,
    dashArray: '5, 10',
    lineCap: 'round'
  }).addTo(map);

  // Plane Animation
  const planeIcon = L.divIcon({
    className: 'plane-icon',
    html: '✈️',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  const planeMarker = L.marker(istanbul, { icon: planeIcon, zIndexOffset: 1000 }).addTo(map);

  // Animate plane along the line
  let pos = 0;
  function animatePlane() {
    pos += 0.005;
    if (pos > 1) pos = 0;

    // Lerp between lat/lng
    const lat = istanbul[0] + (palu[0] - istanbul[0]) * pos;
    const lng = istanbul[1] + (palu[1] - istanbul[1]) * pos;

    planeMarker.setLatLng([lat, lng]);

    // Calculate rotation
    // Simple atan2 for rotation (rough)
    const dy = palu[0] - istanbul[0];
    const dx = palu[1] - istanbul[1];
    // This rotation computation is very rough for lat/lng but okay for a visual toy
    // 90 deg offset usually needed for plane icon pointing up/right
    // let angle = Math.atan2(dy, dx) * 180 / Math.PI; 
    // plane element rotation
    // const planeEl = planeMarker.getElement();
    // if (planeEl) planeEl.firstChild.style.transform = `rotate(${angle}deg)`;

    requestAnimationFrame(animatePlane);
  }
  animatePlane();

}

/* Open When Letters Logic */
const openWhenData = {
  sad: {
    titleKey: 'openWhen.sad.title',
    contentKey: 'openWhen.sad.content'
  },
  miss: {
    titleKey: 'openWhen.miss.title',
    contentKey: 'openWhen.miss.content'
  },
  fight: {
    titleKey: 'openWhen.fight.title',
    contentKey: 'openWhen.fight.content'
  },
  sleep: {
    titleKey: 'openWhen.sleep.title',
    contentKey: 'openWhen.sleep.content'
  }
};

function openLetter(type) {
  const data = openWhenData[type];
  if (!data) return;

  const modal = document.getElementById('letter-modal-overlay');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');

  // Use translations if available, otherwise fallback
  // This depends on how i18n is implemented. Assuming we can access 'translations' object or similar helper.
  // Since i18n.js runs on load, we might need a helper to get text by key dynamically if we switch langs.
  // For now, let's assume we can get the text from the global translations object if exposed, 
  // OR we just set the data-i18n attribute and trigger a translation update.

  titleEl.setAttribute('data-i18n', data.titleKey);
  bodyEl.setAttribute('data-i18n', data.contentKey);

  // Re-run translation for the modal content
  if (window.updateTranslations) {
    window.updateTranslations();
  }

  modal.classList.add('active');
}

function closeLetterModal() {
  document.getElementById('letter-modal-overlay').classList.remove('active');
}

/* Moon Phase Logic */
function getMoonPhase(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 3) {
    year--;
    month += 12;
  }

  ++month;

  let c = 365.25 * year;
  let e = 30.6 * month;
  let jd = c + e + day - 694039.09; // jd is total days elapsed
  jd /= 29.5305882; // divide by the moon cycle
  let b = parseInt(jd); // int(jd) -> b, take integer part of jd
  jd -= b; // subtract integer part to leave fractional part of original jd
  b = Math.round(jd * 8); // scale fraction from 0-8 and round

  if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0

  return b; // 0-7 integer representing phase
}

function updateMoonWidget() {
  const phaseIndex = getMoonPhase(new Date());

  // Phase names mapping keys
  const phaseKeys = [
    'moon.new',         // 0
    'moon.waxingCrescent', // 1
    'moon.firstQuarter',   // 2
    'moon.waxingGibbous',  // 3
    'moon.full',        // 4
    'moon.waningGibbous',  // 5
    'moon.lastQuarter',    // 6
    'moon.waningCrescent'  // 7
  ];

  /* 
     Visual Representation Logic (Simple CSS Translation)
     New Moon (0) -> All Dark
     Full Moon (4) -> All Light
  */
  const shadowEl = document.getElementById('moon-shadow');
  const phaseNameEl = document.getElementById('moon-phase-name');

  if (shadowEl && phaseNameEl) {
    // Set text key
    phaseNameEl.setAttribute('data-i18n', phaseKeys[phaseIndex]);

    // Visual Hack:
    // We can use a combination of simple translates or dedicated CSS classes. 
    // For simplicity, let's toggle classes or manipulate style.
    // A proper CSS sphere map is complex, so let's use a simpler approach:
    // Slide the shadow or change opacity.

    // Let's refine the CSS approach in js:
    // Since it's a 2D circle, we simulate phases by moving the shadow.

    // 0 New Moon: Full Cover
    // 4 Full Moon: No Cover

    let percentage = (phaseIndex / 8) * 100;

    // This is a very rough approximation for visual flair
    // 0 -> 100% covered (New)
    // 4 -> 0% covered (Full)
    // 8 -> 100% covered (New)

    // Let's just use specific styles for each phase if we want to be fancy, 
    // or just set a class like 'phase-0', 'phase-1'.

    shadowEl.className = 'moon-shadow phase-' + phaseIndex;
  }
}

// Ensure we call this on load
document.addEventListener('DOMContentLoaded', updateMoonWidget);

// Map tooltips handled by Leaflet popups now
// Removed SVG hover logic

/* Future Tree Logic */
document.querySelectorAll('.goal-leaf').forEach(leaf => {
  leaf.addEventListener('click', function () {
    const tooltipKey = this.getAttribute('data-tooltip');
    const tooltipEl = document.getElementById('tree-tooltip');

    // Resolve translation text
    // Assuming we can access global 'translations' and 'currentLang' 
    // OR rely on data-i18n update if we set it.
    // Since i18n logic updates ALL data-i18n elements, we can utilize that 
    // OR just simple manual lookup if available.
    // Let's use setAttribute data-i18n and trigger update if possible, 
    // but for tooltip which is dynamic text content, separate handling is good.

    // Simple approach: set data-i18n on tooltip and call update.
    tooltipEl.setAttribute('data-i18n', tooltipKey);

    if (window.updateTranslations) {
      window.updateTranslations();
    }

    tooltipEl.style.opacity = '1'; /* helper if class toggle fails */
    tooltipEl.classList.add('active');

    // Hide after 3 seconds
    setTimeout(() => {
      tooltipEl.classList.remove('active');
      tooltipEl.style.opacity = '0';
    }, 4000);
  });
});

// Smooth highlight for active nav link
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  if (link.getAttribute('href') && window.location.pathname.endsWith(link.getAttribute('href'))) {
    link.style.background = 'rgba(255,255,255,0.06)';
    link.style.border = '1px solid rgba(255,255,255,0.14)';
    link.style.borderRadius = '10px';
  }
});