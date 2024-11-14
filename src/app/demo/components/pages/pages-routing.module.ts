import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'utilisateurs', loadChildren: () => import('./utilisateurs/utilisateurs.module').then(m => m.UtilisateursModule) },
        { path: 'utilisateurs-drtss', loadChildren: () => import('./utilisateurs-drtss/utilisateurs-drtss.module').then(m => m.UtilisateursDrtssModule) },
        { path: 'profil', loadChildren: () => import('./profil/profil.module').then(m => m.ProfilModule) },
        { path: 'signature-electronique', loadChildren: () => import('./signatures-electroniques/signatures-electroniques.module').then(m => m.SignaturesElectroniquesModule) },
        { path: 'application-config', loadChildren: () => import('./application-config/application-config.module').then(m => m.ApplicationConfigModule) },

        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
