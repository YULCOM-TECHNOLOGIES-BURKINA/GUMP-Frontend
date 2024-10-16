import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'demandes', loadChildren: () => import('./demandes/demandes.module').then(m => m.DemandesModule) },
        { path: 'actes', loadChildren: () => import('./actes/actes.module').then(m => m.ActesModule) },
        { path: 'actes/attestation-drtss', loadChildren: () => import('./actes/drtss/drtss.module').then(m => m.DrtssModule) },
        { path: 'actes/attestation-aje', loadChildren: () => import('./actes/aje/aje.module').then(m => m.AjeModule) },
        { path: 'utilisateurs', loadChildren: () => import('./utilisateurs/utilisateurs.module').then(m => m.UtilisateursModule) },
        { path: 'profil', loadChildren: () => import('./profil/profil.module').then(m => m.ProfilModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
