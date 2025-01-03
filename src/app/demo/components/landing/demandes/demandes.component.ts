import { Component, OnInit } from '@angular/core';
import { DemandeDrtss, DemandeDrtssResponse } from '../../../models/drtss';
import { DemandeAnpe, DemandeAnpeResponse } from '../../../models/anpe';
import { DemandeAje, DemandeAjeResponse } from '../../../models/aje';
import { DemandeRccm, DemandeRccmResponse } from '../../../models/rccm';
import { DemandeAsf, DemandeAsfResponse } from '../../../models/asf';
import { Demande } from '../../../models/demande';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DrtssService } from '../../../services/drtss.service';
import { RccmService } from '../../../services/rccm.service';
import { AnpeService } from '../../../services/anpe.service';
import { DemandeService } from '../../../services/demande.service';
import { AjeService } from '../../../services/aje.service';
import { AsfService } from '../../../services/asf.service';
import { interval } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  requestsRccm: DemandeRccm[] = [];
  requestRccm: DemandeRccm = {};

  requestsCnf: DemandeRccm[] = [];
  requestCnf: DemandeRccm = {};

  requestCnss: Demande[] = [];

  requestsAsf: DemandeAsf[] = [];
  // requestAsf: DemandeAsf = {};


  selectedDrtssRequests: DemandeDrtss[] = [];
  selectedAjeRequests: DemandeAje[] = [];
  selectedAnpeRequests: DemandeAnpe[] = [];
  selectedRccmRequests: DemandeRccm[] = [];
  selectedAsfRequests: DemandeAsf[] = [];
  selectedCnssRequests: Demande[] = [];
  selectedCnfRequests: DemandeRccm[] = [];

  cols: any[] = [];

  displayProcessModal: boolean = false;
  displayProcessModalAje: boolean = false;
  displayProcessModalAnpe: boolean = false;
  displayMotifModal: boolean = false;

  totalRecords: number = 0;
  totalRecordsAje: number = 0;
  totalRecordsAnpe: number = 0;
  totalRecordsAsf: number = 0;
  totalRecordsRccm: number = 0;
  totalRecordsCnf: number = 0;
  totalRecordsCnss: number = 5;

  countDrtss = 0;
  countAje= 0;
  countAnpe = 0;
  countAsf= 0;
  countRccm= 0;
  countCnss= 5;
  countCnf= 0;

  readonly VALIDITY_DAYS = 90; // Durée de validité en jours
  readonly WARNING_DAYS = 14; // Seuil d'alerte en jours

  nesForm: FormGroup;
  nesValidated: boolean = false;
  loading: boolean = false;

  constructor(
    private drtssService: DrtssService,
    private ajeService: AjeService,
    private asfService: AsfService,
    private anpeService: AnpeService,
    private rccmService: RccmService,
    private demandeService: DemandeService,
    private messageService: MessageService,
    private fb: FormBuilder) {
      this.nesForm = this.fb.group({
        nes: ['', [Validators.required]]
      });
    }


  ngOnInit() {
      this.getDemandesDrtss();
      this.getDemandesAje();
      this.getDemandesAnpe();
      this.getDemandesRccm();
      this.getDemandesSimulation();
      this.setupValidityCheck();
      this.nesValidated = false;

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
      this.countAje = this.requestsAje.length;
    });
  }

  getDemandesAnpe() {
    this.anpeService.getDemandes().subscribe((data: DemandeAnpeResponse) => {
      this.requestsAnpe = data.content;
      this.totalRecordsAnpe = data.totalElements;
      this.countAnpe= this.requestsAnpe.length;
    });
  }

  getDemandesRccm() {
    this.rccmService.getDemandes().subscribe((data: DemandeRccmResponse) => {
      this.requestsRccm = data.content;
      this.totalRecordsRccm = data.totalElements;
      this.countRccm = this.requestsRccm.length;
    });
  }

  getDemandesSimulation() {
    this.demandeService.getDemandes().subscribe((data: Demande[]) => {
      this.requestCnss = data;
    });
  }

  getTranslatedStatus(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'Approuvée';
      case 'SIGNED':
        return 'Signée';
      case 'PROCESSING':
        return 'En cours de traitement';
      case 'COMPANY_HAS_DEBT_WAITING_FOR_MANUAL_REVIEW':
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

   initatePaymentDRTPS(demandeId: number) {
    const callbackUrl = `${window.location.origin}/actes/drtps/payment-callback/${demandeId}`;
    console.log('callback', callbackUrl);
    localStorage.setItem('callbackurl', callbackUrl);

    this.drtssService.makePayment(demandeId, callbackUrl).subscribe({
      next: (paymentResponse) => {
        // Si l'API retourne une URL de paiement, rediriger l'utilisateur
        if (paymentResponse.url) {
          window.location.href = paymentResponse.url;
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de l\'initialisation du paiement.'
        });
      }
    });
  }

  validateNes() {
    if (this.nesForm.valid) {
        this.loading = true;
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        if (!currentUser.ifu) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de récupérer votre numéro IFU'
            });
            this.loading = false;
            return;
        }

        const requestData = {
            ifu: currentUser.ifu,
            nes: this.nesForm.get('nes')?.value
        };

        this.asfService.getDemandesHistory(requestData).subscribe((data: DemandeAsfResponse) =>{
          this.requestsAsf = data.data.items.resultat;
          this.totalRecordsAsf = data.data.items.resultat.length;
          this.countAsf = this.totalRecordsAsf;
            this.countAsf = this.requestsAsf.length;
            this.nesValidated = true;
            this.loading = false;
        });
        this.loading = false;
    }
  }

  initatePaymentAJE(demandeId: number) {
    const callbackUrl = `${window.location.origin}/actes/aje/payment-callback/${demandeId}`;
    console.log('callback', callbackUrl);
    localStorage.setItem('callbackurl', callbackUrl);

    this.ajeService.makePayment(demandeId, callbackUrl).subscribe({
      next: (paymentResponse) => {
        // Si l'API retourne une URL de paiement, rediriger l'utilisateur
        if (paymentResponse.url) {
          window.location.href = paymentResponse.url;
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de l\'initialisation du paiement.'
        });
      }
    });
  }

  handleDownload(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  openDownloadAsf(asf) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.asfService.downloadAsf({
      ifu: currentUser.ifu,
      nes: this.nesForm.get('nes')?.value,
      reference: asf.reference
    }).subscribe({
      next: (blob) => {
        this.handleDownload(blob, `ASF_${asf.reference}.pdf`);
        this.messageService.add({
          severity: 'success',
          summary: 'Téléchargement',
          detail: 'Le document a été téléchargé avec succès !',
          life: 2000 
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du téléchargement du document.',
          life: 5000
        });
      }
    });
  }
}
