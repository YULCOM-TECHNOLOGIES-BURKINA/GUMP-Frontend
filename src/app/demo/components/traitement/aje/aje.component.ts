import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AjeService } from '../../../services/aje.service';
import { DemandeAje, DemandeAjeResponse } from '../../../models/aje';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-aje',
  templateUrl: './aje.component.html',
  providers: [MessageService],
  styles: [`
    .expired-row {
      background-color: #ffebee !important;
    }
    .warning-text {
      color: #FF9800 !important;
    }
    .expired-text {
      color: #f44336 !important;
    }
    .valid-text {
      color: #4CAF50 !important;
    }

    .search-panel {
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 1rem;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .filter-header h6 {
      margin: 0;
      color: #495057;
    }

    .search-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .filter-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    :host ::ng-deep .p-calendar {
      width: 100%;
    }

    :host ::ng-deep .custom-filter-button .p-button-icon {
      margin-right: 0.5rem;
    }

    :host ::ng-deep .p-button.filter-clear {
      background: #fff;
      border: 1px solid #ced4da;
      color: #495057;
    }

    :host ::ng-deep .p-button.filter-clear:hover {
      background: #f8f9fa;
      border-color: #ced4da;
    }
  `]
})
export class TraitementAjeComponent implements OnInit {
  @ViewChild('dt') table: Table;
  displayFilters: boolean = false;
  statuses: any[];
  dateRange: Date[] = [new Date(), new Date()]; // Initialisé avec des dates par défaut
  showRangeCalendar: boolean = true; // Pour forcer le réaffichage si nécessaire
  maxDate: Date = new Date(); // Pour empêcher la sélection de dates futures
  filteredRequests: DemandeAje[] = [];
  searchFilters = {
    demandeur: '',
    contractReference: '',
    status: null,
    dateStart: null,
    dateEnd: null
  };

  loading: boolean = false;

  requests: DemandeAje[] = [];
  pendingRequests: DemandeAje[] = [];
  processingRequests: DemandeAje[] = [];
  approvedRequests: DemandeAje[] = [];
  rejectedRequests: DemandeAje[] = [];
  selectedRequest: DemandeAje | null = null;
  selectedRequests: DemandeAje[] = [];
  request: DemandeAje = {};
  
  displayProcessModal: boolean = false;
  displayRejectModal: boolean = false;
  displayProcessDetailModal: boolean = false;
  
  rejectionReason: string = '';

  cols: any[] = [];

  one: DemandeAje | null = null;

  totalRecords: number = 0; 
  countPending = 0;
  countProcessing = 0;
  countApproved = 0;
  countRejected = 0;

  req: number; 
  requesterId: string = ''; 
  attestationAnpeNumber: string = '';
  attestationCnssNumber: string = '';
  attestationAnpeDate: Date = null;
  attestationCnssDate: Date = null;

  readonly VALIDITY_HOURS = 72;
  readonly WARNING_HOURS = 48; 

  userRole: string = '';

  constructor(
    private ajeService: AjeService, 
    private messageService: MessageService, 
    private router: Router
  ) {
      this.initializeStatuses();
  }

  ngOnInit() {
    const savedUser = localStorage.getItem('currentUser');
    this.userRole=  JSON.parse(savedUser).role ;
    this.getDemandes();
    this.setupValidityCheck();
    this.initializeColumns();
  }

  private initializeStatuses() {
    this.statuses = [
      { label: 'Tous les statuts', value: null },
      { label: 'En attente', value: 'PENDING' },
      { label: 'En cours', value: 'PROCESSING' },
      { label: 'Approuvé', value: 'APPROVED' },
      { label: 'Rejeté', value: 'REJECTED' }
    ];
  }

  private initializeColumns() {
    this.cols = [
      { field: 'demandeur', header: 'Demandeur' },
      { field: 'reference', header: 'Ref. du contrat' },
      { field: 'createdAt', header: 'Date de demande' },
      { field: 'status', header: 'Statut' }
    ];
  }

  setupValidityCheck() {
    // Vérifier la validité toutes les heures
    interval(3600000).subscribe(() => {
      this.checkValidityAndNotify();
    });
  }

