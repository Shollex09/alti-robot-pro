import EcranRegistre from '../../components/EcranRegistre';
import { CATEGORIES_COUTS } from '../../lib/gestion';

export default function CoutsScreen() {
  return (
    <EcranRegistre
      table="couts"
      champ={{ cle: 'categorie', label: 'Catégorie', options: CATEGORIES_COUTS }}
      titreAjout="Enregistrer un coût"
      resumeLabel="Total des coûts"
    />
  );
}
