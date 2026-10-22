/* Deters simple source scrapers; JavaScript-capable bots can still read displayed details. */
(() => {
  'use strict';
  const decode = values => String.fromCharCode(...values.map(value => value - 17));
  const email = decode([130,134,118,131,128,116,114,131,131,118,125,114,120,118,81,128,131,114,127,120,118,63,119,131]);
  const phone = decode([60,68,68,71,73,66,68,66,66,67,74,67]);
  const display = decode([65,71,49,73,66,49,68,66,49,66,67,49,74,67]);
  window.QUERO_CONTACT = Object.freeze({email});
  document.querySelectorAll('[data-contact]').forEach(link => {
    const isPhone = link.dataset.contact === 'phone';
    link.textContent = isPhone ? display : email;
    link.href = (isPhone ? 'tel:' : 'mailto:') + (isPhone ? phone : email);
  });
  // Keep contact details out of the static HTML, as for the visible links.
  // Google can read JSON-LD generated with JavaScript; capable bots can too.
  document.querySelectorAll('[data-business-schema]').forEach(script => {
    try {
      const business = JSON.parse(script.textContent);
      business.telephone = phone;
      business.email = email;
      script.textContent = JSON.stringify(business);
    } catch (error) { console.error('Données d’entreprise invalides.', error); }
  });
})();
