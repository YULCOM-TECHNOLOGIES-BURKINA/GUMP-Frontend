import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent {

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
    
}