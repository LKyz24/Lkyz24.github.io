
const html = document.documentElement;

    /* THEME */
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
    const dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    document.getElementById('t-ico').textContent = dark ? '🌙' : '☀️';
    document.getElementById('t-lbl').textContent = dark ? 'Light' : 'Dark';
    themeBtn.classList.toggle('on');
    drawLines();
});

/* PANELS */
function openPanel(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('open'));
    const p = document.getElementById('panel-' + id);
    if (p) { p.classList.add('open'); p.scrollTop = 0; setTimeout(() => { p.querySelectorAll('.bf').forEach(b => b.style.width = b.dataset.w + '%'); }, 200); }
}
function closePanel() { document.querySelectorAll('.panel').forEach(p => p.classList.remove('open')); }
document.getElementById('nav-home').addEventListener('click', e => { e.preventDefault(); closePanel(); });

/* NODE POSITIONS */
const angles = { 'nd-about':-90, 'nd-edu':-60, 'nd-exp':54, 'nd-projects':130, 'nd-contact':234 };
const R = 260;
function rad(d){ return d * Math.PI / 180; }

function placeNodes() {
    const hero = document.getElementById('hero');
    const W = hero.offsetWidth, H = hero.offsetHeight;
    const cx = W / 2, cy = H / 2;

    const mobile = W < 600;
    /* min radius so nodes never overlap the name block (~180px wide, ~120px tall) */
    const minR = mobile ? 140 : 200;
    const maxR = mobile ? 170 : 290;
    const r = Math.min(Math.max(Math.min(W * 0.30, H * 0.35), minR), maxR);

    Object.entries(angles).forEach(([id, deg]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.left = (cx + Math.cos(rad(deg)) * r) + 'px';
        el.style.top  = (cy + Math.sin(rad(deg)) * r) + 'px';
        /* smaller icons on mobile */
        el.querySelector('.node-ico').style.width  = mobile ? '40px' : '';
        el.querySelector('.node-ico').style.height = mobile ? '40px' : '';
        el.querySelector('.node-ico').style.fontSize = mobile ? '17px' : '';
        el.querySelector('.node-lbl').style.fontSize = mobile ? '.55rem' : '';
    });
    currentR = r;
    drawLines();
}
let currentR = 240;

/* CANVAS LINES */
function drawLines() {
    const hero = document.getElementById('hero');
    const canvas = document.getElementById('lcanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!hero.classList.contains('revealed')) return;
    const dark = html.getAttribute('data-theme') === 'dark';
    const lc = dark ? 'rgba(0,255,198,0.14)' : 'rgba(0,160,120,0.12)';
    const dc = dark ? 'rgba(0,255,198,0.5)' : 'rgba(0,160,120,0.45)';
    const cx = hero.offsetWidth / 2, cy = hero.offsetHeight / 2;
    ctx.strokeStyle = lc; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
    Object.entries(angles).forEach(([,deg]) => {
        const x = cx + Math.cos(rad(deg)) * currentR, y = cy + Math.sin(rad(deg)) * currentR;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI*2);
        ctx.fillStyle = dc; ctx.fill();
    });
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI*2); ctx.fillStyle = dc; ctx.fill();
}

/* HOVER LOGIC:
- Hovering the name = reveal nodes
- Once revealed, moving anywhere inside hero keeps them visible
- Only hide when mouse leaves the entire hero
*/
const nameWrap = document.getElementById('name-wrap');
const hero = document.getElementById('hero');
let revealedByName = false;

nameWrap.addEventListener('mouseenter', () => {
    revealedByName = true;
    hero.classList.add('revealed');
    drawLines();
});

/* Hide only when leaving the whole hero */
hero.addEventListener('mouseleave', () => {
    revealedByName = false;
    hero.classList.remove('revealed');
    drawLines();
});

/* FLOAT ANIMATION */
Object.keys(angles).forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const spd = 3 + (i % 3) * .7, amp = 5 + (i % 3) * 2;
    let t = i * 1.2;
    (function tick(){ t += .01/spd; el.style.marginTop=(Math.sin(t)*amp)+'px'; el.style.marginLeft=(Math.cos(t*.8)*amp*.5)+'px'; requestAnimationFrame(tick); })();
});

/* TOUCH support — tap name to toggle on mobile */
nameWrap.addEventListener('touchstart', (e) => {
    if (!revealedByName) {
    e.preventDefault();
    revealedByName = true;
    hero.classList.add('revealed');
    drawLines();
    }
}, { passive: false });

window.addEventListener('resize', placeNodes);
window.addEventListener('load', placeNodes);
placeNodes();
