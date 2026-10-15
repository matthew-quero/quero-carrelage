# Vérification — 15 octobre 2026

## Effectué

- Analyse syntaxique Node.js des trois fichiers JavaScript : configuration, site et séquence.
- Analyse structurelle des trois pages HTML : imbrication des balises, identifiants uniques, présence de 30 liens et ressources locales, cibles d'ancres et fichiers de polices.
- Recherche de dépendances résiduelles au moteur Claude Design : aucune balise de template ou référence au moteur dans les pages livrées.
- Simulation DOM de la logique de séquence : 10 initialisations sur cinq dimensions (1920×1080, 1440×900, 768×1024, 390×844 et 320×568), dont des chargements directement en fin de séquence ; 180 positions de défilement dans les deux sens ; 10 redimensionnements. Aucun calcul non fini détecté.
- La simulation vérifie qu'une rafale d'événements de scroll produit une seule mise à jour par image et qu'aucune animation ne tourne au repos.
- Simulation du formulaire : le brouillon contient les champs ; un téléphone invalide ne lance pas la messagerie ; aucun succès d'envoi n'est affirmé.
- Simulation de l'iframe Arazo configurée, du filtrage des URL et attributs du script, et du repli après échec du widget.
- Simulation des avis : les textes sont traités comme du texte, les entrées invalides sont ignorées et aucune requête n'est faite sans configuration.
- Assemblage de l'aperçu autonome avec polices, scripts, styles et pages légales inclus.

## Limites

Les simulations vérifient la logique et les nombres, pas la disposition ni le rendu CSS 3D d'un navigateur. Aucun navigateur de test adapté n'était disponible dans ce flux. Une revue visuelle desktop/mobile et un essai sur de vrais téléphones restent à faire.

Le formulaire et les avis Arazo n'ont pas été testés de bout en bout : leur véritable configuration n'a pas été fournie. Le mode vidéo est préparé dans le code, mais n'a pas été éprouvé avec une vidéo réelle, puisqu'aucun MP4 n'a été transmis.

Les fichiers sont préparés pour une publication sur le dépôt `matthew-quero/quero-carrelage`. L’activation de GitHub Pages et la vérification de son URL publique restent distinctes du transfert des sources.
