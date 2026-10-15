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

Les simulations vérifient la logique et les nombres, pas la disposition ni le rendu CSS 3D d'un navigateur. La première livraison avait été contrôlée sans navigateur. Une revue visuelle desktop/mobile et un essai sur de vrais téléphones restent à faire.

Le formulaire et les avis Arazo n'ont pas été testés de bout en bout : leur véritable configuration n'a pas été fournie. Le mode vidéo est préparé dans le code, mais n'a pas été éprouvé avec une vidéo réelle, puisqu'aucun MP4 n'a été transmis.

Les fichiers sont préparés pour une publication sur le dépôt `matthew-quero/quero-carrelage`. L’activation de GitHub Pages et la vérification de son URL publique restent distinctes du transfert des sources.


## Révision 2 — contrôle sur le site publié

- Syntaxe JavaScript, structure HTML, ressources locales et nouvelles ancres vérifiées ; simulations de la séquence et du formulaire rejouées avec succès.
- Premier écran contrôlé dans Chrome à 1363 × 936 : titre sur deux lignes, localisation séparée, bouton visible et absence de débordement horizontal.
- Textes de la séquence contrôlés visuellement sur la version publiée : le premier et le deuxième message sont lisibles devant le décor 3D. Leur taille reste bornée et leur boîte tient dans le viewport.
- Présence et lisibilité de la section fixe des six prestations vérifiées ; lien « Savoir-faire » testé.
- Aucun message d’erreur issu des scripts du site dans la console consultée (un message provenant d’une extension du navigateur est hors périmètre).
- Décalage cumulé des ancres repéré pendant la revue, puis supprimé : un seul décalage lié à la hauteur du header.
- Les quatre arguments restent également accessibles hors animation dans l’accueil et la section des prestations.

La revue visuelle réelle porte sur l’ordinateur. Les essais sur appareil mobile réel, le mode vidéo avec un vrai MP4 et la connexion Arazo de bout en bout restent à réaliser.

## Révision 3 — retours sur la séquence

- Suppression de l’ancien carré final et de ses mesures mémorisées depuis une image précédente : la projection dépend uniquement du scroll et des dimensions actuelles.
- Simulation numérique avant/arrière rejouée : 10 initialisations, 180 positions, 20 comparaisons identiques d’images au retour, 10 redimensionnements, aucun NaN ni Infinity. RAF regroupées et repos sans boucle vérifiés.
- Simulations formulaire, iframe et avis rejouées avec succès après déplacement des avis dans le contact.
- Neuf fichiers photo récupérés depuis les URL de la maquette originale, type image et fichiers non vides vérifiés.
- Contrôle visuel sur le site publié dans Chrome à 1363 × 936 : neuf photos chargées, bande blanche et numéros absents, deux textes visibles ensemble à des profondeurs différentes, plans de la pièce visibles et section des prestations apparaissant pendant le fondu.
- Retour du scroll après la transition : à la même position y = 4118, les transformations de la pièce et les styles des quatre textes sont strictement identiques à l’aller.
- Survol de « Terrasse et dallage » observé : fond noir, texte blanc et flèche. Les lignes de prestations sont des liens accessibles vers le contact.
- La revue visuelle de cette révision porte sur l’ordinateur ; aucun test sur téléphone réel n’est revendiqué.

## Révision 4 — lisibilité et pages de services

- Suppression du contour de focus des sections ciblées programmatiquement ; focus des liens et formulaires conservé.
- Mosaïque démarrant au premier bord : les premières prestations sont dans le parcours horizontal, au lieu de commencer au milieu de la grille.
- Textes de la pièce : mesure de la taille intrinsèque et disparition avant le débordement ; positions et opacité déterministes dans les deux sens.
- Section de prestations opaque pendant le raccord pour éviter la double exposition grise.
- Tuiles utiles et liste fixe liées à trois pages réelles. Les tuiles ne sont interactives que lorsqu’elles sont entièrement dans le viewport pendant la phase horizontale.
- Contenus et groupes de recherches décrits dans SEO-PAGES.md. Indexation du prototype toujours désactivée.

- Contrôle dans Chrome : le contour du hero est absent ; la tuile « Faïence murale » ouvre la page attendue, dont le rendu est lisible. Le contrôle a repéré dix pixels de dépassement vertical de la grille dû à l’ancienne hauteur de header codée en dur : le calcul des trois rangées utilise désormais la hauteur réelle.

- Contrôle final publié dans Chrome à 1363 × 936 : la première tuile de carrelage intérieur est entière et un clic direct ouvre carrelage-interieur.html ; les trois pages sont accessibles et lisibles.
- À y = 4118, les deux textes visibles ont leurs boîtes entièrement dans le viewport. À y = 5101, aucun texte tronqué ne persiste et les prestations restent opaques.
- Les simulations vérifient aussi que toute boîte de texte encore visible tient dans la zone utile, avec marge, aux dimensions testées.
- Trois aperçus d’images clés ont été générés : grille à plat, sol seul en perspective et pièce carrelée. Ils ne sont pas encore branchés au site ; aucune vidéo de transition n’est annoncée comme terminée.

## Révision 5 — images et retour de navigation

- Trois illustrations générées intégrées aux pages de services et reprises dans le carrousel ; JPEG locaux, dimensions indiquées et recadrage sans étirement.
- Numéro et adresse e-mail retirés du texte visible de toutes les pages, y compris pages légales ; liens de contact conservés sous des libellés. Les coordonnées restent publiques dans les liens techniques, pas des secrets.
- Historique : capture de la position au pointerdown avant un éventuel scroll de focus, conservation à la sortie, restauration après polices et mise en page sur retour navigateur. Bouton Retour sur les pages de services, avec repli vers les prestations lors d’un accès direct.
- Simulation exécutée : capture avant focus, préservation à pagehide, restauration BFCache exacte, entrée fraîche non déplacée et action Retour.
- Guide Flow et cinq prompts dans FLOW.md ; six cadres pour préparer les transitions. Aucun clip Flow n’a encore été généré ou intégré.
