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

  requestsDrtss: DemandeDrtss[] = [];
  requestDrtss: DemandeDrtss = {};

  selectedRequests: DemandeDrtss[] = [];
  cols: any[] = [];

  displayProcessModal: boolean = false;

  totalRecords: number = 0; 

  countDrtss = 0;
  countAje= 0;

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
      this.requestsDrtss = data.content;  // Récupère le tableau des demandes
      this.totalRecords = data.totalElements;  // Récupère le nombre total d'éléments pour la pagination
      this.countDrtss = this.requestsDrtss.length;
    });
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


  deleteSelectedRequests() {
      this.deleteRequestsDialog = true;
  }

  download(file: any) {
    console.log('Téléchargement du fichier:', file);
    const url = file.path;  // Remplacez `file.url` par le champ qui contient l'URL du fichier
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  openDownloadRequest(file: any) {
    console.log('Téléchargement du fichier:', file);
    const url = file.attestation.path;  // Remplacez `file.url` par le champ qui contient l'URL du fichier
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  editRequest(requestDrtss: DemandeDrtss) {
      this.requestDrtss = { ...requestDrtss };
      // Logique d'édition ici
  }

  viewRequest(requestDrtss: DemandeDrtss) { //TODO: harmoniser les requeétes
    this.drtssService.getOneDemande(requestDrtss.id).subscribe(data => {
      this.requestDrtss = data;
    });
    this.displayProcessModal = true;
  }

  closeProcessModal() {
    this.displayProcessModal = false;
  }

  deleteRequest(requestDrtss: DemandeDrtss) {
      this.deleteRequestDialog = true;
      this.requestDrtss = { ...requestDrtss };
  }

  confirmDeleteRequest() {
      this.deleteRequestDialog = false;
      this.requestsDrtss = this.requestsDrtss.filter(val => val.requesterId !== this.requestDrtss.requesterId);
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande supprimée', life: 3000 });
      this.requestDrtss = {};
  }

  confirmDeleteSelected() {
      this.deleteRequestsDialog = false;
      this.requestsDrtss = this.requestsDrtss.filter(val => !this.selectedRequests.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande supprimées', life: 3000 });
      this.selectedRequests = [];
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
