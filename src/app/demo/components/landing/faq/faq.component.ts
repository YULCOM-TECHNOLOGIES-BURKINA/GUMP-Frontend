import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface FAQCategory {
  icon: string;
  title: string;
  code: string;
  description: string;
  questions: FAQ[];
}

interface FAQ {
  question: string;
  answer: string;
  tags?: string[];
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])
  ]
})
export class FAQComponent implements OnInit {
  categories: FAQCategory[] = [];
  selectedCategory: FAQCategory | null = null;
  searchQuery: string = '';
  filteredQuestions: FAQ[] = [];
  loading: boolean = true;

  ngOnInit() {
    this.categories = [
      {
        "icon": "pi pi-file",
        "title": "Attestation de situation cotisante CNSS",
        "code": "cnss-cotisant",
        "description": "Informations sur l'attestation de situation cotisante CNSS et sa procédure d'obtention.",
        "questions": [
          {
            "question": "Qu'est-ce qu'une attestation de situation cotisante CNSS ?",
            "answer": "L'attestation de situation cotisante est un document délivré par la CNSS qui certifie que l'entreprise est à jour dans ses cotisations sociales. Ce document est souvent requis pour les marchés publics et certaines transactions commerciales.",
            "tags": ["cnss", "cotisations", "attestation"]
          },
          {
            "question": "Comment obtenir une attestation de situation cotisante CNSS ?",
            "answer": "Pour obtenir cette attestation, vous devez : 1) Être à jour de vos cotisations sociales, 2) Déposer une demande auprès de la CNSS avec votre numéro d'employeur, 3) Présenter une pièce d'identité valide. Le service est généralement traité sous 48h.",
            "tags": ["procédure", "documents", "délais"]
          }
        ]
      },
      {
        "icon": "pi pi-users",
        "title": "Attestation ANPE",
        "code": "anpe",
        "description": "Informations sur l'attestation de l'Agence Nationale Pour l'Emploi.",
        "questions": [
          {
            "question": "À quoi sert l'attestation ANPE ?",
            "answer": "L'attestation ANPE est un document qui certifie qu'une personne est inscrite comme demandeur d'emploi. Elle peut être utilisée pour diverses démarches administratives et pour bénéficier de certains programmes d'aide à l'emploi.",
            "tags": ["emploi", "attestation", "inscription"]
          },
          {
            "question": "Quelle est la procédure d'obtention ?",
            "answer": "Pour obtenir l'attestation ANPE, vous devez : 1) Vous inscrire à l'ANPE, 2) Fournir une copie de votre CNIB, 3) Présenter votre CV et vos diplômes. L'attestation est délivrée immédiatement après l'inscription.",
            "tags": ["procédure", "documents", "inscription"]
          }
        ]
      },
      {
        "icon": "pi pi-building",
        "title": "Extrait RCCM",
        "code": "rccm",
        "description": "Informations sur l'extrait du Registre du Commerce et du Crédit Mobilier.",
        "questions": [
          {
            "question": "Qu'est-ce qu'un extrait RCCM ?",
            "answer": "L'extrait RCCM est un document officiel qui prouve l'existence légale d'une entreprise et son inscription au registre du commerce. Il contient les informations essentielles sur l'entreprise comme sa forme juridique, son capital et ses dirigeants.",
            "tags": ["commerce", "entreprise", "légal"]
          },
          {
            "question": "Comment obtenir un extrait RCCM ?",
            "answer": "Pour obtenir un extrait RCCM, présentez-vous au tribunal de commerce avec : 1) Une demande écrite, 2) Une copie de la CNIB du dirigeant, 3) Le récépissé de paiement des frais. Le délai d'obtention est généralement de 24 à 48 heures.",
            "tags": ["procédure", "documents", "délais"]
          }
        ]
      },
      {
        "icon": "pi pi-check-circle",
        "title": "Certificat de Non Faillite",
        "code": "non-faillite",
        "description": "Informations sur le certificat de non faillite et sa procédure d'obtention.",
        "questions": [
          {
            "question": "À quoi sert le certificat de non faillite ?",
            "answer": "Le certificat de non faillite atteste qu'une entreprise n'est pas en situation de faillite ou de liquidation judiciaire. Il est souvent exigé pour les marchés publics et certaines transactions commerciales importantes.",
            "tags": ["juridique", "entreprise", "attestation"]
          },
          {
            "question": "Comment obtenir ce certificat ?",
            "answer": "Le certificat s'obtient auprès du Tribunal de Commerce. Vous devez fournir : 1) Une demande écrite, 2) Un extrait RCCM récent, 3) Une copie de la CNIB du dirigeant. Le délai de délivrance est généralement de 48 heures.",
            "tags": ["procédure", "documents", "délais"]
          }
        ]
      },
      {
        "icon": "pi pi-chart-line",
        "title": "Attestation AJE",
        "code": "aje",
        "description": "Informations sur l'attestation de l'Agence pour la Jeunesse et l'Emploi.",
        "questions": [
          {
            "question": "Qu'est-ce que l'attestation AJE ?",
            "answer": "L'attestation AJE est un document délivré par l'Agence pour la Jeunesse et l'Emploi qui certifie qu'un jeune est inscrit dans un programme d'accompagnement pour l'emploi ou l'entrepreneuriat.",
            "tags": ["jeunesse", "emploi", "entrepreneuriat"]
          },
          {
            "question": "Comment obtenir l'attestation AJE ?",
            "answer": "Pour obtenir l'attestation AJE : 1) Inscrivez-vous auprès de l'AJE, 2) Participez au programme d'accompagnement choisi, 3) Faites la demande d'attestation avec votre numéro d'inscription. Le document est généralement délivré sous 24 heures.",
            "tags": ["procédure", "inscription", "délais"]
          }
        ]
      },
      {
        "icon": "pi pi-file",
        "title": "Attestation de situation fiscale",
        "code": "asf",
        "description": "Informations sur l'attestation de situation fiscale et sa procédure d'obtention.",
        "questions": [
          {
            "question": "Qu'est-ce qu'une attestation de situation fiscale ?",
            "answer": "L'attestation de situation fiscale est un document délivré par la Direction Générale des Impôts qui certifie que vous êtes en règle avec vos obligations fiscales. Elle est valable pour une durée de 3 mois.",
            "tags": ["fiscal", "impôts", "attestation"]
          },
          {
            "question": "Comment obtenir une attestation de situation fiscale ?",
            "answer": "Pour obtenir l'attestation, vous devez : 1) Être à jour de vos obligations fiscales, 2) Déposer une demande à la DGI, 3) Fournir votre IFU et une copie de votre dernière déclaration fiscale. Le délai de traitement est de 48 à 72 heures.",
            "tags": ["procédure", "documents", "délais"]
          },
          {
            "question": "Quels sont les coûts associés ?",
            "answer": "L'attestation de situation fiscale est délivrée moyennant le paiement d'un timbre fiscal. Le montant varie selon le type de demande (personne physique ou morale) et l'urgence de la demande.",
            "tags": ["coût", "paiement", "timbre"]
          }
        ]
      },
      {
        "icon": "pi pi-briefcase",
        "title": "Attestation DRTPS",
        "code": "drtps",
        "description": "Informations sur l'attestation de la Direction Régionale du Travail et de la Protection Sociale.",
        "questions": [
          {
            "question": "À quoi sert l'attestation DRTPS ?",
            "answer": "L'attestation DRTPS certifie que votre entreprise respecte la réglementation du travail au Burkina Faso. Elle est souvent requise pour les marchés publics et certaines transactions commerciales importantes.",
            "tags": ["travail", "attestation", "conformité"]
          },
          {
            "question": "Quelle est la procédure d'obtention ?",
            "answer": "Pour obtenir l'attestation DRTPS : 1) Déposez une demande écrite, 2) Fournissez les registres employeur à jour, 3) Présentez les déclarations CNSS récentes, 4) Joignez une copie du règlement intérieur validé. Le traitement prend généralement 72 heures.",
            "tags": ["procédure", "documents", "délais"]
          },
          {
            "question": "Quelle est la durée de validité ?",
            "answer": "L'attestation DRTPS est valable pour une durée de 3 mois à compter de sa date d'émission. Il est conseillé de demander son renouvellement 2 semaines avant expiration.",
            "tags": ["validité", "renouvellement", "durée"]
          }
        ]
      },
      {
        "icon": "pi pi-user",
        "title": "Compte Utilisateur",
        "code": "user",
        "description": "Informations sur la gestion de votre compte utilisateur et les services en ligne.",
        "questions": [
          {
            "question": "Comment créer un compte utilisateur ?",
            "answer": "Pour créer un compte : 1) Cliquez sur 'Inscription' sur la page d'accueil, 2) Remplissez le formulaire avec vos informations personnelles (nom, prénom, email, téléphone), 3) Validez votre email via le lien envoyé, 4) Complétez votre profil avec les documents requis (CNIB, IFU si applicable).",
            "tags": ["inscription", "compte", "création"]
          },
          {
            "question": "Comment sécuriser mon compte ?",
            "answer": "Pour sécuriser votre compte : 1) Utilisez un mot de passe fort, 2) Activez l'authentification à deux facteurs dans les paramètres, 3) Ne partagez jamais vos identifiants, 4) Déconnectez-vous après chaque session, particulièrement sur les ordinateurs partagés.",
            "tags": ["sécurité", "authentification", "protection"]
          },
          {
            "question": "Que faire en cas d'oubli de mot de passe ?",
            "answer": "En cas d'oubli : 1) Cliquez sur 'Mot de passe oublié', 2) Entrez votre email d'inscription, 3) Suivez les instructions reçues par email, 4) Créez un nouveau mot de passe sécurisé. La réinitialisation est immédiate après validation du lien.",
            "tags": ["mot de passe", "récupération", "accès"]
          },
          {
            "question": "Comment suivre mes demandes en cours ?",
            "answer": "Dans votre espace personnel : 1) Accédez à la section 'Mes demandes', 2) Consultez le statut de chaque demande, 3) Recevez des notifications par email à chaque étape, 4) Téléchargez vos documents une fois disponibles.",
            "tags": ["suivi", "demandes", "notifications"]
          }
        ]
      }
    ];

    this.selectedCategory = this.categories[0];
    this.filterQuestions();

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  selectCategory(category: FAQCategory) {
    this.selectedCategory = category;
    this.filterQuestions();
  }

  filterQuestions() {
    if (!this.selectedCategory) return;
    
    if (!this.searchQuery) {
      this.filteredQuestions = this.selectedCategory.questions;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredQuestions = this.selectedCategory.questions.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.tags?.some(tag => tag.toLowerCase().includes(query))
    );

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.filterQuestions();
  }
}