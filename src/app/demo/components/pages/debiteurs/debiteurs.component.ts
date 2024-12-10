import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { HttpClient } from '@angular/common/http';

interface Debiteur {
  id?: number;
  debiteur?: string;
  promoteur?: string;
  numeroIFU?: string;
  numeroImmatriculation?: string;
  registreCommerce?: string;
  contacts?: string;
  dateNaissance?: string;
  numeroCNIB?: string;
  numeroCheque?: string;
  montantDu?: number;
}

@Component({
  selector: 'app-debiteur',
  templateUrl: './debiteurs.component.html',
  providers: [MessageService]
})
export class DebiteursComponent implements OnInit {
  @ViewChild('dt') table: Table;
  
  // Variables pour les dialogues
  displayFilters: boolean = false;
  displayViewDialog: boolean = false;
  displayEditDialog: boolean = false;
  displayNewDialog: boolean = false;
  
  // Variables pour les données
  debiteurs: Debiteur[] = [];
  filteredRequests: Debiteur[] = [];
  requests: Debiteur[] = [];
  request: Debiteur = {};
  selectedDebiteur: Debiteur | null = null;
  editingDebiteur: Debiteur | null = null;
  newDebiteur: Debiteur = {};

  totalRecords: number = 0; 
  count = 0;
  
  // Variables pour les filtres
  searchFilters = {
    debiteur: '',
    promoteur: '',
    numeroIFU: '',
    montantMin: null as number | null,
    montantMax: null as number | null
  };

  loading: boolean = false;

  private apiUrl = 'http://votre-api-url/api/debiteurs'; // À remplacer par votre URL

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getDebiteurs();
  }

  // Récupération des débiteurs
  getDebiteurs() {
    this.loading = true;
    this.http.get<Debiteur[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.debiteurs = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les débiteurs'
        });
        this.loading = false;
      }
    });
  }

  // Import du fichier CSV
  onImportCSV(event: any) {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`${this.apiUrl}/import`, formData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Import réussi',
          detail: 'Les données ont été importées avec succès'
        });
        this.getDebiteurs(); // Recharger la liste
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de l\'import du fichier'
        });
      }
    });
  }

  // Création d'un nouveau débiteur
  openNewDebiteur() {
    this.newDebiteur = {};
    this.displayNewDialog = true;
  }

  saveNewDebiteur() {
    this.loading = true;
    this.http.post(this.apiUrl, this.newDebiteur).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Débiteur ajouté avec succès'
        });
        this.getDebiteurs();
        this.displayNewDialog = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de l\'ajout du débiteur'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Édition d'un débiteur
  editDebiteur(debiteur: Debiteur) {
    this.editingDebiteur = { ...debiteur };
    this.displayEditDialog = true;
  }

  saveEdit() {
    if (this.editingDebiteur && this.editingDebiteur.id) {
      this.loading = true;
      this.http.put(`${this.apiUrl}/${this.editingDebiteur.id}`, this.editingDebiteur).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Débiteur modifié avec succès'
          });
          this.getDebiteurs();
          this.displayEditDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la modification'
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  // Voir les détails d'un débiteur
  viewDetails(debiteur: Debiteur) {
    this.selectedDebiteur = debiteur;
    this.displayViewDialog = true;
  }

  // Gestion des montants
  getMontantClass(montant: number): string {
    if (montant === 0) return 'amount-success';
    if (montant < 500000) return 'amount-warning';
    return 'amount-danger';
  }

  // Gestion des filtres
  toggleFilters() {
    this.displayFilters = !this.displayFilters;
  }

  applyFilters() {
    this.table.filter(this.searchFilters.debiteur, 'debiteur', 'contains');
    // Vous pouvez ajouter d'autres filtres selon vos besoins

    this.loading = true;

    let filtered = [...this.requests];

    // Filtre par debiteur
    if (this.searchFilters.debiteur) {
      filtered = filtered.filter(request => 
        request.debiteur?.toLowerCase().includes(this.searchFilters.debiteur.toLowerCase())
      );
    }

    this.filteredRequests = filtered;
    // Mise à jour des compteurs
    this.count = this.filteredRequests.length;

    this.loading = false;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Filtres appliqués',
      detail: `${filtered.length} demandes trouvées`,
      life: 3000
    });
  }

  clearFilters() {
    this.searchFilters = {
      debiteur: '',
      promoteur: '',
      numeroIFU: '',
      montantMin: null,
      montantMax: null
    };
    this.table.reset();

    // Réinitialisation des données
    this.filteredRequests = [...this.requests];
    
    this.messageService.add({
      severity: 'info',
      summary: 'Filtres réinitialisés',
      detail: 'Tous les filtres ont été effacés',
      life: 3000
    });
  }
}