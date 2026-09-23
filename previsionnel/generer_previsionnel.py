import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as L
from openpyxl.comments import Comment
from openpyxl.chart import BarChart, LineChart, Reference

import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Previsionnel_location_mini-pelle.xlsx")

F = "Arial"
EUR = '#,##0 €;(#,##0 €);"-"'
EUR2 = '#,##0.00 €;(#,##0.00 €);"-"'
PCT = '0.0%;(0.0%);"-"'
NUM = '#,##0;(#,##0);"-"'
NUM1 = '#,##0.0;(#,##0.0);"-"'

f_norm = Font(name=F, size=10)
f_bold = Font(name=F, size=10, bold=True)
f_in = Font(name=F, size=10, color="0000FF")
f_link = Font(name=F, size=10, color="008000")
f_linkb = Font(name=F, size=10, color="008000", bold=True)
f_title = Font(name=F, size=14, bold=True, color="1F3864")
f_hdr = Font(name=F, size=10, bold=True, color="FFFFFF")
f_note = Font(name=F, size=9, italic=True, color="595959")
fill_hdr = PatternFill("solid", fgColor="1F3864")
fill_sec = PatternFill("solid", fgColor="D9E1F2")
fill_key = PatternFill("solid", fgColor="FFFF00")
fill_tot = PatternFill("solid", fgColor="F2F2F2")
thin = Side(style="thin", color="808080")
top_border = Border(top=thin)

wb = Workbook()


def setw(ws, widths):
    for col, w in widths.items():
        ws.column_dimensions[col].width = w


def cell(ws, ref, value, font=f_norm, fmt=None, fill=None, bold=None, align=None):
    c = ws[ref]
    c.value = value
    c.font = font
    if fmt:
        c.number_format = fmt
    if fill:
        c.fill = fill
    if align:
        c.alignment = align
    return c


def header_row(ws, row, labels, start_col=1):
    for i, lab in enumerate(labels):
        c = ws.cell(row=row, column=start_col + i, value=lab)
        c.font = f_hdr
        c.fill = fill_hdr
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)


def section(ws, row, text, ncols):
    for col in range(1, ncols + 1):
        ws.cell(row=row, column=col).fill = fill_sec
    c = ws.cell(row=row, column=1, value=text)
    c.font = f_bold


# =====================================================================
# 1. HYPOTHESES
# =====================================================================
wsH = wb.active
wsH.title = "Hypothèses"
setw(wsH, {"A": 50, "B": 14, "C": 14, "D": 14, "E": 12, "F": 70})
H = {}  # key -> absolute reference string


def href(key):
    return H[key]


cell(wsH, "A1", "HYPOTHÈSES DU PRÉVISIONNEL — tous montants en € HT", f_title)
cell(wsH, "A2", "Cellules en bleu = données saisies (modifiables). Surlignées en jaune = hypothèses clés à valider / compléter. "
     "Noir = calculs. Vert = liens vers une autre feuille.", f_note)

r = 4


def inp(key, label, value, unit="", note="", fmt=EUR, key_cell=False):
    global r
    cell(wsH, f"A{r}", label)
    c = cell(wsH, f"B{r}", value, f_in, fmt, fill_key if key_cell else None)
    cell(wsH, f"C{r}", unit, f_note)
    cell(wsH, f"F{r}", note, f_note)
    H[key] = f"'Hypothèses'!$B${r}"
    r += 1
    return c


section(wsH, r, "Général", 6); r += 1
inp("debut", "Date de démarrage de l'activité (1er mois)", datetime.date(2027, 1, 1), "",
    "Hypothèse : démarrage au 1er janvier 2027, à ajuster selon la date d'immatriculation.", "mm/yyyy", True)
inp("jours_ouvres", "Jours ouvrés par mois (capacité d'une machine)", 21, "jours",
    "Sert au calcul du taux d'utilisation de la mini-pelle.", NUM)
r += 1

section(wsH, r, "Investissements de départ (HT)", 6); r += 1
inp("inv_pelle", "Mini-pelle 2,5 t", 27500, "€ HT",
    "Donnée fournie : 25 000 à 30 000 € → milieu de fourchette retenu.", EUR, True)
inp("inv_remorque", "Remorque plateau d'occasion", 8000, "€ HT", "Donnée fournie : environ 8 000 € d'occasion.")
inp("inv_camion", "Petit camion benne d'occasion", 20000, "€ HT",
    "Donnée fournie : entre 15 000 et 25 000 € → milieu de fourchette retenu.", EUR, True)
inp("inv_materiel", "Matériel & équipements divers (godets, BRH, outillage, EPI...)", 5000, "€ HT",
    "Estimation : « matériel et équipement en tous genres ».", EUR, True)
inp("frais_etab", "Frais d'établissement (statuts, annonce légale, greffe, formalités)", 1200, "€",
    "Estimation. Comptabilisés en charges la 1re année.")
inp("treso_depart", "Trésorerie de départ (fonds de roulement)", 5000, "€",
    "Donnée fournie : « un peu de trésorerie de départ ». Montant à ajuster.", EUR, True)
r += 1

section(wsH, r, "Durées d'amortissement (linéaire)", 6); r += 1
inp("d_pelle", "Mini-pelle d'occasion", 5, "ans", "Usage courant pour un engin d'occasion (à valider avec la comptable).", NUM)
inp("d_remorque", "Remorque plateau", 5, "ans", "", NUM)
inp("d_camion", "Camion benne d'occasion", 5, "ans", "", NUM)
inp("d_materiel", "Matériel & équipements", 3, "ans", "Le petit matériel < 500 € HT par unité peut être passé directement en charges.", NUM)
r += 1

section(wsH, r, "Financement", 6); r += 1
inp("capital", "Capital social", 1000, "€", "Donnée fournie : 1 000 €, réparti 50/50 (500 € chacun).")
inp("cca", "Apports en compte courant d'associés", 10000, "€",
    "Hypothèse : 5 000 € par associé, remboursables quand la trésorerie le permet. Mettre 0 si aucun apport.", EUR, True)
inp("taux", "Taux de l'emprunt bancaire (annuel)", 0.042, "",
    "Hypothèse : taux professionnel indicatif 2026 pour un prêt matériel sur 5 ans. À remplacer par l'offre de la banque.", PCT, True)
inp("duree", "Durée de l'emprunt", 60, "mois", "Hypothèse : 5 ans, aligné sur la durée d'amortissement du matériel.", NUM)
inp("frais_dossier", "Frais de dossier bancaire + garantie", 500, "€", "Estimation.")
cell(wsH, f"A{r}", "Montant de l'emprunt nécessaire (calculé)")
H["emprunt_calc"] = f"'Hypothèses'!$B${r}"
r += 2

section(wsH, r, "Chiffre d'affaires — prix de vente (HT)", 6); r += 1
inp("prix_seche", "Location mini-pelle SANS opérateur (prix / jour)", 280, "€ HT / jour",
    "Donnée fournie : 250 à 350 € HT/jour → bas de fourchette retenu par prudence. Déplacements facturés en plus (non comptés).", EUR, True)
inp("prix_chauffeur", "Location mini-pelle AVEC opérateur (prix / journée de 7 h)", 750, "€ HT / jour",
    "Donnée fournie : 650 à 950 € HT pour 7 h hors déplacement → bas de fourchette retenu par prudence.", EUR, True)
inp("ca_travaux", "Travaux sur devis (terrassement, évacuation déchets, maçonnerie, élagage, espaces verts) — CA A1", 65000, "€ HT",
    "Objectif fourni : « envisager le double sur la société » → 65 k€ de location + 65 k€ de travaux = 130 k€.", EUR, True)
