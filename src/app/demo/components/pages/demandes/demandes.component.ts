import { Component, OnInit } from '@angular/core';
import { DemandeDrtss, DemandeDrtssResponse } from '../../../models/drtss';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DrtssService } from '../../../services/drtss.service';

@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.component.html',
  providers: [MessageService]
})
export class DemandesComponent implements OnInit {

  deleteRequestDialog: boolean = false;
  deleteRequestsDialog: boolean = false;

  requests: DemandeDrtss[] = [];
  request: DemandeDrtss = {};

  selectedRequests: DemandeDrtss[] = [];
  cols: any[] = [];

  displayProcessModal: boolean = false;

  totalRecords: number = 0; 

  // one: DemandeDrtss | null = null;

  constructor(private drtssService: DrtssService, private messageService: MessageService) { }

  ngOnInit() {
      // Récupération des demandes via un service qui gère l'appel API pour chaque acte.
      this.getDemandes();


      this.cols = [
          { field: 'acte', header: 'Acte' },
          { field: 'createdAt', header: 'Date' },
          { field: 'status', header: 'Statut' }
      ];
  }

   // Méthode pour récupérer les demandes
   getDemandes() {
    this.drtssService.getDemandes().subscribe((data: DemandeDrtssResponse) => {
      this.requests = data.content;  // Récupère le tableau des demandes
      this.totalRecords = data.totalElements;  // Récupère le nombre total d'éléments pour la pagination
    });
  }

  deleteSelectedRequests() {
      this.deleteRequestsDialog = true;
  }

  download() {
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  editRequest(request: DemandeDrtss) {
      this.request = { ...request };
      // Logique d'édition ici
  }

  viewRequest(request: DemandeDrtss) { //TODO: harmoniser les requeétes
    this.drtssService.getOneDemande(request.requesterId).subscribe(data => {
      this.request = data;
    });
    this.displayProcessModal = true;
  }

  closeProcessModal() {
    this.displayProcessModal = false;
  }

  deleteRequest(request: DemandeDrtss) {
      this.deleteRequestDialog = true;
      this.request = { ...request };
  }

  confirmDeleteRequest() {
      this.deleteRequestDialog = false;
      this.requests = this.requests.filter(val => val.requesterId !== this.request.requesterId);
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande supprimée', life: 3000 });
      this.request = {};
  }

  confirmDeleteSelected() {
      this.deleteRequestsDialog = false;
      this.requests = this.requests.filter(val => !this.selectedRequests.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande supprimées', life: 3000 });
      this.selectedRequests = [];
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
