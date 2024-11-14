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
                    { label: 'Actes', icon: 'pi pi-fw pi-clone', routerLink: ['/app/pages/actes'], visible: this.userRole === 'entreprise'  },
                    { label: 'Mes demandes', icon: 'pi pi-fw pi-list', routerLink: ['/app/pages/demandes'], visible: this.userRole === 'entreprise'  },
                    { label: 'Statistiques', icon: 'pi pi-fw pi-clone', routerLink: ['/app/pages/actes'], visible: this.userRole === 'admin' || this.userRole?.startsWith('admin_')  },
                    { label: 'Rapport', icon: 'pi pi-fw pi-list', routerLink: ['/app/pages/demandes'], visible: this.userRole === 'admin'  }
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
                    { label: 'Attestation AJE', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/aje'], visible: this.userRole === 'admin' || this.userRole === 'admin_aje' },
                    { label: 'RCCM', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/rccm'], visible: this.userRole === 'admin' },
                ]
            },
            {
                label: 'Paramètres',
                visible: this.userRole === 'admin',
                items: [
                    { label: 'Informations générales', icon: 'pi pi-fw pi-user', routerLink: ['/app/pages/profil'] },
                    { label: 'Frais de traitement', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole === 'admin' },
                    { label: 'Délais de traitement', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole === 'admin' },
                    { label: 'En-têtes et pieds de page des actes', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole === 'admin' },
                    { label: 'Signatures electroniques', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole === 'admin' }
                ]
            },
            {
                label: 'Paramètres',
                visible: this.userRole === 'admin_drtss',
                items: [
                    { label: 'Informations générales', icon: 'pi pi-fw pi-user', routerLink: ['/app/pages/profil'] },
                   // { label: 'Gestions Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole === 'admin_drtss' },
                    { label: 'Gestions Utilisateurs DRTSS', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs-drtss/gestions'], visible: this.userRole === 'admin_drtss' },
                    { label: 'Signatures electroniques', icon: 'pi pi-fw pi-qrcode', routerLink: ['/app/pages/signature-electronique/signataire'], visible: this.userRole === 'admin_drtss' },
                    { label: 'Signer Attestations', icon: 'pi pi-fw pi-file-edit', routerLink: ['/app/pages/signature-electronique/sign_attestation'], visible: this.userRole === 'admin_drtss' },
                    { label: 'Paramétrage délais', icon: 'pi pi-fw pi-paperclip', routerLink: ['/app/pages/application-config'], visible: this.userRole === 'admin_drtss' },
                    { label: 'Paramétrage délais', icon: 'pi pi-fw pi-paperclip', routerLink: ['/app/pages/application-config'], visible: this.userRole === 'admin_aje' }
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
