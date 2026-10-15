# Vidéo pilotée par le défilement

Le mode par défaut conserve la séquence CSS 3D de la v6. Le fichier d'origine ne contient aucune vidéo.

Pour basculer sur une vidéo réelle :

1. Placer le MP4 dans `assets/` et, si disponible, une image de couverture.
2. Renseigner les chemins relatifs dans `animation.videoUrl` et `animation.posterUrl` de `site.config.js`.
3. Garder la vidéo courte et viser une compression adaptée au web. Des images clés fréquentes rendent la navigation avant/arrière plus réactive, au prix d'un fichier plus lourd.
4. Tester sur un vrai iPhone et un Android avant publication publique.

La position du scroll est convertie en position dans la vidéo (`currentTime`). La vidéo reste muette, ne lance aucune lecture automatique et suit le défilement dans les deux sens. Le chargement initial demande les métadonnées ; la lecture de nouvelles images entraîne ensuite du téléchargement. Une erreur de vidéo réactive la séquence CSS. La préférence « réduire les animations » affiche la version statique du site.

La séquence n'a pas besoin d'être une vidéo pour recevoir de vraies textures : les neuf chemins `animation.textures` permettent de conserver l'animation géométrique actuelle avec des images de carreaux.
