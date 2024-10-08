import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DemandeService } from '../../../services/demande.service';
import { Demande } from '../../../models/demande';

@Component({
  selector: 'app-drtss',
  templateUrl: './drtss.component.html',
  providers: [MessageService],
})
export class TraitementDrtssComponent implements OnInit {
  requests: Demande[] = [];
  selectedRequest: Demande | null = null;
  selectedRequests: Demande[] = [];
  
  displayProcessModal: boolean = false;
  displayRejectModal: boolean = false;
  displayProcessDetailModal: boolean = false;
  
  rejectionReason: string = '';

  cols: any[] = [];

  one: Demande | null = null;

  constructor(private demandeService: DemandeService, private messageService: MessageService) {}

  ngOnInit() {
    this.demandeService.getDemandes().subscribe(data => {
      this.requests = data;
    });

    this.demandeService.getOneDemande().subscribe(data => {
      this.one = data;
    });


    // this.demandeService.getDemandesP().then(data => this.requests = data);

    this.cols = [
      { field: 'acte', header: 'Acte' },
      { field: 'date', header: 'Date' },
      { field: 'status', header: 'Statut' }
  ];
  }

  openViewRequest(request: Demande) {
    this.selectedRequest = { ...request };
    this.displayProcessDetailModal = true;
  }

  openProcessRequest(request: Demande) {
    this.selectedRequest = { ...request };
    this.displayProcessModal = true;
  }

  openRejectRequest(request: Demande) {
    this.selectedRequest = { ...request };
    this.displayRejectModal = true;
  }

  processRequest() {
    if (this.selectedRequest) {
      this.selectedRequest.status = 'Traité';
      this.demandeService.updateDemande(this.selectedRequest).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande traitée', life: 3000 });
        this.displayProcessModal = false;
        this.selectedRequest = null;
      });
    }
  }

  rejectRequest() {
    if (this.selectedRequest) {
      this.selectedRequest.status = 'Rejeté';
      this.selectedRequest.rejectionReason = this.rejectionReason;
      this.demandeService.updateDemande(this.selectedRequest).subscribe(() => {
        this.messageService.add({ severity: 'error', summary: 'Rejetée', detail: 'Demande rejetée', life: 3000 });
        this.displayRejectModal = false;
        this.selectedRequest = null;
        this.rejectionReason = '';
      });
    }
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
