import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { KeycloakAuthService } from '../../../services/keycloak-auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  template: `
    <div class="page-header py-3 px-4 mx-0 md:mx-6 lg:mx-10 lg:px-10 flex align-items-center justify-content-between relative lg:static">
      <a class="flex align-items-center" href="#">
        <img src="assets/image.png" alt="GUMP Logo" height="50" class="mr-0 lg:mr-2">
        <span class="logo-text text-900 font-bold text-2xl line-height-3 mr-2">Guichet Unique des Marchés Publics</span>
      </a>

      <div class="flex align-items-center">
        <!-- Desktop Menu -->
        <div class="hidden lg:flex">
          <p-menubar [model]="items" 
                     [style]="{'border': 'none', 'background': 'transparent'}" 
                     styleClass="custom-menubar" 
                     [routerLink]="true">
          </p-menubar>
        </div>

        <!-- Mobile Menu -->
        <div class="flex lg:hidden">
          <p-slideMenu #slideMenu [model]="items" [popup]="true" [viewportHeight]="300"></p-slideMenu>
          <button #btn type="button" pButton icon="pi pi-bars" 
             (click)="slideMenu.toggle($event)"
             class="p-button-text p-button-rounded">
          </button>
        </div>
      </div>
    </div>
  `,
  styles:`
    :host ::ng-deep {
      .custom-menubar {
        .p-menubar {
          padding: 0.5rem;
          background: transparent;
          border: none;
          border-radius: 0;
        }

        .p-menubar-root-list {
          gap: 1rem;
        }

        .p-menuitem-link {
          padding: 0.75rem 1.25rem;
          // border-radius: 2rem;
          transition: all 0.2s;

          &:hover {
            background-color: rgba(0, 128, 0, 0.1);
          }

          .p-menuitem-text {
            color: #374151;
            font-weight: 500;
          }

          .p-menuitem-icon {
            color: #374151;
          }
        }


        // Ajoutez ceci pour les liens actifs
      .active-link .p-menuitem-link-active {
        background-color: rgba(0, 208, 10, 0.35) !important;
        border: 1px solid rgba(0, 128, 0, 0.2);
        
        .p-menuitem-text {
          color: #166534 !important;
          font-weight: 700;
        }
        
        .p-menuitem-icon {
          color: #166534 !important;
        }
      }

        .p-submenu-list {
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                     0 4px 6px -2px rgba(0, 0, 0, 0.05);

          .p-menuitem-link {
            border-radius: 0;

            &:hover {
              background-color: #f3f4f6;
            }
          }
        }
      }
    }
  `
})
export class HeaderComponent implements OnInit {
  items: MenuItem[];
  isAuthenticated: Observable<boolean>;

  private currentUser: any = null;

  constructor(private authService: KeycloakAuthService) {
    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-home',
        routerLink: '/',
        routerLinkActiveOptions: { exact: true },
        styleClass: 'active-link'
      },
      {
        label: 'Guide d\'utilisation',
        icon: 'pi pi-book',
        routerLink: ['/guide'],
        routerLinkActiveOptions: { exact: true },
        styleClass: 'active-link'
      },
      {
        label: 'Vérification',
        icon: 'pi pi-check-circle',
        routerLink: ['/verification'],
        styleClass: 'active-link'
      },
      {
        label: 'FAQ',
        icon: 'pi pi-question-circle',
        routerLink: ['/faq'],
        styleClass: 'active-link'
      }
    ];
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser') !== null) {
      this.items.push(
        { 
          label: 'Mes demandes', 
          icon: 'pi pi-list', 
          routerLink: ['/demandes'],
          styleClass: 'active-link'
        },
        { 
          label: 'Mon profil', 
          icon: 'pi pi-user', 
          routerLink: ['/profile'],
          styleClass: 'active-link'
        },
        { 
          label: 'Se déconnecter', 
          icon: 'pi pi-power-off', 
          styleClass: 'active-link',
          command: () => this.authService.logout() 
        }
      );
    } else {
      this.items.push(
        { 
          label: 'Connexion', 
          icon: 'pi pi-user',
          styleClass: 'active-link',
          command: () => this.authService.login() 
        },
        { 
          label: 'Inscription', 
          icon: 'pi pi-user', 
          routerLink: ['/auth/register'],
          styleClass: 'active-link'
        }
      );
    }
  }
}