inp("g2", "Croissance d'activité année 2", 0.15, "", "Hypothèse.", PCT, True)
inp("g3", "Croissance d'activité année 3", 0.10, "", "Hypothèse.", PCT, True)
cell(wsH, f"A{r}", "→ Le nombre de jours loués par mois et la saisonnalité des travaux se saisissent dans la feuille « Activité A1 ».", f_note)
r += 2

section(wsH, r, "Charges variables", 6); r += 1
inp("taux_achats", "Achats de matériaux / fournitures refacturés (en % du CA travaux)", 0.30, "",
    "Hypothèse : gravier, sable, béton, tuyaux, mise en décharge…", PCT, True)
inp("carbu_jour", "Carburant (GNR) par jour de location AVEC opérateur", 30, "€ HT / jour",
    "Hypothèse : ~3 L/h × 7 h × ~1,45 € HT/L. En location sèche, le client fait le plein.", EUR)
inp("entretien_jour", "Usure / entretien variable par jour de location", 10, "€ HT / jour",
    "Hypothèse : chenilles, godets, graissage, flexibles, provision au jour loué.", EUR)
inp("taux_carbu_travaux", "Carburant & usure camion/engins sur travaux (en % du CA travaux)", 0.06, "", "Hypothèse.", PCT)
r += 1

section(wsH, r, "Rémunération des associés", 6); r += 1
inp("nb_assoc", "Nombre d'associés rémunérés", 2, "", "Donnée fournie : 2 associés à 50/50.", NUM)
header_row(wsH, r, ["", "Année 1", "Année 2", "Année 3"])
r += 1
cell(wsH, f"A{r}", "Rémunération NETTE mensuelle par associé")
for j, v in enumerate([1000, 1500, 2000]):
    cell(wsH, f"{L(2+j)}{r}", v, f_in, EUR, fill_key)
cell(wsH, f"F{r}", "Hypothèse : vous ne vous verserez pas forcément de salaire au début → 1 000 € net/mois en A1 "
     "à partir du mois indiqué ci-dessous. Mettre 0 pour tester sans rémunération.", f_note)
H["rem_row"] = r
r += 1
inp("rem_debut", "Mois de début de la rémunération en année 1 (1 à 12)", 4, "mois n°",
    "Hypothèse : pas de rémunération les 3 premiers mois.", NUM, True)
inp("taux_cotis", "Cotisations sociales (en % de la rémunération nette)", 0.45, "",
    "Hypothèse SARL avec gérance majoritaire (TNS) ≈ 45 %. En SAS (président assimilé salarié) compter ≈ 75–82 %. "
    "Voir la feuille « Lisez-moi ».", PCT, True)
r += 1

section(wsH, r, "Fiscalité", 6); r += 1
inp("tva", "Taux de TVA", 0.20, "", "Taux normal.", PCT)
inp("is_reduit", "IS — taux réduit PME", 0.15, "", "Taux réduit applicable jusqu'au plafond ci-dessous (capital entièrement libéré, détenu ≥ 75 % par des personnes physiques).", PCT)
inp("is_plafond", "IS — plafond du taux réduit", 42500, "€", "Plafond du bénéfice imposable au taux réduit.")
inp("is_normal", "IS — taux normal", 0.25, "", "", PCT)
inp("mois_remb_tva", "Mois de remboursement du crédit de TVA (0 = pas de demande)", 3, "mois n°",
    "Hypothèse : demande de remboursement (formulaire 3519) après la 1re déclaration, remboursé le mois 3. Mettre 0 pour simple report.", NUM, True)
inp("relais_tva", "Crédit relais TVA sur investissements (1 = oui, 0 = non)", 1, "",
    "Hypothèse : la banque préfinance la TVA des investissements ; le relais est soldé à réception du remboursement de TVA.", "0", True)
r += 1

section(wsH, r, "Charges fixes annuelles (HT)", 6); r += 1
header_row(wsH, r, ["Poste", "Année 1", "Année 2", "Année 3", "TVA ? (1/0)", "Commentaire"])
r += 1
fixed = [
    ("Assurance RC pro + décennale (terrassement)", 3000, 3000, 3000, 0, "Estimation — demander des devis (obligatoire pour les travaux)."),
    ("Assurance mini-pelle (bris de machine, vol)", 1200, 1200, 1200, 0, "Estimation."),
    ("Assurance camion + remorque", 1500, 1500, 1500, 0, "Estimation."),
    ("Entretien / réparations (forfait annuel)", 2500, 3000, 3500, 1, "Matériel d'occasion : prévoir une enveloppe croissante."),
    ("VGP mini-pelle + contrôle technique camion", 400, 400, 400, 1, "Vérification générale périodique obligatoire des engins."),
    ("Expert-comptable", 2400, 2400, 2400, 1, "Estimation — à ajuster avec la lettre de mission."),
    ("Frais bancaires + terminal de paiement", 600, 600, 600, 0, "Estimation."),
    ("Téléphone / internet (2 lignes)", 720, 720, 720, 1, "Estimation."),
    ("Publicité, site internet, panneaux, annonces", 1500, 1000, 1000, 1, "Lancement plus important en année 1."),
    ("Petit outillage & EPI", 1200, 1200, 1200, 1, "Estimation."),
    ("Location dépôt / stockage du matériel", 0, 0, 0, 1, "À COMPLÉTER si le matériel n'est pas stocké chez un associé."),
    ("Déplacements, péages", 600, 600, 600, 1, "Estimation."),
    ("Logiciel de facturation / devis", 300, 300, 300, 1, "Estimation."),
    ("CFE (cotisation foncière des entreprises)", 0, 500, 500, 0, "Exonérée l'année de création ; montant variable selon la commune."),
    ("Divers & imprévus", 1500, 1500, 1500, 1, "Marge de sécurité."),
]
H["fix_first"] = r
for lab, a1, a2, a3, t, note in fixed:
    cell(wsH, f"A{r}", lab)
    for j, v in enumerate([a1, a2, a3]):
        cell(wsH, f"{L(2+j)}{r}", v, f_in, EUR, fill_key if "COMPLÉTER" in note else None)
    cell(wsH, f"E{r}", t, f_in, "0")
    cell(wsH, f"F{r}", note, f_note)
    if lab.startswith("Assurance mini-pelle"):
        H["ass_pelle_row"] = r
    if lab.startswith("VGP"):
        H["vgp_row"] = r
    if lab.startswith("Entretien"):
        H["entr_row"] = r
    r += 1
H["fix_last"] = r - 1
cell(wsH, f"A{r}", "Total charges fixes externes", f_bold, fill=fill_tot)
for j in range(3):
    col = L(2 + j)
    cell(wsH, f"{col}{r}", f"=SUM({col}{H['fix_first']}:{col}{H['fix_last']})", f_bold, EUR, fill_tot)
H["fix_tot_row"] = r
r += 1

# =====================================================================
# 2. FINANCEMENT (plan de financement + emprunt)
# =====================================================================
wsF = wb.create_sheet("Financement")
setw(wsF, {"A": 44, "B": 14, "C": 4, "D": 44, "E": 14, "F": 4, "G": 10, "H": 14, "I": 14, "J": 14, "K": 14, "L": 14, "M": 8})
cell(wsF, "A1", "PLAN DE FINANCEMENT INITIAL & EMPRUNT", f_title)
header_row(wsF, 3, ["Besoins (HT)", "Montant"])
header_row(wsF, 3, ["Ressources", "Montant"], start_col=4)
besoins = [("Mini-pelle d'occasion", "inv_pelle"), ("Remorque plateau", "inv_remorque"),
           ("Camion benne", "inv_camion"), ("Matériel & équipements", "inv_materiel"),
           ("Frais d'établissement", "frais_etab"), ("Frais de dossier bancaire", "frais_dossier"),
           ("Trésorerie de départ", "treso_depart")]
