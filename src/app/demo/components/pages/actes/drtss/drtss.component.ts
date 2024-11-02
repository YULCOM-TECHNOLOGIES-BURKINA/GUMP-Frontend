import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DrtssService } from '../../../../services/drtss.service';
import { Router } from '@angular/router';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-drtss',
  providers: [MessageService],
  templateUrl: './drtss.component.html',
})


export class DrtssComponent {

  anpeFile: File | null = null; // Fichier ANPE
  cnssFile: File | null = null; // Fichier CNSS
  attestationAnpeNumber: string = '';
  attestationCnssNumber: string = '';

  contractReference: string;
  contractPurpose: string;
  contractingOrganizationName: string;
  organizationAddress: string;
  organizationPhone: string;

  constructor(
    private messageService: MessageService, 
    private drtssService: DrtssService,
    private router: Router) {}

  // Méthode pour gérer la sélection des fichiers
  onFileSelect(event: any, fileType: string) {
    const file = event.files[0];
    if (fileType === 'anpeFile') {
      this.anpeFile = file;
    } else if (fileType === 'cnssFile') {
      this.cnssFile = file;
    }
    this.messageService.add({ severity: 'info', summary: 'Fichier chargé', detail: `${file.name} a été chargé.` });
  }

  // Méthode pour soumettre le formulaire
  onSubmit() {
    if (this.anpeFile && this.cnssFile) {
      const formData = new FormData();
      formData.append('attestationAnpe', this.anpeFile);
      formData.append('attestationCnss', this.cnssFile);
      formData.append('attestationAnpeNumber', this.attestationAnpeNumber);
      formData.append('attestationCnssNumber', this.attestationCnssNumber);
      // formData.append('requesterId', '02152');

      // Appel au service pour envoyer les fichiers
      this.drtssService.submitAttestationRequest(formData).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formulaire envoyé avec succès !' });
          setTimeout(() => {
            this.router.navigate(['/app/pages/demandes']); 
          }, 2000); // délai de 2 secondes avant la redirection
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de l\'envoi.' });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez charger les deux fichiers.' });
    }
  }

}
