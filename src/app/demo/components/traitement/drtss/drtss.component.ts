import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DrtssService } from '../../../services/drtss.service';
import { DemandeDrtss, DemandeDrtssResponse } from '../../../models/drtss';

@Component({
  selector: 'app-drtss',
  templateUrl: './drtss.component.html',
  providers: [MessageService],
})
export class TraitementDrtssComponent implements OnInit {
  requests: DemandeDrtss[] = [];
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

  requesterId: string = ''; 
  attestationAnpeNumber: string = '';
  attestationCnssNumber: string = '';
  attestationAnpeDate: Date = null;
  attestationCnssDate: Date = null;

  constructor(private drtssService: DrtssService, private messageService: MessageService) {}

  ngOnInit() {
    this.getDemandes();

    this.cols = [
      { field: 'acte', header: 'Acte' },
      { field: 'createdAt', header: 'Date' },
      { field: 'status', header: 'Statut' }
    ];
  }

  getDemandes() {
    this.drtssService.getDemandes().subscribe((data: DemandeDrtssResponse) => {
      this.requests = data.content;  // Récupère le tableau des demandes
      this.totalRecords = data.totalElements;  // Récupère le nombre total d'éléments pour la pagination
    });
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

  download(file: any) {
    console.log('Téléchargement du fichier:', file);
    const url = file.path;  // Remplacez `file.url` par le champ qui contient l'URL du fichier
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  processRequest() {
    if (this.selectedRequest) {
      const formData = new FormData();
      formData.append('attestationAnpeNumber', this.attestationAnpeNumber);
      formData.append('attestationAnpeDate', this.attestationAnpeDate ? this.attestationAnpeDate.toISOString().split('T')[0] : '');
      formData.append('attestationCnssNumber', this.attestationCnssNumber);
      formData.append('attestationCnssDate', this.attestationCnssDate ? this.attestationCnssDate.toISOString().split('T')[0] : '');

      this.drtssService.approveRequest(this.selectedRequest.id, formData).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Demande traitée et approuvée',
          life: 3000
        });
        this.displayProcessModal = false;
        this.selectedRequest = null;
      });
    }
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