for i, (lab, k) in enumerate(besoins):
    cell(wsF, f"A{4+i}", lab)
    cell(wsF, f"B{4+i}", f"={href(k)}", f_link, EUR)
rb = 4 + len(besoins)
cell(wsF, f"A{rb}", "TOTAL DES BESOINS", f_bold, fill=fill_tot)
cell(wsF, f"B{rb}", f"=SUM(B4:B{rb-1})", f_bold, EUR, fill_tot)
cell(wsF, f"A{rb+1}", "TVA sur investissements à avancer (récupérée ensuite)", f_note)
cell(wsF, f"B{rb+1}", f"=SUM(B4:B7)*{href('tva')}", f_note, EUR)
cell(wsF, "D4", "Capital social")
cell(wsF, "E4", f"={href('capital')}", f_link, EUR)
cell(wsF, "D5", "Apports en compte courant d'associés")
cell(wsF, "E5", f"={href('cca')}", f_link, EUR)
cell(wsF, "D6", "Emprunt bancaire (solde à financer)", f_bold)
cell(wsF, "E6", f"=MAX(0,B{rb}-E4-E5)", f_bold, EUR, fill_key)
cell(wsF, f"D{rb}", "TOTAL DES RESSOURCES", f_bold, fill=fill_tot)
cell(wsF, f"E{rb}", f"=SUM(E4:E6)", f_bold, EUR, fill_tot)
cell(wsF, f"D{rb+1}", "Taux d'apport personnel", f_note)
cell(wsF, f"E{rb+1}", f"=IF(E{rb}=0,0,(E4+E5)/E{rb})", f_note, PCT)
FIN_TOTAL = f"'Financement'!$B${rb}"
EMPRUNT = "'Financement'!$E$6"
wsH[H["emprunt_calc"].split("!")[1].replace("$", "")].value = f"={EMPRUNT}"
wsH[H["emprunt_calc"].split("!")[1].replace("$", "")].font = f_link
wsH[H["emprunt_calc"].split("!")[1].replace("$", "")].number_format = EUR
cell(wsH, "F" + H["emprunt_calc"].split("$")[-1], "Total des besoins − capital − apports (feuille Financement).", f_note)

rr = rb + 3
cell(wsF, f"A{rr}", "Caractéristiques de l'emprunt", f_bold)
cell(wsF, f"A{rr+1}", "Montant emprunté"); cell(wsF, f"B{rr+1}", f"={EMPRUNT}", f_norm, EUR)
cell(wsF, f"A{rr+2}", "Taux annuel"); cell(wsF, f"B{rr+2}", f"={href('taux')}", f_link, PCT)
cell(wsF, f"A{rr+3}", "Durée (mois)"); cell(wsF, f"B{rr+3}", f"={href('duree')}", f_link, NUM)
cell(wsF, f"A{rr+4}", "Mensualité (capital + intérêts)", f_bold)
cell(wsF, f"B{rr+4}", f"=IF(B{rr+1}=0,0,PMT(B{rr+2}/12,B{rr+3},-B{rr+1}))", f_bold, EUR2, fill_key)
cell(wsF, f"A{rr+5}", "Coût total du crédit (intérêts)")
cell(wsF, f"B{rr+5}", f"=B{rr+4}*B{rr+3}-B{rr+1}", f_norm, EUR)
MENSU = f"'Financement'!$B${rr+4}"

# annual summary
ra = rr + 8
cell(wsF, f"A{ra}", "Synthèse annuelle de l'emprunt", f_bold)
header_row(wsF, ra + 1, ["Année", "Intérêts", "Capital remboursé", "Capital restant dû fin"], start_col=1)
# columns A,B,C,D -> reuse
EMP_ANN = {}
for y in range(1, 6):
    row = ra + 1 + y
    cell(wsF, f"A{row}", f"Année {y}")
    cell(wsF, f"B{row}", f"=SUMIFS($J:$J,$G:$G,{y})", f_norm, EUR)
    cell(wsF, f"C{row}", f"=SUMIFS($K:$K,$G:$G,{y})", f_norm, EUR)
    cell(wsF, f"D{row}", f"=IFERROR(INDEX($L:$L,MATCH({y}*12,$H:$H,0)),0)", f_norm, EUR)
    EMP_ANN[y] = row

# monthly schedule in G..L
cell(wsF, "G3", "Tableau d'amortissement mensuel", f_bold)
header_row(wsF, 4, ["Année", "Mois n°", "Capital début", "Intérêts", "Capital remb.", "Capital fin"], start_col=7)
SCHED0 = 5
for n in range(1, 61):
    row = SCHED0 + n - 1
    cell(wsF, f"G{row}", f"=INT((H{row}-1)/12)+1", f_norm, "0")
    cell(wsF, f"H{row}", n, f_norm, "0")
    cell(wsF, f"I{row}", f"=$B${rr+1}" if n == 1 else f"=L{row-1}", f_norm, EUR)
    cell(wsF, f"J{row}", f"=IF(H{row}>$B${rr+3},0,I{row}*$B${rr+2}/12)", f_norm, EUR2)
    cell(wsF, f"K{row}", f"=IF(H{row}>$B${rr+3},0,MIN(I{row},$B${rr+4}-J{row}))", f_norm, EUR2)
    cell(wsF, f"L{row}", f"=I{row}-K{row}", f_norm, EUR)
cell(wsF, f"G{SCHED0+61}", "Durée > 60 mois : prolonger le tableau.", f_note)

# =====================================================================
# 3. AMORTISSEMENTS
# =====================================================================
wsA = wb.create_sheet("Amortissements")
setw(wsA, {"A": 34, "B": 14, "C": 10, "D": 14, "E": 14, "F": 14, "G": 16})
cell(wsA, "A1", "TABLEAU DES AMORTISSEMENTS (linéaire, acquisition au 1er mois)", f_title)
header_row(wsA, 3, ["Immobilisation", "Valeur HT", "Durée (ans)", "Dotation A1", "Dotation A2", "Dotation A3", "VNC fin A3"])
assets = [("Mini-pelle d'occasion", "inv_pelle", "d_pelle"), ("Remorque plateau", "inv_remorque", "d_remorque"),
          ("Camion benne", "inv_camion", "d_camion"), ("Matériel & équipements", "inv_materiel", "d_materiel")]
for i, (lab, v, d) in enumerate(assets):
    row = 4 + i
    cell(wsA, f"A{row}", lab)
    cell(wsA, f"B{row}", f"={href(v)}", f_link, EUR)
    cell(wsA, f"C{row}", f"={href(d)}", f_link, NUM)
    for y in range(1, 4):
        col = L(3 + y)
        cell(wsA, f"{col}{row}", f"=IF(C{row}>={y},B{row}/C{row},0)", f_norm, EUR)
    cell(wsA, f"G{row}", f"=B{row}-SUM(D{row}:F{row})", f_norm, EUR)
cell(wsA, "A8", "TOTAL", f_bold, fill=fill_tot)
for col in "BDEFG":
    cell(wsA, f"{col}8", f"=SUM({col}4:{col}7)", f_bold, EUR, fill_tot)
cell(wsA, "C8", None, fill=fill_tot)
AMORT = {1: "'Amortissements'!$D$8", 2: "'Amortissements'!$E$8", 3: "'Amortissements'!$F$8"}
AMORT_PELLE = "'Amortissements'!$D$4"

