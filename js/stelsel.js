// A planetary system seen from slightly above: the star in the middle, the planets on their orbits
// at their real relative speeds. Distances use a square-root scale, so that planets close to their
// star stay visible next to planets far away; the scale is written under the drawing.
// Stelsel.toon(id), Stelsel.vergelijk(aan), Stelsel.ritme(aan), Stelsel.pauze(aan).
const Stelsel = (function () {
  const canvas = document.getElementById('stelsel');
  const ctx = canvas.getContext('2d');
  const KANTEL = 0.46; // how flat the orbits look: 1 is straight from above
  const ONS_KLEUR = 'rgba(165, 157, 146, 0.55)';

  let stelsel = null, vergelijk = false, ritme = false, pauze = false;
  let schaal = 1, doelSchaal = 1; // the largest distance (AU) that fits; animated when it changes
  let dagen = 0, w = 0, h = 0, dpr = 1;
  let audio = null, vorigeFase = [];
  let onTijd = () => {};

  // A fixed starting position per planet, so they don't all start on one line
  const begin = s => [...s].reduce((x, c) => (x * 31 + c.charCodeAt(0)) % 997, 7) / 997;

  function kleur(p) {
    if (p.t > 1000 && p.r > 6) return '#ff8a5a';   // a young giant that glows by itself
    if (p.t > 1500) return '#ff7a3a';              // lava
    if (p.r < 1.6) return p.t > 600 ? '#d9a27a' : '#c8b8a6'; // rock
    if (p.r < 4) return '#9fd0d8';                 // mini-Neptune
    if (p.r < 8) return '#7fa6e0';                 // ice giant size
    return '#e0bf94';                              // gas giant
  }
  const grootte = p => Math.min(11, 2.4 + 2 * Math.sqrt(p.r)) * (w < 600 ? 0.8 : 1);
  const inZone = p => p.a >= stelsel.hz[0] && p.a <= stelsel.hz[1];

  function grootsteAfstand() {
    const verst = stelsel.planeten[stelsel.planeten.length - 1].a;
    if (!vergelijk) return verst * 1.08;
    // Show our planets up to the first one beyond this system (at least up to Mars)
    let tot = Math.max(1.524, verst);
    const voorbij = ONS.find(o => o.a >= verst);
    if (voorbij) tot = Math.max(1.524, voorbij.a);
    return Math.max(tot, verst) * 1.08;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize', resize);
  resize();

  function toon(id) {
    stelsel = STELSELS.find(s => s.id === id);
    dagen = 0;
    vorigeFase = [];
    doelSchaal = grootsteAfstand();
    schaal = doelSchaal;
  }

  // The time scale: the innermost planet goes round in about four seconds
  const dagenPerSeconde = () => stelsel.planeten[0].p / 4;
  function tijdTekst() {
    const d = dagenPerSeconde();
    if (d < 1) return `1 seconde is ${Math.round(d * 24)} uur`;
    if (d < 400) return `1 seconde is ${Math.round(d)} ${Math.round(d) === 1 ? 'dag' : 'dagen'}`;
    return `1 seconde is ${Math.round(d / 365.25)} jaar`;
  }

  // A short tone, like a marimba; inner planets are higher
  const TONEN = [880, 784, 659, 587, 523, 440, 392, 330];
  function tik(i) {
    if (!audio) return;
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = 'sine';
    o.frequency.value = TONEN[i % TONEN.length];
    const t = audio.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.connect(g).connect(audio.destination);
    o.start(t); o.stop(t + 0.65);
  }

  const flits = [];
  function teken() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    // On wide screens a little to the right, away from the text
    const breed = w > 600;
    const cx = breed ? w * 0.55 : w / 2, cy = h / 2;
    const R = Math.min(w * (breed ? 0.41 : 0.46), (h * 0.44) / KANTEL);
    const px = a => R * Math.sqrt(a / schaal);

    // Habitable zone: a soft green band
    const [z1, z2] = stelsel.hz.map(px);
    if (z1 < R * 1.2) {
      ctx.save();
      ctx.translate(cx, cy); ctx.scale(1, KANTEL);
      ctx.beginPath(); ctx.arc(0, 0, Math.min(z2, R * 1.3), 0, Math.PI * 2); ctx.arc(0, 0, z1, 0, Math.PI * 2, true);
      ctx.fillStyle = 'rgba(110, 200, 140, 0.11)'; ctx.fill();
      ctx.restore();
    }

    // Our own planets as dashed orbits
    if (vergelijk) {
      ctx.save();
      ctx.setLineDash([3, 5]); ctx.strokeStyle = ONS_KLEUR; ctx.fillStyle = ONS_KLEUR; ctx.lineWidth = 1;
      ctx.font = `${w < 600 ? 11 : 12}px -apple-system, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      let vorigeLabel = -Infinity;
      ONS.forEach(o => {
        const r = px(o.a);
        if (r > R * 1.02) return;
        ctx.beginPath(); ctx.ellipse(cx, cy, r, r * KANTEL, 0, 0, Math.PI * 2); ctx.stroke();
        // Only a name where there is room for it
        const y = cy + r * KANTEL + 14;
        if (y - vorigeLabel > 14 && r * KANTEL > 10) { ctx.fillText(o.n, cx, y); vorigeLabel = y; }
      });
      ctx.restore();
    }

    // The planets' orbits
    ctx.lineWidth = 1;
    stelsel.planeten.forEach(p => {
      const r = px(p.a);
      ctx.strokeStyle = inZone(p) ? 'rgba(140, 220, 160, 0.45)' : 'rgba(236, 230, 220, 0.16)';
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * KANTEL, 0, 0, Math.PI * 2); ctx.stroke();
    });
    if (ritme) { // the line where the planets 'tick'
      ctx.strokeStyle = 'rgba(240, 163, 92, 0.35)';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * 1.02, cy); ctx.stroke();
    }

    // Positions; things behind the star (top half) are drawn first
    const dingen = stelsel.planeten.map((p, i) => {
      const hoek = 2 * Math.PI * (begin(stelsel.id + p.n) + dagen / p.p);
      const r = px(p.a);
      return { p, i, x: cx + Math.cos(hoek) * r, y: cy + Math.sin(hoek) * r * KANTEL, voor: Math.sin(hoek) > 0, hoek };
    });
    const sterGrootte = Math.max(7, Math.min(18, 11 + 3 * Math.log10(stelsel.lum + 0.001)));

    const tekenPlaneet = d => {
      const s = grootte(d.p), c = kleur(d.p);
      const f = flits[d.i] || 0;
      if (d.p.t > 1000 || f > 0) {
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, s * (2.6 + f * 2));
        g.addColorStop(0, f > 0 ? `rgba(240, 163, 92, ${0.5 * f + 0.2})` : 'rgba(255, 120, 60, 0.35)'); g.addColorStop(1, 'rgba(255, 120, 60, 0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(d.x, d.y, s * (2.6 + f * 2), 0, Math.PI * 2); ctx.fill();
      }
      // Lit from the star: a light side and a dark side
      const nx = (cx - d.x), ny = (cy - d.y), nl = Math.hypot(nx, ny) || 1;
      const g = ctx.createRadialGradient(d.x + nx / nl * s * 0.5, d.y + ny / nl * s * 0.5, s * 0.1, d.x, d.y, s * 1.1);
      g.addColorStop(0, c); g.addColorStop(1, '#141218');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(d.x, d.y, s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(236, 230, 220, 0.75)';
      ctx.font = `600 ${w < 600 ? 11 : 12.5}px -apple-system, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(d.p.n, d.x + s + 4, d.y - s * 0.4);
    };

    const tekenSter = (x, y, s, kleurSter) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, s * 5);
      g.addColorStop(0, kleurSter); g.addColorStop(0.18, kleurSter); g.addColorStop(0.3, kleurSter + '55'); g.addColorStop(1, kleurSter + '00');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fffaf2'; ctx.beginPath(); ctx.arc(x, y, s * 0.55, 0, Math.PI * 2); ctx.fill();
    };

    dingen.filter(d => !d.voor).forEach(tekenPlaneet);
    if (stelsel.sterren) {
      // Two stars around their common centre
      const b = stelsel.sterren, hoek = 2 * Math.PI * dagen / b.p, r = px(b.a);
      const a1 = { x: cx - Math.cos(hoek) * r * b.verhouding, y: cy - Math.sin(hoek) * r * b.verhouding * KANTEL };
      const a2 = { x: cx + Math.cos(hoek) * r * (1 - b.verhouding), y: cy + Math.sin(hoek) * r * (1 - b.verhouding) * KANTEL };
      const paar = [[a1, sterGrootte, stelsel.sterKleur], [a2, sterGrootte * 0.6, b.kleur2]].sort((p, q) => p[0].y - q[0].y);
      paar.forEach(([p, s, k]) => tekenSter(p.x, p.y, s, k));
    } else {
      tekenSter(cx, cy, sterGrootte, stelsel.sterKleur);
    }
    dingen.filter(d => d.voor).forEach(tekenPlaneet);

    // Rhythm: a tick when a planet crosses the line to the right of the star
    dingen.forEach(d => {
      const fase = (begin(stelsel.id + d.p.n) + dagen / d.p.p) % 1;
      if (ritme && vorigeFase[d.i] !== undefined && fase < vorigeFase[d.i]) { tik(d.i); flits[d.i] = 1; }
      vorigeFase[d.i] = fase;
    });
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let zichtbaar = true;
  new IntersectionObserver(([e]) => { zichtbaar = e.isIntersecting; }).observe(canvas);
  let laatst = performance.now();
  function frame(nu) {
    const dt = Math.min(0.05, (nu - laatst) / 1000);
    laatst = nu;
    if (zichtbaar && stelsel) {
      if (!pauze) dagen += dt * dagenPerSeconde() * (reduced ? 0.15 : 1);
      schaal += (doelSchaal - schaal) * Math.min(1, dt * 4);
      for (let i = 0; i < flits.length; i++) if (flits[i]) flits[i] = Math.max(0, flits[i] - dt * 2.5);
      teken();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.body.classList.add('stelsel-klaar');

  return {
    toon(id) { toon(id); onTijd(tijdTekst()); },
    vergelijk(aan) { vergelijk = aan; doelSchaal = grootsteAfstand(); },
    ritme(aan) {
      ritme = aan;
      if (aan && !audio) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) audio = new AC(); }
      if (audio && audio.state === 'suspended') audio.resume();
    },
    pauze(aan) { pauze = aan; },
    opTijd(fn) { onTijd = fn; },
  };
})();
