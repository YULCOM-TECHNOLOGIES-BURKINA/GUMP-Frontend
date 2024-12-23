import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VerificationService } from '../../../services/verification.service';

interface VerificationResult {
  docType: string;
  reference: string;
  status: 'valid' | 'invalid' | 'pending';
  issueDate?: string;
  expiryDate?: string;
  organization?: string;
  additionalInfo?: string;
  documentData?: any;
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
    private verificationService: VerificationService,
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

    if (this.selectedDocType === 'ASF') {
      const asfData = {
        reference: this.verificationForm.get('reference').value,
        nes: this.verificationForm.get('nes').value,
        ifu: this.verificationForm.get('ifu').value
      };

      this.verificationService.verifyASF(asfData).subscribe({
        next: (response: Blob) => {

          if (response) {
            this.handleVerificationResponseASF(response);
          }
        },
        error: (error) => {
          this.handleVerificationErrorASF(error);
        }
      });
    } else {
      this.verificationService.verifyDocument(
        this.selectedDocType,
        this.verificationForm.get('reference').value
      ).subscribe({
        next: (response) => {
          this.handleVerificationResponse(response);
        },
        error: (error) => {
          this.handleVerificationError(error);
        }
      });
    }
  }

  private handleVerificationResponse(response: any) {
    this.loading = false;
  
    const isValid = response.isDocumentValid;
  
    this.verificationResult = {
      docType: this.selectedDocType,
      reference: this.verificationForm.get('reference').value,
      status: isValid ? 'valid' : 'invalid',
      issueDate: isValid ? response.documentGenerationDate : undefined,
      expiryDate: isValid ? response.documentExpirationDate : undefined,
      organization: isValid ? response.documentOwner : undefined,
      additionalInfo: isValid ?
        `Le document N° ${response.documentNumber} est valide` :
        'Document non valide ou inexistant'
    };
  
    this.showResult = true;
  }

  private handleVerificationErrorASF(error: any) {
    this.loading = false;
    
    let errorMessage: string;
    
    if (error.status === 404) {
      // Essayer de lire le message d'erreur du corps de la réponse
      try {
        const errorBody = JSON.parse(error.error);
        errorMessage = errorBody.error || 'Document non valide ou inexistant';
      } catch {
        errorMessage = 'Document non valide ou inexistant';
      }
    } else {
      switch (error.status) {
        case 500:
          errorMessage = 'Le serveur a rencontré une erreur';
          break;
        default:
          errorMessage = 'Une erreur est survenue lors de la vérification du document';
      }
    }
  
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: errorMessage
    });
  
    this.verificationResult = {
      docType: this.selectedDocType,
      reference: this.verificationForm.get('reference').value,
      status: 'invalid',
      additionalInfo: errorMessage
    };
  
    this.showResult = true;
  }


  private handleVerificationError(error: any) {
    this.loading = false;

    // Déterminer le message d'erreur en fonction du code HTTP
    let errorMessage: string;
    switch (error.status) {
      case 404:
        errorMessage = 'Document non valide ou inexistant';
        break;
      case 500:
        errorMessage = 'Le serveur a rencontré une erreur';
        break;
      default:
        errorMessage = 'Une erreur est survenue lors de la vérification du document';
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: errorMessage
    });

    this.verificationResult = {
      docType: this.selectedDocType,
      reference: this.verificationForm.get('reference').value,
      status: 'invalid',
      additionalInfo: errorMessage
    };

    this.showResult = true;
  }

  private handleVerificationResponseASF(response: Blob) {
    this.loading = false;

    // Vérifier que c'est bien un PDF
    if (response.type === 'application/pdf') {
      this.verificationResult = {
        docType: this.selectedDocType,
        reference: this.verificationForm.get('reference').value,
        status: 'valid',
        additionalInfo: 'Document valide',
        documentData: response
      };

      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Document valide'
      });

      this.showResult = true;
    } else {
      this.handleVerificationErrorASF({
        status: 400,
        message: 'Format de document invalide'
      });
    }
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

  private downloadDocument() {
    if (this.verificationResult?.documentData) {
      // Créer une URL pour le blob
      const url = window.URL.createObjectURL(this.verificationResult.documentData);
      
      // Créer un élément <a> pour le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = `ASF-${this.verificationResult.reference}.pdf`;
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }
}
