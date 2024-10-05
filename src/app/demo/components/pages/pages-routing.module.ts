import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'demandes', loadChildren: () => import('./demandes/demandes.module').then(m => m.DemandesModule) },
        { path: 'actes', loadChildren: () => import('./actes/actes.module').then(m => m.ActesModule) },
        { path: 'utilisateurs', loadChildren: () => import('./utilisateurs/utilisateurs.module').then(m => m.UtilisateursModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
