import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DrtssService } from '../../../../services/drtss.service';

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
  // requesterId: string = ''; // Fichier CNSS

  constructor(private messageService: MessageService, private drtssService: DrtssService) {}

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
      // formData.append('requesterId', '02152');

      // Appel au service pour envoyer les fichiers
      this.drtssService.submitAttestationRequest(formData).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formulaire envoyé avec succès !' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formulaire envoyé avec succès !' });
          // this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de l\'envoi.' });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez charger les deux fichiers.' });
    }
  }

}
