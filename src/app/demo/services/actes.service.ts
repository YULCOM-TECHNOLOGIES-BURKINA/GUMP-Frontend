import { Observable, of } from 'rxjs';

interface ActInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
  organization: string;
  validityPeriod: string;
  processingTime: string;
  price: string;
  category: string;
  usages: string[];
  requiredDocuments: string[];
  prerequisites: { id: string; title: string; description: string }[];
  legalTexts: { title: string; content: string; link: string }[];
  steps: { title: string; description: string }[];
}

class ActService {
  private acts: ActInfo[] = [
    {
      id: 'drtps',
      title: 'Attestation DRTPS',
      description: 'L\'attestation DRTPS (Direction Régionale du Travail et de la Protection Sociale) est un document officiel qui certifie la régularité d\'une entreprise en matière de droit du travail et de sécurité sociale.',
      icon: 'pi pi-file',
      organization: 'Direction Régionale du Travail et de la Protection Sociale',
      validityPeriod: '3 mois',
      processingTime: '48 heures',
      price: '10 000 FCFA',
      category: 'Travail',
      usages: [
        'Participation aux marchés publics',
        'Renouvellement des agréments',
        'Demandes de financement',
        'Certification qualité'
      ],
      requiredDocuments: [
        'Registre d\'employeur à jour',
        'Déclarations sociales des 3 derniers mois',
        'Attestation CNSS valide',
        'Contrats de travail des employés'
      ],
      prerequisites: [
        {
          id: 'cnss',
          title: 'Attestation CNSS',
          description: 'Vous devez disposer d\'une attestation CNSS valide pour faire cette demande'
        }
      ],
      legalTexts: [
        {
          title: 'Code du Travail - Article L.118',
          content: 'L\'attestation de régularité est délivrée par l\'inspection du travail aux entreprises qui respectent les dispositions du présent code.',
          link: 'https://exemple.com/code-travail'
        },
        {
          title: 'Décret n°2023-456',
          content: 'Fixe les modalités de délivrance et de renouvellement des attestations de régularité en matière de travail.',
          link: 'https://exemple.com/decret'
        }
      ],
      steps: [
        {
          title: 'Création du compte',
          description: 'Créez votre compte entreprise sur la plateforme en fournissant les informations requises.'
        },
        {
          title: 'Vérification des prérequis',
          description: 'Assurez-vous d\'avoir tous les documents nécessaires et une attestation CNSS valide.'
        },
        {
          title: 'Soumission de la demande',
          description: 'Remplissez le formulaire en ligne et téléchargez les documents requis.'
        },
        {
          title: 'Paiement',
          description: 'Procédez au paiement des frais de traitement via les moyens de paiement disponibles.'
        },
        {
          title: 'Suivi de la demande',
          description: 'Suivez l\'état d\'avancement de votre demande depuis votre espace personnel.'
        }
      ]
    },
    // TODO: Ajouter les 6 autres actes ici
  ];

  getActInfo(id: string): Observable<ActInfo> {
    const act = this.acts.find((a) => a.id === id);
    return act ? of(act) : of(null);
  }
}

export default ActService;