/* Configuration publique uniquement. Ne jamais placer de clé privée ici. */
window.QUERO_CONFIG = {
  animation: {
    lengthVh: 1000,
    // Laisser vide pour conserver la séquence de carreaux en CSS 3D.
    // Exemple de chemin local après ajout de votre vidéo : './assets/pose.mp4'.
    videoUrl: '',
    posterUrl: '',
    // Des images réelles pourront remplacer les 9 surfaces neutres.
    textures: []
  },
  contact: { email: 'querocarrelage@orange.fr' },
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
