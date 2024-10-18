import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DrtssService } from '../../../services/drtss.service';
import { DemandeDrtss, DemandeDrtssResponse } from '../../../models/drtss';
import { Router } from '@angular/router';


@Component({
  selector: 'app-drtss',
  templateUrl: './drtss.component.html',
  providers: [MessageService],
})
export class TraitementDrtssComponent implements OnInit {
  requests: DemandeDrtss[] = [];
  pendingRequests: DemandeDrtss[] = [];
  processingRequests: DemandeDrtss[] = [];
  approvedRequests: DemandeDrtss[] = [];
  selectedRequest: DemandeDrtss | null = null;
  selectedRequests: DemandeDrtss[] = [];
  request: DemandeDrtss = {};
  
  displayProcessModal: boolean = false;
  displayRejectModal: boolean = false;
  displayProcessDetailModal: boolean = false;
  
  rejectionReason: string = '';

  cols: any[] = [];

  one: DemandeDrtss | null = null;

  totalRecords: number = 0; 
  countPending = 0;
  countProcessing = 0;
  countApproved = 0;

  requesterId: string = ''; 
  attestationAnpeNumber: string = '';
  attestationCnssNumber: string = '';
  attestationAnpeDate: Date = null;
  attestationCnssDate: Date = null;

  constructor(private drtssService: DrtssService, private messageService: MessageService, private router: Router) {}

  ngOnInit() {
    this.getDemandes();

    this.cols = [
      { field: 'acte', header: 'Acte' },
      { field: 'createdAt', header: 'Date' },
      { field: 'status', header: 'Statut' }
    ];
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
    this.drtssService.getDemandes().subscribe((data: DemandeDrtssResponse) => {
      this.requests = data.content;  // Récupère le tableau des demandes
      this.totalRecords = data.totalElements;  // Récupère le nombre total d'éléments pour la pagination
      this.categorizeRequests();
    });
  }

  categorizeRequests() {
    this.pendingRequests = this.requests.filter(request => request.status === 'PENDING');
    this.processingRequests = this.requests.filter(request => request.status === 'PROCESSING');
    this.approvedRequests = this.requests.filter(request => request.status === 'APPROVED');

    this.countPending = this.pendingRequests.length;
    this.countProcessing = this.processingRequests.length;
    this.countApproved = this.approvedRequests.length;
  }

  openViewRequest(request: DemandeDrtss) {
    this.drtssService.getOneDemande(request.id).subscribe(data => {
      this.request = data;
    });
    this.displayProcessDetailModal = true;
  }

  openProcessRequest(request: DemandeDrtss) {
    this.drtssService.getOneDemande(request.id).subscribe(data => {
      this.request = data;
    });
    this.displayProcessModal = true;
  }

  openRejectRequest(request: DemandeDrtss) {
    this.drtssService.getOneDemande(request.id).subscribe(data => {
      this.request = data;
    });
    this.displayRejectModal = true;
  }

  openDownloadRequest(file: any) {
    console.log('Téléchargement du fichier:', file);
    const url = file.attestation.path;  // Remplacez `file.url` par le champ qui contient l'URL du fichier
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  download(file: any) {
    console.log('Téléchargement du fichier:', file);
    const url = file.path;  // Remplacez `file.url` par le champ qui contient l'URL du fichier
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  isFormValid(): boolean {
    return !!this.attestationAnpeNumber 
         && !!this.attestationAnpeDate 
         && !!this.attestationCnssNumber 
         && !!this.attestationCnssDate;
  }

  processRequest() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Tous les champs sont obligatoires. Veuillez les remplir.',
        life: 3000
      });
      return;
    }
    if (this.request) {
      const requestData = {
        attestationAnpeNumber: this.attestationAnpeNumber,
        attestationAnpeDate: this.attestationAnpeDate ? this.attestationAnpeDate.toISOString().split('T')[0] : '',
        attestationCnssNumber: this.attestationCnssNumber,
        attestationCnssDate: this.attestationCnssDate ? this.attestationCnssDate.toISOString().split('T')[0] : ''
      };

      this.drtssService.approveRequest(this.request.id, requestData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Demande approuvée et attestation générée!',
            life: 3000
          });
          this.displayProcessModal = false;
          this.request = null;
          setTimeout(() => {
            this.router.navigate(['/app/traitement/drtss']); 
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
  }


  processReviewRequest(identifiant) {
      this.drtssService.reviewRequest(identifiant).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Demande traitée et en attente de validation',
            life: 3000
          });
          this.displayProcessModal = false;
          setTimeout(() => {
            this.router.navigate(['/app/traitement/drtss']); 
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

  // rejectRequest() {
  //   if (this.selectedRequest) {
  //     this.selectedRequest.status = 'Rejeté';
  //     this.selectedRequest.rejectionReason = this.rejectionReason;
  //     this.drtssService.updateDemande(this.selectedRequest).subscribe(() => {
  //       this.messageService.add({ severity: 'error', summary: 'Rejetée', detail: 'Demande rejetée', life: 3000 });
  //       this.displayRejectModal = false;
  //       this.selectedRequest = null;
  //       this.rejectionReason = '';
  //     });
  //   }
  // }

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
}
