# Arazo — formulaire de devis

Le contrat public est fourni dans `BRANCHER_ARAZO.md` transmis le 22 octobre 2026.
Le formulaire natif conserve sa présentation et envoie désormais une requête JSON
à `https://arazo.fr/api/demandes`, pour le destinataire public
`5074220b-3e4e-4577-831f-5a0304227a37`. Aucune clé privée n’est utilisée.

## Champs envoyés

| Champ Arazo | Champ du formulaire | Règle du site |
|---|---|---|
| artisan | configuration `artisanId` | identifiant public du compte |
| nom | nom | obligatoire, au moins deux caractères |
| email | email | obligatoire pour recevoir le devis et permettre le suivi |
| telephone | tel | facultatif ; espaces et séparateurs retirés |
| ville | commune | facultatif |
| type_travaux | projet | choix de la prestation |
| message | message | facultatif |

Le serveur accepte au moins un e-mail ou un téléphone, selon le document fourni.
Le site demande un e-mail afin de permettre la chaîne de devis et relances décrite
dans ce document. Les champs vides facultatifs sont omis du JSON.

## Comportement

`assets/quote-form.js` gère l’envoi. Le bouton et l’état `aria-busy` empêchent un
double clic concurrent. Seule une réponse HTTP réussie affiche la confirmation.
Un refus de l’API (champ `erreur`), une réponse non JSON, une erreur réseau ou un
délai dépassé conservent les informations. Après un succès, le formulaire est vidé
uniquement si le visiteur ne l’a pas modifié pendant l’envoi. Le délai est de vingt
secondes ; un dépassement ne permet pas de savoir si le serveur a reçu la demande.
Les messages ne promettent pas de délai de réponse de Pascal. Aucun envoi automatique
par e-mail n’est effectué en repli.

Le 22 octobre 2026, le préflight `OPTIONS` répond HTTP 204 avec les autorisations
CORS pour `POST` et `content-type`. Un corps vide permet de vérifier le refus des
requêtes invalides sans créer une demande. La création d’une vraie demande, la
notification de Pascal et les automatisations du tableau de bord restent à vérifier
avec un envoi réel autorisé. Les tests locaux simulent les réponses de l’API.

## Autres modes

Les anciens emplacements `hostedUrl`, `scriptUrl`, `scriptAttributes` et
`iframeHeight` restent disponibles pour un éventuel widget officiel. Ils sont vides
dans la configuration active. Si un widget est configuré, le formulaire natif reste
disponible jusqu’à l’apparition de son contenu.

## Avis

Le document fourni ne contient ni URL de flux d’avis ni script d’affichage. La
section reste donc masquée. L’adaptateur déjà présent peut lire un tableau JSON
public, ou un objet `{ "reviews": [...] }`, avec `author`, `text` et une note
`rating` facultative entre 1 et 5. Ce format est un contrat du site, pas une API
Arazo inventée. Configurer `arazo.reviews.feedUrl` et, si disponible, `googleUrl`
à partir des liens publics fournis par Arazo.
