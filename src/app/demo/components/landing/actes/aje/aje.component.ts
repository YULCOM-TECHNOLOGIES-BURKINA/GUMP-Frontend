import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AjeService } from '../../../../services/aje.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aje',
  providers: [MessageService],
  templateUrl: './aje.component.html',
})

export class AjeComponent implements OnInit {
  requestType: 'LIQUIDATION' | 'SOUMISSION' = 'LIQUIDATION';
  bankAccountReference: string;
  contractReference: string;
  contractPurpose: string;
  contractingOrganizationName: string;
  organizationAddress: string;
  organizationPhone: string;
  businessDomain: string;

  formLabels = {
    title: 'Fiche de demande et de retrait d\'attestation de non engagement - Liquidation',
    reference: 'Référence de l\'appel d\'offre',
    purpose: 'Objet de l\'appel d\'offre '
  };

  constructor(
    private messageService: MessageService, 
    private ajeService: AjeService,
    private router: Router) {}

    ngOnInit() {
      this.updateFormLabels();
    }
  
    updateFormLabels() {
      if (this.requestType === 'SOUMISSION') {
        this.formLabels = {
          title: 'Fiche de demande et de retrait d\'attestation de non engagement - Soumission',
          reference: 'Référence de l\'acte de soumission',
          purpose: 'Objet de l\'acte de soumission'
        };
      } else {
        this.formLabels = {
          title: 'Fiche de demande et de retrait d\'attestation de non engagement - Liquidation',
          reference: 'Référence du marché ',
          purpose: 'Objet du marché '
        };
      }
    }
  
    onRequestTypeChange() {
      this.updateFormLabels();
    }

  isFormValid(): boolean {
    return   !!this.bankAccountReference 
          && !!this.contractReference 
          && !!this.businessDomain 
          && !!this.contractPurpose
          && !!this.contractingOrganizationName
          && !!this.organizationAddress
          && !!this.requestType
          && !!this.organizationPhone;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Tous les champs sont obligatoires. Veuillez les remplir.',
        life: 3000
      });
      return;
    } else {
      const requestData = {
        requestType: this.requestType,
        bankAccountReference: this.bankAccountReference,
        contractReference: this.contractReference,
        publicContractNumber: this.contractReference,
        contractPurpose: this.contractPurpose,
        contractingOrganizationName: this.contractingOrganizationName,
        organizationAddress: this.organizationAddress,
        organizationPhone: this.organizationPhone,
        businessDomain: this.businessDomain
      };
      
      this.ajeService.submitAttestationRequest(requestData).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formulaire envoyé avec succès !', life: 2000 });
          // Récupérer l'ID de la demande depuis la réponse
          const demandeId = response.id;

          // Construction du callback URL
          const callbackUrl = `${window.location.origin}/actes/aje/payment-callback/${demandeId}`;

          // Initier le paiement
          setTimeout(() => {
            this.initatePayment(demandeId, callbackUrl);
          }, 2000);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de l\'envoi.' });
        }
      });
    }
  }

  private initatePayment(demandeId: number, callbackUrl: string) {
    this.ajeService.makePayment(demandeId, callbackUrl).subscribe({
      next: (paymentResponse) => {
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
}
