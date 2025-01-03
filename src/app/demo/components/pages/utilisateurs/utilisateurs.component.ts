import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Utilisateur } from '../../../models/utilisateurs';
import { User, UserResponse } from '../../../models/utilisateurs';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss',
  providers: [MessageService]
})

export class UtilisateursComponent implements OnInit {
    approveRequestDialog: boolean = false;
    activateRequestDialog: boolean = false;
    desactivateRequestDialog: boolean = false;
    rejectRequestDialog: boolean = false;
    requests: User[] = [];
    request: User = {};
    selectedRequests: User[] = [];
    cols: any[] = [];

    first: number = 0;
    last: number = 0;
    totalRecords: number = 0;
    rows: number = 100; // Nombre d'éléments par page
    currentPage: number = 0;

    pendingRequests: User[] = [];
    activeRequests: User[] = [];
    inactiveRequests: User[] = [];

    countPending = 0;
    countActive = 0;
    countInactive = 0;

    constructor(private utilisateurService: UserService, private messageService: MessageService, private router: Router) { }

  onPageChange(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.rows = event.rows;
    this.currentPage = event.page;
    this.loadUsers(this.currentPage, this.rows);
  }

  loadUsers(page: number, size: number) {
    this.utilisateurService.getUsersCompany(page, size).subscribe({
      next: (response: UserResponse) => {
        this.requests = response.content.filter(user => user.role === 'USER');
        this.totalRecords = this.requests.length;
        this.categorizeRequests();        
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs', err);
      }
    });
  }

  categorizeRequests() {
    const requestsToUse = this.requests;
    
    this.pendingRequests = requestsToUse.filter(request => request.isPendingForActivation);
    this.activeRequests = requestsToUse.filter(request => request.isActive && !request.isPendingForActivation);
    this.inactiveRequests = requestsToUse.filter(request => !request.isActive && !request.isPendingForActivation);

    this.countPending = this.pendingRequests.length;
    this.countActive = this.activeRequests.length;
    this.countInactive = this.inactiveRequests.length;
  }

    ngOnInit(): void {
      this.loadUsers(0, this.rows);
      this.cols = [
        { field: 'company', header: 'Entité' },
        { field: 'username', header: 'IFU' },
        { field: 'email', header: 'Email' },
        { field: 'cnssNumber', header: 'Numéro CNSS' },
        { field: 'region', header: 'Région' },
        { field: 'status', header: 'Statut' }
      ];
    }

  approveRequest(request: Utilisateur) {
      this.request = { ...request };
      this.approveRequestDialog = true;
  }

  rejectRequest(request: Utilisateur) {
    this.request = { ...request };
    this.rejectRequestDialog = true;
}


activateRequest(request: Utilisateur) {
  this.request = { ...request };
  this.activateRequestDialog = true;
}


desactivateRequest(request: Utilisateur) {
  this.request = { ...request };
  this.desactivateRequestDialog = true;
}

  confirmApproveRequest() {
      this.approveRequestDialog = false;
      this.utilisateurService.approveUser(this.request.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur activé avec succès!',
            life: 5000
          });
          this.request = null;
          this.loadUsers(0, this.rows); 
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de la validation.',
            life: 5000
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
          detail: 'Utilisateur rejeté avec succès!',
          life: 3000
        });
        this.request = null;
        this.loadUsers(0, this.rows); 
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors du rejet.',
          life: 3000
        });
      }
    });
}

confirmActivateRequest() {
  this.activateRequestDialog = false;
  this.utilisateurService.activateUser(this.request.id).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Utilisateur activé avec succès!',
        life: 5000
      });
      this.request = null;
      this.loadUsers(0, this.rows); 
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de l\'activation.',
        life: 5000
      });
    }
  });
}


confirmDesactivateRequest() {
  this.desactivateRequestDialog = false;
  this.utilisateurService.desactivateUser(this.request.id).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Utilisateur désactivé avec succès!',
        life: 5000
      });
      this.request = null;
      this.loadUsers(0, this.rows); 
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de la désactivation.',
        life: 5000
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
