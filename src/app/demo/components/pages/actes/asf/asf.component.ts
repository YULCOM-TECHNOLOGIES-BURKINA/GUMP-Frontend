import { Component, OnInit} from '@angular/core';
import { MessageService } from 'primeng/api';
import { AsfService } from '../../../../services/asf.service';
import { Router } from '@angular/router';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface Acte {
  label: string;
  code: string;
}

@Component({
  selector: 'app-asf',
  providers: [MessageService],
  templateUrl: './asf.component.html',
})


export class AsfComponent implements OnInit {

  asfFile: File | null = null; // Fichier RCCM
  statutFile: File | null = null; // Fichier statut

  contractReference: string;
  contractPurpose: string;
  contractingOrganizationName: string;
  organizationAddress: string;
  organizationPhone: string;


  actes: Acte[] | undefined;

  selectedActe: Acte | undefined;

  constructor(
    private messageService: MessageService, 
    private asfService: AsfService,
    private router: Router) {}

  ngOnInit() {
    this.actes = [
        { label: 'Test 1', code: 'T01' },
        { label: 'Test 2', code: 'T02' },
        { label: 'Label 3', code: 'B03' }
    ];
  }

  // Méthode pour gérer la sélection des fichiers
  onFileSelect(event: any, fileType: string) {
    const file = event.files[0];
    if (fileType === 'asfFile') {
      this.asfFile = file;
    } else if (fileType === 'statutFile') {
      this.statutFile = file;
    }
    this.messageService.add({ severity: 'info', summary: 'Fichier chargé', detail: `${file.name} a été chargé.` });
  }

  // Méthode pour soumettre le formulaire
  onSubmit() {
    if (this.asfFile && this.statutFile) {
      const formData = new FormData();
      formData.append('asf', this.asfFile);
      formData.append('statut', this.statutFile);

      // Appel au service pour envoyer les fichiers
      // TODO: envoyer directement dans le même opbjet les informations sur l'utlisateur et sur l'entrerpise
      this.asfService.submitAttestationRequest(formData).subscribe({
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
