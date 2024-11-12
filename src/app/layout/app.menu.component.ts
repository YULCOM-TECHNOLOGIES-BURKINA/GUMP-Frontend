import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { KeycloakAuthService } from '../../app/demo/services/keycloak-auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    userRole: string | null = null;

    constructor(public layoutService: LayoutService, private authService: KeycloakAuthService) { }

    ngOnInit() {
        
        const userDetails = localStorage.getItem('currentUser');
        const user = JSON.parse(userDetails);

        this.userRole = user.role;
    
        this.model = [
            {
                label: 'Tableau de bord',
                items: [
                    { label: 'Accueil', icon: 'pi pi-fw pi-home', routerLink: ['/app'] }
                ]
            },
            {
                label: 'Modules',
                visible: this.userRole === 'ADMIN' || this.userRole === 'USER',
                items: [
                    { label: 'Actes', icon: 'pi pi-fw pi-clone', routerLink: ['/app/pages/actes'], visible: this.userRole === 'USER'  },
                    { label: 'Mes demandes', icon: 'pi pi-fw pi-list', routerLink: ['/app/pages/demandes'], visible: this.userRole === 'USER'  },
                    { label: 'Statistiques', icon: 'pi pi-fw pi-clone', routerLink: ['/app/pages/actes'], visible: this.userRole === 'ADMIN' || this.userRole?.startsWith('admin_')  },
                    { label: 'Rapport', icon: 'pi pi-fw pi-list', routerLink: ['/app/pages/demandes'], visible: this.userRole === 'ADMIN'  }
                ]
            },
            {
                label: 'Traitement des demandes',
                // visible: this.userRole === 'ADMIN' || this.userRole?.startsWith('DRTSS_USER'),
                items: [
                    { label: 'Attestation DRTSS', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/drtss'], visible: this.userRole === 'ADMIN' || this.userRole === 'DRTSS_USER' },
                    { label: 'Attestation AJE', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/aje'], visible: this.userRole === 'ADMIN' || this.userRole === 'TRESOR_USER' }
                ]
            },
            {
                label: 'Paramètres',
                visible: this.userRole === 'ADMIN',
                items: [
                    { label: 'Informations générales', icon: 'pi pi-fw pi-user', routerLink: ['/app/pages/profil'] },
                    { label: 'Frais de traitement', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs']},
                    { label: 'Délais de traitement', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs']},
                    { label: 'En-têtes et pieds de page des actes', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs']},
                    { label: 'Signatures electroniques', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs']}
                ]
            },
            {
                label: 'Paramètres',
                visible: this.userRole === 'DRTSS_USER',
                items: [
                    { label: 'Informations générales', icon: 'pi pi-fw pi-user', routerLink: ['/app/pages/profil'] },
                    { label: 'Gestions Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole === 'DRTSS_USER' },
                    { label: 'Gestions Utilisateurs DRTSS', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs-drtss/gestions'], visible: this.userRole === 'DRTSS_USER' },
                    { label: 'Signatures electroniques', icon: 'pi pi-fw pi-qrcode', routerLink: ['/app/pages/signature-electronique/signataire'], visible: this.userRole === 'DRTSS_USER' },
                    { label: 'Signer Attestations', icon: 'pi pi-fw pi-file-edit', routerLink: ['/app/pages/signature-electronique/sign_attestation'], visible: this.userRole === 'DRTSS_USER' }
                ]
            },
            {
                label: 'Sécurité',
                items: [
                    { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/app/pages/profil'] },
                    { label: 'Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole === 'ADMIN' }
                ]
            }
        ];
    }
}
