/* Charge le jeu (index.html) dans Node, sans navigateur : le script inline et
   le bundle DiceBear tournent dans un contexte vm muni d'un DOM minimal.
   Les fonctions du jeu sont accessibles via g.<nom> ; g.S et g.UI suivent
   l'état vivant (S est réaffecté par le jeu, d'où les accesseurs). */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const racine = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(racine, 'index.html'), 'utf8');
const vendor = fs.readFileSync(path.join(racine, 'vendor', 'dicebear.bundle.js'), 'utf8');
const debut = html.indexOf('<script>\n');
const fin = html.lastIndexOf('</script>');
if(debut < 0 || fin < 0) throw new Error('script principal introuvable dans index.html');
const script = html.slice(debut + '<script>\n'.length, fin);

function element(){
  const e = {
    innerHTML:'', textContent:'', value:'', hidden:false, style:{}, dataset:{},
    classList:{ add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    setAttribute(){}, getAttribute(){ return null; }, removeAttribute(){},
    addEventListener(){}, removeEventListener(){}, appendChild(){}, remove(){},
    querySelector(){ return element(); }, querySelectorAll(){ return []; },
    closest(){ return null; }, focus(){}, select(){}, scrollIntoView(){},
    getBoundingClientRect(){ return {width:400, height:300, top:0, left:0}; },
  };
  return e;
}
const elements = new Map();
const parSelecteur = s => { if(!elements.has(s)) elements.set(s, element()); return elements.get(s); };
const stockage = new Map();

const sandbox = {
  console, Math, Date, JSON, Intl, Promise, Map, Set, Array, Object, String, Number, Boolean, Error,
  setTimeout(){ return 0; }, clearTimeout(){}, setInterval(){ return 0; }, clearInterval(){},
  requestAnimationFrame(){ return 0; }, cancelAnimationFrame(){},
  performance: { now: () => Date.now() },
  navigator: {},
  localStorage: {
    getItem: k => stockage.has(k) ? stockage.get(k) : null,
    setItem: (k, v) => { stockage.set(k, String(v)); },
    removeItem: k => { stockage.delete(k); },
  },
  document: {
    querySelector: parSelecteur,
    querySelectorAll: () => [],
    getElementById: id => parSelecteur('#'+id),
    createElement: () => element(),
    addEventListener(){},
    body: element(), documentElement: element(),
  },
  addEventListener(){},
  matchMedia: () => ({ matches:false, addEventListener(){} }),
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(vendor, sandbox, {filename:'dicebear.bundle.js'});
vm.runInContext(script, sandbox, {filename:'index.html'});

/* `const`/`let` de premier niveau ne deviennent pas des propriétés du global :
   on les relit par une évaluation dans le même contexte. */
const g = new Proxy({}, {
  get(_, nom){
    if(nom === 'eval') return code => vm.runInContext(code, sandbox);
    if(nom === 'element') return parSelecteur;
    return vm.runInContext(`typeof ${String(nom)} === 'undefined' ? undefined : ${String(nom)}`, sandbox);
  },
  set(_, nom, v){ sandbox.__v = v; vm.runInContext(`${String(nom)} = __v`, sandbox); return true; },
});
module.exports = g;
