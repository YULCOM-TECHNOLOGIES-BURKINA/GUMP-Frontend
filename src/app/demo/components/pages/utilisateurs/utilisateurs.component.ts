import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Utilisateur } from '../../../models/utilisateurs';
import { User, UserResponse } from '../../../models/utilisateurs';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss',
  providers: [MessageService]
})

export class UtilisateursComponent implements OnInit {
    approveRequestDialog: boolean = false;
    rejectRequestDialog: boolean = false;
    requests: User[] = [];
    request: User = {};
    selectedRequests: User[] = [];
    cols: any[] = [];

    constructor(private utilisateurService: UserService, private messageService: MessageService) { }

    ngOnInit(): void {
      this.getUtilisateurs();
      this.cols = [
        { field: 'company', header: 'Entité' },
        { field: 'username', header: 'IFU' },
        { field: 'email', header: 'Email' },
        { field: 'cnssNumber', header: 'Numéro CNSS' },
        { field: 'region', header: 'Région' },
        { field: 'status', header: 'Statut' }
    ];
    }

    getUtilisateurs() {
        this.utilisateurService.getUsersCompany().subscribe((data: UserResponse) => {
            this.requests = data.content.filter(user => user.role === 'USER');;
        });
    }

  approveRequest(request: Utilisateur) {
      this.request = { ...request };
      this.approveRequestDialog = true;
  }

  rejectRequest(request: Utilisateur) {
    this.request = { ...request };
    this.rejectRequestDialog = true;
}

  confirmApproveRequest() {
      this.approveRequestDialog = false;
      this.utilisateurService.approveUser(this.request.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur activé avec succès!',
            life: 3000
          });
          this.request = null;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de l\'activation.',
            life: 3000
          });
        }
      });
  }


  confirmRejectRequest() {
    this.rejectRequestDialog = false;
    this.utilisateurService.rejectUser(this.request.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Utilisateur activé avec succès!',
          life: 3000
        });
        this.request = null;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de l\'activation.',
          life: 3000
        });
      }
    });
}

download(file: any) {
    const url = file;
    window.open(url, '_blank');
    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Fichier téléchargé', life: 3000 });
  }


  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
