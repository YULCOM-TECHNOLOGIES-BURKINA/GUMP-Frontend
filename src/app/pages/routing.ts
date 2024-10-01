import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'actes',
    loadChildren: () =>
      import('./actes/actes.module').then((m) => m.ActesModule),
  },
  {
    path: 'actes/details/:slug',
    loadChildren: () =>
      import('./actes/details/details.module').then((m) => m.DetailsModule),
  },
  {
    path: 'actes/demande/:slug',
    loadChildren: () =>
      import('./actes/demande/demande.module').then((m) => m.DemandeModule),
  },
  // {
  //   path: 'contact',
  //   loadChildren: () =>
  //     import('./contact/contact.module').then((m) => m.ContactModule),
  // },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
