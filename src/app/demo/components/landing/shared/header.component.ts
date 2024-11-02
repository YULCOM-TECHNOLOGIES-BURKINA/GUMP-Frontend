import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  template: `
    <div class="py-3 px-4 mx-0 md:mx-6 lg:mx-10 lg:px-10 flex align-items-center justify-content-between relative lg:static">
      <a class="flex align-items-center" href="#">
        <img src="assets/image.png" alt="GUMP Logo" height="50" class="mr-0 lg:mr-2">
        <span class="text-900 font-bold text-2xl line-height-3 mr-2">Guichet Unique des Marchés Publics</span>
      </a>

      <div class="flex align-items-center">
        <!-- Desktop Menu -->
        <div class="hidden lg:flex">
          <p-menubar [model]="items" [style]="{'border': 'none', 'background': 'transparent'}" styleClass="custom-menubar">
            <ng-template pTemplate="end">
              <button routerLink="/auth/login" pButton pRipple label="Connexion" 
                class="p-button border-none font-semibold bg-green-600 hover:bg-green-700 transition-colors transition-duration-150"
                style="border-radius: 2rem;">
              </button>
            </ng-template>
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
  styles:` :host ::ng-deep {
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
            border-radius: 2rem;
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
}`
})
export class HeaderComponent {
  items: MenuItem[];

  constructor() {
    this.items = [
        {
          label: 'Accueil',
          icon: 'pi pi-home',
          routerLink: ['/']
        },
        {
          label: 'Guide d\'utilisation',
          icon: 'pi pi-book',
          routerLink: ['/guide']
        },
        {
          label: 'Vérification',
          icon: 'pi pi-check-circle',
          routerLink: ['/verification']
        },
        {
          label: 'FAQ',
          icon: 'pi pi-question-circle',
          routerLink: ['/faq']
        }
      ];
  }
}