import EcranRegistre from '../../components/EcranRegistre';

export default function InvestissementsScreen() {
  return (
    <EcranRegistre
      table="investissements"
      champ={{
        cle: 'libelle',
        label: 'Investissement',
        placeholder: 'Ex : serre, poulailler, motoculteur...',
      }}
      titreAjout="Enregistrer un investissement"
      resumeLabel="Total investi"
    />
  );
}
