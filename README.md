# QUENQUEN CORP

Portail officiel de l'écosystème QUENQUEN CORP, en ligne sur https://quenquen-corp.fr (GitHub Pages).

## Pages

| Adresse | Contenu |
|---|---|
| `/` | Hub QUENQUEN CORP (portails, réseaux, carte de membre, registre des agents) |
| `/card-collector/` | Card Collector — Volume 1 |
| `/card-collector-v2/` | Card Collector — Volume 2 (album lié au compte Twitch) |
| `/wiki/` | Wiki QuenQuen |
| `/the-rise-of-french-quenquen/` | Jeu The Rise of French QuenQuen |
| `/planner/` | Planner des lives (outil interne) |
| `/go/*.html` | Pages de redirection vers les sections et les réseaux |
| `/admin-contact/`, `/admin-mysteres/` | Outils d'administration (non indexés) |

## Accessibilité

Un audit a été fait le 12/11/2026 : voir `AUDIT-ACCESSIBILITE.md` pour les règles à garder
(texte de 12 px minimum, contraste de 4,5:1, vrais liens et boutons, focus visible, son coupable).

## Cartes du Volume 2

Chaque carte `card-collector-v2/assets/cards/N.png` a une vignette légère
`card-collector-v2/assets/cards/thumbs/N.webp` (480 px) utilisée dans l'album.
Sans vignette, l'album charge directement le PNG.

## Live Twitch, vidéo à la une et planning

L'accueil interroge la fonction Supabase `qc-hub-status` (publique, lecture seule) toutes les 90 secondes.
Elle renvoie l'état du live Twitch de `frenchquenquen_` et la dernière vidéo de la chaîne YouTube `@frenchquenquen` (identifiant de chaîne UC1yL4kGds_NRitlib_J41jw).

- En live : bandeau rouge « EN LIVE MAINTENANT » en haut de l'accueil et portail Twitch marqué « ● EN LIVE ».
- Vidéo à la une : dernière vidéo longue de la chaîne (à défaut, le dernier Short).
- Si la fonction ne répond pas, l'accueil garde la vidéo écrite en dur dans `index.html` et n'affiche pas de bandeau.
- Sans clés Twitch, le live est détecté par l'aperçu public de Twitch (quelques minutes de décalage possibles, pas de titre garanti).
  Avec les secrets `TWITCH_CLIENT_ID` et `TWITCH_CLIENT_SECRET` dans Supabase, la fonction utilise l'API officielle (titre, jeu, spectateurs).
- Planning : quand le Planner publie sur Discord, la fonction `quenquen-planner-publish` enregistre aussi les lives
  dans la table Supabase `qc_live_schedule` (elle remplace le planning précédent). L'accueil affiche le prochain live
  et les suivants ; un live disparaît 3 heures après son début, et le bloc est masqué si le planning est vide.
  Dans le Planner, la date s'écrit `18/10` et l'heure `20h30` (heure de Paris).
