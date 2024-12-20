import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-profil',
    templateUrl: './profil.component.html',
    providers: [MessageService],
})
export class ProfilComponent implements OnInit {
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

  currentUser = localStorage.getItem('currentUser');
  request: any;


  constructor(
      private userService: UserService,
      private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getUserProfile();
  }

//   saveProfil() {
//       if (this.profil) {
//           const formData = new FormData();
//           formData.append('lastname', this.profil.nom);
//           formData.append('lastname', this.profil.nom);

//           // Appel au service pour envoyer les fichiers
//           this.userService.submitUserRequest(formData).subscribe({
//               next: (response) => {
//                   this.messageService.add({
//                       severity: 'success',
//                       summary: 'Profil mis à jour',
//                       detail: 'Les nouvelles informations du profil ont été sauvegardées!',
//                   });
//               },
//               error: (err) => {
//                   this.messageService.add({
//                       severity: 'error',
//                       summary: 'Erreur',
//                       detail: "Une erreur est survenue lors de l'envoi.",
//                   });
//               },
//           });
//       } else {
//           this.messageService.add({
//               severity: 'warn',
//               summary: 'Attention',
//               detail: 'Veuillez remplir les champs obligatoires.',
//           });
//       }
//   }

saveProfil() {
    if (this.request) {
        const userData = {
            representantLastname: this.request.company.representantLastname,
            representantFirstname: this.request.company.representantFirstname,
            region: this.request.company.region,
            location: this.request.company.location,
            address: this.request.company.address,
            postalAddress: this.request.company.postalAddress,
            representantPhone: this.request.company.representantPhone,
            phone: this.request.company.phone
        };

        this.userService.saveMe(userData).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Profil mis à jour',
                    detail: 'Les nouvelles informations du profil ont été sauvegardées!'
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Une erreur est survenue lors de la modification du profil."
                });
            }
        });
    } else {
        this.messageService.add({
            severity: 'warn',
            summary: 'Attention',
            detail: 'Veuillez remplir le nom et le prénom.'
        });
    }
}

  getUserProfile() {
    if (this.currentUser !== null) {
        this.userService.getMe().subscribe({
            next: (response) => {
                this.request = response; 
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erruer',
                    detail: 'Informations du profile non disponibles'
                }); 
            }
        }); 
       
    }
  }
}