  checkValidityAndNotify() {
    this.requests.forEach(request => {
      const daysLeft = this.calculateDaysLeft(request.createdAt);
      if (daysLeft <= this.WARNING_HOURS && daysLeft > 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Attention',
          detail: `La demande ${request.id} expire dans ${daysLeft} heures`,
          life: 60000
        });
      }
    });
  }

  calculateDaysLeft(createdAt: string): number {
    const created = new Date(createdAt);
    const expirationDate = new Date(created.getTime() + this.VALIDITY_HOURS  * 60 * 60 * 1000);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 ));
  }

  isExpired(createdAt: string): boolean {
    return this.calculateDaysLeft(createdAt) <= 0;
  }

  getValidityStatus(createdAt: string) {
    const daysLeft = this.calculateDaysLeft(createdAt);
    
    if (daysLeft <= 0) {
      return {
        text: 'Expiré',
        class: 'expired-text',
        severity: 'danger'
      };
    } else if (daysLeft <= this.WARNING_HOURS) {
      return {
        text: `${daysLeft} heures restantes`,
        class: 'warning-text',
        severity: 'warning'
      };
    } else {
      return {
        text: `${daysLeft} heures restantes`,
        class: 'valid-text',
        severity: 'success'
      };
    }
  }

  getTranslatedStatus(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'Approuvée';
      case 'PROCESSING':
        return 'En cours de traitement';
      case 'REJECTED':
        return 'Rejetée';
      case 'PENDING':
        return 'En attente';
      default:
        return status;  // Si le statut est inconnu, on le retourne tel quel
    }
  }

  getDemandes() { 
    this.loading = true;
    this.ajeService.getDemandes().subscribe((data: DemandeAjeResponse) => {
      this.requests = data.content.filter(request => request.isPaid === true);  
      this.totalRecords = this.requests.length; 
      this.filteredRequests = [...this.requests];
      this.categorizeRequests();
      this.loading = false;
    });
    this.loading = false;
  }

  openViewRequest(request: DemandeAje) {
    this.ajeService.getOneDemande(request.id).subscribe(data => {
      this.request = data;
    });
    this.displayProcessDetailModal = true;
  }

  openProcessRequest(request: DemandeAje) {
    this.ajeService.getOneDemande(request.id).subscribe(data => {
      this.request = data;
    });
    this.displayProcessModal = true;
  }

  openRejectRequest(request: DemandeAje) {
    this.ajeService.getOneDemande(request.id).subscribe(data => {
      this.request = data;
    });
    this.displayRejectModal = true;
  }

  processReviewRequest(identifiant) {
    this.ajeService.reviewRequest(identifiant).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Demande traitée et en attente de validation',
          life: 3000
        });
        this.displayProcessModal = false;
        setTimeout(() => {
          this.router.navigate(['/app/traitement/aje']); 
        }, 500); 
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de la validation de la demande.',
          life: 3000
        });
      }
    });
}

  openDownloadRequest(file: any) {
    console.log('Téléchargement du fichier:', file);
    const url = file.attestation.path;
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  download(file: any) {
    console.log('Téléchargement du fichier:', file);
    const url = file.path;
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }


  processRequest(req: number) {
    this.ajeService.approveRequest(req).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Demande approuvée et attestation générée!',
          life: 3000
        });
        setTimeout(() => {
          this.router.navigate(['/app/traitement/aje']); 
        }, 500); 
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de l\'approbation de la demande.',
          life: 3000
        });
      }
    });
  }

  rejectRequest(req: number) {
    this.ajeService.rejectRequest(req).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Demande rejettée!',
          life: 3000
        });
        setTimeout(() => {
          this.router.navigate(['/app/traitement/aje']); 
        }, 500); 
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de l\'approbation de la demande.',
          life: 3000
        });
      }
    });
  }

  closeProcessModal() {
    this.displayProcessModal = false;
  }

  closeRejectModal() {
    this.displayRejectModal = false;
    this.rejectionReason = '';
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  toggleFilters() {
    this.displayFilters = !this.displayFilters;
  }

  onDateSelect(event: any) {
    // Vérifiez si les deux dates sont sélectionnées
    if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
      // Assurez-vous que les dates sont des objets Date valides
      this.dateRange = this.dateRange.map(date => {
        if (date && !(date instanceof Date)) {
          return new Date(date);
        }
        return date;
      });
    }
  }

  applyFilters() {
    this.loading = true;

    let filtered = [...this.requests];
    
    // Filtre par demandeur
    // if (this.searchFilters.demandeur) {
    //   filtered = filtered.filter(request => 
    //     request.demandeur?.toLowerCase().includes(this.searchFilters.demandeur.toLowerCase())
    //   );
    // }

    // Filtre par référence
    if (this.searchFilters.contractReference) {
      filtered = filtered.filter(request => 
        request.contractReference?.toLowerCase().includes(this.searchFilters.contractReference.toLowerCase())
      );
    }

    // Filtre par statut
    if (this.searchFilters.status) {
      filtered = filtered.filter(request => 
        request.status === this.searchFilters.status
      );
    }


    // Filtre par date - Avec vérifications de sécurité renforcées
    if (this.dateRange && Array.isArray(this.dateRange) && this.dateRange.length === 2) {
      filtered = filtered.filter(request => {
        try {
          if (!request.createdAt) return false;
          
          const requestDate = new Date(request.createdAt);
          
          // Vérification de la validité de la date
          if (!requestDate || isNaN(requestDate.getTime())) return false;
          
          const startDate = this.dateRange[0] ? new Date(this.dateRange[0]) : null;
          const endDate = this.dateRange[1] ? new Date(this.dateRange[1]) : null;

          if (startDate && endDate) {
            // Clone la date de fin et ajoute un jour pour inclure toute la journée
            const endDatePlusOne = new Date(endDate);
            endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
            return requestDate >= startDate && requestDate < endDatePlusOne;
          } else if (startDate) {
            return requestDate >= startDate;
          } else if (endDate) {
            const endDatePlusOne = new Date(endDate);
            endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
            return requestDate < endDatePlusOne;
          }
        } catch (error) {
          console.error('Error filtering date:', error);
          return false;
        }
        return true;
      });
    }

    // Mise à jour des listes filtrées
    this.filteredRequests = filtered;
    this.pendingRequests = filtered.filter(request => request.status === 'PENDING');
    this.processingRequests = filtered.filter(request => request.status === 'PROCESSING');
    this.approvedRequests = filtered.filter(request => request.status === 'APPROVED');

    // Mise à jour des compteurs
    this.countPending = this.pendingRequests.length;
    this.countProcessing = this.processingRequests.length;
    this.countApproved = this.approvedRequests.length;

    this.loading = false;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Filtres appliqués',
      detail: `${filtered.length} demandes trouvées`,
      life: 3000
    });
  }

  clearFilters() {
    // Réinitialisation des filtres
    this.searchFilters = {
      demandeur: '',
      contractReference: '',
      status: null,
      dateStart: null,
      dateEnd: null
    };
    this.clearDateRange();
    
    // Réinitialisation des données
    this.filteredRequests = [...this.requests];
    this.categorizeRequests();
    
    this.messageService.add({
      severity: 'info',
      summary: 'Filtres réinitialisés',
      detail: 'Tous les filtres ont été effacés',
      life: 3000
    });
  }

  clearDateRange() {
    this.dateRange = [null, null];
    this.showRangeCalendar = false;
    setTimeout(() => {
        this.showRangeCalendar = true;
    });
  }

  categorizeRequests() {
    const requestsToUse = this.filteredRequests || this.requests;
    
    this.pendingRequests = requestsToUse.filter(request => request.status === 'PENDING');
    this.processingRequests = requestsToUse.filter(request => request.status === 'PROCESSING');
    this.approvedRequests = requestsToUse.filter(request => request.status === 'APPROVED');
    this.rejectedRequests = requestsToUse.filter(request => request.status === 'REJECTED');

    this.countPending = this.pendingRequests.length;
    this.countProcessing = this.processingRequests.length;
    this.countApproved = this.approvedRequests.length;
    this.countRejected = this.rejectedRequests.length;
  }
}
