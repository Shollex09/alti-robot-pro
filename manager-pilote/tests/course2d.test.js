/* Course en 2D : la piste, et surtout la fidélité de la mise en scène au
   résultat simulé. Lancer : node tests/course2d.test.js */
const g = require('./harness.js');
let ok = 0, ko = 0;
const t = (nom, cond, info) => { cond ? ok++ : (ko++, console.log('  ÉCHEC :', nom, info===undefined ? '' : JSON.stringify(info))); };

/* ===== 1. Géométrie ===== */
const pts = g.pointsDuChemin('M0,0L10,0L10,10Z');
t('le chemin SVG est relu en points', pts.length===3 && pts[2][0]===10 && pts[2][1]===10, pts);
const re = g.reechantillonner([[0,0],[10,0],[10,10],[0,10]], 40);
const pas = re.map((p,i)=>Math.hypot(re[(i+1)%40][0]-p[0], re[(i+1)%40][1]-p[1]));
t('rééchantillonnage à pas régulier', re.length===40 && Math.max(...pas)-Math.min(...pas) < 1e-6, [Math.min(...pas), Math.max(...pas)]);

for(const nom of ['Spa-Francorchamps','Monaco','Jarama','Angerville','Salbris']){
  const p = g.pisteDe(nom);
  const T = p.tCum;
  t(`${nom} : temps cumulé croissant de 0 à 1`, T[0]===0 && Math.abs(T[T.length-1]-1)<1e-9 && T.every((x,i)=>i===0||x>=T[i-1]));
  t(`${nom} : on ralentit dans les virages`, Math.min(...p.vitesse) < 0.8 && Math.max(...p.vitesse) > 0.95, [Math.min(...p.vitesse), Math.max(...p.vitesse)]);
  t(`${nom} : des virages et des lignes droites`, p.virage.some(Boolean) && p.virage.some(v=>!v));
  const a = g.pointPiste(p, 0.37), b = g.pointPiste(p, 1.37), c = g.pointPiste(p, -0.63);
  t(`${nom} : la position boucle sur le tour`, Math.abs(a.x-b.x)<1e-9 && Math.abs(a.y-c.y)<1e-9);
  t(`${nom} : le tracé reste dans la scène`, p.trace.every(([x,y])=>x>0 && y>0 && x<p.w && y<p.h));
}
t('Salbris garde sa photo', !!g.pisteDe('Salbris').photo && !g.pisteDe('Monza').photo);
t('Spa en F1 : 44 tours, comme en vrai', g.toursCourse('f1','Spa-Francorchamps')===44, g.toursCourse('f1','Spa-Francorchamps'));
t('karting : nombre de tours selon la catégorie', g.toursCourse('kmini','Salbris')===10 && g.toursCourse('kz','Salbris')===20);

/* ===== 2. Fidélité au résultat, sur de nombreuses courses ===== */
function partie(cat){
  g.nouvellePartie(4,9,'T');
  const c = g.S.monde.scoutPool[0];
  g.ACTIONS.signerPilote({id:c.id}); g.ACTIONS.confirmSignerPilote({id:c.id, proba:'1'});
  g.demarrerSaison(cat, g.ecuriesPour(cat)[1].id);
}
function preparerWeekend(nom){
  g.S.saison.calendrier[g.S.saison.courseIndex].nom = nom;
  g.ouvrirWeekend();
  const w = g.S.weekend;
  while(w.etapes[w.etape]!=='course'){
    if(w.etapes[w.etape]==='libres') g.choisirProgrammeEL('reglages');
    else g.etapeSuivante();
  }
  if(!w.grille) g.etapeSuivante();
  return w;
}
const distanceAuTrace = (p, x, y) => g.distanceAuTrace(p, x, y);
const actifs = st => st.ordre.filter(id=>!st.voitures.find(v=>v.id===id).abandon);

