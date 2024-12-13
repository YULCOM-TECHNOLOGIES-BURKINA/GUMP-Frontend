import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { KeycloakAuthService } from '../../app/demo/services/keycloak-auth.service';
import { SignatureElectroniquesService } from '../demo/services/signature-electroniques.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    userRole: string | null|any = null;
    currentUserRole: any[] = [];
     constructor(public layoutService: LayoutService, private authService: KeycloakAuthService, private signatureService:SignatureElectroniquesService ) { }

    ngOnInit() {

        const userDetails = localStorage.getItem('currentUser');
        const user = JSON.parse(userDetails);
        this.checkSignatory(user.email)
        this.userRole = user.role;
        console.log("userRole",user);
        this.initMenu()
    }
    signatory_value:any[]=[]
    isSignatory:boolean=false;

    checkSignatory(email: string): void {
        this.signatureService.getSignatoryByEmail(email).subscribe({
          next: (res: any) => {
                console.log("log",res);

            if ( !!res?.signatureCertificat ) {
                this.userRole
                this.signatory_value.push(res?.signatureCertificat.actif);
                         this.userRole.push(res?.signatureCertificat.actif)
                         this.initMenu()

            }

          },
          error: (error) => {
             this.isSignatory = false;
             this.initMenu()
          },
        });

    }

    initMenu(){
        this.model = [
            {
                label: 'Tableau de bord',
                items: [
                    { label: 'Accueil', icon: 'pi pi-fw pi-home', routerLink: ['/app'] }
                ]
            },
            {
                label: 'Modules',
                visible: this.userRole.includes('ADMIN') ,
                items: [
                    { label: 'Statistiques', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/app/pages/statistiques'], visible: this.userRole.includes('ADMIN')  },
                    { label: 'Rapport', icon: 'pi pi-fw pi-list', routerLink: ['/app/pages/demandes'], visible: this.userRole.includes('ADMIN')   }
                ]
            },
            {
                label: 'Traitement des demandes',
                items: [
                    { label: 'Attestation DRTSS', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/drtss'], visible: this.userRole.includes('ADMIN')  || this.userRole.includes('DRTSS_AGENT')|| this.userRole.includes('DRTSS_REGIONAL_MANAGER') },
                    { label: 'Attestation AJE', icon: 'pi pi-fw pi-file', routerLink: ['/app/traitement/aje'], visible: this.userRole.includes('ADMIN')  || this.userRole.includes('TRESOR_AGENT') }
                ]
            },
            // {
            //     label: 'Paramètres',
            //     visible: this.userRole.includes('ADMIN') ,
            //     items: [
            //         { label: 'Informations générales', icon: 'pi pi-fw pi-user', routerLink: ['/app/pages/profil'] },
            //         { label: 'Frais de traitement', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs']},
            //         { label: 'Délais de traitement', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs']},
            //         { label: 'En-têtes et pieds de page des actes', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs']},
            //         { label: 'Signatures electroniques', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs']}
            //     ]
            // },
            {
                label: 'Paramètres',
                visible: this.userRole.includes('ADMIN') || this.userRole.includes('DRTSS_AGENT') || this.userRole.includes('TRESOR_AGENT')|| this.userRole.includes('DRTSS_REGIONAL_MANAGER'),
                items: [
                    // { label: 'Informations générales', icon: 'pi pi-fw pi-user', routerLink: ['/app/pages/profil'] },
                   // { label: 'Gestions Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole.includes('DRTSS_AGENT') },
                   { label: 'Gestions Utilisateurs DRTSS', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs-drtss/gestions'], visible: this.userRole.includes('ADMIN') || this.userRole.includes('DRTSS_REGIONAL_MANAGER') },
                   { label: 'Gestions Compte Directeurs ', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/directeurs-regional/gestions'], visible: this.userRole.includes('ADMIN')  ||  this.userRole.includes('DRTSS_REGIONAL_MANAGER')},
                   { label: 'Signatures electroniques', icon: 'pi pi-fw pi-qrcode', routerLink: ['/app/pages/signature-electronique/signataire'], visible: this.userRole.includes('ADMIN') ||  this.userRole.includes('DRTSS_REGIONAL_MANAGER') },
                    { label: 'Signer Attestations', icon: 'pi pi-fw pi-file-edit', routerLink: ['/app/pages/signature-electronique/sign_attestation'], visible: this.userRole.includes('ADMIN') || this.userRole.includes('DRTSS_AGENT')  || this.signatory_value.includes(true)},
                    { label: 'Paramétrage délais', icon: 'pi pi-fw pi-paperclip', routerLink: ['/app/pages/application-config'], visible:  this.userRole.includes('ADMIN') || this.userRole.includes('DRTSS_AGENT')},
                    { label: 'Paramétrage délais', icon: 'pi pi-fw pi-paperclip', routerLink: ['/app/pages/application-config'], visible:  this.userRole.includes('ADMIN') || this.userRole.includes('TRESOR_AGENT')},
                    { label: 'Gestion des débiteurs', icon: 'pi pi-fw pi-paperclip', routerLink: ['/app/pages/debiteurs'], visible: this.userRole.includes('TRESOR_AGENT')}
                ]
            },
            {
                label: 'Sécurité',
                items: [
                    { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/app/pages/profil'] },
                    { label: 'Utilisateurs', icon: 'pi pi-fw pi-users', routerLink: ['/app/pages/utilisateurs'], visible: this.userRole.includes('ADMIN')  }
                ]
            }
        ];
    }


}
