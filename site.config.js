/* Configuration publique uniquement. Ne jamais placer de clé privée ici. */
window.QUERO_CONFIG = {
  animation: {
    lengthVh: 600,
    mobileLengthVh: 350,
    // Laisser vide pour conserver la séquence de carreaux en CSS 3D.
    // Exemple de chemin local après ajout de votre vidéo : './assets/pose.mp4'.
    videoUrl: '',
    posterUrl: '',
    // Photos de référence de la maquette Claude, à remplacer par les chantiers de Pascal.
    textures: [
      './assets/photos/service-interieur.webp',
      './assets/photos/service-faience.webp',
      './assets/photos/service-faience.webp',
      './assets/photos/service-interieur.webp',
      './assets/photos/service-faience.webp',
      './assets/photos/service-interieur.webp',
      './assets/photos/service-terrasse.webp',
      './assets/photos/service-faience.webp',
      './assets/photos/service-faience.webp'
    ]
  },
  // Contact details are reconstructed in assets/contact.js.
  arazo: {
    form: {
      // API publique et destinataire fournis par Arazo. Ce UUID n'est pas un secret.
      apiUrl: 'https://arazo.fr/api/demandes',
      artisanId: '5074220b-3e4e-4577-831f-5a0304227a37',
      // Copier l'URL publique exacte fournie par Arazo. Aucun endpoint n'est présumé.
      hostedUrl: '',
      // Variante pour le véritable widget Arazo : recopier src et attributs du script fourni.
      // Ne renseigner qu'un mode. Le script est inséré dans #arazo-form.
      scriptUrl: '',
      scriptAttributes: {},
      iframeHeight: 850
    },
    reviews: {
      // URL publique d'un flux que vous contrôlez, normalisé au format de INTEGRATION_ARAZO.md.
      // Ne pas utiliser une clé Google privée côté navigateur.
      feedUrl: '',
      googleUrl: '',
      max: 6
    }
  }
};
