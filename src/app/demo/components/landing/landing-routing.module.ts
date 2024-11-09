import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { FAQComponent } from './faq/faq.component';
import { VerificationComponent } from './verification/verification.component';
import { GuideComponent } from './guide/guide.component';
import { GuideDetailComponent } from './guide/guide-detail.component';
import { ProfilComponent } from './profil/profil.component';
import { DemandesComponent } from './demandes/demandes.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LandingComponent },
        { path: 'faq', component: FAQComponent },
        { path: 'verification', component: VerificationComponent },
        { path: 'guide', component: GuideComponent },
        { path: 'guide/:id', component: GuideDetailComponent },
        { path: 'profile', component: ProfilComponent },
        { path: 'demandes', component: DemandesComponent },
        { path: 'actes/drtps', loadChildren: () => import('./actes/drtss/drtss.module').then(m => m.DrtssModule) },
        { path: 'actes/aje', loadChildren: () => import('./actes/aje/aje.module').then(m => m.AjeModule) },
        { path: 'actes/anpe', loadChildren: () => import('./actes/anpe/anpe.module').then(m => m.AnpeModule) },
        // { path: 'actes/attestation-cnss', loadChildren: () => import('./actes/cnss/cnss.module').then(m => m.CnssModule) },
        { path: 'actes/rccm', loadChildren: () => import('./actes/rccm/rccm.module').then(m => m.RccmModule) },
        { path: 'actes/cnf', loadChildren: () => import('./actes/cnf/cnf.module').then(m => m.CnfModule) },
        { path: 'actes/asf', loadChildren: () => import('./actes/asf/asf.module').then(m => m.AsfModule) },
    ])],
    exports: [RouterModule]
})
export class LandingRoutingModule { }
