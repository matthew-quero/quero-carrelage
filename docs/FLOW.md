# Quéro Carrelage — images clés et Google Flow

Préparé le 15 octobre 2026. Images d’illustration générées, pas des réalisations de Pascal. Les vidéos ne sont pas encore générées.

## Les six images

| Fichier | État |
|---|---|
| 01-carreau-gauche.png | Grand carreau noir incliné à gauche, fond blanc |
| 02-carreau-centre.png | Carreau noir centré, fond blanc |
| 03-grille.png | Grille noire vue de face |
| 04-sol-perspective.png | Sol seul en perspective, fond blanc |
| 05-piece.png | Pièce carrelée formée |
| 06-piece-rapprochee.png | Caméra avancée dans la même pièce |

Les exports du pack ont le même cadre 1920 × 1080, sans étirement. Une image générée ne verrouille pas les joints comme un rendu 3D : le raccord final sera à caler sur la grille HTML après choix des clips. Les PNG d’origine restent intacts.

## Photo ou taille des carreaux ?

Garder les tuiles carrées du site et recadrer les photos dedans. Le remplissage « cover » conserve les proportions ; ajuster le point de cadrage si un élément est coupé. Les pages conservent des images larges. Ne jamais étirer une photo 16:9 pour la faire rentrer dans un carré.

Pour les images clés : même cadre, matériau, lumière et géométrie aussi stable que possible.

## Montage pour le site

- 01 → 02 : arrivée du carreau.
- 02 → 03 : assemblage de la grille.
- À ce point, passer au vrai carrousel HTML pour conserver les photos et les liens cliquables.
- À la fin du carrousel, revenir à une grille noire et utiliser 03 → 04 → 05 → 06.
- Les titres et textes restent dans la page, synchronisés avec le scroll. Ne pas les faire générer dans la vidéo.

Les vidéos ne sont pas encore branchées. Le mode vidéo global actuel remplace la scène entière : on ne doit pas simplement y mettre un long film si le carrousel doit rester cliquable. Les clips seront placés dans les portions de transition, avec un raccord entre la grille filmée et les cellules HTML.

## Comment utiliser Flow

1. Ouvrir https://labs.google/fx/tools/flow et créer un projet.
2. Dans le choix de modèle de la zone de génération, choisir **Video**, puis **Frames**.
3. Placer la première image dans **Add start frame**, la suivante dans **Add end frame**. Ne pas les ajouter seulement comme références dans Ingredients.
4. Choisir **16:9**, **une sortie** et, si disponible dans le compte, **Veo 3.1 Fast** pour un essai. Commencer avec **6 secondes** ; essayer 8 secondes pour la formation de la pièce si nécessaire. Ce sont des choix de travail, pas des durées imposées. Vérifier les crédits affichés avant de générer.
5. Coller le prompt correspondant ci-dessous et générer.
6. Contrôler les bords et les joints, puis télécharger les clips retenus sous les noms 01-vers-02.mp4, 02-vers-03.mp4, etc.
7. Réutiliser exactement la même image intermédiaire comme arrivée du clip précédent et départ du suivant.
8. Me transmettre les MP4 pour le raccord, l’encodage adapté au scroll et l’intégration.

Flow produit les images intermédiaires. Les prompts guident le mouvement, sans garantir des joints immuables. Rejeter un clip si les carreaux fondent, se déforment ou changent de matériau. Modifier seulement l’intervalle fautif. Le son n’est pas nécessaire pour le site.

## Les cinq prompts exacts

Les prompts sont en anglais pour préciser les mouvements de caméra.

### 01 → 02 — déplacement et rotation

Départ : 01-carreau-gauche.png. Arrivée : 02-carreau-centre.png.

    Create one continuous clean architectural motion-design shot between the supplied start and end frames. The single charcoal ceramic tile moves from the left side to the exact center, rotates in the image plane from its diamond orientation to an axis-aligned square, and scales down to the exact size in the end frame. Keep it rigid and perfectly square. Preserve its mineral texture, matte finish and color. Keep the camera locked in a perpendicular orthographic view and the background pure white. Use gentle acceleration and deceleration without overshoot. No additional tiles, melting, texture morphing, perspective rotation, text, logo, UI, cut or flash.

### 02 → 03 — assemblage de la grille

Départ : 02-carreau-centre.png. Arrivée : 03-grille.png.

    Create one continuous orthographic architectural assembly shot between the supplied centered tile and full tiled grid. Keep the original tile centered, allowing only the uniform scale adjustment needed to match the final grid cell. Other identical rigid charcoal tiles slide in from the outer frame edges and settle into the exact rows and columns of the end frame. Assemble by planar translation, not liquid morphing or stretching. All tiles remain coplanar with straight seams and uniform thin gray grout. Keep the camera locked and perpendicular to the plane. No photographs, labels, text, UI, perspective tilt, camera shake, flash or cut.

Le carrousel interactif s’affiche ensuite en HTML ; ce clip ne remplace pas son déplacement horizontal.

### 03 → 04 — bascule en sol

Départ : 03-grille.png. Arrivée : 04-sol-perspective.png.

    Create one continuous precise architectural transformation from the supplied front-facing tiled grid to the supplied horizontal tiled floor. Treat the entire surface as one rigid rectangular plane. Tilt this plane backward as a single slab, coordinating translation and scale only as needed to reach the exact floor perspective and rear edge in the end frame. All individual tiles stay attached, rigid and evenly spaced; grout lines remain straight and their topology unchanged. Reveal a pure white studio void around the receding plane. Preserve the charcoal matte porcelain. No camera orbit, roll, bending, melting, disassembling tiles, walls, objects, text, UI, flash or cut.

### 04 → 05 — formation de la pièce

Départ : 04-sol-perspective.png. Arrivée : 05-piece.png.

    Create one continuous architectural assembly shot from the supplied floor-only frame to the supplied completed empty room. Lock the camera position, eye height, lens and framing. Keep the existing tiled floor completely stationary. Rigid tiled panels rise from its rear, left and right boundaries to form the exact walls in the end frame. The ceiling then closes from the upper rear edge. Preserve square tile proportions, straight grout, charcoal mineral material and room symmetry. Shading changes only naturally as the room closes; keep the light source unchanged. No liquid surfaces, furniture, openings, people, tools, text, UI, camera movement, flash or cut.

### 05 → 06 — avancée de caméra

Départ : 05-piece.png. Arrivée : 06-piece-rapprochee.png.

    Create one continuous slow straight camera dolly forward through the exact empty tiled room in the start frame, reaching the closer composition of the supplied end frame. Translate only along the room's center axis at constant eye height with the same fixed wide-angle lens. This is a physical forward move, not a lens zoom. The back wall grows larger while side-wall, floor and ceiling bands narrow naturally. Preserve room dimensions, tile count, grid topology, material, grout and lighting. Keep all surfaces rigid and seams straight. No lateral drift, pan, tilt, roll, new objects, text, UI, morphing, flickering joints, flash or cut.

## Après les générations

Regarder les raccords à l’arrêt et au ralenti : le scroll peut s’immobiliser sur n’importe quelle image. Les clips retenus devront avoir les mêmes couleurs, ratio et résolution finale. Les mouvements du carreau et l’assemblage peuvent aussi rester en CSS si Flow déforme trop la géométrie.

## Sources Google

- Images de départ/arrivée et création de vidéo : https://support.google.com/flow/answer/16353334?hl=en
- Modèles, fonctions et durées disponibles : https://support.google.com/flow/answer/16352836?hl=en

Documentation consultée le 15 octobre 2026 ; l’interface et les crédits peuvent évoluer.
