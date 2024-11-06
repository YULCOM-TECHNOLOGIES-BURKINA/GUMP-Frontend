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
  requesterId: string = 'YULCOM';
  rccmReference: string = 'YULCOM';
  ifuNumber: string = 'YULCOM';
  address: string = 'YULCOM';
  phoneNumber: string = 'YULCOM';
  businessDomain: string = 'YULCOM';
  bankAccountReference: string;
  contractReference: string;
  contractPurpose: string;
  contractingOrganizationName: string;
  organizationAddress: string;
  organizationPhone: string;

  // Libellés dynamiques
  formLabels = {
    title: 'Fiche de demande et de retrait d\'attestation de non engagement - Liquidation',
    reference: 'Référence du marché ',
    purpose: 'Objet du marché '
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
          && !!this.contractPurpose
          && !!this.contractingOrganizationName
          && !!this.organizationAddress
          && !!this.requestType
          && !!this.organizationPhone;
  }

  // isFormValid(): boolean {
  //   return !!this.businessDomain 
  //         && !!this.bankAccountReference 
  //         && !!this.contractReference 
  //         && !!this.contractPurpose
  //         && !!this.contractingOrganizationName
  //         && !!this.organizationAddress
  //         //&& !!this.rccmReference
  //         //&& !!this.ifuNumber
  //         //&& !!this.address
  //         //&& !!this.phoneNumber
  //         && !!this.requestType
  //         //&& !!this.requesterId
  //         && !!this.organizationPhone;
  // }

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
        requesterId: this.requesterId,
        rccmReference: this.rccmReference,
        ifuNumber: this.ifuNumber,
        address: this.address,
        phoneNumber: this.phoneNumber,
        businessDomain: this.businessDomain,
        bankAccountReference: this.bankAccountReference,
        contractReference: this.contractReference,
        contractPurpose: this.contractPurpose,
        contractingOrganizationName: this.contractingOrganizationName,
        organizationAddress: this.organizationAddress,
        organizationPhone: this.organizationPhone
      };
      
      this.ajeService.submitAttestationRequest(requestData).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formulaire envoyé avec succès !', life: 2000 });
          setTimeout(() => {
            this.router.navigate(['/app/pages/demandes']); 
          }, 2000); 
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de l\'envoi.' });
        }
      });
    }
  }

}
