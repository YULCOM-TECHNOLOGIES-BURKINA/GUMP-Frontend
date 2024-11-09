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
        icon: 'pi pi-file',
        title: 'Attestations DRTSS',
        code: 'drtss',
        description: 'Tout ce que vous devez savoir sur les attestations DRTSS et leur obtention.',
        questions: [
          {
            question: 'Comment obtenir une attestation DRTSS ?',
            answer: 'Pour obtenir une attestation DRTSS, connectez-vous à votre compte, accédez à la section "Attestations DRTSS" et suivez les étapes du formulaire. Assurez-vous d\'avoir tous les documents requis numérisés avant de commencer la procédure.',
            tags: ['attestation', 'documents', 'procédure']
          },
          {
            question: 'Quel est le délai de traitement d\'une attestation DRTSS ?',
            answer: 'Le délai de traitement standard est de 48 heures ouvrables. Vous recevrez une notification par email dès que votre attestation sera disponible.',
            tags: ['délais', 'traitement', 'notification']
          }
        ]
      },
      {
        icon: 'pi pi-briefcase',
        title: 'Services CNSS',
        code: 'cnss',
        description: 'Tout ce que vous devez savoir sur les attestations DRTSS et leur obtention.',
        questions: [
          {
            question: 'Comment obtenir une attestation DRTSS ?',
            answer: 'Pour obtenir une attestation DRTSS, connectez-vous à votre compte, accédez à la section "Attestations DRTSS" et suivez les étapes du formulaire. Assurez-vous d\'avoir tous les documents requis numérisés avant de commencer la procédure.',
            tags: ['attestation', 'documents', 'procédure']
          },
          {
            question: 'Quel est le délai de traitement d\'une attestation DRTSS ?',
            answer: 'Le délai de traitement standard est de 48 heures ouvrables. Vous recevrez une notification par email dès que votre attestation sera disponible.',
            tags: ['délais', 'traitement', 'notification']
          }
        ]
      },
      {
        icon: 'pi pi-user',
        title: 'Compte Utilisateur',
        code: 'user',
        description: 'Tout ce que vous devez savoir sur les attestations DRTSS et leur obtention.',
        questions: [
          {
            question: 'Comment obtenir une attestation DRTSS ?',
            answer: 'Pour obtenir une attestation DRTSS, connectez-vous à votre compte, accédez à la section "Attestations DRTSS" et suivez les étapes du formulaire. Assurez-vous d\'avoir tous les documents requis numérisés avant de commencer la procédure.',
            tags: ['attestation', 'documents', 'procédure']
          },
          {
            question: 'Quel est le délai de traitement d\'une attestation DRTSS ?',
            answer: 'Le délai de traitement standard est de 48 heures ouvrables. Vous recevrez une notification par email dès que votre attestation sera disponible.',
            tags: ['délais', 'traitement', 'notification']
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