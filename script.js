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
  let cat = {x:50, y:200, speed:2};
  let hearts = [
    {x:200, y:100}, {x:420, y:80}, {x:150, y:260}, {x:320, y:180}
  ];
  let letters = [
    {x:260, y:220}, {x:120, y:140}
  ];
  let score = 0;
  let love = 0; // 0..100

  function drawCat(){ ctx.fillText("🐱", cat.x, cat.y); }
  function drawHearts(){ hearts.forEach(h=>ctx.fillText("❤️", h.x, h.y)); }
  function drawLetters(){ letters.forEach(l=>ctx.fillText("💌", l.x, l.y)); }

  function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawCat(); drawHearts(); drawLetters();
    hearts.forEach((h,i)=>{ if(Math.abs(cat.x-h.x)<20&&Math.abs(cat.y-h.y)<20){score+=1;love=Math.min(100,love+8);hearts.splice(i,1);} });
    letters.forEach((l,i)=>{ if(Math.abs(cat.x-l.x)<20&&Math.abs(cat.y-l.y)<20){love=Math.min(100,love+15);letters.splice(i,1);} });
    document.getElementById("score").innerText = "Score: "+score;
    const fill = document.getElementById("loveFill");
    if (fill) fill.style.width = love + "%";
    if (love >= 100) {
      const win = document.getElementById("winText");
      if (win) win.style.display = "block";
    }
  }

  document.addEventListener("keydown", e=>{
    if(e.key==="ArrowRight") cat.x+=cat.speed;
    if(e.key==="ArrowLeft") cat.x-=cat.speed;
    if(e.key==="ArrowUp") cat.y-=cat.speed;
    if(e.key==="ArrowDown") cat.y+=cat.speed;
    update();
  });
  update();
}

// Map animation
const route = document.getElementById("route");
const plane = document.getElementById("plane");
if (route && plane) {
  let progress=0;
  function animate(){
    const x = 100 + 300*progress;
    const y = 150 + (50*progress) - 5*Math.sin(progress*Math.PI*2);
    plane.setAttribute("x", x);
    plane.setAttribute("y", y);
    // dashed route offset for motion illusion
    const dashOffset = (1-progress) * 100;
    route.style.strokeDashoffset = dashOffset;
    progress += 0.006; if(progress>1) progress=0;
    requestAnimationFrame(animate);
  }
  animate();
}

// Map zoom controls
const svg = document.getElementById('map');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
let zoom = 1;
function applyZoom(){ if(svg) svg.setAttribute('viewBox', `${250-250/zoom} ${150-150/zoom} ${500/zoom} ${300/zoom}`); }
if (zoomInBtn) zoomInBtn.onclick = ()=>{ zoom = Math.min(2.5, zoom+0.2); applyZoom(); };
if (zoomOutBtn) zoomOutBtn.onclick = ()=>{ zoom = Math.max(1, zoom-0.2); applyZoom(); };

// Marker tooltip
const tip = document.getElementById('mapTip');
if (svg && tip) {
  function showTip(text, cx, cy){
    tip.textContent = text;
    const rect = svg.getBoundingClientRect();
    tip.style.left = (rect.left + cx) + 'px';
    tip.style.top = (rect.top + cy) + 'px';
    tip.classList.add('show');
  }
  function hideTip(){ tip.classList.remove('show'); }
  svg.addEventListener('mousemove', (e)=>{
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    // hit test around markers
    const nearIstanbul = Math.hypot(svgP.x-100, svgP.y-150) < 12;
    const nearPalu = Math.hypot(svgP.x-400, svgP.y-200) < 12;
    if (nearIstanbul) showTip('Istanbul • Türkiye', 100, 150);
    else if (nearPalu) showTip('Palu • Endonezya', 400, 200);
    else hideTip();
  });
}

// Smooth highlight for active nav link
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  if (link.getAttribute('href') && window.location.pathname.endsWith(link.getAttribute('href'))) {
    link.style.background = 'rgba(255,255,255,0.06)';
    link.style.border = '1px solid rgba(255,255,255,0.14)';
    link.style.borderRadius = '10px';
  }
});