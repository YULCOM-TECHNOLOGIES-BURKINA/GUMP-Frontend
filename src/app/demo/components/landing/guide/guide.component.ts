import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface ActGuide {
    id: string;
    title: string;
    description: string;
    icon: string;
    organization: string;
    validityPeriod: string;
    processingTime: string;
    price: string;
    category: string;
    img: string; // Chemin vers l'image de l'acte
}

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html'
})
export class GuideComponent implements OnInit {
    acts: ActGuide[] = [
      {
        id: 'cnss',
        title: 'Attestation CNSS',
        description: 'Attestation de situation cotisante',
        icon: 'pi pi-building',
        organization: 'Agence Judiciaire de l\'État',
        validityPeriod: '3 mois',
        processingTime: '24 heures',
        price: '7 500 FCFA',
        category: 'Fonction Publique',
        img:'assets/cnss.jpg'
      },
      {
        id: 'rccm',
        title: 'Attestation d\'inscription au RCCM',
        description: 'Registre du commerce et du crédit Mobilier',
        icon: 'pi pi-building',
        organization: 'Agence Judiciaire de l\'État',
        validityPeriod: '3 mois',
        processingTime: '72 heures',
        price: '15 000 FCFA',
        category: 'Justice',
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
        category: 'Emploi',
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
          category: 'Fonction Publique',
          img:'assets/image.png'
        },
        {
          id: 'aje',
          title: 'Attestation de non engagement(AJE)',
          description: 'Attestation de non engagement de l\'Agent judiciaire de l\'ETAT (AJE)',
          icon: 'pi pi-building',
          organization: 'Agence Judiciaire de l\'État',
          validityPeriod: '3 mois',
          processingTime: '24 heures',
          price: '1 000 FCFA',
          category: 'Justice',
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
          category: 'Justice',
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
          category: 'Finances',
          img:'assets/dgi.png'
        }
    ];

    filteredActs: ActGuide[] = [];
    selectedCategory: string = 'all';
    searchQuery: string = '';
    sortField: string = 'title';
    sortOrder: number = 1;
    categories: any[] = [
        { label: 'Tous', value: 'all' },
        { label: 'Fonction Publique', value: 'Fonction Publique' },
        { label: 'Finances', value: 'Finances' },
        { label: 'Justice', value: 'Justice' }
    ];

    constructor(private router: Router) {}

    ngOnInit() {
      if (localStorage.getItem('currentUser') !== null) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user.role.includes('USER')){
          this.router.navigate(['app/']);
        }
      }

      this.filteredActs = [...this.acts];
    }

    filterActs() {
        this.filteredActs = this.acts.filter(act => {
            const matchesCategory = this.selectedCategory === 'all' || act.category === this.selectedCategory;
            const matchesSearch = !this.searchQuery ||
                act.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                act.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }

    navigateToDetail(actId: string) {
        this.router.navigate(['/guide', actId]);
    }

    sortActs(field: string) {
        this.sortField = field;
        this.sortOrder = this.sortOrder * -1;
        this.filteredActs.sort((a: any, b: any) => {
            const valueA = a[field];
            const valueB = b[field];
            return this.sortOrder * (valueA < valueB ? -1 : 1);
        });
    }
}