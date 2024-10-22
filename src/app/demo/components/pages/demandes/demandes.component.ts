import { Component, OnInit } from '@angular/core';
import { DemandeDrtss, DemandeDrtssResponse } from '../../../models/drtss';
import { DemandeAje, DemandeAjeResponse } from '../../../models/aje';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DrtssService } from '../../../services/drtss.service';
import { AjeService } from '../../../services/aje.service';

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

  requestsAje: DemandeAje[] = [];
  requestAje: DemandeAje = {};

  selectedDrtssRequests: DemandeDrtss[] = [];
  selectedAjeRequests: DemandeAje[] = [];

  cols: any[] = [];

  displayProcessModal: boolean = false;

  totalRecords: number = 0; 
  totalRecordsAje: number = 0; 

  countDrtss = 0;
  countAje= 0;


  constructor(private drtssService: DrtssService, private ajeService: AjeService, private messageService: MessageService) { }

  ngOnInit() {
      this.getDemandesDrtss();
      this.getDemandesAje();


      this.cols = [
          { field: 'acte', header: 'Acte' },
          { field: 'createdAt', header: 'Date' },
          { field: 'status', header: 'Statut' }
      ];
  }

  getDemandesDrtss() {
    this.drtssService.getDemandes().subscribe((data: DemandeDrtssResponse) => {
      this.requestsDrtss = data.content;
      this.totalRecords = data.totalElements;
      this.countDrtss = this.requestsDrtss.length;
    });
  }

  getDemandesAje() {
    this.ajeService.getDemandes().subscribe((data: DemandeAjeResponse) => {
      this.requestsAje = data.content;
      this.totalRecordsAje = data.totalElements;
      this.countAje= this.requestsAje.length;
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
        return status;
    }
  }


  deleteSelectedRequests() {
      this.deleteRequestsDialog = true;
  }

  download(file: any) {
    console.log('Téléchargement du fichier:', file);
    const url = file.path;
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  openDownloadRequest(file: any) {
    console.log('Téléchargement du fichier:', file);
    const url = file.attestation.path;
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  editRequest(requestDrtss: DemandeDrtss) {
      this.requestDrtss = { ...requestDrtss };
  }

  viewRequest(requestDrtss: DemandeDrtss) {
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
      this.requestsDrtss = this.requestsDrtss.filter(val => !this.selectedDrtssRequests.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande supprimées', life: 3000 });
      this.selectedDrtssRequests = [];
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
