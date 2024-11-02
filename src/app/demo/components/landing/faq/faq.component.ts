import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

interface FAQCategory {
  icon: string;
  title: string;
  questions: FAQ[];
}

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html'
})
export class FAQComponent implements OnInit {
  categories: FAQCategory[] = [];
  selectedCategory: FAQCategory | null = null;
  searchQuery: string = '';

  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-home',
        routerLink: ['/']
      },
      {
        label: 'Guide d\'utilisation',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Textes reglémentaires',
            icon: 'pi pi-file-pdf',
            routerLink: ['/about']
          },
          {
            label: 'DRTSS',
            icon: 'pi pi-file',
            routerLink: ['/guide/drtss']
          },
          {
            label: 'AJE',
            icon: 'pi pi-file',
            routerLink: ['/guide/aje']
          },
          {
            label: 'CNSS',
            icon: 'pi pi-file',
            routerLink: ['/guide/cnss']
          },
          {
            label: 'ANPE',
            icon: 'pi pi-file',
            routerLink: ['/guide/anpe']
          },
          {
            label: 'ASF',
            icon: 'pi pi-file',
            routerLink: ['/guide/asf']
          }
        ]
      },
      {
        label: 'Vérification',
        icon: 'pi pi-check-circle',
        routerLink: ['/verification']
      },
      {
        label: 'FAQ',
        icon: 'pi pi-question-circle',
        routerLink: ['/faq']
      }
      // {
      //   label: 'Contact',
      //   icon: 'pi pi-envelope',
      //   routerLink: ['/contact']
      // }
    ];

    this.categories = [
      {
        icon: 'pi pi-file',
        title: 'Attestations DRTSS',
        questions: [
          {
            question: 'Comment obtenir une attestation DRTSS ?',
            answer: 'Pour obtenir une attestation DRTSS, connectez-vous à votre compte, accédez à la section "Attestations DRTSS" et suivez les étapes du formulaire. Assurez-vous d\'avoir tous les documents requis numérisés avant de commencer la procédure.'
          },
          {
            question: 'Quel est le délai de traitement d\'une attestation DRTSS ?',
            answer: 'Le délai de traitement standard est de 48 heures ouvrables. Vous recevrez une notification par email dès que votre attestation sera disponible.'
          }
        ]
      },
      {
        icon: 'pi pi-briefcase',
        title: 'Services CNSS',
        questions: [
          {
            question: 'Comment vérifier mon statut CNSS ?',
            answer: 'Vous pouvez vérifier votre statut CNSS en vous connectant à votre espace personnel et en consultant la section "Situation CNSS". Les informations sont mises à jour en temps réel.'
          },
          {
            question: 'Que faire en cas de problème de paiement CNSS ?',
            answer: 'En cas de problème de paiement, contactez d\'abord le service support via le formulaire dédié. Un agent vous contactera sous 24h pour résoudre votre problème.'
          }
        ]
      },
      {
        icon: 'pi pi-user',
        title: 'Compte Utilisateur',
        questions: [
          {
            question: 'Comment créer un compte sur la plateforme ?',
            answer: 'Pour créer un compte, cliquez sur "Connexion" puis "Créer un compte". Vous devrez fournir une adresse email valide, vos informations personnelles et professionnelles, puis valider votre compte via le lien envoyé par email.'
          },
          {
            question: 'J\'ai oublié mon mot de passe, que faire ?',
            answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Entrez votre adresse email et suivez les instructions envoyées pour réinitialiser votre mot de passe.'
          }
        ]
      }
    ];

    this.selectedCategory = this.categories[0];
  }

  selectCategory(category: FAQCategory) {
    this.selectedCategory = category;
  }

  filterQuestions(category: FAQCategory): FAQ[] {
    if (!this.searchQuery) return category.questions;
    
    return category.questions.filter(faq =>
      faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}