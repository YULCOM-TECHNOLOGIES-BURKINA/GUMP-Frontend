import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Tableau de bord',
                items: [
                    { label: 'Accueil', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Modules',
                items: [
                    { label: 'Campagnes', icon: 'pi pi-fw pi-clone', routerLink: ['/pages/campagnes'] },
                    { label: 'Expression de besoin', icon: 'pi pi-fw pi-list', routerLink: ['/pages/besoins'] },
                    { label: 'Annonces', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pages/annonces'] },
                    { label: 'Niveau de stock', icon: 'pi pi-fw pi-box', routerLink: ['/pages/stock'] },
                    { label: 'Notifications', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                   
                ]
            },
            {
                label: 'Configuration',
                items: [
                    { label: 'Type de campagnes', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                    { label: 'Catégorie de campagnes', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                    { label: 'Type d\'expresion de besoin', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                    { label: 'Type d\'annonces', icon: 'pi pi-fw pi-eye', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
                ]
            },
            {
                label: 'Sécurité',
                items: [
                    { label: 'Profil', icon: 'pi pi-fw pi-user', routerLink: ['/pages/utilisateurs'] },
                    { label: 'Utilisateurs ', icon: 'pi pi-fw pi-users', url: ['/pages/utilisateurs'], target: '_blank' },
                    // { label: 'Groupes ', icon: 'pi pi-fw pi-user-lock', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
                    { label: 'Permissions ', icon: 'pi pi-fw pi-shield', url: ['/pages/utilisateurs'], target: '_blank' },
                ]
            }
        ];
    }
}
