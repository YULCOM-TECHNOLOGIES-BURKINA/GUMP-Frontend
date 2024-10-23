import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AjeService } from '../../../services/aje.service';
import { DemandeAje, DemandeAjeResponse } from '../../../models/aje';
import { Router } from '@angular/router';


@Component({
  selector: 'app-aje',
  templateUrl: './aje.component.html',
  providers: [MessageService],
})
export class TraitementAjeComponent implements OnInit {
  requests: DemandeAje[] = [];
  pendingRequests: DemandeAje[] = [];
  processingRequests: DemandeAje[] = [];
  approvedRequests: DemandeAje[] = [];
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

  req: number; 
  requesterId: string = ''; 
  attestationAnpeNumber: string = '';
  attestationCnssNumber: string = '';
  attestationAnpeDate: Date = null;
  attestationCnssDate: Date = null;

  constructor(private ajeService: AjeService, private messageService: MessageService, private router: Router) {}

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
    this.ajeService.getDemandes().subscribe((data: DemandeAjeResponse) => {
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
