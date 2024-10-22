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
      const formData = new FormData();
      formData.append('businessDomain', this.businessDomain);
      formData.append('bankAccountReference', this.bankAccountReference);
      formData.append('contractReference', this.contractReference);
      formData.append('contractPurpose', this.contractPurpose);
      formData.append('contractingOrganizationName', this.contractingOrganizationName);
      formData.append('organizationAddress', this.organizationAddress);
      formData.append('organizationPhone', this.organizationPhone);
    
      this.ajeService.submitAttestationRequest(formData).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formulaire envoyé avec succès !' });
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
