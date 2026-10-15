/* Adapted from the supplied Claude Design v6. The scroll position is the single timeline. */
(() => {
'use strict';
class TileSequence {
  constructor(props) { this.props = props; }
  mount() {
    this._m = null;
    const reduced = false;
    const q = s => document.querySelector(s);
    const stage = q('[data-stage]');
    const sticky = q('[data-sticky]');
    const grid = q('[data-grid]');
    const flat = q('[data-flat]');
    const room = q('[data-room]');
    const roomInner = q('[data-room-inner]');
    const centerTile = q('[data-centertile]');
    const flatsq = q('[data-flatsq]');
    const contact = null;
    const infos = Array.from(document.querySelectorAll('[data-info]'));
    const layer = q('[data-tilelayer]');
    const tile = q('[data-tile]');
    const slot = q('[data-slot="center"]');
    const bar = q('[data-progress]');
    const heroText = q('[data-herotext]');
    const cells = Array.from(document.querySelectorAll('[data-cell]'));

    const len = Math.max(320, Number(this.props.sequenceLength) || 1000);
    if (stage) stage.style.height = len + 'vh';

    const back = q('[data-plane="back"]');
    const wl = q('[data-plane="wleft"]');
    const wr = q('[data-plane="wright"]');
    const cl = q('[data-plane="ceiling"]');
    const GAP = 8;
    const INFO_POS = [[22, 32], [78, 66], [24, 68], [76, 30]];
    let D = 0, step = 150, cellW = 142;
    const mod = (v, m) => ((v % m) + m) % m;
    const layoutRoom = (vw, ch, cw) => {
      cellW = Math.max(40, Math.round(cw));
      step = cellW + GAP;
      D = Math.round((ch + 3 * step - GAP) / 2);
      if (sticky) sticky.style.perspective = Math.round(vw * 1.15) + 'px';
      const img = 'repeating-linear-gradient(180deg,#1E1E1E 0 ' + GAP + 'px,transparent ' + GAP + 'px ' + step + 'px),repeating-linear-gradient(90deg,#1E1E1E 0 ' + GAP + 'px,transparent ' + GAP + 'px ' + step + 'px)';
      [back, wl, wr, cl].forEach(el => { if (el) el.style.backgroundImage = img; });
      if (wl) { wl.style.width = D + 'px'; wl.style.height = '0px'; wl.style.transform = 'rotateY(90deg)'; }
      if (wr) { wr.style.width = D + 'px'; wr.style.height = '0px'; wr.style.transform = 'rotateY(-90deg)'; }
      if (back) { back.style.height = '0px'; back.style.transform = 'translateZ(-' + D + 'px)'; }
      if (cl) { cl.style.height = '0px'; cl.style.transform = 'rotateX(-90deg)'; }
      if (centerTile) {
        const pxB0 = mod(vw / 2 - (GAP + step) / 2, step) - step;
        const col = Math.round((vw / 2 - (pxB0 + GAP + cellW / 2)) / step);
        centerTile.style.opacity = '0';
        centerTile.style.width = cellW + 'px';
        centerTile.style.height = cellW + 'px';
        centerTile.style.left = (pxB0 + GAP + col * step) + 'px';
        centerTile.dataset.cellw = String(cellW);
      }
      infos.forEach((el, k) => {
        const A = INFO_POS[k] || [50, 50];
        el.dataset.dx = String((A[0] - 50) / 100 * vw);
        el.dataset.dy = String((A[1] - 50) / 100 * ch);
        el.style.transform = 'translate(-50%,-50%) scale(0.34)';
        el.style.opacity = '0';
      });
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

    const heroTile = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const mobile = vw <= 760;
      const sd = mobile ? Math.min(vw * 0.38, vh * 0.3) : vh;
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
      if (reduced) {
        stage.style.height = '100svh';
        if (layer) layer.style.display = 'none';
        if (room) room.style.display = 'none';
        if (flat) flat.style.transform = 'none';
        if (grid) grid.style.transform = 'none';
        if (slot) slot.style.opacity = '1';
        if (sticky) sticky.style.backgroundColor = '#FFFFFF';
        cells.forEach(el => { el.style.filter = 'none'; });
        if (contact) { contact.style.position = 'relative'; contact.style.marginTop = '0'; contact.style.opacity = '1'; contact.style.transform = 'none'; contact.style.pointerEvents = ''; }
        return;
      }
      const vw = window.innerWidth, vh = window.innerHeight;
      const span = stage.offsetHeight - vh;
      const y = window.scrollY;
      const stageStart = stage.getBoundingClientRect().top + y;
      const p = clamp01((y - stageStart) / (span || 1));
      if (window.QueroVideo?.active) { window.QueroVideo.seek(p); return; }

      const a = clamp01(y / (stageStart * 0.55 || 1));
      const b = clamp01((y / (stageStart || 1) - 0.55) / 0.45);
      const c = clamp01((p - 0.06) / 0.20);
      const dark = clamp01((p - 0.26) / 0.10);
      const fold = clamp01((p - 0.36) / 0.09);
      const cam = clamp01((p - 0.58) / 0.32);
      const reveal = clamp01((p - 0.955) / 0.03);

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
          el.style.filter = local > 0 ? 'brightness(' + (1 - local).toFixed(3) + ')' : 'none';
        });
        const gj = Math.round(255 + (30 - 255) * ease(dark));
        if (grid) grid.style.backgroundColor = 'rgb(' + gj + ',' + gj + ',' + gj + ')';
        const bg = Math.round(255 * (1 - ease(dark)));
        if (sticky) sticky.style.backgroundColor = 'rgb(' + bg + ',' + bg + ',' + bg + ')';
        stage.style.backgroundColor = 'rgb(' + bg + ',' + bg + ',' + bg + ')';
      }

      /* temps 2 et 3 : bascule du sol puis levée des plans depuis ses arêtes */
      const eF = ease(fold);
      const P0 = vw * 1.15;
      const S0 = P0 / (P0 + D);
      const Send = Math.max(S0 + 0.1, 0.8 * vh / (cellW || 1));
      const camAll = clamp01((p - 0.58) / 0.32);
      const Sn = S0 + (Send - S0) * camAll;
      const roomZ = D + P0 - P0 / Sn;

      if (flat) flat.style.transform = 'translateZ(' + roomZ + 'px) rotateX(' + (90 * eF) + 'deg)';
      if (roomInner) roomInner.style.transform = 'translateZ(' + roomZ + 'px)';

      const eW = ease(clamp01((p - 0.45) / 0.06));
      const eL = eW, eB = eW;
      const eC = ease(clamp01((p - 0.51) / 0.04));
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

      /* temps 4 : les infos approchent, grossissent et sortent par les bords */
      if (infos.length) {
        const n = infos.length;
        const win = 1 / n;
        infos.forEach((el, i2) => {
          const t = clamp01((cam - i2 * win) / win);
          const sc = 0.62 / (1 - 0.955 * t);
          const dx = Number(el.dataset.dx || 0) * (sc - 1) * 1.4;
          const dy = Number(el.dataset.dy || 0) * (sc - 1) * 1.4;
          const on = t > 0.001 ? clamp01(t / 0.05) : 0;
          el.style.opacity = String(on);
          el.style.transform = 'translate(-50%,-50%) translate(' + dx + 'px,' + dy + 'px) scale(' + sc.toFixed(3) + ')';
        });
      }

      /* raccord : le décor 3D cède la place à un carré plein agrandi en 2D */
      const post = clamp01((p - 0.90) / 0.055);
      const swap = p >= 0.90;
      if (room) room.style.visibility = swap ? 'hidden' : 'visible';
      if (flat) flat.style.visibility = swap ? 'hidden' : 'visible';
      if (layer) layer.style.visibility = swap ? 'hidden' : 'visible';
      if (centerTile) {
        const k = Math.max(0, Math.round((M.ch - cellW) / 2 / step));
        centerTile.style.bottom = (M.ch - k * step - cellW) + 'px';
      }
      if (!swap && centerTile && sticky) {
        const rs = sticky.getBoundingClientRect(), rt = centerTile.getBoundingClientRect();
        if (rt.width > 0) this._sq = { s: rt.width, x: rt.left - rs.left + rt.width / 2, y: rt.top - rs.top + rt.height / 2 };
      }
      const Q = this._sq;
      if (flatsq && Q) {
        const J = Math.max(1, GAP * Q.s / (cellW || 1));
        const pitch = Q.s + J;
        const px = (Q.x - Q.s / 2 - J), py = (Q.y - Q.s / 2 - J);
        const img = 'repeating-linear-gradient(180deg,#1E1E1E 0 ' + J + 'px,transparent ' + J + 'px ' + pitch + 'px),repeating-linear-gradient(90deg,#1E1E1E 0 ' + J + 'px,transparent ' + J + 'px ' + pitch + 'px)';
        if (this._sqi !== img) { this._sqi = img; flatsq.style.backgroundImage = img; }
        flatsq.style.backgroundPosition = px + 'px ' + py + 'px,' + px + 'px ' + py + 'px';
        flatsq.style.transformOrigin = Q.x + 'px ' + Q.y + 'px';
        const fill = Math.max(vw, M.ch) * 2.4 / Math.max(1, Q.s);
        flatsq.style.opacity = swap ? '1' : '0';
        flatsq.style.transform = 'scale(' + (1 + (fill - 1) * post).toFixed(3) + ')';
      }
      if (sticky) sticky.style.visibility = 'visible';

      if (contact) {
        contact.style.transform = 'none';
        const ct = contact.getBoundingClientRect().top;
        contact.style.transform = p > 0.9 && ct > 0 ? 'translateY(' + (-ct) + 'px)' : 'none';
        contact.style.opacity = String(reveal);
        contact.style.pointerEvents = reveal > 0.5 ? '' : 'none';
      }
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
    const resize = () => { this._m = null; this._dk = null; this._sq = null; schedule(); };
    this.destroy = () => {
      cancelAnimationFrame(this._raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      window.removeEventListener('load', resize);
      document.fonts?.removeEventListener('loadingdone', resize);
      this._observer?.disconnect();
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
    sequence = new TileSequence({sequenceLength:window.QUERO_CONFIG?.animation?.lengthVh || 1000});
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
