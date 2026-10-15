# Brancher Arazo

Le récapitulatif fourni indique qu'Arazo dispose d'un formulaire public avec widget et page hébergée. Il ne contient ni le script de Quéro Carrelage, ni un identifiant public d'artisan, ni un contrat de flux d'avis. Aucun de ces éléments n'a été inventé.

## Formulaire hébergé

Dans `site.config.js`, renseigner `arazo.form.hostedUrl` avec **l'URL publique exacte** du formulaire Quéro Carrelage copiée depuis Arazo. Le site monte une iframe et masque le formulaire par e-mail. Un lien d'ouverture directe reste disponible si l'intégration par iframe est refusée par le serveur Arazo. L'iframe est nommée pour les lecteurs d'écran et ne reçoit aucun identifiant privé.

Le serveur Arazo doit autoriser l'intégration sur le domaine final si ses en-têtes `Content-Security-Policy` limitent les parents. La hauteur est réglable avec `iframeHeight`. Aucun redimensionnement par message inter-origines non vérifié n'est accepté.

## Widget officiel

Autre possibilité : copier l'URL `src` du script réel dans `scriptUrl`, et ses attributs `data-*` dans `scriptAttributes`. Laisser `hostedUrl` vide. Le script est inséré dans `#arazo-form` ; adapter ce conteneur si le contrat officiel du widget attend un identifiant différent.

Exemple de configuration structurelle, à compléter avec les valeurs réelles :

```js
form: {
  hostedUrl: '',
  scriptUrl: '',
  scriptAttributes: {},
  iframeHeight: 850
}
```

Le formulaire par e-mail reste disponible jusqu'à l'apparition du widget. Un échec de chargement du script conserve cette solution de contact. Ne pas utiliser une URL d'administration, un jeton de session, une clé Supabase privée ou une clé Google dans ces fichiers publics.

Le widget et la page Arazo sont responsables de la validation, de l'antispam et de la création effective de la demande. Ce site ne fait aucun POST vers un endpoint supposé.

## Avis

En l'absence de données réelles, la section est masquée. Le site comprend un adaptateur pour un **flux JSON public que vous contrôlez**, à renseigner dans `arazo.reviews.feedUrl`. Ceci est un format de raccordement proposé pour le site, pas une API Arazo existante présumée.

Format accepté : un tableau, ou un objet `{ "reviews": [...] }`. Chaque avis contient :

| Champ | Type | Utilisation |
|---|---|---|
| `author` | chaîne | Nom public de l'auteur |
| `text` | chaîne | Texte réel de l'avis |
| `rating` | nombre de 1 à 5, facultatif | Affichage de la note |

Aucune donnée illustrative n'est fournie comme faux avis. Les textes sont insérés via `textContent` pour éviter l'exécution de HTML provenant du flux.

Le service qui publie ce flux doit gérer les droits de réutilisation, les attributions et les conditions du fournisseur de données. Il peut aussi exposer un widget officiel : dans ce cas, remplacer cet adaptateur par ce widget.

Pour un flux sur un autre domaine, autoriser en lecture l'origine GitHub Pages au niveau CORS. Aucune authentification privée ne doit être nécessaire depuis le navigateur. L'absence de flux, une erreur ou un tableau vide masquent la section sans bloquer le contact.

`googleUrl` peut contenir le lien réel vers la fiche Google, pour l'appel à l'action « Voir les avis sur Google ».

## Repli provisoire

Sans configuration Arazo, les champs du formulaire préparent un e-mail à l'adresse présente dans l'export d'origine. Le visiteur doit encore envoyer ce message depuis sa messagerie. Le texte et le bouton l'indiquent explicitement. Le formulaire ne dit jamais qu'une demande a été reçue et conserve les champs.
