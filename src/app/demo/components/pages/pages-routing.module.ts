import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'demandes', loadChildren: () => import('./demandes/demandes.module').then(m => m.DemandesModule) },
        { path: 'actes', loadChildren: () => import('./actes/actes.module').then(m => m.ActesModule) },
        { path: 'actes/attestation-drtss', loadChildren: () => import('./actes/drtss/drtss.module').then(m => m.DrtssModule) },
        { path: 'actes/attestation-aje', loadChildren: () => import('./actes/aje/aje.module').then(m => m.AjeModule) },
        { path: 'actes/attestation-anpe', loadChildren: () => import('./actes/anpe/anpe.module').then(m => m.AnpeModule) },
        { path: 'actes/attestation-cnss', loadChildren: () => import('./actes/cnss/cnss.module').then(m => m.CnssModule) },
        { path: 'actes/attestation-rccm', loadChildren: () => import('./actes/rccm/rccm.module').then(m => m.RccmModule) },
        { path: 'actes/certificat-de-non-faillite', loadChildren: () => import('./actes/cnf/cnf.module').then(m => m.CnfModule) },
        { path: 'actes/attestation-situation-fiscale', loadChildren: () => import('./actes/asf/asf.module').then(m => m.AsfModule) },
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