# =====================================================================
# 4. ACTIVITE A1 (mensuel)
# =====================================================================
wsV = wb.create_sheet("Activité A1")
setw(wsV, {"A": 46, **{L(c): 10.5 for c in range(2, 14)}, "N": 12})
cell(wsV, "A1", "ACTIVITÉ MENSUELLE — ANNÉE 1", f_title)
cell(wsV, "A2", "Saisir en bleu le nombre de jours loués par mois (la saisonnalité TP est plus faible en hiver et en août).", f_note)
header_row(wsV, 4, ["Mois"] + [""] * 12 + ["Total A1"])
for m in range(1, 13):
    c = wsV.cell(row=4, column=1 + m, value=f"=EDATE({href('debut')},{m-1})")
    c.number_format = "mmm-yy"
seche = [4, 5, 7, 9, 10, 10, 9, 6, 10, 10, 7, 5]
chauf = [2, 3, 4, 5, 6, 6, 5, 3, 6, 6, 4, 3]
saison = [0.04, 0.05, 0.08, 0.10, 0.10, 0.10, 0.09, 0.05, 0.11, 0.11, 0.09, 0.08]
rows_V = {}


def vrow(row, label, key, values=None, formula=None, fmt=EUR, font=f_norm, total=True, fill=None):
    cell(wsV, f"A{row}", label, font if font is f_bold else f_norm, fill=fill)
    for m in range(1, 13):
        col = L(1 + m)
        if values is not None:
            cell(wsV, f"{col}{row}", values[m - 1], f_in, fmt)
        else:
            cell(wsV, f"{col}{row}", formula(col), font, fmt, fill)
    if total:
        cell(wsV, f"N{row}", f"=SUM(B{row}:M{row})", f_bold, fmt, fill_tot)
    rows_V[key] = row


vrow(5, "Jours de location SANS opérateur", "js", values=seche, fmt=NUM)
vrow(6, "Jours de location AVEC opérateur", "jc", values=chauf, fmt=NUM)
vrow(7, "Total jours de location de la mini-pelle", "jt", formula=lambda c: f"={c}5+{c}6", fmt=NUM, font=f_bold)
vrow(8, "Taux d'utilisation (jours loués / jours ouvrés)", "tu",
     formula=lambda c: f"=IF({href('jours_ouvres')}=0,0,{c}7/{href('jours_ouvres')})", fmt=PCT, total=False)
cell(wsV, "N8", f"=IF({href('jours_ouvres')}=0,0,N7/(12*{href('jours_ouvres')}))", f_bold, PCT, fill_tot)
vrow(10, "CA location sans opérateur", "cas", formula=lambda c: f"={c}5*{href('prix_seche')}")
vrow(11, "CA location avec opérateur", "cac", formula=lambda c: f"={c}6*{href('prix_chauffeur')}")
vrow(12, "CA LOCATION", "cal", formula=lambda c: f"={c}10+{c}11", font=f_bold)
vrow(14, "Saisonnalité des travaux annexes (% du CA annuel)", "sais", values=saison, fmt=PCT)
cell(wsV, "O14", '=IF(ROUND(N14,4)=1,"OK","≠ 100 % !")', f_bold)
vrow(15, "CA TRAVAUX ANNEXES", "cat", formula=lambda c: f"={c}14*{href('ca_travaux')}", font=f_bold)
vrow(17, "CHIFFRE D'AFFAIRES TOTAL HT", "ca", formula=lambda c: f"={c}12+{c}15", font=f_bold, fill=fill_sec)
cell(wsV, "A19", "Objectif location année 1 (donnée fournie)", f_norm)
cell(wsV, "N19", 65000, f_in, EUR)
cell(wsV, "A20", "Écart CA location / objectif", f_norm)
cell(wsV, "N20", "=N12-N19", f_bold, EUR)
cell(wsV, "A22", "Point de vigilance : la mini-pelle sert aussi sur vos propres chantiers (travaux annexes). "
     "Les jours de chantier réduisent les jours disponibles à la location — surveiller le taux d'utilisation (ligne 8).", f_note)
V = lambda key, col="N": f"'Activité A1'!${col}${rows_V[key]}"

# =====================================================================
# 5. COMPTE DE RESULTAT (3 ans)
# =====================================================================
wsR = wb.create_sheet("Compte de résultat")
setw(wsR, {"A": 52, "B": 14, "C": 14, "D": 14, "E": 60})
cell(wsR, "A1", "COMPTE DE RÉSULTAT PRÉVISIONNEL (€ HT)", f_title)
header_row(wsR, 3, ["", "Année 1", "Année 2", "Année 3", "Commentaire"])
R = {}
row = 4


def rline(key, label, formulas, bold=False, fmt=EUR, note="", fill=None, link=False):
    global row
    cell(wsR, f"A{row}", label, f_bold if bold else f_norm, fill=fill)
    for j, fml in enumerate(formulas):
        font = f_linkb if (link and bold) else f_link if link else (f_bold if bold else f_norm)
        cell(wsR, f"{L(2+j)}{row}", fml, font, fmt, fill)
    if note:
        cell(wsR, f"E{row}", note, f_note)
    R[key] = row
    row += 1


def grow(key):  # A2, A3 formulas scaling A1 by growth
    rr_ = R[key] if key in R else None
    return None


section(wsR, row, "PRODUITS", 5); row += 1
rline("ca_loc", "CA location mini-pelle", [f"={V('cal')}", f"=B{row}*(1+{href('g2')})", f"=C{row}*(1+{href('g3')})"],
      note="A1 = feuille Activité ; A2/A3 = croissance.")
rline("ca_trav", "CA travaux annexes", [f"={V('cat')}", f"=B{row}*(1+{href('g2')})", f"=C{row}*(1+{href('g3')})"])
rline("ca", "CHIFFRE D'AFFAIRES", [f"=B{R['ca_loc']}+B{R['ca_trav']}", f"=C{R['ca_loc']}+C{R['ca_trav']}",
                                   f"=D{R['ca_loc']}+D{R['ca_trav']}"], bold=True, fill=fill_tot)
row += 1
section(wsR, row, "CHARGES VARIABLES", 5); row += 1
rline("achats", "Achats matériaux / fournitures (travaux)",
      [f"={c}{R['ca_trav']}*{href('taux_achats')}" for c in "BCD"])
rline("carbu", "Carburant & usure (location avec opérateur + travaux)",
      [f"={V('jc')}*{href('carbu_jour')}+B{R['ca_trav']}*{href('taux_carbu_travaux')}",
       f"=B{row}*(1+{href('g2')})", f"=C{row}*(1+{href('g3')})"])
rline("usure", "Usure / entretien variable mini-pelle",
      [f"={V('jt')}*{href('entretien_jour')}", f"=B{row}*(1+{href('g2')})", f"=C{row}*(1+{href('g3')})"])
rline("cv", "Total charges variables", [f"=SUM({c}{R['achats']}:{c}{R['usure']})" for c in "BCD"], bold=True, fill=fill_tot)
rline("mcv", "MARGE SUR COÛTS VARIABLES", [f"={c}{R['ca']}-{c}{R['cv']}" for c in "BCD"], bold=True)
rline("tmcv", "Taux de marge sur coûts variables", [f"=IF({c}{R['ca']}=0,0,{c}{R['mcv']}/{c}{R['ca']})" for c in "BCD"], fmt=PCT)
row += 1
section(wsR, row, "CHARGES FIXES", 5); row += 1
fr = H["fix_tot_row"]
rline("ext", "Charges externes fixes (assurances, comptable, entretien...)",
      [f"='Hypothèses'!{c}${fr}" for c in "BCD"], link=True, note="Détail dans la feuille Hypothèses.")
rline("fetab", "Frais d'établissement", [f"={href('frais_etab')}", 0, 0], link=True)
remr = H["rem_row"]
rline("rem", "Rémunération nette des associés",
      [f"='Hypothèses'!B${remr}*{href('nb_assoc')}*MAX(0,13-{href('rem_debut')})",
       f"='Hypothèses'!C${remr}*{href('nb_assoc')}*12", f"='Hypothèses'!D${remr}*{href('nb_assoc')}*12"],
      note="A1 : à partir du mois de début saisi dans les hypothèses.")
