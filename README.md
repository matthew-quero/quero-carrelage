# Quéro Carrelage

Site vitrine de Pascal Quéro, basé sur la v6 fournie depuis Claude Design.
HTML, CSS et JavaScript autonomes. Aucune installation, aucun build, aucun compte nécessaire pour consulter le site.

## Ouvrir le site

Double-cliquer sur `index.html`, ou ouvrir le dossier dans VS Code avec Live Server.
Pour tester un flux d'avis, servir les fichiers en HTTP :

```sh
python -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Ce qui a changé

- Suppression du moteur et des balises propriétaires Claude Design.
- Conservation du carré d’ouverture, de la grille, du passage au noir, du sol qui bascule et de la pièce 3D. Les textes sont sur un calque indépendant, avec un temps de lecture stable.
- Séquence raccourcie de 40 % sur ordinateur, plans noirs mieux différenciés, premier écran allégé et prestations consultables dans une section fixe.
- Une seule mise à jour par image lors du défilement ; aucune boucle d'animation permanente au repos.
- Recalcul de la géométrie au redimensionnement et au chargement des polices.
- Contact toujours accessible, sans attendre la fin de l'animation. Les liens « Demander un devis » et « Passer l'animation » y vont directement.
- Mise en page mobile, focus clavier, lien d'évitement, préférence de mouvement réduit et version statique sans JavaScript.
- Retrait des photos Unsplash de démonstration. Les neuf surfaces restent neutres, prêtes pour vos textures.
- Polices Barlow et Chakra Petch fournies localement ; pas d'appel à Google Fonts.
- Formulaire utilisable par brouillon d'e-mail tant que le véritable formulaire Arazo n'est pas configuré. Aucune fausse confirmation, aucune donnée stockée par ce site.
- Points de branchement du widget/formulaire Arazo et des avis réels.
- Pages légales conservées et liens réparés. Les informations de l'export n'ont pas été vérifiées auprès de l'entreprise.

## Configuration

Tout se règle dans `site.config.js` :

- `animation.lengthVh` : longueur de la séquence sur ordinateur, 600 par défaut (six hauteurs d’écran).
- `animation.mobileLengthVh` : longueur sur écran étroit, 520 par défaut.
- `animation.textures` : chemins de neuf vraies images, dans leur ordre dans la grille.
- `animation.videoUrl` et `posterUrl` : vidéo à parcourir avec le scroll, en remplacement de l'animation CSS. Laisser vides pour le rendu d'origine.
- `arazo.form` : URL publique exacte du formulaire hébergé, ou src et attributs du véritable script d'intégration Arazo.
- `arazo.reviews` : flux d'avis public normalisé et lien Google facultatif.

Voir [INTEGRATION_ARAZO.md](INTEGRATION_ARAZO.md) pour les données attendues et [docs/VIDEO.md](docs/VIDEO.md) pour la vidéo.

## GitHub Pages

Le dépôt est `https://github.com/matthew-quero/quero-carrelage`.
Les fichiers du site sont à sa racine, avec `index.html` comme entrée.
Dans **Settings → Pages**, choisir le déploiement depuis la branche `main`, dossier `/ (root)`, puis enregistrer.
Le site sera disponible à l’adresse affichée par GitHub après son déploiement.

Tous les chemins sont relatifs : le site peut vivre dans un sous-dossier de dépôt. Le fichier `.nojekyll` est inclus.
Le dossier `original/` conserve le ZIP Claude Design inchangé. Il peut rester hors du dépôt publié.

Le site est livré en **mode test non indexable** (`noindex,nofollow` dans les pages et `robots.txt`). Quand la vraie version est validée : supprimer ces directives, autoriser l'exploration, ajouter les URL finales dans un sitemap et un lien canonique.

## Ce qui demande encore vos éléments

- Le vrai script ou lien public Arazo pour le compte Quéro Carrelage.
- Le flux d'avis ou le vrai widget d'avis, s'il existe côté Arazo. Aucun avis n'a été inventé.
- Les images réelles des carreaux / chantiers et la vidéo si le mode vidéo est retenu.
- L’activation de GitHub Pages dans les réglages du dépôt.
- Les éléments encore indiqués « à compléter » dans les pages légales d'origine.

## Vérification

Les vérifications réellement exécutées sont consignées dans `docs/VERIFICATION.md`.
Le projet d'origine complet se trouve dans `original/claude-design-original.zip`.
