import { Component, OnInit} from '@angular/core';
import { MessageService } from 'primeng/api';
import { RccmService } from '../../../../services/rccm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cnf',
  providers: [MessageService],
  templateUrl: './cnf.component.html',
})


export class CnfComponent implements OnInit {
  rccmFile: File | null = null; // Fichier RCCM
  statutFile: File | null = null; // Fichier statut
  immatriculationDate: string;
  typeDemande: string = 'CERTIFICAT_NON_FAILLITE';

  constructor(
    private messageService: MessageService, 
    private rccmService: RccmService,
    private router: Router) {}

  ngOnInit() {}

  onFileSelect(event: any, fileType: string) {
    const file = event.files[0];
    if (fileType === 'rccmFile') {
      this.rccmFile = file;
    } else if (fileType === 'statutFile') {
      this.statutFile = file;
    }
    this.messageService.add({ severity: 'info', summary: 'Fichier chargé', detail: `${file.name} a été chargé.` });
  }

  onSubmit() {
    if (!this.rccmFile || !this.statutFile || !this.immatriculationDate) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Attention', 
        detail: 'Veuillez remplir tous les champs requis.' 
      });
      return;
    }

    this.rccmService.submitAttestationRequest(
      this.rccmFile,
      this.statutFile,
      this.immatriculationDate,
      this.typeDemande
    ).subscribe({
      next: (response) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Succès', 
          detail: 'Formulaire envoyé avec succès !',
          life: 3000 
        });
        setTimeout(() => {
          this.router.navigate(['/demandes']);
        }, 2000);
        
        // Réinitialisation du formulaire
        this.rccmFile = null;
        this.statutFile = null;
        this.immatriculationDate = null;
        this.typeDemande = '';

      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erreur', 
          detail: 'Une erreur est survenue lors de l\'envoi.',
          life: 5000 
        });
      }
    });
  }

}
