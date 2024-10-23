import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../../app/demo/services/auth.service'; 

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    userRole: string | null = null;

    constructor(public layoutService: LayoutService, private authService: AuthService) { }

    ngOnInit() {
        // Récupérer le rôle de l'utilisateur
        this.userRole = this.authService.getUserRole(); 
        
        this.model = [
            {
                label: 'Tableau de bord',
                items: [
                    { label: 'Accueil', icon: 'pi pi-fw pi-home', routerLink: ['/app'] }
                ]
            },
            {
                label: 'Modules',
                visible: this.userRole === 'admin' || this.userRole === 'entreprise',
                items: [
                    { label: 'Actes', icon: 'pi pi-fw pi-clone', routerLink: ['/app/pages/actes'] },
                    { label: 'Mes demandes', icon: 'pi pi-fw pi-list', routerLink: ['/app/pages/demandes'] },
                    // { label: 'Nouvelle demande DRTSS', icon: 'pi pi-fw pi-list', routerLink: ['/app/pages/actes/attestation-drtss'] },
                ]
            },
            {
                label: 'Traitement des demandes',
                visible: this.userRole === 'admin' || this.userRole?.startsWith('admin_'),
                items: [
                    { label: 'Attestation DRTSS', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/drtss'], visible: this.userRole === 'admin' || this.userRole === 'admin_drtss' },
                    { label: 'Attestation ANPE', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/anpe'], visible: this.userRole === 'admin' },
                    { label: 'Attestation CNSS', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/cnss'], visible: this.userRole === 'admin' },
                    { label: 'Attestation Situation Fiscale', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/situation-fiscale'], visible: this.userRole === 'admin' },
                    { label: 'Certificat de non faillite', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/cnf'], visible: this.userRole === 'admin' },
                    { label: 'Attestation AJE', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/aje'], visible: this.userRole === 'admin' },
                    { label: 'RCCM', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/rccm'], visible: this.userRole === 'admin' },
                ]
            },
            {
                label: 'Sécurité',
                items: [
                    { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/app/pages/profil'] },
                    { label: 'Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole === 'admin' }
                ]
            }
        ];
    }
}
