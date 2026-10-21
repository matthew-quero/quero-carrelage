/* Site shell, honest email fallback, configurable Arazo mounting and video scrubbing. */
(() => {
'use strict';
const config = window.QUERO_CONFIG || {};
const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const asUrl = value => {
  if (!value) return null;
  try {
    const u = new URL(value, location.href);
    return ['https:', 'http:'].includes(u.protocol) && (u.protocol === 'https:' || ['localhost','127.0.0.1'].includes(u.hostname)) ? u.href : null;
  } catch { return null; }
};
const localAsset = value => {
  if (!value) return null;
  try { const u = new URL(value, location.href); return ['https:','http:','file:'].includes(u.protocol) ? u.href : null; } catch { return null; }
};
// Accessibility and anchor navigation do not depend on the animation being complete.
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const hash = link.getAttribute('href');
  const target = $(hash);
  if (!target) return;
  event.preventDefault();
  const scrollTarget = hash === '#haut' ? $('.hero-scroll') || target : target;
  scrollTarget.scrollIntoView({ behavior: reduced.matches || ['#contact','#savoir-faire'].includes(hash) ? 'instant' : 'smooth', block: 'start' });
  const focus = target.querySelector('h2[tabindex]') || target;
  if (!focus.hasAttribute('tabindex')) focus.setAttribute('tabindex','-1');
  focus.focus({ preventScroll:true });
  history.replaceState(null,'', hash);
}));
// Place actual texture files in assets/ and list their paths in site.config.js.
(config.animation?.textures || []).slice(0,9).forEach((url, i) => {
  const texture = document.querySelector(`[data-texture="${i+1}"]`);
  const src = localAsset(url);
  if (!texture || !src) return;
  const image = new Image();
  image.onload = () => { texture.style.backgroundImage = `url(${JSON.stringify(src)})`; };
  image.src = src;
});
const form = $('#quote-form');
const status = $('#form-status');
const email = window.QUERO_CONTACT.email;
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const phone = String(data.get('tel') || '').replace(/[\s().-]/g,'');
  if (!/^\+?[0-9]{8,15}$/.test(phone)) {
    status.textContent = 'Vérifiez le numéro de téléphone pour que je puisse vous rappeler.';
    form.elements.tel.setAttribute('aria-invalid','true');
    form.elements.tel.focus();
    return;
  }
  form.elements.tel.removeAttribute('aria-invalid');
  const text = `Bonjour Pascal,\n\nJe souhaite vous parler de mon projet.\n\nNom : ${data.get('nom')}\nTéléphone : ${data.get('tel')}\nCommune : ${data.get('commune') || 'Non précisée'}\nProjet : ${data.get('projet')}\n\n${data.get('message') || ''}\n`;
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Demande de devis — Quéro Carrelage')}&body=${encodeURIComponent(text)}`;
  status.replaceChildren(document.createTextNode('Votre message est préparé. Vérifiez-le et envoyez-le depuis votre messagerie. Si elle ne s’ouvre pas, '));
  const retry = document.createElement('a');
  retry.href = mailto; retry.textContent = 'ouvrez le message ici'; retry.style.textDecoration = 'underline';
  status.append(retry,document.createTextNode(' ou contactez-moi par téléphone.'));
  // Never clear the form: opening a mail client is not proof of delivery.
  const open = document.createElement('a'); open.href = mailto; open.hidden = true;
  document.body.append(open); open.click(); open.remove();
});
// Integrate only the exact URL or script supplied by Arazo; no invented API or identifiers.
const arazo = config.arazo?.form || {};
const mount = $('#arazo-form');
const hosted = asUrl(arazo.hostedUrl);
const scriptUrl = asUrl(arazo.scriptUrl);
function addFormLink(url, label) {
  const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.className = 'text-link'; link.textContent = label; mount.append(link);
}
if (hosted) {
  const frame = document.createElement('iframe');
  frame.title = 'Demander un devis à Quéro Carrelage'; frame.src = hosted; frame.loading = 'lazy';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.style.minHeight = Math.max(500, Math.min(1600, Number(arazo.iframeHeight) || 850)) + 'px';
  mount.append(frame); addFormLink(hosted, 'Ouvrir le formulaire dans une nouvelle fenêtre ↗');
  mount.hidden = false; form.hidden = true;
  // Framing may be disallowed by the remote host. The direct link always remains available.
} else if (scriptUrl) {
  const script = document.createElement('script'); script.src = scriptUrl; script.async = true;
  for (const [name,value] of Object.entries(arazo.scriptAttributes || {})) {
    if (/^data-[a-z0-9-]+$/.test(name)) script.setAttribute(name,String(value));
  }
  script.addEventListener('error', () => { mount.hidden = true; form.hidden = false; });
  mount.hidden = false; mount.append(script);
  // Keep the usable fallback until the real widget has rendered content.
  const observer = new MutationObserver(() => {
    if (mount.querySelector('iframe,form,input,button')) { form.hidden = true; observer.disconnect(); }
  });
  observer.observe(mount, { childList:true, subtree:true });
}
// Real reviews only. Missing/unavailable data leaves this section hidden.
async function loadReviews() {
  const settings = config.arazo?.reviews || {};
  const url = asUrl(settings.feedUrl);
  if (!url) return;
  try {
    const response = await fetch(url, { credentials:'omit', signal:AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Reviews unavailable');
    const data = await response.json();
    const reviews = Array.isArray(data) ? data : data.reviews;
    if (!Array.isArray(reviews)) return;
    const limit = Math.max(1, Math.min(12, Number(settings.max) || 6));
    const list = $('#reviews-list');
    for (const item of reviews.slice(0,limit)) {
      if (!item || typeof item.author !== 'string' || typeof item.text !== 'string' || !item.text.trim()) continue;
      const card = document.createElement('article'); card.className = 'review';
      const value = Number(item.rating);
      if (Number.isFinite(value) && value >= 1 && value <= 5) {
        const stars = document.createElement('div'); stars.className = 'rating'; stars.setAttribute('aria-label',`${value} sur 5`);
        stars.textContent = '★'.repeat(Math.round(value)) + '☆'.repeat(5-Math.round(value)); card.append(stars);
      }
      const quote = document.createElement('blockquote'); quote.textContent = item.text.slice(0,6000);
      const author = document.createElement('p'); author.textContent = item.author.slice(0,160);
      card.append(quote, author); list.append(card);
    }
    if (!list.children.length) return;
    $('#avis').hidden = false;
    const google = asUrl(settings.googleUrl);
    if (google) { $('#google-reviews').href = google; $('#google-reviews').hidden = false; }
  } catch (error) { console.info('Les avis sont temporairement indisponibles.'); }
}
loadReviews();
// A future source video can use the same scroll timeline, in either direction.
const video = $('#scroll-video');
const videoUrl = localAsset(config.animation?.videoUrl);
if (videoUrl) {
  let target = 0, ready = false;
  const controller = window.QueroVideo = {
    active:false,
    seek(progress) {
      target = Math.max(0, Math.min(1, progress));
      if (ready && !video.seeking) {
        const time = Math.min(video.duration - .01, target * video.duration);
        if (Number.isFinite(time) && Math.abs(video.currentTime-time) > .025) video.currentTime = Math.max(0,time);
      }
    }
  };
  video.addEventListener('loadedmetadata', () => {
    ready = Number.isFinite(video.duration) && video.duration > 0;
    controller.active = ready && !reduced.matches;
    if (controller.active) { video.hidden = false; document.documentElement.classList.add('video-mode'); controller.seek(target); window.dispatchEvent(new Event('scroll')); }
  });
  reduced.addEventListener('change', () => {
    controller.active = ready && !reduced.matches;
    video.hidden = !controller.active;
    document.documentElement.classList.toggle('video-mode', controller.active);
    window.dispatchEvent(new Event('resize'));
  });
  video.addEventListener('seeked', () => controller.seek(target));
  video.addEventListener('error', () => {
    controller.active = false; video.hidden = true; document.documentElement.classList.remove('video-mode'); window.dispatchEvent(new Event('resize'));
  });
  const poster = localAsset(config.animation?.posterUrl); if (poster) video.poster = poster;
  video.src = videoUrl;
}
})();
