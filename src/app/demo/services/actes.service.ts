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
    {
      id: 'cnss',
      title: 'Attestation CNSS',
      description: 'L\'attestation CNSS (Caisse Nationale de Sécurité Sociale) atteste de la conformité d\'une entreprise aux obligations de cotisation sociale.',
      icon: 'pi pi-file',
      organization: 'Caisse Nationale de Sécurité Sociale',
      validityPeriod: '3 mois',
      processingTime: '72 heures',
      price: '5 000 FCFA',
      category: 'Sécurité Sociale',
      usages: [
          'Accès aux marchés publics',
          'Renouvellement de licences',
          'Demandes de crédits'
      ],
      requiredDocuments: [
          'Relevé des cotisations à jour',
          'Relevé d\'identité bancaire de l\'entreprise',
          'Dernier avis de paiement CNSS'
      ],
      prerequisites: [],
      legalTexts: [
          {
              title: 'Code de la Sécurité Sociale - Article 42',
              content: 'Toute entreprise doit fournir l\'attestation CNSS pour accéder aux marchés publics.',
              link: 'https://exemple.com/code-securite-sociale'
          }
      ],
      steps: [
          {
              title: 'Inscription sur le portail CNSS',
              description: 'Créer un compte entreprise sur le portail de la CNSS.'
          },
          {
              title: 'Soumission des documents',
              description: 'Télécharger les documents requis sur la plateforme.'
          },
          {
              title: 'Paiement des frais',
              description: 'Payer les frais via les moyens de paiement disponibles.'
          },
          {
              title: 'Téléchargement de l\'attestation',
              description: 'Télécharger l\'attestation CNSS une fois délivrée.'
          }
      ]
  },
  {
      id: 'aje',
      title: 'Attestation de Non-Engagement (AJE)',
      description: 'L\'attestation de non-engagement certifie qu\'une entreprise n\'est pas en situation d\'engagement auprès de l\'État pour des projets en cours.',
      icon: 'pi pi-file',
      organization: 'Ministère de l\'Économie et des Finances',
      validityPeriod: '1 an',
      processingTime: '5 jours ouvrables',
      price: '15 000 FCFA',
      category: 'Finance',
      usages: [
          'Participation aux appels d\'offres',
          'Obtention de prêts bancaires',
          'Renouvellement de concessions'
      ],
      requiredDocuments: [
          'Extrait Kbis récent',
          'Attestation fiscale',
          'Déclaration sur l\'honneur de non-engagement'
      ],
      prerequisites: [],
      legalTexts: [
          {
              title: 'Arrêté n°2022-88',
              content: 'Régit l\'attestation de non-engagement pour les entreprises.',
              link: 'https://exemple.com/arret-2022-88'
          }
      ],
      steps: [
          {
              title: 'Demande de l\'attestation',
              description: 'Soumettre une demande via le site du Ministère des Finances.'
          },
          {
              title: 'Validation des informations',
              description: 'Les informations fournies sont vérifiées par le ministère.'
          },
          {
              title: 'Délivrance de l\'attestation',
              description: 'L\'attestation est délivrée si les conditions sont remplies.'
          }
      ]
  },
  {
      id: 'rccm',
      title: 'Registre du Commerce et du Crédit Mobilier (RCCM)',
      description: 'L\'inscription au RCCM atteste de l\'existence juridique d\'une entreprise et de son enregistrement.',
      icon: 'pi pi-book',
      organization: 'Greffe du Tribunal de Commerce',
      validityPeriod: 'Indéfini',
      processingTime: '5 jours',
      price: '25 000 FCFA',
      category: 'Commerce',
      usages: [
          'Démarches bancaires',
          'Accès aux marchés publics',
          'Obligations légales'
      ],
      requiredDocuments: [
          'Statuts de l\'entreprise',
          'Pièce d\'identité du gérant',
          'Formulaire de demande RCCM'
      ],
      prerequisites: [],
      legalTexts: [
          {
              title: 'Code du Commerce - Article 15',
              content: 'Tout commerçant doit s\'inscrire au RCCM pour exercer légalement.',
              link: 'https://exemple.com/code-commerce'
          }
      ],
      steps: [
          {
              title: 'Remplir le formulaire',
              description: 'Remplir le formulaire de demande au RCCM.'
          },
          {
              title: 'Déposer au greffe',
              description: 'Déposer le dossier complet au greffe du tribunal.'
          },
          {
              title: 'Obtention de l\'extrait',
              description: 'L\'extrait est délivré après validation.'
          }
      ]
  },
  {
      id: 'cnf',
      title: 'Certificat de Non Faillite (CNF)',
      description: 'Le certificat de non-faillite prouve qu\'une entreprise n\'est pas en situation de faillite.',
      icon: 'pi pi-shield',
      organization: 'Tribunal de Commerce',
      validityPeriod: '6 mois',
      processingTime: '72 heures',
      price: '20 000 FCFA',
      category: 'Juridique',
      usages: [
          'Participation aux marchés publics',
          'Renouvellement de licence',
          'Partenariats commerciaux'
      ],
      requiredDocuments: [
          'Pièce d\'identité du gérant',
          'Extrait RCCM',
          'Formulaire de demande'
      ],
      prerequisites: [],
      legalTexts: [
          {
              title: 'Code des procédures collectives',
              content: 'Le certificat de non faillite est requis pour toute entreprise soumissionnaire.',
              link: 'https://exemple.com/procedure-collective'
          }
      ],
      steps: [
          {
              title: 'Soumettre la demande',
              description: 'Envoyer les documents requis pour l\'obtention du certificat.'
          },
          {
              title: 'Traitement de la demande',
              description: 'Vérification des antécédents de faillite par le tribunal.'
          },
          {
              title: 'Obtention du certificat',
              description: 'Le certificat est délivré après vérification.'
          }
      ]
  },
  {
      id: 'asf',
      title: 'Attestation de Situation Fiscale (ASF)',
      description: 'Le certificat de non-faillite prouve qu\'une entreprise n\'est pas en situation de faillite.',
      icon: 'pi pi-shield',
      organization: 'Tribunal de Commerce',
      validityPeriod: '6 mois',
      processingTime: '72 heures',
      price: '20 000 FCFA',
      category: 'Juridique',
      usages: [
          'Participation aux marchés publics',
          'Renouvellement de licence',
          'Partenariats commerciaux'
      ],
      requiredDocuments: [
          'Pièce d\'identité du gérant',
          'Extrait RCCM',
          'Formulaire de demande'
      ],
      prerequisites: [],
      legalTexts: [
          {
              title: 'Code des procédures collectives',
              content: 'Le certificat de non faillite est requis pour toute entreprise soumissionnaire.',
              link: 'https://exemple.com/procedure-collective'
          }
      ],
      steps: [
          {
              title: 'Soumettre la demande',
              description: 'Envoyer les documents requis pour l\'obtention du certificat.'
          },
          {
              title: 'Traitement de la demande',
              description: 'Vérification des antécédents de faillite par le tribunal.'
          },
          {
              title: 'Obtention du certificat',
              description: 'Le certificat est délivré après vérification.'
          }
      ]
  }
  ];

  getActInfo(id: string): Observable<ActInfo> {
    const act = this.acts.find((a) => a.id === id);
    return act ? of(act) : of(null);
  }
}

export default ActService;