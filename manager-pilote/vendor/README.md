# vendor/

Bibliothèques tierces vendées localement : aucun appel réseau à l'exécution,
le jeu reste jouable hors ligne.

## dicebear.bundle.js

Bundle esbuild (IIFE, minifié) de `@dicebear/core` + `@dicebear/collection`
(style **Micah**), exposant `window.DicebearPersona.svgFor(seed, options)`.
Le nom de la fonction globale garde « Persona » pour l'historique, mais le
style utilisé est Micah depuis le retour « visages plus jolis, plus
réalistes » — voir plus bas.

- `@dicebear/core` et `@dicebear/collection` : MIT, © DiceBear contributors —
  <https://www.dicebear.com/>.
- Le style **Micah** (« Avatar Illustration System », par Micah Lanier) est
  une œuvre distincte, sous licence **CC BY 4.0** (attribution requise) —
  <https://www.figma.com/community/file/829741575478342595> /
  <https://creativecommons.org/licenses/by/4.0/>.
  L'attribution est faite une fois dans l'application, onglet
  Sauvegarde → Crédits, plutôt que répétée dans les métadonnées de chaque
  portrait généré (celles-ci sont retirées à l'affichage).

**Pourquoi Micah plutôt que Personas (premier choix) ou Notionists** :
Personas donnait des visages jugés trop simples/enfantins par l'utilisateur.
Notionists est CC0 (aucune attribution requise, plus proche de ce qui avait
été demandé au départ) mais son schéma n'a **aucune option de couleur** —
impossible d'y mettre la couleur d'écurie sur la combinaison. Micah a
`shirtColor`, un rendu plus adulte/soigné, et reste sous une licence libre
standard (CC BY 4.0, déjà correctement gérée pour Personas).

**Piège rencontré** : l'option `facialHair: 'beard'` de Micah se dessine
comme un aplat noir plein qui couvre tout le bas du visage — bien plus
proche d'une cagoule que d'une barbe dans cette illustration. Exclue ;
seule l'option `scruff` (repousse) est utilisée, sobre à tout âge.

Régénérer le bundle (versions figées à 9.4.2, la dernière compatible entre
core et collection au moment de l'écriture) :

```sh
mkdir -p /tmp/dicebear-build && cd /tmp/dicebear-build
npm init -y
npm install @dicebear/core@9.4.2 @dicebear/collection@9.4.2 esbuild@latest --save-dev
cat > glue.mjs <<'EOF'
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
function svgFor(seed, options){
  return createAvatar(micah, { seed, size: 360, ...options }).toString();
}
window.DicebearPersona = { svgFor };
EOF
./node_modules/.bin/esbuild glue.mjs --bundle --format=iife --platform=browser \
  --minify --outfile=dicebear.bundle.js
```

Puis copier `dicebear.bundle.js` ici.

## Tracés de circuits (dans index.html, pas dans ce dossier)

Les tracés réels (`TRACES_REELS`, dans le `<script>` principal de
`index.html`, section « Tracés de circuits ») viennent de
[bacinger/f1-circuits](https://github.com/bacinger/f1-circuits) (MIT,
© Tomislav Bacinger), au format GeoJSON, convertis en chemins SVG normalisés
par un script Node ponctuel (projection locale + mise à l'échelle dans un
viewBox commun `0 0 200 120`, sans dépendance à l'exécution). Le repo garde
seulement la longueur du circuit et le tracé en points ; toute couleur vient
du CSS (`stroke="currentColor"`).

**Wikimedia Commons, la source demandée à l'origine, est bloqué par la
politique réseau de cet environnement de développement** (`commons.wikimedia.org`
et `upload.wikimedia.org` renvoient un 403 côté proxy). f1-circuits est la
meilleure alternative trouvée : même exigence de licence libre, et des
géométries réelles plutôt que des images statiques à recolorer par filtre
CSS (plus fragile). Si Wikimedia redevient accessible, les fichiers SVG de
la catégorie
[SVG track maps of motorsport circuits](https://commons.wikimedia.org/wiki/Category:SVG_track_maps_of_motorsport_circuits)
restent une alternative à envisager, circuit par circuit (licences
individuelles à vérifier, généralement CC BY-SA).

Circuits sans tracé réel disponible (tout le karting, fictif ou sans donnée
ouverte connue, et Jarama, absent de f1-circuits) : tracé stylisé, généré
déterministiquement à partir du nom du circuit (`traceProcedurale` dans
index.html), clairement distingué du réel par la classe CSS `.stylise` et
l'absence du badge « tracé réel ».