rline("cotis", "Cotisations sociales des dirigeants", [f"={c}{R['rem']}*{href('taux_cotis')}" for c in "BCD"])
rline("ebe", "EXCÉDENT BRUT D'EXPLOITATION (EBE)",
      [f"={c}{R['mcv']}-{c}{R['ext']}-{c}{R['fetab']}-{c}{R['rem']}-{c}{R['cotis']}" for c in "BCD"], bold=True, fill=fill_tot)
rline("amort", "Dotations aux amortissements", [f"={AMORT[y]}" for y in (1, 2, 3)], link=True)
rline("rex", "RÉSULTAT D'EXPLOITATION", [f"={c}{R['ebe']}-{c}{R['amort']}" for c in "BCD"], bold=True)
rline("interets", "Charges financières (intérêts + frais de dossier en A1)",
      [f"='Financement'!$B${EMP_ANN[1]}+{href('frais_dossier')}", f"='Financement'!$B${EMP_ANN[2]}",
       f"='Financement'!$B${EMP_ANN[3]}"], link=True)
rline("rai", "RÉSULTAT AVANT IMPÔT", [f"={c}{R['rex']}-{c}{R['interets']}" for c in "BCD"], bold=True, fill=fill_tot)
# deficits reportables
R_def = row + 1  # computed below (placeholder)
rline("base_is", "Base imposable à l'IS (après report des déficits)",
      [f"=MAX(0,B{R['rai']})", f"=MAX(0,C{R['rai']}-B{R_def+1})", f"=MAX(0,D{R['rai']}-C{R_def+1})"])
rline("is", "Impôt sur les sociétés",
      [f"=MIN({c}{R['base_is']},{href('is_plafond')})*{href('is_reduit')}+MAX(0,{c}{R['base_is']}-{href('is_plafond')})*{href('is_normal')}"
       for c in "BCD"])
assert row == R_def + 1
rline("deficit", "Déficit reportable en fin d'année",
      [f"=MAX(0,-B{R['rai']})", f"=MAX(0,B{row}-C{R['rai']})", f"=MAX(0,C{row}-D{R['rai']})"], note="Info : déficits imputés sur les bénéfices suivants.")
rline("rn", "RÉSULTAT NET", [f"={c}{R['rai']}-{c}{R['is']}" for c in "BCD"], bold=True, fill=fill_sec)
rline("tx_rn", "Résultat net / CA", [f"=IF({c}{R['ca']}=0,0,{c}{R['rn']}/{c}{R['ca']})" for c in "BCD"], fmt=PCT)
row += 1
section(wsR, row, "CAPACITÉ D'AUTOFINANCEMENT", 5); row += 1
rline("caf", "CAF (résultat net + amortissements)", [f"={c}{R['rn']}+{c}{R['amort']}" for c in "BCD"], bold=True)
rline("remb", "Remboursement du capital de l'emprunt",
      [f"='Financement'!$C${EMP_ANN[y]}" for y in (1, 2, 3)], link=True)
rline("autof", "Trésorerie dégagée après remboursement", [f"={c}{R['caf']}-{c}{R['remb']}" for c in "BCD"], bold=True, fill=fill_tot,
      note="Doit rester positive : c'est ce que la banque regarde en premier.")
rline("couv", "Couverture des annuités (CAF / capital remboursé)",
      [f"=IF({c}{R['remb']}=0,0,{c}{R['caf']}/{c}{R['remb']})" for c in "BCD"], fmt='0.00"x"')
# fix deficit reference in base_is: deficit row is R['deficit']; we used R_def+1 == R['deficit']
assert R["deficit"] == R_def + 1
RC = lambda key, c="B": f"'Compte de résultat'!${c}${R[key]}"

# =====================================================================
# 6. TRESORERIE A1 (mensuel, TTC)
# =====================================================================
wsT = wb.create_sheet("Trésorerie A1")
setw(wsT, {"A": 50, **{L(c): 10.5 for c in range(2, 14)}, "N": 12})
cell(wsT, "A1", "PLAN DE TRÉSORERIE MENSUEL — ANNÉE 1 (montants TTC)", f_title)
cell(wsT, "A2", "Hypothèses : investissements et apports au mois 1 ; location payée comptant ; travaux encaissés à 30 jours (mois suivant) ; "
     "TVA sur les encaissements (prestations de services), déclarée mensuellement et payée le mois suivant ; TVA des investissements préfinancée par un crédit relais, "
     "soldé au remboursement du crédit de TVA ; "
     "IS de l'année 1 payé en année 2.", f_note)
wsT["A2"].alignment = Alignment(wrap_text=True, vertical="top")
wsT.merge_cells("A2:N2")
wsT.row_dimensions[2].height = 38
header_row(wsT, 4, ["Mois"] + [""] * 12 + ["Total A1"])
for m in range(1, 13):
    c = wsT.cell(row=4, column=1 + m, value=f"='Activité A1'!{L(1+m)}4")
    c.number_format = "mmm-yy"
    c.font = Font(name=F, size=10, bold=True, color="FFFFFF")
T = {}
tva = href("tva")


def trow(row, key, label, formula, bold=False, fill=None, total=True, fmt=EUR):
    cell(wsT, f"A{row}", label, f_bold if bold else f_norm, fill=fill)
    for m in range(1, 13):
        col = L(1 + m)
        fml = formula(m, col)
        cell(wsT, f"{col}{row}", fml, f_bold if bold else f_norm, fmt, fill)
    if total:
        cell(wsT, f"N{row}", f"=SUM(B{row}:M{row})", f_bold, fmt, fill_tot)
    T[key] = row


def prevcol(col):
    return L(ord(col) - 64 - 1) if len(col) == 1 else None


section(wsT, 5, "ENCAISSEMENTS", 14)
trow(6, "e_cap", "Apport en capital", lambda m, c: f"={href('capital')}" if m == 1 else 0)
trow(7, "e_cca", "Apports en compte courant d'associés", lambda m, c: f"={href('cca')}" if m == 1 else 0)
TVA_INV = f"'Financement'!$B${rb+1}"
trow(8, "e_emp", "Déblocage de l'emprunt + crédit relais TVA", lambda m, c: f"={EMPRUNT}+{href('relais_tva')}*{TVA_INV}" if m == 1 else 0)
trow(9, "e_loc", "Encaissements location (TTC)", lambda m, c: f"='Activité A1'!{c}12*(1+{tva})")
trow(10, "e_trav", "Encaissements travaux (TTC, à 30 jours)",
     lambda m, c: 0 if m == 1 else f"='Activité A1'!{L(m)}15*(1+{tva})")
trow(11, "e_tot", "TOTAL ENCAISSEMENTS", lambda m, c: f"=SUM({c}6:{c}10)", bold=True, fill=fill_tot)

section(wsT, 13, "DÉCAISSEMENTS", 14)
inv_sum = f"({href('inv_pelle')}+{href('inv_remorque')}+{href('inv_camion')}+{href('inv_materiel')})"
trow(14, "d_inv", "Investissements (TTC)", lambda m, c: f"={inv_sum}*(1+{tva})" if m == 1 else 0)
trow(15, "d_etab", "Frais d'établissement + frais de dossier",
     lambda m, c: f"={href('frais_etab')}+{href('frais_dossier')}" if m == 1 else 0)
trow(16, "d_ach", "Achats matériaux travaux (TTC)",
     lambda m, c: f"='Activité A1'!{c}15*{href('taux_achats')}*(1+{tva})")
