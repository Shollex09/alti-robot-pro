#!/usr/bin/env python3
# Reconstruit apercu-en-ligne.html depuis index.html : l'hôte fournit lui-même
# <!doctype>, <html>, <head> et <body>, et le service worker n'a pas de sens en ligne.
import re
src = open('index.html', encoding='utf-8').read()

titre = '<title>Planning Urgences Mâcon</title>'
police = re.search(r'<link href="https://fonts\.googleapis\.com[^>]*>', src).group(0)
corps  = src[src.index('<style id="cssApp">'):src.rindex('</body>')]
# L'id est conservé : la feuille de style est relue par pageImprimable().
# L'hôte fournit lui-même la charpente : la frontière </head>/<body> disparaît.
assert 'id="cssApp"' in corps
assert corps.count('</style>\n</head>\n<body>\n') == 1
corps  = corps.replace('</style>\n</head>\n<body>\n', '</style>\n')

sw = re.search(r"\nif\('serviceWorker' in navigator\)\{\n.*?\n\}\n", corps, re.S)
assert sw, 'enregistrement du service worker introuvable'
corps = corps.replace(sw.group(0), '\n')

out = titre + '\n' + police + '\n' + corps.rstrip() + '\n'
# Les balises de structure ne doivent plus encadrer le document ; celles qui restent
# sont à l'intérieur d'une chaîne JavaScript (le document imprimable), sans effet ici.
assert not out.lower().lstrip().startswith('<!doctype')
assert '\n<body' not in out.lower() and '\n</body>' not in out.lower()
assert 'serviceWorker' not in out
open('apercu-en-ligne.html', 'w', encoding='utf-8').write(out)
print('aperçu régénéré :', len(out), 'caractères')
