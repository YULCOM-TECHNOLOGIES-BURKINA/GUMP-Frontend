import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-profil',
    templateUrl: './profil.component.html',
    providers: [MessageService],
})
export class ProfilComponent {
  profil = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      passwordConfirm: '',
      doubleAuth: false,
  };

  deleteAccountDialog = false;
  desactivateAccountDialog = false;

  constructor(
      private utilisateurService: UserService,
      private messageService: MessageService
  ) {}

  // TODO: à terminer
  saveProfil() {
      if (this.profil) {
          const formData = new FormData();
          formData.append('nom', this.profil.nom);

          // Appel au service pour envoyer les fichiers
          this.utilisateurService.submitUserRequest(formData).subscribe({
              next: (response) => {
                  this.messageService.add({
                      severity: 'success',
                      summary: 'Profil mis à jour',
                      detail: 'Les nouvelles informations du profil ont été sauvegardées!',
                  });
              },
              error: (err) => {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Erreur',
                      detail: "Une erreur est survenue lors de l'envoi.",
                  });
              },
          });
      } else {
          this.messageService.add({
              severity: 'warn',
              summary: 'Attention',
              detail: 'Veuillez remplir les champs obligatoires.',
          });
      }
  }

  desactivateAccount() {
      this.desactivateAccountDialog = true;
  }

  confirmDesactivateAccount() {
      this.desactivateAccountDialog = false;
      this.messageService.add({
          severity: 'success',
          summary: 'Compte désactivé',
          detail: 'Votre a été désactivé avec succès',
          life: 3000,
      });
  }

  deleteAccount() {
      this.deleteAccountDialog = true;
  }

  confirmDeleteAccount() {
      this.deleteAccountDialog = false;
      this.messageService.add({
          severity: 'success',
          summary: 'Compte supprimé',
          detail: 'Votre a été supprimé avec succès',
          life: 3000,
      });
  }
}
