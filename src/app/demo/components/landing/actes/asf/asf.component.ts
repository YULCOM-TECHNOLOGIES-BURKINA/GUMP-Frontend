import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AsfService } from '../../../../services/asf.service';
import { Router } from '@angular/router';


interface AsfResponse {
  data: {
    items: {
      resultat: {
        numero_ifu: string;
        reference: string;
        code: number;
        message: string;
      }
    },
    error: {
      code: number;
      message: string;
      message_code: string;
    }
  },
  status: number;
}

@Component({
  selector: 'app-asf',
  providers: [MessageService],
  templateUrl: './asf.component.html',
})
export class AsfComponent implements OnInit {
  ifu: string = '';
  nes: string = '';

  constructor(
    private messageService: MessageService,
    private asfService: AsfService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('currentUser') !== null) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      this.ifu = user.ifu;
      //this.nes = user.nes;
    } else{
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez vous connecter.',
        life: 15000 
      });
    }
  }

  resetForm() {
    //this.ifu = '';
    this.nes = '';
  }

  handleDownload(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  onSubmit() {
      const requestData = {
        ifu: this.ifu,
        nes: this.nes
      };

      this.asfService.submitAttestationRequest(requestData).subscribe({
        next: (response: AsfResponse) => {
          const reference = response.data.items.resultat.reference;
          const serverMessage = response.data.items.resultat.message;

          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: serverMessage,
              life: 2000
            });
            // Vérification du message d'erreur du serveur
            if (response.data.items.resultat.code === 201) {
              this.messageService.add({
                severity: 'info',
                summary: 'Demande en cours de traitement',
                detail: response.data.items.resultat.message,
                life: 5000 
              });
              // Réinitialisation du formulaire
              this.resetForm();
              setTimeout(() => {
                this.router.navigate(['/demandes']);
              }, 1000);
            }
            // Téléchargement automatique du document
            this.asfService.downloadAsf({
              ifu: this.ifu,
              nes: this.nes,
              reference: reference
            }).subscribe({
              next: (blob) => {
                this.handleDownload(blob, `ASF_${reference}.pdf`);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Téléchargement',
                  detail: 'Le document a été téléchargé avec succès !',
                  life: 2000 
                });
                // Réinitialisation du formulaire
                this.resetForm();
                setTimeout(() => {
                  this.router.navigate(['/demandes']);
                }, 1000);
              },
              error: (err) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erreur',
                  detail: 'Erreur lors du téléchargement du document.',
                  life: 5000
                });
                setTimeout(() => {
                  this.router.navigate(['/demandes']);
                }, 1000);
              }
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'La référence du document est manquante.',
              life: 5000
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err.error?.error?.message || 'Une erreur est survenue',
            life: 5000
          });
        }
      });
    
  }
}