# Audit d'accessibilité — quenquen-corp.fr

Audit du 12/11/2026. Pages testées en local sur ordinateur (1366 px) et mobile (390 px),
avec axe-core (règles WCAG 2.1 A/AA) et des tests clavier.

## Résultat

| Page | Erreurs axe avant | Erreurs axe après |
|---|---|---|
| Accueil `/` | 2 | 0 |
| Wiki `/wiki/` | 1 | 0 |
| Card Collector Volume 2 | 1 | 0 |
| The Rise of French QuenQuen | 3 | 1 (mineure) |
| Card Collector Volume 1 | 1 | 1 (mineure) |
| Planner | 0 | 0 |

Les tests automatiques ne voient qu'une partie des problèmes. Les plus gênants
(texte minuscule, son sans bouton d'arrêt, menus invisibles sur mobile, lien cassé)
ont été trouvés à la lecture du code et en naviguant.

## Ce qui a été corrigé

### Accueil
- Texte de 7 à 11 px passé à 12 px minimum ; gris trop sombres éclaircis (contraste 4,5:1).
- Bouton « SON » en haut à droite : le bourdonnement et les bips peuvent être coupés, le choix est mémorisé.
- Les 4 portails (Card Collector, Wiki, The Rise, Volume 2) sont de vrais liens : ils marchent sans JavaScript, au clavier, et avec « ouvrir dans un nouvel onglet ».
- Titre principal (h1) ajouté, niveaux de titres cohérents, lien « Aller au contenu ».
- Fenêtres (carte de membre, carte agrandie, contact) : le focus y entre, y reste, Échap ferme, le focus revient au bouton d'origine.
- Carte de membre et cartes du registre utilisables au clavier.
- Mobile : le bouton CONTACT ne recouvre plus le menu du bas ; les badges (DÉCOUVERTE, LORE, GAME) ne recouvrent plus les titres ; le titre du Volume 2 ne déborde plus.
- Image du portail Volume 2 : 4,2 Mo → 140 Ko (WebP).
- Fenêtre « Liens des projets » supprimée : aucun bouton ne l'ouvrait.
- Animations réduites pour les visiteurs qui le demandent dans leur système.

### Pages de redirection `/go/`
- `go/twitch.html` menait à une page vide (`twitch-intro.html`, 0 octet) : il mène maintenant à la chaîne Twitch. Fichier vide supprimé.
- Chaque page affiche un lien « Continuer » et fonctionne sans JavaScript.
- L'intro animée avant YouTube est sautée si le visiteur a demandé moins d'animations.

### Wiki
- Le bouton « Revenir au hub » recouvrait le logo du wiki sur ordinateur : il est dans une barre au-dessus de l'en-tête, avec la musique.
- Mobile : le menu des articles était masqué, donc inaccessible. Il s'affiche sous l'article, avec un bouton « Menu du wiki ».
- Recherche : champ nommé pour les lecteurs d'écran, suggestions atteignables au clavier.
- Logo du wiki cliquable au clavier ; le choix « musique coupée » est mémorisé.

### Card Collector Volume 2
- L'album chargeait chaque carte en PNG de 2 à 3,5 Mo. Il charge des vignettes WebP (25 Ko en moyenne), seulement quand elles arrivent à l'écran ; le PNG complet ne se charge qu'à l'ouverture d'une carte.
- Cartes possédées utilisables au clavier ; visionneuse fermable avec Échap.
- `assets/back.png` n'existe pas : chaque carte non acquise provoquait une erreur 404. Remplacé par un motif en CSS.
- Le choix « musique coupée » est mémorisé.

### The Rise, Volume 1, Planner, pages admin
- The Rise : le zoom du navigateur n'est plus bloqué ; bouton de retour au hub plus lisible.
- Volume 1 : 8 images sans texte alternatif corrigées, boutons de page nommés.
- Focus clavier visible partout.

## À décider (non modifié)

1. **Liens des réseaux.** `go/youtube.html` envoie vers `youtube.com/@frenchquenquen` et `go/tiktok.html` vers `tiktok.com/@frenchquenquen`, alors que le portail affiche « QUENQUEN-LE MULTIVERS ». Les mêmes adresses sont dans les données pour Google (JSON-LD). À confirmer.
2. **Intro de 6,6 s avant YouTube.** Un visiteur qui clique sur YouTube attend l'animation (bouton « passer » présent). C'est le seul réseau avec ce délai.
3. **Musiques.** Décision du 12/11/2026 : on ne touche pas aux musiques. Aucun fichier audio n'a été modifié ni supprimé.
4. **Lien OnlyFan.** `go/onlyfan.html` mène à un vrai compte OnlyFans depuis un site tout public.
5. **Fichiers de sauvegarde.** `wiki_patched.html`, `wiki/index-legacy-backup.html` (identiques, 5,6 Mo chacun) et `wiki/assets/images/wiki-c630a41cfb026da7.png` (2,4 Mo) n'étaient liés par aucune page : supprimés le 12/11/2026, récupérables dans l'historique Git. `planner-preview/` et `assets/quenquen-corp-v1.png` semblent aussi inutilisés, laissés en place.
6. **Poids du dépôt : 852 Mo**, dont 433 Mo pour le Volume 1 (vidéos) et 300 Mo pour les PNG du Volume 2. GitHub recommande de rester sous 1 Go. Passer les cartes en WebP et les vidéos sur YouTube ou un stockage dédié réglerait le problème.
7. **Volume 1.** Le contour de focus est volontairement masqué sur les cartes (pour cacher les zones secrètes). Le jeu reste donc difficile au clavier ; le corriger changerait le jeu.
8. **The Rise.** Jeu sur canvas, non jouable avec un lecteur d'écran ; c'est une limite du format.

## Règles à garder pour la suite

- Texte : 12 px minimum, 14 à 16 px pour les paragraphes.
- Contraste texte/fond : 4,5:1 minimum.
- Ce qui se clique est un `<a>` (navigation) ou un `<button>` (action), jamais un `<div>`.
- Toute image a un `alt` (vide si décorative).
- Tout son qui démarre seul a un bouton pour le couper.
- Ne jamais bloquer le zoom (`user-scalable=no`).
- Nouvelle carte du Volume 2 : ajouter sa vignette dans `assets/cards/thumbs/` (480 px, WebP).
