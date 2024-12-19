import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  verificationForm: FormGroup;

  documentTypes = [
    { label: 'Attestation DRTPS', value: 'DRTPS' },
    { label: 'Attestation CNSS', value: 'CNSS' },
    { label: 'Attestation AJE', value: 'AJE' },
    { label: 'Attestation ANPE', value: 'ANPE' },
    { label: 'Attestation ASF', value: 'ASF' },
    { label: 'Extrait RCCM', value: 'RCCM' },
    { label: 'Certificat de Non Faillite', value: 'CNF' }
  ];

  constructor(
    private messageService: MessageService, 
    private router: Router,
    private fb: FormBuilder
  ) {
    this.verificationForm = this.fb.group({
      reference: ['', Validators.required],
      nes: [''],
      ifu: ['']
    });
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser') !== null) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user.role.includes('USER')) {
        this.router.navigate(['app/']);
      }
    }
  }

  onDocTypeChange() {
    if (this.selectedDocType === 'ASF') {
      this.verificationForm.get('nes').setValidators([Validators.required]);
      this.verificationForm.get('ifu').setValidators([Validators.required]);
    } else {
      this.verificationForm.get('nes').clearValidators();
      this.verificationForm.get('ifu').clearValidators();
      this.verificationForm.get('nes').setValue('');
      this.verificationForm.get('ifu').setValue('');
    }
    this.verificationForm.get('nes').updateValueAndValidity();
    this.verificationForm.get('ifu').updateValueAndValidity();
  }

  verify() {
    if (this.selectedDocType === 'ASF' && 
        (!this.verificationForm.get('nes').value || 
         !this.verificationForm.get('ifu').value || 
         !this.verificationForm.get('reference').value)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs requis'
      });
      return;
    } else if (!this.selectedDocType || !this.verificationForm.get('reference').value) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez saisir une référence et sélectionner un type de document'
      });
      return;
    }

    this.loading = true;
    this.showResult = false;

    // Simuler la vérification (à remplacer par votre appel API réel)
    setTimeout(() => {
      // Simulation d'un document invalide (à adapter selon vos besoins)
      const isValid = Math.random() > 0.5;
      
      this.verificationResult = {
        docType: this.selectedDocType,
        reference: this.verificationForm.get('reference').value,
        status: isValid ? 'valid' : 'invalid',
        issueDate: isValid ? '2024-01-15' : undefined,
        expiryDate: isValid ? '2024-12-31' : undefined,
        organization: isValid ? 'Direction Régionale du Travail et de la Protection Sociale' : undefined,
        additionalInfo: isValid ? 'Document émis par la DRPTS du Centre' : 'Document non valide ou inexistant'
      };

      this.loading = false;
      this.showResult = true;
    }, 1500);
  }

  reset() {
    this.verificationForm.reset();
    this.selectedDocType = '';
    this.showResult = false;
    this.verificationResult = null;
  }

  isFormValid(): boolean {
    if (this.selectedDocType === 'ASF') {
      return this.verificationForm.valid && this.selectedDocType?.trim().length > 0;
    }
    return this.verificationForm.get('reference').value?.trim().length > 0 && 
           this.selectedDocType?.trim().length > 0;
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