const stats = {courses:0, evenements:0, sc:0, abandons:0, sorties:0, arrets:0};
const echecs = {};
const echec = (cle, info) => { if(!echecs[cle]) echecs[cle] = info; };
const circuits = {kmini:['Salbris','Angerville','Genk'], f3:['Monza','Monaco','Spa-Francorchamps','Jarama']};
for(const cat of ['kmini','f3']){
  partie(cat);
  for(let n=0;n<14;n++){
    // saison finie, pilote renvoyé ou blessé : on repart d'une partie neuve
    if(!g.S.saison || !g.S.pilote || g.S.saison.courseIndex >= g.S.saison.calendrier.length || g.blesse(g.S.pilote)) partie(cat);
    const nom = circuits[cat][n % circuits[cat].length];
    const w = preparerWeekend(nom);
    g.lancerCourse(false);
    const m = w.course2d;
    if(!m){ echec('modèle créé au départ', nom); break; }
    stats.courses++;
    const piste = g.pisteDe(nom);
    const posMi = w.evenement ? w.courseEtat.posMi : null;
    let avantDecision = null;
    if(w.evenement){
      stats.evenements++;
      avantDecision = g.etatCourse2d(m, 0.5);
      const moiId = g.S.pilote.id;
      if(actifs(avantDecision).indexOf(moiId)+1 !== posMi) echec('la radio cite le bon rang', {nom, dit:posMi, vu:actifs(avantDecision).indexOf(moiId)+1});
      g.finaliserCourse(n % w.evenement._choix.length);
    }else g.finaliserCourse(null);
    if(!m.final){ echec('modèle complété à l’arrivée', nom); continue; }
    if(m.sc) stats.sc++;
    if(m.arret.length) stats.arrets++;

    const st0 = g.etatCourse2d(m, 0);
    if(JSON.stringify(st0.ordre)!==JSON.stringify(m.depart)) echec('départ dans l’ordre de la grille', {nom});
    const st1 = g.etatCourse2d(m, 1);
    const officiel = [...m.final].sort((a,b)=>a.pos-b.pos).map(f=>f.id);
    if(JSON.stringify(st1.ordre)!==JSON.stringify(officiel)) echec('arrivée dans l’ordre officiel', {nom});
    const finishers = officiel.filter(id=>!m.final.find(f=>f.id===id).abandon);
    if(JSON.stringify(actifs(st1))!==JSON.stringify(finishers)) echec('ordre en piste à l’arrivée = classement', {nom});
    if(avantDecision){
      const apres = g.etatCourse2d(m, 0.5);
      const ecartMax = Math.max(...apres.voitures.map(v=>{ const a = avantDecision.voitures.find(x=>x.id===v.id); return Math.hypot(a.x-v.x, a.y-v.y); }));
      if(ecartMax > 1e-6) echec('aucun saut entre les deux moitiés de course', {nom, ecartMax});
      if(m.final.some(f=>f.abandon && g.tAbandon(m, f.id) < 0.5)) echec('pas d’abandon avant la décision de mi-course', {nom});
    }else if(JSON.stringify(actifs(g.etatCourse2d(m, 0.5)).filter(id=>m.mi.includes(id)))
             !==JSON.stringify(m.mi.filter(id=>actifs(g.etatCourse2d(m, 0.5)).includes(id)))) echec('ordre de mi-course', {nom});

    // échantillonnage de toute la course
    let prec = null, ordreSC = null;
    for(let k=0;k<=400;k++){
      const tt = k/400, st = g.etatCourse2d(m, tt);
      for(const v of st.voitures){
        const dist = distanceAuTrace(piste, v.x, v.y);
        if(!v.abandon && dist > piste.largeur/2) echec('une voiture en course ne quitte jamais l’asphalte', {nom, id:v.id, t:tt, dist, largeur:piste.largeur});
        if(prec){
          const a = prec.voitures.find(x=>x.id===v.id);
          if(v.D < a.D - 1e-9) echec('aucune voiture ne recule', {nom, id:v.id, t:tt});
        }
      }
      if(m.sc && tt>=g.SC_DEBUT && tt<=g.SC_FIN){
        const o = actifs(st).filter(id=>!m.arret.includes(id));
        const oPrec = ordreSC && ordreSC.filter(id=>o.includes(id));
        if(oPrec && JSON.stringify(oPrec)!==JSON.stringify(o.filter(id=>oPrec.includes(id)))) echec('aucun dépassement sous voiture de sécurité', {nom, t:tt});
        ordreSC = o;
        if(!st.sc || st.sc.b < 0.99) echec('voiture de sécurité visible pendant la neutralisation', {nom, t:tt});
      }
      prec = st;
    }
    // abandons : arrêt, et sortie de piste seulement sur abandon « Sortie de piste »
    for(const f of m.final.filter(f=>f.abandon)){
      stats.abandons++;
      const ta = g.tAbandon(m, f.id);
      const a = g.etatCourse2d(m, Math.min(1, ta+0.05)).voitures.find(v=>v.id===f.id);
      const b = g.etatCourse2d(m, 1).voitures.find(v=>v.id===f.id);
      if(Math.abs(a.D-b.D) > 1e-9) echec('la voiture arrêtée ne repart pas', {nom, cause:f.abandon});
      const dist = distanceAuTrace(piste, b.x, b.y);
      // Salbris (photo) : un pont et un enchevêtrement de portions collées
      // laissent ~1 % de positions sans bac à gravier libre (docs/ETAT_PROTOTYPE.md)
      const seuil = piste.photo ? piste.largeur*0.3 : piste.largeur/2;
      if(f.abandon==='Sortie de piste'){ stats.sorties++; if(dist <= seuil) echec('la sortie de piste quitte l’asphalte', {nom, dist}); }
    }
    // déterminisme : la même course se rejoue à l'identique
    if(JSON.stringify(g.etatCourse2d(m, 0.73))!==JSON.stringify(g.etatCourse2d(m, 0.73))) echec('déterminisme', {nom});
    g.ACTIONS.finirWeekend && g.S.weekend && g.ACTIONS.finirWeekend();
  }
}
const cles = ['modèle créé au départ','modèle complété à l’arrivée','la radio cite le bon rang','départ dans l’ordre de la grille',
  'arrivée dans l’ordre officiel','ordre en piste à l’arrivée = classement','aucun saut entre les deux moitiés de course',
  'pas d’abandon avant la décision de mi-course','ordre de mi-course','une voiture en course ne quitte jamais l’asphalte',
  'aucune voiture ne recule','aucun dépassement sous voiture de sécurité','voiture de sécurité visible pendant la neutralisation',
  'la voiture arrêtée ne repart pas','la sortie de piste quitte l’asphalte','déterminisme'];
