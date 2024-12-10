import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {  Router } from '@angular/router';

interface VerificationResult {
  docType: string;
  reference: string;
  status: 'valid' | 'invalid' | 'pending';
  issueDate?: string;
  expiryDate?: string;
  organization?: string;
  additionalInfo?: string;
}

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  providers: [MessageService]
})
export class VerificationComponent implements OnInit {
  reference: string = '';
  loading: boolean = false;
  showResult: boolean = false;
  selectedDocType: string = '';
  verificationResult: VerificationResult | null = null;

  documentTypes = [
    { label: 'Attestation DRTPS', value: 'DRTPS' },
    { label: 'Attestation CNSS', value: 'CNSS' },
    { label: 'Attestation AJE', value: 'AJE' },
    { label: 'Attestation ANPE', value: 'ANPE' },
    { label: 'Attestation ASF', value: 'ASF' }
  ];

  constructor(private messageService: MessageService, private router: Router) {}

  ngOnInit() { 
    if (localStorage.getItem('currentUser') !== null) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user.role.includes('USER')){
        this.router.navigate(['app/']);
      }
    }
  }

  verify() {
    if (!this.reference || !this.selectedDocType) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez saisir une référence et sélectionner un type de document'
      });
      return;
    }

    this.loading = true;
    this.showResult = false;

    setTimeout(() => {
      this.verificationResult = {
        docType: this.selectedDocType,
        reference: this.reference,
        status: 'valid',
        issueDate: '2024-01-15',
        expiryDate: '2024-12-31',
        organization: 'Direction Régionale du Travail et de la Protection Sociale',
        additionalInfo: 'Document émis par la DRPTS du Centre'
      };

      this.loading = false;
      this.showResult = true;
    }, 1500);
  }

  reset() {
    this.reference = '';
    this.selectedDocType = '';
    this.showResult = false;
    this.verificationResult = null;
  }

  isFormValid(): boolean {
    return this.reference?.trim().length > 0 && this.selectedDocType?.trim().length > 0;
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'valid':
        return 'success';
      case 'invalid':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'valid':
        return 'pi pi-check-circle';
      case 'invalid':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-info-circle';
    }
  }
}