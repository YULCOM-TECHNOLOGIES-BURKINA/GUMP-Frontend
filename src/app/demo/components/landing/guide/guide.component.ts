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
}

@Component({
    selector: 'app-guide',
    templateUrl: './guide.component.html'
})
export class GuideComponent implements OnInit {
    acts: ActGuide[] = [
        {
            id: 'drtss',
            title: 'Attestation DRTSS',
            description: 'Attestation de régularité en matière de travail et de sécurité sociale',
            icon: 'pi pi-file',
            organization: 'Direction Régionale du Travail et de la Sécurité Sociale',
            validityPeriod: '3 mois',
            processingTime: '48 heures',
            price: '10 000 FCFA',
            category: 'Travail'
        },
        {
            id: 'cnss',
            title: 'Attestation CNSS',
            description: 'Attestation de situation cotisante',
            icon: 'pi pi-shield',
            organization: 'Caisse Nationale de Sécurité Sociale',
            validityPeriod: '3 mois',
            processingTime: '24 heures',
            price: '7 500 FCFA',
            category: 'Sécurité Sociale'
        },
        {
            id: 'aje',
            title: 'Attestation AJE',
            description: 'Attestation de situation juridique des entreprises',
            icon: 'pi pi-building',
            organization: 'Agence Judiciaire de l\'État',
            validityPeriod: '3 mois',
            processingTime: '72 heures',
            price: '15 000 FCFA',
            category: 'Juridique'
        }
        // Ajoutez les autres actes de la même manière
    ];

    filteredActs: ActGuide[] = [];
    selectedCategory: string = 'all';
    searchQuery: string = '';
    sortField: string = 'title';
    sortOrder: number = 1;
    categories: any[] = [
        { label: 'Tous', value: 'all' },
        { label: 'Travail', value: 'Travail' },
        { label: 'Sécurité Sociale', value: 'Sécurité Sociale' },
        { label: 'Juridique', value: 'Juridique' }
    ];

    constructor(private router: Router) {}

    ngOnInit() {
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