trow(17, "d_carb", "Carburant & usure (TTC)",
     lambda m, c: f"=('Activité A1'!{c}6*{href('carbu_jour')}+'Activité A1'!{c}15*{href('taux_carbu_travaux')}"
                  f"+'Activité A1'!{c}7*{href('entretien_jour')})*(1+{tva})")
ff, fl = H["fix_first"], H["fix_last"]
fix_ttc = f"SUMPRODUCT('Hypothèses'!$B${ff}:$B${fl},1+'Hypothèses'!$E${ff}:$E${fl}*{tva})/12"
trow(18, "d_fix", "Charges fixes externes (TTC, lissées sur 12 mois)", lambda m, c: f"={fix_ttc}")
trow(19, "d_rem", "Rémunérations nettes des associés",
     lambda m, c: f"=IF({m}>={href('rem_debut')},'Hypothèses'!$B${remr}*{href('nb_assoc')},0)")
trow(20, "d_cot", "Cotisations sociales des dirigeants", lambda m, c: f"={c}19*{href('taux_cotis')}")
trow(21, "d_emp", "Mensualité d'emprunt (+ remboursement du relais TVA)", lambda m, c: f"='Financement'!$J${SCHED0+m-1}+'Financement'!$K${SCHED0+m-1}"
     f"+IF({m}=MAX(1,{href('mois_remb_tva')}),{href('relais_tva')}*{TVA_INV},0)")
REMB = lambda m: f"IF({m}={href('mois_remb_tva')},{L(m)}32,0)"
trow(22, "d_tva", "TVA reversée (+) / remboursement du crédit de TVA (−)", lambda m, c: 0 if m == 1 else f"={L(m)}31-{REMB(m)}")
trow(23, "d_tot", "TOTAL DÉCAISSEMENTS", lambda m, c: f"=SUM({c}14:{c}22)", bold=True, fill=fill_tot)

trow(25, "solde", "SOLDE DU MOIS", lambda m, c: f"={c}11-{c}23", bold=True)
trow(26, "cumul", "TRÉSORERIE FIN DE MOIS", lambda m, c: f"={c}25" if m == 1 else f"={L(m)}26+{c}25",
     bold=True, fill=fill_sec, total=False)
cell(wsT, "N26", "=M26", f_bold, EUR, fill_tot)

section(wsT, 28, "CALCUL DE LA TVA", 14)
trow(29, "tva_col", "TVA collectée (sur encaissements)", lambda m, c: f"=({c}9+{c}10)/(1+{tva})*{tva}")
ded_base = lambda c: (f"({c}14+{c}16+{c}17)/(1+{tva})*{tva}"
                      f"+SUMPRODUCT('Hypothèses'!$B${ff}:$B${fl},'Hypothèses'!$E${ff}:$E${fl})*{tva}/12")
trow(30, "tva_ded", "TVA déductible", lambda m, c: f"={ded_base(c)}")
trow(31, "tva_pay", "TVA à payer (versée le mois suivant)",
     lambda m, c: f"=MAX(0,{c}29-{c}30-{'0' if m == 1 else '('+L(m)+'32-'+REMB(m)+')'})")
trow(32, "tva_cred", "Crédit de TVA reporté en fin de mois",
     lambda m, c: f"=MAX(0,{'0' if m == 1 else '('+L(m)+'32-'+REMB(m)+')'}-({c}29-{c}30))", total=False)
cell(wsT, "A34", "Trésorerie minimale sur l'année 1", f_bold)
cell(wsT, "N34", "=MIN(B26:M26)", f_bold, EUR, fill_key)
cell(wsT, "A35", "TVA de décembre restant à payer en janvier A2 / crédit de TVA restant (remboursable sur demande)", f_note)
cell(wsT, "N35", "=M31-M32", f_note, EUR)
cell(wsT, "A36", "Astuce : le crédit de TVA lié aux investissements peut faire l'objet d'une demande de remboursement "
     "auprès des impôts (formulaire 3519) pour soulager la trésorerie.", f_note)

# =====================================================================
# 7. RENTABILITE MINI-PELLE & SEUIL
# =====================================================================
wsP = wb.create_sheet("Rentabilité & seuil")
setw(wsP, {"A": 62, "B": 16, "C": 16, "D": 60})
cell(wsP, "A1", "RENTABILITÉ DE LA MINI-PELLE & SEUIL DE RENTABILITÉ (année 1)", f_title)
cell(wsP, "A2", "Répond à la question : combien de jours de location par mois faut-il pour rentabiliser les achats ?", f_note)
header_row(wsP, 4, ["Coût annuel de possession de la mini-pelle", "€ / an", "", "Commentaire"])
ap, vg, er = H["ass_pelle_row"], H["vgp_row"], H["entr_row"]
p_rows = [
    ("Amortissement de la mini-pelle", f"={AMORT_PELLE}", "Feuille Amortissements."),
    ("Intérêts d'emprunt (quote-part mini-pelle)",
     f"=IF({FIN_TOTAL}=0,0,'Financement'!$B${EMP_ANN[1]}*{href('inv_pelle')}/{FIN_TOTAL})", "Au prorata du prix de la pelle dans les besoins."),
    ("Assurance mini-pelle", f"='Hypothèses'!$B${ap}", ""),
    ("VGP / contrôles", f"='Hypothèses'!$B${vg}", ""),
    ("Entretien forfaitaire (50 % du forfait annuel)", f"='Hypothèses'!$B${er}*0.5", "Hypothèse : la moitié du forfait entretien concerne la pelle."),
]
for i, (lab, fml, note) in enumerate(p_rows):
    cell(wsP, f"A{5+i}", lab); cell(wsP, f"B{5+i}", fml, f_link, EUR); cell(wsP, f"D{5+i}", note, f_note)
cell(wsP, "A10", "Coût total de possession de la mini-pelle / an", f_bold, fill=fill_tot)
cell(wsP, "B10", "=SUM(B5:B9)", f_bold, EUR, fill_tot)
cell(wsP, "A11", "Soit par mois", f_bold)
cell(wsP, "B11", "=B10/12", f_bold, EUR)

header_row(wsP, 13, ["Marge dégagée par jour de location", "Sans opérateur", "Avec opérateur", ""])
cell(wsP, "A14", "Prix de vente HT / jour")
cell(wsP, "B14", f"={href('prix_seche')}", f_link, EUR); cell(wsP, "C14", f"={href('prix_chauffeur')}", f_link, EUR)
cell(wsP, "A15", "− Carburant")
cell(wsP, "B15", 0, f_norm, EUR); cell(wsP, "C15", f"={href('carbu_jour')}", f_link, EUR)
cell(wsP, "D15", "En location sèche, le carburant est à la charge du client.", f_note)
cell(wsP, "A16", "− Usure / entretien variable")
cell(wsP, "B16", f"={href('entretien_jour')}", f_link, EUR); cell(wsP, "C16", f"={href('entretien_jour')}", f_link, EUR)
cell(wsP, "A17", "− Temps de l'opérateur", f_note)
cell(wsP, "D17", "Non déduit ici : l'opérateur est un associé, sa rémunération est une charge fixe.", f_note)
cell(wsP, "A18", "Marge sur coût variable par jour", f_bold, fill=fill_tot)
cell(wsP, "B18", "=B14-B15-B16", f_bold, EUR, fill_tot); cell(wsP, "C18", "=C14-C15-C16", f_bold, EUR, fill_tot)

