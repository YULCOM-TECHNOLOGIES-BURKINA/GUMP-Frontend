import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';


interface ActGuide {
  id: string;
  title: string;
  description: string;
  icon: string;
  organization: string;
  validityPeriod: string;
  processingTime: string;
  price: string;
  img: string;
}
@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit {

  statistics: any[] = [];

  acts: ActGuide[] = [
    {
      id: 'rccm',
      title: 'Attestation d\'inscription au RCCM',
      description: 'Registre du commerce et du crédit Mobilier',
      icon: 'pi pi-building',
      organization: 'Agence Judiciaire de l\'État',
      validityPeriod: '3 mois',
      processingTime: '72 heures',
      price: '15 000 FCFA',
      img:'assets/justice.jpg'
    },
    {
      id: 'anpe',
      title: 'Attestation ANPE',
      description: 'Attestation desc',
      icon: 'pi pi-building',
      organization: 'Agence Judiciaire de l\'État',
      validityPeriod: '3 mois',
      processingTime: '72 heures',
      price: '15 000 FCFA',
      img:'assets/anpe.jpg'
    },
    {
      id: 'drtps',
      title: 'Attestation DRTPS',
      description: 'Attestation de régularité en matière de travail et de protection sociale',
      icon: 'pi pi-file',
      organization: 'Direction Régionale du Travail et de la Protection Sociale',
      validityPeriod: '3 mois',
      processingTime: '48 heures',
      price: '10 000 FCFA',
      img:'assets/image.png'
    },
    {
      id: 'aje',
      title: 'Attestation de non engagement (AJE)',
      description: 'Attestation de non engagement de l\'Agent judiciaire de l\'ETAT (AJE)',
      icon: 'pi pi-building',
      organization: 'Agence Judiciaire de l\'État',
      validityPeriod: '3 mois',
      processingTime: '72 heures',
      price: '15 000 FCFA',
      img:'assets/justice.jpg'
    },
   
    {
      id: 'cnf',
      title: 'Certificat de non faillite',
      description: 'Attestation de situation juridique des entreprises',
      icon: 'pi pi-building',
      organization: 'Agence Judiciaire de l\'État',
      validityPeriod: '3 mois',
      processingTime: '72 heures',
      price: '15 000 FCFA',
      img:'assets/justice.jpg'
    },
    {
      id: 'asf',
      title: 'Attestation de Situation Fiscale',
      description: 'Attestation de Situation Fiscale',
      icon: 'pi pi-building',
      organization: 'Agence Judiciaire de l\'État',
      validityPeriod: '3 mois',
      processingTime: '72 heures',
      price: '15 000 FCFA',
      img:'assets/dgi.png'
    }
  ];
      
  constructor(public layoutService: LayoutService, public router: Router) { }

  ngOnInit() {

    if (localStorage.getItem('currentUser') !== null) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user.role.includes('USER')){
        this.router.navigate(['']);
      } else{
        this.router.navigate(['app/']);
      }
    }

    this.statistics = [
      {
        value: '50K+',
        label: 'Utilisateurs',
        icon: 'pi pi-users',
        color: 'bg-green-100 text-green-700'
      },
      {
        value: '100K+',
        label: 'Documents traités',
        icon: 'pi pi-file',
        color: 'bg-blue-100 text-blue-700'
      },
      {
        value: '99.9%',
        label: 'Disponibilité',
        icon: 'pi pi-check-circle',
        color: 'bg-purple-100 text-purple-700'
      },
      {
        value: '24/7',
        label: 'Support',
        icon: 'pi pi-phone',
        color: 'bg-yellow-100 text-yellow-700'
      }
    ];
  }

  navigateToDetail(actId: string) {
    this.router.navigate(['/guide', actId]);
  }
    
}
