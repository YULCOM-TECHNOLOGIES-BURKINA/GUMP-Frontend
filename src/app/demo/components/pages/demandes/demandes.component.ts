import { Component, OnInit } from '@angular/core';
import { Demande } from '../../../models/demande';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DemandeService } from '../../../services/demande.service';

@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.component.html',
  providers: [MessageService]
})
export class DemandesComponent implements OnInit {

  deleteRequestDialog: boolean = false;
  deleteRequestsDialog: boolean = false;

  requests: Demande[] = [];
  request: Demande = {};

  selectedRequests: Demande[] = [];
  cols: any[] = [];

  displayProcessModal: boolean = false;

  one: Demande | null = null;

  constructor(private demandeService: DemandeService, private messageService: MessageService) { }

  ngOnInit() {
      // Récupération des demandes via un service qui gère l'appel API pour chaque acte.
      this.demandeService.getDemandes().subscribe(data => {
        this.requests = data;
      });

    //   this.demandeService.getOneDemande().subscribe(data => {
    //     this.requests = data;
    //   });

    this.demandeService.getOneDemande().subscribe(data => {
        this.one = data;
      });

      this.cols = [
          { field: 'acte', header: 'Acte' },
          { field: 'date', header: 'Date' },
          { field: 'status', header: 'Statut' }
      ];
  }

  deleteSelectedRequests() {
      this.deleteRequestsDialog = true;
  }

  download() {
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  editRequest(request: Demande) {
      this.request = { ...request };
      // Logique d'édition ici
  }

  viewRequest(request: Demande) {
    this.request = { ...request };
    this.displayProcessModal = true;
  }

  closeProcessModal() {
    this.displayProcessModal = false;
  }

  deleteRequest(request: Demande) {
      this.deleteRequestDialog = true;
      this.request = { ...request };
  }

  confirmDeleteRequest() {
      this.deleteRequestDialog = false;
      this.requests = this.requests.filter(val => val.id !== this.request.id);
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande supprimée', life: 3000 });
      this.request = {};
  }

  confirmDeleteSelected() {
      this.deleteRequestsDialog = false;
      this.requests = this.requests.filter(val => !this.selectedRequests.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demandes supprimées', life: 3000 });
      this.selectedRequests = [];
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