header_row(wsP, 20, ["Nombre de jours de location nécessaires PAR MOIS pour couvrir…", "Sans opérateur", "Avec opérateur", ""])
cell(wsP, "A21", "…le seul coût de possession de la mini-pelle")
cell(wsP, "A22", "…la mensualité totale de l'emprunt + assurances/entretien pelle")
cell(wsP, "A23", "…toutes les charges fixes de la société (hors rémunérations)")
cell(wsP, "A24", "…toutes les charges fixes, rémunérations des associés comprises", f_bold)
cell(wsP, "D21", "Ce que la pelle doit rapporter pour « se payer » elle-même.", f_note)
cell(wsP, "D22", "Vision trésorerie : la location rembourse tout le crédit (pelle + camion + remorque).", f_note)
cell(wsP, "D23", "Hypothèse extrême : aucun CA travaux, la location porte toute la structure.", f_note)
cell(wsP, "D24", "Idem, en payant les associés selon les hypothèses de l'année 1.", f_note)
need = {
    21: "$B$11",
    22: f"({MENSU}+($B$7+$B$8+$B$9)/12)",
    23: f"(({RC('ext')}+{RC('fetab')}+{RC('amort')}+{RC('interets')})/12)",
    24: f"(({RC('ext')}+{RC('fetab')}+{RC('amort')}+{RC('interets')}+{RC('rem')}+{RC('cotis')})/12)",
}
for rr_, n in need.items():
    cell(wsP, f"B{rr_}", f"=IF(B$18<=0,0,{n}/B$18)", f_bold if rr_ == 24 else f_norm, NUM1)
    cell(wsP, f"C{rr_}", f"=IF(C$18<=0,0,{n}/C$18)", f_bold if rr_ == 24 else f_norm, NUM1)
cell(wsP, "A25", "Pour comparaison : jours loués prévus en moyenne par mois (feuille Activité)", f_note)
cell(wsP, "B25", f"={V('js')}/12", f_link, NUM1); cell(wsP, "C25", f"={V('jc')}/12", f_link, NUM1)
cell(wsP, "A26", "Jours de location / mois pour atteindre 65 000 € de CA location avec un seul type de location", f_note)
cell(wsP, "B26", f"=IF({href('prix_seche')}=0,0,'Activité A1'!$N$19/12/{href('prix_seche')})", f_norm, NUM1)
cell(wsP, "C26", f"=IF({href('prix_chauffeur')}=0,0,'Activité A1'!$N$19/12/{href('prix_chauffeur')})", f_norm, NUM1)

header_row(wsP, 28, ["Seuil de rentabilité global (année 1)", "Montant", "", ""])
cell(wsP, "A29", "Charges fixes totales (externes, frais d'établissement, rémunérations, cotisations, amortissements, intérêts)")
cell(wsP, "B29", f"={RC('ext')}+{RC('fetab')}+{RC('rem')}+{RC('cotis')}+{RC('amort')}+{RC('interets')}", f_link, EUR)
cell(wsP, "A30", "Taux de marge sur coûts variables")
cell(wsP, "B30", f"={RC('tmcv')}", f_link, PCT)
cell(wsP, "A31", "SEUIL DE RENTABILITÉ (CA HT minimum pour résultat = 0)", f_bold, fill=fill_tot)
cell(wsP, "B31", "=IF(B30<=0,0,B29/B30)", f_bold, EUR, fill_key)
cell(wsP, "A32", "CA prévisionnel année 1")
cell(wsP, "B32", f"={RC('ca')}", f_link, EUR)
cell(wsP, "A33", "Marge de sécurité (CA prévu − seuil) / CA prévu")
cell(wsP, "B33", "=IF(B32=0,0,(B32-B31)/B32)", f_norm, PCT)
cell(wsP, "A34", "Point mort : mois où le seuil est atteint (CA supposé régulier)")
cell(wsP, "B34", "=IF(B32=0,0,B31/B32*12)", f_norm, '0.0" mois"')

header_row(wsP, 36, ["Sensibilité : résultat avant impôt A1 selon le niveau d'activité", "% du CA prévu", "Résultat avant IS", ""])
for i, k in enumerate([0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2]):
    rr_ = 37 + i
    cell(wsP, f"A{rr_}", f"Scénario {int(k*100)} %" + (" (prévisionnel)" if k == 1 else ""))
    cell(wsP, f"B{rr_}", k, f_in, PCT)
    cell(wsP, f"C{rr_}", f"=B{rr_}*{RC('mcv')}-$B$29", f_bold if k == 1 else f_norm, EUR)
cell(wsP, "A44", "Hypothèse simplifiée : charges variables proportionnelles au CA, charges fixes inchangées.", f_note)

# =====================================================================
# 0. SYNTHESE + LISEZ-MOI (placed first)
# =====================================================================
wsS = wb.create_sheet("Synthèse", 0)
setw(wsS, {"A": 50, "B": 15, "C": 15, "D": 15})
cell(wsS, "A1", "PRÉVISIONNEL — LOCATION DE MINI-PELLE & TRAVAUX ANNEXES", f_title)
cell(wsS, "A2", "Société en création — 2 associés à 50/50 — capital 1 000 €. Document de travail à destination de l'expert-comptable.", f_note)
header_row(wsS, 4, ["Démarrage", "Montant"])
syn1 = [("Total des besoins de démarrage", f"={FIN_TOTAL}"),
        ("Apports des associés (capital + comptes courants)", "='Financement'!$E$4+'Financement'!$E$5"),
        ("Emprunt bancaire à solliciter", f"={EMPRUNT}"),
        ("Mensualité d'emprunt", f"={MENSU}")]
for i, (lab, fml) in enumerate(syn1):
    cell(wsS, f"A{5+i}", lab); cell(wsS, f"B{5+i}", fml, f_link, EUR)
header_row(wsS, 10, ["Indicateurs (€ HT)", "Année 1", "Année 2", "Année 3"])
syn2 = [("CA location mini-pelle", "ca_loc", EUR), ("CA travaux annexes", "ca_trav", EUR), ("Chiffre d'affaires total", "ca", EUR),
        ("EBE", "ebe", EUR), ("Résultat net", "rn", EUR), ("Rémunération nette des 2 associés", "rem", EUR),
        ("CAF", "caf", EUR), ("Trésorerie dégagée après remboursement d'emprunt", "autof", EUR)]
for i, (lab, key, fmt) in enumerate(syn2):
    rr_ = 11 + i
    cell(wsS, f"A{rr_}", lab, f_bold if key in ("ca", "rn") else f_norm)
    for j, c in enumerate("BCD"):
        cell(wsS, f"{c}{rr_}", f"={RC(key, c)}", f_linkb if key in ("ca", "rn") else f_link, fmt)
header_row(wsS, 20, ["Points clés année 1", "Valeur"])
syn3 = [("Jours de location / mois en moyenne (avec + sans opérateur)", f"={V('jt')}/12", NUM1),
        ("Taux d'utilisation moyen de la mini-pelle", f"={V('tu')}", PCT),
        ("Seuil de rentabilité (CA HT)", "='Rentabilité & seuil'!$B$31", EUR),
        ("Trésorerie minimale atteinte en année 1", "='Trésorerie A1'!$N$34", EUR),
        ("Trésorerie en fin d'année 1", "='Trésorerie A1'!$N$26", EUR)]
for i, (lab, fml, fmt) in enumerate(syn3):
    cell(wsS, f"A{21+i}", lab); cell(wsS, f"B{21+i}", fml, f_link, fmt)

ch = BarChart()
ch.type = "col"
ch.title = "CA et résultat net (€ HT)"
ch.style = 10
data = Reference(wsS, min_col=1, max_col=4, min_row=13, max_row=13)
ch.add_data(Reference(wsS, min_col=2, max_col=4, min_row=13, max_row=13), from_rows=True, titles_from_data=False)
ch.add_data(Reference(wsS, min_col=2, max_col=4, min_row=15, max_row=15), from_rows=True, titles_from_data=False)
ch.series[0].tx = None
from openpyxl.chart.series import SeriesLabel
ch.series[0].tx = SeriesLabel(v="Chiffre d'affaires")
ch.series[1].tx = SeriesLabel(v="Résultat net")
ch.series[0].graphicalProperties.solidFill = "1F3864"
ch.series[1].graphicalProperties.solidFill = "70AD47"
ch.set_categories(Reference(wsS, min_col=2, max_col=4, min_row=10, max_row=10))
ch.height, ch.width = 7.5, 14
wsS.add_chart(ch, "F4")

