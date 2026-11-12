/* Course en 2D dans un vrai navigateur : les voitures bougent, la radio de
   mi-course arrive à mi-course, la seconde moitié suit la décision, puis le
   débrief ; « Revoir la course » rejoue tout.
   Lancer : NODE_PATH=$(npm root -g) node tests/course2d.browser.js [dossier-captures] */
const {chromium} = require('playwright');
const path = require('path');
const sortie = process.argv[2] || '.';
const capture = nom => path.join(sortie, nom);

(async()=>{
  const b = await chromium.launch();
  const p = await (await b.newContext({viewport:{width:412, height:900}, deviceScaleFactor:2})).newPage();
  const err = [];
  p.on('pageerror', e=>err.push(e.message));
  // les polices Google ne sont pas joignables depuis tous les environnements
  p.on('console', m=>{ if(m.type()==='error' && !/favicon|fonts\.g|net::/.test(m.text())) err.push(m.text()); });
  await p.goto('file://'+(process.env.FICHIER || path.join(__dirname, '..', 'index.html')));
  await p.waitForTimeout(400);
  await p.click('[data-act="lancerPartie"]');
  await p.waitForTimeout(300);
  let ok = 0, ko = 0;
  const t = (nom, c, info) => { c ? ok++ : (ko++, console.log('  ÉCHEC :', nom, info===undefined?'':JSON.stringify(info))); };

  // une course avec événement de mi-course, en F3 à Spa
  let avecEvenement = false;
  for(let essai=0; essai<20 && !avecEvenement; essai++){
    await p.evaluate(()=>{
      if(!S.pilote){
        const c = S.monde.scoutPool[0];
        ACTIONS.signerPilote({id:c.id}); ACTIONS.confirmSignerPilote({id:c.id, proba:'1'});
      }
      if(!S.saison) demarrerSaison('f3', ecuriesPour('f3')[1].id);
      if(S.weekend) ACTIONS.finirWeekend();
      S.saison.calendrier[S.saison.courseIndex].nom = 'Spa-Francorchamps';
      ouvrirWeekend(); UI.tab = 'weekend';
      const w = S.weekend;
      while(w.etapes[w.etape]!=='course'){ if(w.etapes[w.etape]==='libres') choisirProgrammeEL('reglages'); else etapeSuivante(); }
      if(!w.grille) etapeSuivante();
      render();
    });
    await p.click('[data-act="lancerCourse"]');
    await p.waitForTimeout(100);
    avecEvenement = await p.evaluate(()=>!!S.weekend.evenement);
  }
  t('une course avec événement de mi-course a été lancée', avecEvenement);

  const avant = await p.evaluate(()=>{
    const v = document.querySelector('#c2dVoitures g[id^="veh-"]');
    return {scene: !!document.getElementById('c2dSvg'), carte: !!document.querySelector('.circuit-map'),
            radio: !!document.querySelector('[data-act="choixCourse"]'),
            nb: document.querySelectorAll('#c2dVoitures > g').length, grille: S.weekend.grille.length,
            id: v.id, tr: v.getAttribute('transform')};
  });
  t('la scène 2D s’affiche au départ', avant.scene);
  t('… à la place de la carte statique', !avant.carte);
  t('… avec toute la grille', avant.nb===avant.grille, avant);
  t('la radio ne parle pas avant la mi-course', !avant.radio);
  await p.screenshot({path:capture('c2d-1-depart.png')});
  await p.waitForTimeout(1500);
  const pendant = await p.evaluate(id=>({tr: document.getElementById(id).getAttribute('transform'),
    tour: document.getElementById('c2dTour').textContent, lignes: document.querySelectorAll('#c2dClassement li').length}), avant.id);
  t('les voitures avancent', pendant.tr!==avant.tr);
  t('compteur de tours et classement en direct', /^Tour \d+\/\d+$/.test(pendant.tour) && pendant.lignes>=8, pendant);
  await p.screenshot({path:capture('c2d-2-en-course.png')});

  // vitesse ×4 : la mi-course arrive, la radio appelle
  await p.click('[data-act="c2dVitesse"][data-v="4"]');
  await p.waitForFunction(()=>!!document.querySelector('[data-act="choixCourse"]'), null, {timeout:15000}).catch(()=>{});
  const mi = await p.evaluate(()=>({radio: !!document.querySelector('[data-act="choixCourse"]'), scene: !!document.getElementById('c2dSvg'),
    t: C2D && C2D.t, rang: [...document.querySelectorAll('#c2dClassement li.moi .p')].map(x=>x.textContent)[0],
    posMi: S.weekend.courseEtat && S.weekend.courseEtat.posMi}));
  t('à mi-course, la radio appelle sous la scène figée', mi.radio && mi.scene && mi.t===0.5, mi);
  t('le classement affiché correspond au rang cité par la radio', String(mi.posMi)===mi.rang, mi);
  await p.screenshot({path:capture('c2d-3-radio.png'), fullPage:true});

  await p.click('[data-act="choixCourse"]');
  await p.waitForTimeout(300);
  const reprise = await p.evaluate(()=>({scene: !!document.getElementById('c2dSvg'), anim: S.weekend.animCourse,
    debrief: document.getElementById('v-weekend').textContent.includes('Classement de la course')}));
  t('la seconde moitié se joue après la décision', reprise.scene && reprise.anim && reprise.anim.de===0.5, reprise);
  t('… le débrief attend l’arrivée', !reprise.debrief);
  await p.waitForFunction(()=>document.getElementById('v-weekend').textContent.includes('Classement de la course'), null, {timeout:20000}).catch(()=>{});
  const fin = await p.evaluate(()=>({debrief: document.getElementById('v-weekend').textContent.includes('Classement de la course'),
    revoir: !!document.querySelector('[data-act="revoirCourse"]'), scene: !!document.getElementById('c2dSvg')}));
  t('arrivée puis débrief, sans la scène', fin.debrief && !fin.scene, fin);
  t('« Revoir la course en 2D » est proposé', fin.revoir);
  await p.screenshot({path:capture('c2d-4-debrief.png')});

  await p.click('[data-act="revoirCourse"]');
  await p.waitForTimeout(400);
  await p.click('[data-act="c2dCam"][data-v="moi"]');
  await p.waitForTimeout(900);
  const revoir = await p.evaluate(()=>({scene: !!document.getElementById('c2dSvg'), vb: document.getElementById('c2dSvg').getAttribute('viewBox')}));
  t('« Revoir » rejoue la course, caméra sur mon pilote', revoir.scene && revoir.vb.split(' ').map(Number)[2] < 500, revoir);
  await p.screenshot({path:capture('c2d-5-camera.png')});
  await p.click('[data-act="c2dPasser"]');
  await p.waitForTimeout(300);
  t('« Passer » revient au débrief', await p.evaluate(()=>document.getElementById('v-weekend').textContent.includes('Classement de la course')));

  t('aucune erreur JavaScript', err.length===0, err.slice(0,3));
  console.log(`\n${ok} assertions OK, ${ko} échec(s)`);
  await b.close();
  process.exit(ko ? 1 : 0);
})();
