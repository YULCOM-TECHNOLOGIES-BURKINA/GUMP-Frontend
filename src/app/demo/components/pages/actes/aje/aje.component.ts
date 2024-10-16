import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AjeService } from '../../../../services/aje.service';
import { Router } from '@angular/router';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-aje',
  providers: [MessageService],
  templateUrl: './aje.component.html',
})


export class AjeComponent {

  anpeFile: File | null = null; // Fichier ANPE
  cnssFile: File | null = null; // Fichier CNSS

  constructor(
    private messageService: MessageService, 
    private ajeService: AjeService,
    private router: Router) {}

  onFileSelect(event: any, fileType: string) {
    const file = event.files[0];
    if (fileType === 'anpeFile') {
      this.anpeFile = file;
    } else if (fileType === 'cnssFile') {
      this.cnssFile = file;
    }
    this.messageService.add({ severity: 'info', summary: 'Fichier chargé', detail: `${file.name} a été chargé.` });
  }

  onSubmit() {
    if (this.anpeFile && this.cnssFile) {
      const formData = new FormData();
      formData.append('attestationAnpe', this.anpeFile);
      formData.append('attestationCnss', this.cnssFile);
    
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
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez charger les deux fichiers.' });
    }
  }

}
