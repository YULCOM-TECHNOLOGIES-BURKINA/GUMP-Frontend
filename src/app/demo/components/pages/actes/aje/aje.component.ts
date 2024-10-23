import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AjeService } from '../../../../services/aje.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aje',
  providers: [MessageService],
  templateUrl: './aje.component.html',
})


export class AjeComponent {

  requestType: string = 'SOUMISSION';
  requesterId: string = 'YULCOM';
  rccmReference: string;
  ifuNumber: string;
  address: string;
  phoneNumber: string;
  businessDomain: string;
  bankAccountReference: string;
  contractReference: string;
  contractPurpose: string;
  contractingOrganizationName: string;
  organizationAddress: string;
  organizationPhone: string;

  constructor(
    private messageService: MessageService, 
    private ajeService: AjeService,
    private router: Router) {}

  isFormValid(): boolean {
    return !!this.businessDomain 
          && !!this.bankAccountReference 
          && !!this.contractReference 
          && !!this.contractPurpose
          && !!this.contractingOrganizationName
          && !!this.organizationAddress
          && !!this.rccmReference
          && !!this.ifuNumber
          && !!this.address
          && !!this.phoneNumber
          && !!this.requestType
          && !!this.requesterId
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
