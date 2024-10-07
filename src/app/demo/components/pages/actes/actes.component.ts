import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-actes',
  templateUrl: './actes.component.html',
  styleUrl: './actes.component.css',
})
export class ActesComponent  {

  actes = [
    {
      title: 'Attestation DRTSS',
      routerLink: '/app/pages/actes/attestation-drtss'
    },
    {
      title: 'Attestation de situation cotisante CNSS',
      routerLink: '/app/pages/actes/attestation-cnss'
    },
    {
      title: 'Attestation de Situation Fiscale',
      routerLink: '/app/pages/actes/attestation-situation-fiscale'
    },
    {
      title: "Attestation de non engagement de l'Agent judiciaire de l'ETAT (AJE)",
      routerLink: '/app/pages/actes/attestation-aje'
    },
    {
      title: 'Registre du commerce et du crédit Mobilier (RCCM)',
      routerLink: '/app/pages/actes/rccm'
    },
    {
      title: 'Certificat de non faillite',
      routerLink: '/app/pages/actes/certificat-de-non-faillite'
    },
    {
      title: 'Attestation ANPE',
      routerLink: '/app/pages/actes/attestation-anpe'
    }
  ];
  
  constructor(public layoutService: LayoutService, public router: Router) { }
}
