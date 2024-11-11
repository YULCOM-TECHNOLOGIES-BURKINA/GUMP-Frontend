import { Component, OnInit } from '@angular/core';
import { DemandeDrtss, DemandeDrtssResponse } from '../../../models/drtss';
import { DemandeAnpe, DemandeAnpeResponse } from '../../../models/anpe';
import { DemandeAje, DemandeAjeResponse } from '../../../models/aje';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DrtssService } from '../../../services/drtss.service';
import { AnpeService } from '../../../services/anpe.service';
import { AjeService } from '../../../services/aje.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-demandes',
  templateUrl: './demandes.component.html',
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
  `]
})
export class DemandesComponent implements OnInit {

  deleteRequestDialog: boolean = false;
  deleteRequestsDialog: boolean = false;

  requestsDrtss: DemandeDrtss[] = [];
  requestDrtss: DemandeDrtss = {};

  requestsAje: DemandeAje[] = [];
  requestAje: DemandeAje = {};

  requestsAnpe: DemandeAnpe[] = [];
  requestAnpe: DemandeAnpe = {};

  selectedDrtssRequests: DemandeDrtss[] = [];
  selectedAjeRequests: DemandeAje[] = [];
  selectedAnpeRequests: DemandeAnpe[] = [];

  cols: any[] = [];

  displayProcessModal: boolean = false;
  displayProcessModalAje: boolean = false;
  displayProcessModalAnpe: boolean = false;
  displayMotifModal: boolean = false;

  totalRecords: number = 0; 
  totalRecordsAje: number = 0; 
  totalRecordsAnpe: number = 0; 

  countDrtss = 0;
  countAje= 0;
  countAnpe= 0;

  readonly VALIDITY_DAYS = 90; // Durée de validité en jours
  readonly WARNING_DAYS = 14; // Seuil d'alerte en jours

  constructor(
    private drtssService: DrtssService, 
    private ajeService: AjeService, 
    private anpeService: AnpeService, 
    private messageService: MessageService) { }

  ngOnInit() {
      this.getDemandesDrtss();
      this.getDemandesAje();
      this.getDemandesAnpe();
      this.setupValidityCheck();

      this.cols = [
          { field: 'reference', header: 'Reference du marché' },
          { field: 'objet', header: 'Objet du marché' },
          { field: 'createdAt', header: 'Date' },
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
    this.requestsDrtss.forEach(request => {
      const daysLeft = this.calculateDaysLeft(request.createdAt);
      if (daysLeft <= this.WARNING_DAYS && daysLeft > 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Attention',
          detail: `La demande ${request.id} expire dans ${daysLeft} jours`,
          life: 5000
        });
      }
    });
  }

  calculateDaysLeft(createdAt: string): number {
    const created = new Date(createdAt);
    const expirationDate = new Date(created.getTime() + this.VALIDITY_DAYS * 24 * 60 * 60 * 1000);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
    } else if (daysLeft <= this.WARNING_DAYS) {
      return {
        text: `${daysLeft} jours restants`,
        class: 'warning-text',
        severity: 'warning'
      };
    } else {
      return {
        text: `${daysLeft} jours restants`,
        class: 'valid-text',
        severity: 'success'
      };
    }
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

  getDemandesAnpe() {
    this.anpeService.getDemandes().subscribe((data: DemandeAnpeResponse) => {
      this.requestsAnpe = data.content;
      this.totalRecordsAnpe = data.totalElements;
      this.countAnpe= this.requestsAnpe.length;
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
    const url = file.path;
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  openDownloadRequest(file: any) {
    const url = file.attestation.path;
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }

  openDownloadRequestAje(file: any) {
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

  openMotif(requestDrtss: DemandeDrtss) {
    this.drtssService.getOneDemande(requestDrtss.id).subscribe(data => {
      this.requestDrtss = data;
    });
    this.displayMotifModal = true;
  }


  viewRequestAje(requestAje: DemandeAje) {
    this.ajeService.getOneDemande(requestAje.id).subscribe(data => {
      this.requestAje = data;
    });
    this.displayProcessModalAje = true;
  }

  viewRequestAnpe(requestAnpe: DemandeAnpe) {
    this.anpeService.getOneDemande(requestAnpe.id).subscribe(data => {
      this.requestAnpe = data;
    });
    this.displayProcessModalAnpe = true;
  }

  closeProcessModal() {
    this.displayProcessModal = false;
  }

  closeProcessModalAje() {
    this.displayProcessModalAje = false;
  }
  
  closeProcessModalAnpe() {
    this.displayProcessModalAnpe = false;
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
