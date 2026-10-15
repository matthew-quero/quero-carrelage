/* Adapted from the supplied Claude Design v6. The scroll position is the single timeline. */
(() => {
'use strict';
class TileSequence {
  constructor(props) { this.props = props; }
  mount() {
    this._m = null;
    const q = s => document.querySelector(s);
    const stage = q('[data-stage]');
    const sticky = q('[data-sticky]');
    const scene = q('[data-scene]') || sticky;
    const services = document.getElementById('savoir-faire');
    const copy = q('[data-copy]');
    const grid = q('[data-grid]');
    const flat = q('[data-flat]');
    const room = q('[data-room]');
    const roomInner = q('[data-room-inner]');
    const infos = Array.from(document.querySelectorAll('[data-info]'));
    const layer = q('[data-tilelayer]');
    const tile = q('[data-tile]');
    const slot = q('[data-slot="center"]');
    const bar = q('[data-progress]');
    const heroText = q('[data-herotext]');
    const cells = Array.from(document.querySelectorAll('[data-cell]'));

    const desktopLength = Math.max(360, Number(this.props.sequenceLength) || 600);
    const mobileLength = Math.max(360, Number(this.props.mobileLength) || 520);
    const setLength = () => { if (stage) stage.style.height = (window.innerWidth <= 760 ? mobileLength : desktopLength) + 'svh'; };
    setLength();

    const back = q('[data-plane="back"]');
    const wl = q('[data-plane="wleft"]');
    const wr = q('[data-plane="wright"]');
    const cl = q('[data-plane="ceiling"]');
    const GAP = 8;
    let D = 0, step = 150, cellW = 142;
    const mod = (v, m) => ((v % m) + m) % m;
    const layoutRoom = (vw, ch, cw) => {
      cellW = Math.max(40, Math.round(cw));
      step = cellW + GAP;
      D = Math.round((ch + 3 * step - GAP) / 2);
      if (scene) scene.style.perspective = Math.round(vw * 1.15) + 'px';
      const img = 'repeating-linear-gradient(180deg,#484848 0 ' + GAP + 'px,transparent ' + GAP + 'px ' + step + 'px),repeating-linear-gradient(90deg,#484848 0 ' + GAP + 'px,transparent ' + GAP + 'px ' + step + 'px)';
      [back, wl, wr, cl].forEach(el => { if (el) el.style.backgroundImage = img; });
      if (wl) { wl.style.width = D + 'px'; wl.style.height = '0px'; wl.style.transform = 'rotateY(90deg)'; }
      if (wr) { wr.style.width = D + 'px'; wr.style.height = '0px'; wr.style.transform = 'rotateY(-90deg)'; }
      if (back) { back.style.height = '0px'; back.style.transform = 'translateZ(-' + D + 'px)'; }
      if (cl) { cl.style.height = '0px'; cl.style.transform = 'rotateX(-90deg)'; }


    };

    const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
    const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const rows = 3;
    const idx = Math.max(0, cells.indexOf(slot));
    const ring = cells.map((el, i2) => {
      const dx = Math.floor(i2 / rows) - Math.floor(idx / rows);
      const dy = (i2 % rows) - (idx % rows);
      return { el: el, i: i2, dx: dx, dy: dy, d: Math.max(Math.abs(dx), Math.abs(dy)) };
    });
    const maxD = Math.max.apply(null, ring.map(o => o.d));
    // Fixed world positions, reused in both scroll directions.
    const infoPositions = [[.19,-.14],[-.21,.15],[.16,.18],[-.17,-.12]];

    const heroTile = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const mobile = vw <= 760;
      const sd = mobile ? Math.min(vw * 0.38, vh * 0.3) : Math.min(vh * .82, vw * .58);
      return { w: sd, h: sd, x: mobile ? -sd * .85 : -sd / 2, y: (vh - sd) / 2 };
    };
    const setTile = (r, rot, op) => {
      if (!tile) return;
      tile.style.width = r.w + 'px';
      tile.style.height = r.h + 'px';
      tile.style.opacity = String(op);
      tile.style.transform = 'translate(' + r.x + 'px,' + r.y + 'px) rotate(' + rot + 'deg)';
    };

    const applyStage = () => {
      if (!stage) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const ch = sticky?.clientHeight || vh;
      const span = stage.offsetHeight - ch;
      const y = window.scrollY;
      const stageStart = stage.getBoundingClientRect().top + y;
      const p = clamp01((y - stageStart) / (span || 1));
      // The final viewport is shared with the real services section, never an empty screen.
      const handoffStart = Math.max(.5, 1 - ch / (span || 1));
      const handoff = ease(clamp01((p - handoffStart) / (1 - handoffStart)));
      if (services) services.style.opacity = String(handoff);
      if (scene) scene.style.opacity = String(1 - handoff);
      if (copy) copy.style.opacity = String(1 - handoff);
      if (window.QueroVideo?.active) { window.QueroVideo.seek(p); return; }

      const a = clamp01(y / (stageStart * 0.55 || 1));
      const b = clamp01((y / (stageStart || 1) - 0.55) / 0.45);
      const c = clamp01(p / 0.32);
      const dark = clamp01((p - 0.32) / 0.08);
      const fold = clamp01((p - 0.40) / 0.09);
      const cam = clamp01((p - 0.59) / 0.29);
      const shade = Math.round(255 * (1 - ease(dark) + ease(dark) * handoff));
      const background = 'rgb(' + shade + ',' + shade + ',' + shade + ')';
      if (sticky) sticky.style.backgroundColor = background;
      stage.style.backgroundColor = background;

      if (heroText) {
        const ht = clamp01(y / (vh * 0.8));
        heroText.style.transform = 'translateY(' + (-80 * ht) + 'px)';
        heroText.style.opacity = String(1 - ht);
      }

      const posT = ease(a);
      const rot = 45 * (1 - posT);

      ring.forEach(o => {
        if (o.i === idx) return;
        const st = maxD > 1 ? (o.d - 1) / (maxD - 1) : 0;
        const local = clamp01((b - st * 0.12) / 0.88);
        const k = 1 - ease(local);
        const l = Math.hypot(o.dx, o.dy) || 1;
        o.el.style.transform = 'translate(' + (o.dx / l * vw * 1.15 * k) + 'px,' + (o.dy / l * vh * 1.15 * k) + 'px)';
      });

      if (grid) {
        if (!this._m || this._m.vw !== vw || this._m.vh !== vh) {
          const prev = grid.style.transform;
          const previousFlat = flat?.style.transform;
          if (flat) flat.style.transform = 'none';
          grid.style.transform = 'none';
          const g = grid.getBoundingClientRect();
          const sr = slot ? slot.getBoundingClientRect() : g;
          const ch0 = sticky ? sticky.clientHeight : vh;
          const baseX = vw / 2 - (sr.left + sr.width / 2);
          this._m = { vw: vw, vh: vh, ch: ch0, H: g.height, gLeft: g.left, baseX: baseX, travel: Math.max(0, g.right + baseX - vw) };
          grid.style.transform = prev;
          if (flat) flat.style.transform = previousFlat;
          if (flat) flat.style.transformOrigin = '50% ' + ch0 + 'px';
          layoutRoom(vw, ch0, sr.width);
        }
      }
      const M = this._m || { ch: vh, H: 0, gLeft: 0, baseX: 0, travel: 0 };
      const gx = M.baseX - M.travel * ease(c);
      if (grid) grid.style.transform = 'translateX(' + gx + 'px)';

      const target = slot ? slot.getBoundingClientRect() : null;
      const h = heroTile();
      let r = h;
      if (target) {
        const t2 = { w: target.width, h: target.height, x: target.left, y: target.top };
        r = {
          w: h.w + (t2.w - h.w) * posT,
          h: h.h + (t2.h - h.h) * posT,
          x: h.x + (t2.x - h.x) * posT,
          y: h.y + (t2.y - h.y) * posT
        };
      }
      if (slot) slot.style.opacity = a >= 1 ? '1' : '0';
      setTile(r, rot, a >= 1 ? 0 : 1);

      /* temps 1 : la mosaïque passe au noir, par vagues */
      if (this._dk !== dark) {
        this._dk = dark;
        cells.forEach((el, i2) => {
          const col = Math.floor(i2 / rows), row = i2 % rows;
          const sx = (M.gLeft + gx + col * step) / (vw || 1);
          const w = clamp01(sx * 0.8 + (row / (rows - 1)) * 0.2);
          const local = clamp01((dark - w * 0.5) / 0.5);
          el.style.filter = local > 0 ? 'brightness(' + (1 - local * .78).toFixed(3) + ')' : 'none';
        });
        const gj = Math.round(255 + (72 - 255) * ease(dark));
        if (grid) grid.style.backgroundColor = 'rgb(' + gj + ',' + gj + ',' + gj + ')';

      }

      /* temps 2 et 3 : bascule du sol puis levée des plans depuis ses arêtes */
      const eF = ease(fold);
      const P0 = vw * 1.15;
      const Send = Math.max(1.5, 0.8 * vh / (cellW || 1));
      // A linear camera advance gives the walls and words the same acceleration in perspective.
      const roomZ = cam * (D + P0 - P0 / Send);

      if (flat) flat.style.transform = 'translateZ(' + roomZ + 'px) rotateX(' + (90 * eF) + 'deg)';
      if (roomInner) roomInner.style.transform = 'translateZ(' + roomZ + 'px)';

      const eW = ease(clamp01((p - 0.49) / 0.06));
      const eL = eW, eB = eW;
      const eC = ease(clamp01((p - 0.55) / 0.06));
      const pxB = mod(vw / 2 - (GAP + step) / 2, step) - step;
      const setH = (el, h, full, px) => {
        if (!el) return;
        const oy = h - full - GAP;
        el.style.height = h + 'px';
        el.style.backgroundPosition = px + 'px ' + oy + 'px,' + px + 'px ' + oy + 'px';
      };
      setH(wl, M.ch * eL, M.ch, -GAP);
      setH(back, M.ch * eB, M.ch, pxB);
      setH(wr, M.ch * eW, M.ch, 0);
      if (cl) {
        const hc = D * eC, oy = hc - D;
        cl.style.height = hc + 'px';
        cl.style.backgroundPosition = pxB + 'px ' + oy + 'px,' + pxB + 'px ' + oy + 'px';
      }

      // Project text mathematically into a separate 2D overlay. Walls cannot hide it.
      // Consecutive depth planes overlap; near words grow past the viewer and disappear.
      const camera = cam * 5.4;
      infos.forEach((el, index) => {
        const depth = 1.5 + index * 1.15 - camera;
        const visible = p >= .56 && depth < 2.2 && depth > -.98;
        const scale = 1.1 / Math.max(.12, 1.1 + depth);
        const far = ease(clamp01((2.2 - depth) / 1.1));
        const near = 1 - ease(clamp01((-depth - .30) / .68));
        const start = ease(clamp01((p - .56) / .04));
        const [x,y0] = infoPositions[index % infoPositions.length];
        const spread = vw <= 760 ? .74 : 1;
        el.style.left = (50 + x * 100 * scale * spread).toFixed(3) + '%';
        el.style.top = (48 + y0 * 100 * scale).toFixed(3) + '%';
        el.style.opacity = visible ? String(far * near * start) : '0';
        el.style.transform = 'translate(-50%, -50%) scale(' + scale.toFixed(4) + ')';
        el.style.visibility = visible ? 'visible' : 'hidden';
      });
      // No state carried over from a previous frame: reverse scroll renders the same scene.
      if (room) room.style.visibility = 'visible';
      if (flat) flat.style.visibility = 'visible';
      if (layer) layer.style.visibility = 'visible';
      if (sticky) sticky.style.visibility = 'visible';


    };

    const applyBar = () => {
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      bar.style.width = (max - y <= 4 ? 100 : clamp01(y / (max || 1)) * 100) + '%';
    };

    const render = () => {
      this._raf = 0;
      applyStage();
      applyBar();
      const mobileBar = document.getElementById('mobile-call');
      if (mobileBar) mobileBar.hidden = window.innerWidth > 760 || window.scrollY < window.innerHeight * .7 || document.getElementById('contact').getBoundingClientRect().top < window.innerHeight;
    };
    const schedule = () => { if (!this._raf) this._raf = requestAnimationFrame(render); };
    const resize = () => { setLength(); document.documentElement.style.setProperty('--sequence-overlap', (sticky?.clientHeight || window.innerHeight) + 'px'); this._m = null; this._dk = null; schedule(); };
    this.destroy = () => {
      cancelAnimationFrame(this._raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      window.removeEventListener('load', resize);
      document.fonts?.removeEventListener('loadingdone', resize);
      this._observer?.disconnect();
      if (services) services.style.opacity = '';
      if (heroText) { heroText.style.opacity = ''; heroText.style.transform = ''; }
    };
    window.addEventListener('scroll', schedule, { passive:true });
    window.addEventListener('resize', resize, { passive:true });
    window.addEventListener('load', resize);
    document.fonts?.addEventListener('loadingdone', resize);
    this._observer = new ResizeObserver(() => {
      const header = document.getElementById('site-header');
      const h = Math.ceil(header.getBoundingClientRect().height + 10);
      document.documentElement.style.setProperty('--header-height', h + 'px');
      if (sticky) { sticky.style.top = h + 'px'; sticky.style.height = 'calc(100svh - ' + h + 'px)'; }
      document.documentElement.style.setProperty('--sequence-overlap', (sticky?.clientHeight || window.innerHeight - h) + 'px');
      resize();
    });
    this._observer.observe(document.getElementById('site-header'));
    render();
  }
 }
const media = matchMedia('(prefers-reduced-motion: reduce)');
let sequence;
function init() {
  sequence?.destroy?.();
  document.documentElement.classList.remove('has-motion');
  if (media.matches) return;
  try {
    sequence = new TileSequence({sequenceLength:window.QUERO_CONFIG?.animation?.lengthVh || 600, mobileLength:window.QUERO_CONFIG?.animation?.mobileLengthVh || 520});
    document.documentElement.classList.add('has-motion');
    sequence.mount();
  } catch (error) {
    sequence?.destroy?.();
    document.documentElement.classList.remove('has-motion');
    console.error('La séquence est indisponible. La page reste accessible.', error);
  }
}
media.addEventListener('change', init);
init();
})();
