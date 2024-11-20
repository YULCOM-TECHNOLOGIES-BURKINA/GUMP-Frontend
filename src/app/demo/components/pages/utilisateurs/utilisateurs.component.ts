import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Utilisateur } from '../../../models/utilisateurs';
import { User, UserResponse } from '../../../models/utilisateurs';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-utilisateurs',
  // standalone: true,
  // imports: [],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss',
  providers: [MessageService]
})

export class UtilisateursComponent implements OnInit {

    utilisateurs: User[] = [];

    deleteRequestDialog: boolean = false;
    deleteRequestsDialog: boolean = false;

    requests: User[] = [];
    request: User = {};

    selectedRequests: User[] = [];
    cols: any[] = [];

    constructor(private utilisateurService: UserService, private messageService: MessageService) { }

    ngOnInit(): void {
      // this.utilisateurService.getUtilisateurs().then(data => this.requests = data);
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
            this.utilisateurs = data.content;
            this.requests = data.content.filter(user => user.role === 'USER');;
        });
    }

    desactiverUtilisateur(utilisateur: User) {
        this.utilisateurService.desactivateUser(utilisateur.id).subscribe(() => {
            utilisateur.actif = false;
        });
    }


    deleteSelectedRequests() {
      this.deleteRequestsDialog = true;
  }

  editRequest(request: Utilisateur) {
      this.request = { ...request };
      // Logique d'édition ici
  }

  deleteRequest(request: User) {
      this.deleteRequestDialog = true;
      this.request = { ...request };
  }

  confirmDeleteRequest() {
      this.deleteRequestDialog = false;
      this.requests = this.requests.filter(val => val.id !== this.request.id);
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé', life: 3000 });
      this.request = {};
  }

  confirmDeleteSelected() {
      this.deleteRequestsDialog = false;
      this.requests = this.requests.filter(val => !this.selectedRequests.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateurs supprimés', life: 3000 });
      this.selectedRequests = [];
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