lc = LineChart()
lc.title = "Trésorerie fin de mois — année 1 (€)"
lc.add_data(Reference(wsT, min_col=2, max_col=13, min_row=26, max_row=26), from_rows=True, titles_from_data=False)
lc.series[0].tx = SeriesLabel(v="Trésorerie")
lc.series[0].graphicalProperties.line.solidFill = "1F3864"
lc.set_categories(Reference(wsT, min_col=2, max_col=13, min_row=4, max_row=4))
lc.y_axis.numFmt = "#,##0"
lc.x_axis.number_format = "mmm-yy"
lc.height, lc.width = 7.5, 14
lc.legend = None
wsS.add_chart(lc, "F20")

wsL = wb.create_sheet("Lisez-moi", 1)
setw(wsL, {"A": 130})
lines = [
    ("NOTE DE PRÉSENTATION POUR L'EXPERT-COMPTABLE", f_title),
    ("", None),
    ("1. Le projet", f_bold),
    ("Création d'une société de location de mini-pelle 2,5 t, avec ou sans opérateur, et de travaux sur devis : terrassement, évacuation des déchets, "
     "maçonnerie après terrassement, élagage et entretien d'espaces verts. Clients : particuliers et entreprises (projets extérieurs, création d'accès pour engins).", None),
    ("Secteur : Mâcon et alentours. Veille de marché : 8 concurrents directs importants et une dizaine de structures intermédiaires peu équipées. "
     "La location avec opérateur pour les particuliers est peu proposée (ni par les grandes enseignes, ni par le TP) : c'est le positionnement différenciant.", None),
    ("2 associés à parts égales (50/50), capital social de 1 000 €. Répartition des rôles : un associé gère la communication, l'administratif, les devis, "
     "la facturation et le suivi clients ; l'autre (Alexandre) gère le terrain : visites préalables et réalisation des travaux.", None),
    ("Expérience : l'associé chargé de l'administratif a créé et dirige depuis 2022 l'agence Corberon Location (location de nacelles, Replonges) : "
     "1,18 M€ de CA et 264 k€ de bénéfice en 2024, ≈ 1 M€ de CA prévu en 2026, 6 personnes. Les deux associés utilisent déjà la mini-pelle dans leur activité.", None),
    ("Investissements : mini-pelle 2,5 t (25–30 k€), remorque plateau d'occasion (~8 k€), petit camion benne d'occasion (15–25 k€), "
     "matériel et équipements divers, trésorerie de départ. Budget total envisagé : 50 000 à 70 000 €.", None),
    ("Tarifs : 250–350 € HT/jour sans opérateur ; 650–950 € HT/jour (7 h) avec opérateur, hors déplacement. Travaux annexes sur devis.", None),
    ("Objectif année 1 : au moins 65 000 € HT de CA sur la location seule, et environ le double (≈ 130 000 € HT) sur l'ensemble de la société.", None),
    ("Estimation des associés : il faut au minimum 12 jours de location sans opérateur par mois, ou 6 à 8 jours avec opérateur, pour rentabiliser l'achat "
     "(à comparer avec la feuille « Rentabilité & seuil »).", None),
    ("", None),
    ("2. Organisation du fichier", f_bold),
    ("Synthèse : chiffres clés et graphiques.  •  Hypothèses : TOUTES les données modifiables.  •  Financement : plan de financement + tableau d'emprunt.", None),
    ("Amortissements  •  Activité A1 : jours loués et CA mois par mois  •  Compte de résultat : 3 ans  •  Trésorerie A1 : plan mensuel TTC avec TVA.", None),
    ("Rentabilité & seuil : jours de location nécessaires par mois, seuil de rentabilité et sensibilité du résultat.", None),
    ("Code couleur : bleu = saisie ; fond jaune = hypothèse clé à valider ; noir = calcul ; vert = lien vers une autre feuille. Tout se recalcule automatiquement.", None),
    ("", None),
    ("3. Points à confirmer / questions pour la comptable", f_bold),
    ("• Locations de la mini-pelle aux sociétés des associés (Corberon Location, activité d'Alexandre) : source de CA récurrente, "
     "mais conventions à encadrer (prix de marché, conventions réglementées).", None),
    ("• Achat de matériel d'occasion auprès d'un particulier = pas de TVA récupérable (le plan de trésorerie suppose un achat auprès d'un professionnel avec TVA).", None),
    ("• Prix retenus en bas de fourchette (280 € HT/jour sans opérateur, 750 € HT/jour avec opérateur) ; les déplacements facturés en plus ne sont pas comptés.", None),
    ("• Durées d'amortissement du matériel d'occasion ; choix entre emprunt bancaire et crédit-bail / LOA pour la pelle et le camion.", None),
    ("• Aides possibles : ACRE (exonération partielle de cotisations la 1re année, sous conditions), ARCE/maintien ARE si l'un des associés est demandeur d'emploi, "
     "prêt d'honneur (Initiative France, Réseau Entreprendre) pour renforcer l'apport personnel.", None),
    ("• Régime de TVA (réel normal mensuel supposé) et demande de remboursement du crédit de TVA sur les investissements.", None),
    ("", None),
    ("4. Choix du statut juridique (50/50) — éléments de réflexion", f_bold),
    ("SARL avec co-gérance des 2 associés : gérance majoritaire → statut TNS, cotisations ≈ 40–45 % du net (hypothèse retenue ici : 45 %). "
     "Protection sociale plus faible, dividendes au-delà de 10 % du capital + comptes courants soumis aux cotisations sociales.", None),
    ("SAS avec un président et un directeur général : assimilés salariés, cotisations ≈ 75–82 % du net, meilleure protection sociale ; "
     "aucune cotisation si aucune rémunération n'est versée ; dividendes soumis au prélèvement forfaitaire unique (pas de cotisations sociales).", None),
    ("→ Si vous ne vous rémunérez pas au début, la SAS est souple ; si vous vous versez un salaire régulier, la SARL coûte moins cher en cotisations. "
     "Pour tester la SAS, passer le taux de cotisations à 80 % dans les Hypothèses.", None),
    ("Dans les deux cas, prévoir un pacte d'associés (répartition des rôles, sortie d'un associé, décisions en cas d'égalité 50/50).", None),
    ("", None),
    ("5. Limites du prévisionnel", f_bold),
    ("Montants indicatifs basés sur des estimations de marché : à affiner avec les devis réels (matériel, assurances, banque) et la lettre de mission de la comptable. "
     "Pas de salarié prévu. Stocks et délais fournisseurs non modélisés (paiement comptant). Les taux fiscaux et sociaux sont à vérifier à la date de création.", None),
]
for i, (txt, font) in enumerate(lines):
    c = wsL.cell(row=1 + i, column=1, value=txt)
    c.font = font or f_norm
    c.alignment = Alignment(wrap_text=True, vertical="top")

# global font default for untouched cells & freeze panes
for ws in wb.worksheets:
    ws.sheet_view.showGridLines = False
    ws.page_setup.orientation = 'landscape'
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True
wsV.freeze_panes = "B5"
wsT.freeze_panes = "B5"
wsR.freeze_panes = "B4"
wsF.freeze_panes = "A4"

wb.save(OUT)
print("saved", OUT)
