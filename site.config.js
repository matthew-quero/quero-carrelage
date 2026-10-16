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
      './assets/photos/service-interieur.jpg',
      './assets/photos/service-faience.jpg',
      './assets/photos/service-faience.jpg',
      './assets/photos/service-interieur.jpg',
      './assets/photos/service-faience.jpg',
      './assets/photos/service-interieur.jpg',
      './assets/photos/service-terrasse.jpg',
      './assets/photos/service-faience.jpg',
      './assets/photos/service-faience.jpg'
    ]
  },
  // Contact details are reconstructed in assets/contact.js.
  arazo: {
    form: {
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
