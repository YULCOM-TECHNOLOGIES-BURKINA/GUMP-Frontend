import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit {

  items: MenuItem[] = [];

  actes: { label: string, description: string, slug: string }[] = [
      {
        label: 'Attestation DRTSS',
        description: 'Petite description de l\'acte',
        slug: 'attestation-drtss'
  
      },
      {
        label: 'Attestation de situation cotisante CNSS',
        description: 'Petite description de l\'acte',
        slug: 'attestation-de-situation-cotisante-cnss'
  
      },
      {
        label: 'Attestation de Situation Fiscale',
        description: 'Petite description de l\'acte',
        slug: 'attestation-de-situation-fiscale'
  
      },
      {
        label: 'Attestation de non engagement de l\'Agent judiciaire de l\'ETAT (AJE)',
        description: 'Petite description de l\'acte',
        slug: 'attestation-de-non-engagement-aje'
  
      },
      {
        label: ' Registre du commerce et du crédit Mobilier (RCCM)',
        description: 'Petite description de l\'acte',
        slug: 'rccm'
  
      },
      {
        label: 'Certificat de non faillite',
        description: 'Petite description de l\'acte',
        slug: 'certificat-de-non-faillite'
  
      },
      {
        label: 'Attestation ANPE',
        description: 'Petite description de l\'acte',
        slug: 'attestation-anpe'
  
      }
  ];
      
  constructor(public layoutService: LayoutService, public router: Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-home',
        routerLink: ['/']
      },
      {
        label: 'À propos',
        icon: 'pi pi-info-circle',
        routerLink: ['/about']
      },
      {
        label: 'Guide',
        icon: 'pi pi-book',
        items: [
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
        label: 'FAQ',
        icon: 'pi pi-question-circle',
        routerLink: ['/faq']
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        routerLink: ['/contact']
      }
    ];
  }
    
}