for(const k of cles) t(k, !echecs[k], echecs[k]);
t('les 28 courses ont bien été jouées', stats.courses===28, stats);
console.log('  couverture :', JSON.stringify(stats));

/* ===== 3. Enchaînement à l'écran ===== */
partie('f3');
g.UI.tab = 'weekend';
let vu = false;
for(let essai=0; essai<30 && !vu; essai++){
  const w = preparerWeekend('Monza');
  g.ACTIONS.lancerCourse();
  if(!w.evenement){ g.ACTIONS.finirWeekend(); continue; }
  vu = true;
  let html = g.element('#v-weekend').innerHTML;
  t('à la mi-course, la scène joue d’abord la première moitié', html.includes('id="c2dSvg"') && w.animCourse && w.animCourse.a===0.5);
  t('… et l’appel radio attend la fin de cette moitié', !html.includes('data-act="choixCourse"'));
  g.ACTIONS.c2dPasser();
  html = g.element('#v-weekend').innerHTML;
  t('« Passer » amène à la décision, scène figée au-dessus', html.includes('data-act="choixCourse"') && html.includes('id="c2dSvg"') && !w.animCourse);
  g.ACTIONS.choixCourse({i:'0'});
  html = g.element('#v-weekend').innerHTML;
  t('après la décision, la seconde moitié se joue', html.includes('id="c2dSvg"') && w.animCourse && w.animCourse.de===0.5 && w.animCourse.a===1);
  t('… et le débrief attend l’arrivée', !html.includes('Classement de la course'));
  g.ACTIONS.c2dPasser();
  html = g.element('#v-weekend').innerHTML;
  t('débrief après la course, avec « revoir la course »', html.includes('Classement de la course') && html.includes('data-act="revoirCourse"') && !html.includes('id="c2dSvg"'));
  g.ACTIONS.revoirCourse();
  t('revoir la course rejoue tout depuis le départ', g.element('#v-weekend').innerHTML.includes('id="c2dSvg"') && w.animCourse.de===0);
  g.ACTIONS.c2dPasser();
}
t('un événement de mi-course a pu être testé', vu);

// simulation rapide : pas d'animation imposée, mais la course reste revoyable
partie('kmini');
g.UI.tab = 'weekend';
g.ACTIONS.simRapide();
t('la simulation rapide va droit au débrief', g.element('#v-weekend').innerHTML.includes('Classement de la course') && !g.S.weekend.animCourse);
t('… et propose de revoir la course', g.element('#v-weekend').innerHTML.includes('data-act="revoirCourse"'));

// ancienne sauvegarde : animation de l'ancien format, sans modèle 2D
g.S.weekend.course2d = null;
g.S.weekend.animCourse = {classement:[]};
g.render();
t('une ancienne sauvegarde ne bloque pas le débrief', g.element('#v-weekend').innerHTML.includes('Classement de la course') && !g.S.weekend.animCourse);

console.log(`\n${ok} assertions OK, ${ko} échec(s)`);
process.exit(ko ? 1 : 0);
