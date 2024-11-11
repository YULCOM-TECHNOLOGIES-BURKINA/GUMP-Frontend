import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
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
        { field: 'nom', header: 'Nom et Prénom' },
        { field: 'email', header: 'Email' },
        { field: 'status', header: 'Statut' },
        { field: 'role', header: 'Rôle' }
    ];
    }

    getUtilisateurs() {
        this.utilisateurService.getUsers().subscribe((data: User[]) => {
            this.utilisateurs = data;
            this.requests = data;
        });
    }

    desactiverUtilisateur(utilisateur: User) {
        this.utilisateurService.desactivateUser(utilisateur.id).subscribe(() => {
            utilisateur.actif = false;
        });
    }

    // supprimerUtilisateur(utilisateur: Utilisateur) {
    //     if (confirm(`Voulez-vous vraiment supprimer l'utilisateur ${utilisateur.nom} ?`)) {
    //         this.utilisateurService.supprimerUtilisateur(utilisateur.id).subscribe(() => {
    //             this.utilisateurs = this.utilisateurs.filter(u => u.id !== utilisateur.id);
    //         });
    //     }
    // }

    deleteSelectedRequests() {
      this.deleteRequestsDialog = true;
  }

  editRequest(request: User) {
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
