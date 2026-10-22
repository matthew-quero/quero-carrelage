/* Native quote form: public Arazo contract supplied in BRANCHER_ARAZO.md. */
(() => {
  'use strict';
  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#form-status');
  const button = form?.querySelector('button[type="submit"]');
  if (!form || !status || !button) return;
  const settings = window.QUERO_CONFIG?.arazo?.form || {};
  const originalLabel = button.textContent;
  let pending = false;
  function message(state, text) {
    status.dataset.state = state;
    status.textContent = text;
    if (text) status.focus({preventScroll:true});
  }
  function payload() {
    const data = new FormData(form);
    const body = {artisan: settings.artisanId};
    for (const [key, field] of Object.entries({nom:'nom',telephone:'tel',email:'email',ville:'commune',type_travaux:'projet',message:'message'})) {
      let value = String(data.get(field) || '').trim();
      if (key === 'telephone') value = value.replace(/[\s().-]/g, '');
      if (value) body[key] = value;
    }
    return body;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    for (const name of ['nom','tel','email']) form.elements[name].removeAttribute('aria-invalid');
    if (!form.reportValidity()) return;
    const body = payload();
    if (!body.nom || body.nom.length < 2) {
      message('error', 'Indiquez votre prénom et votre nom.');
      form.elements.nom.setAttribute('aria-invalid', 'true');
      form.elements.nom.focus();
      return;
    }
    if (!body.email) {
      message('error', 'Indiquez votre e-mail pour recevoir le devis.');
      form.elements.email.setAttribute('aria-invalid', 'true');
      form.elements.email.focus();
      return;
    }
    if (body.telephone && !/^\+?[0-9]{8,15}$/.test(body.telephone)) {
      message('error', 'Vérifiez le numéro de téléphone pour que Pascal puisse vous rappeler.');
      form.elements.tel.setAttribute('aria-invalid', 'true');
      form.elements.tel.focus();
      return;
    }
    let api;
    try {
      api = new URL(settings.apiUrl);
      if (api.protocol !== 'https:' || !/^[0-9a-f-]{36}$/i.test(settings.artisanId || '')) throw new Error('Invalid configuration');
    } catch {
      message('error', 'Le formulaire est temporairement indisponible. Contactez Pascal par téléphone ou par e-mail.');
      return;
    }
    const sent = JSON.stringify(body);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    pending = true;
    button.disabled = true;
    button.textContent = 'Envoi…';
    form.setAttribute('aria-busy', 'true');
    message('pending', '');
    try {
      const response = await fetch(api.href, {
        method:'POST', credentials:'omit', redirect:'error',
        headers:{'content-type':'application/json'}, body:sent, signal:controller.signal
      });
      if (!response.ok) {
        let data;
        try { data = await response.json(); } catch { /* Error pages need not be JSON. */ }
        const fallback = response.status === 429
          ? 'Trop de demandes ont été envoyées. Patientez quelques minutes avant de réessayer.'
          : 'La réception de votre demande n’a pas pu être confirmée. Réessayez ou contactez Pascal.';
        message('error', typeof data?.erreur === 'string' && data.erreur.trim() ? data.erreur.trim().slice(0,400) : fallback);
        return;
      }
      // Do not erase changes made while the request was in flight.
      if (JSON.stringify(payload()) === sent) form.reset();
      message('success', 'Merci, votre demande a bien été transmise. Pascal vous recontactera.');
    } catch {
      message('error', 'La réception de votre demande n’a pas pu être confirmée. Vos informations sont conservées ; vous pouvez réessayer ou contacter Pascal.');
    } finally {
      clearTimeout(timeout);
      pending = false;
      button.disabled = false;
      button.textContent = originalLabel;
      form.removeAttribute('aria-busy');
    }
  });
})();
