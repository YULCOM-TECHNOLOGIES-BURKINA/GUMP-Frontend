import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DrtssService } from '../../../services/drtss.service';
import { DemandeDrtss } from '../../../models/drtss';

@Component({
  selector: 'app-drtss',
  templateUrl: './drtss.component.html',
  providers: [MessageService],
})
export class TraitementDrtssComponent implements OnInit {
  requests: DemandeDrtss[] = [];
  selectedRequest: DemandeDrtss | null = null;
  selectedRequests: DemandeDrtss[] = [];
  
  displayProcessModal: boolean = false;
  displayRejectModal: boolean = false;
  displayProcessDetailModal: boolean = false;
  
  rejectionReason: string = '';

  cols: any[] = [];

  one: DemandeDrtss | null = null;

  constructor(private drtssService: DrtssService, private messageService: MessageService) {}

  ngOnInit() {
    this.drtssService.getDemandes().subscribe(data => {
      this.requests = data;
    });

    // this.drtssService.getOneDemande().subscribe(data => {
    //   this.one = data;
    // });


    this.cols = [
      { field: 'acte', header: 'Acte' },
      { field: 'date', header: 'Date' },
      { field: 'status', header: 'Statut' }
  ];
  }

  openViewRequest(request: DemandeDrtss) {
    this.selectedRequest = { ...request };
    this.displayProcessDetailModal = true;
  }

  openProcessRequest(request: DemandeDrtss) {
    this.selectedRequest = { ...request };
    this.displayProcessModal = true;
  }

  openRejectRequest(request: DemandeDrtss) {
    this.selectedRequest = { ...request };
    this.displayRejectModal = true;
  }

  download() {
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  // processRequest() {
  //   if (this.selectedRequest) {
  //     this.selectedRequest.status = 'Traité';
  //     this.drtssService.updateDemande(this.selectedRequest).subscribe(() => {
  //       this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande traitée', life: 3000 });
  //       this.displayProcessModal = false;
  //       this.selectedRequest = null;
  //     });
  //   }
  // }

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
