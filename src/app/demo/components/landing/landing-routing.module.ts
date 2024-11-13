import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { FAQComponent } from './faq/faq.component';
import { VerificationComponent } from './verification/verification.component';
import { GuideComponent } from './guide/guide.component';
import { GuideDetailComponent } from './guide/guide-detail.component';
import { ProfilComponent } from './profil/profil.component';
import { DemandesComponent } from './demandes/demandes.component';
import { AuthGuard } from '../../guards/auth.guard';  

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LandingComponent },
        { path: 'faq', component: FAQComponent },
        { path: 'verification', component: VerificationComponent },
        { path: 'guide', component: GuideComponent },
        { path: 'guide/:id', component: GuideDetailComponent },
        { path: 'profile', canActivate: [AuthGuard],  component: ProfilComponent },
        { path: 'demandes', canActivate: [AuthGuard], component: DemandesComponent },
        { path: 'actes/drtps', canActivate: [AuthGuard],  loadChildren: () => import('./actes/drtss/drtss.module').then(m => m.DrtssModule) },
        { path: 'actes/aje', canActivate: [AuthGuard], loadChildren: () => import('./actes/aje/aje.module').then(m => m.AjeModule) },
        { path: 'actes/anpe', canActivate: [AuthGuard], loadChildren: () => import('./actes/anpe/anpe.module').then(m => m.AnpeModule) },
        { path: 'actes/rccm', canActivate: [AuthGuard], loadChildren: () => import('./actes/rccm/rccm.module').then(m => m.RccmModule) },
        { path: 'actes/cnf', canActivate: [AuthGuard],  loadChildren: () => import('./actes/cnf/cnf.module').then(m => m.CnfModule) },
        { path: 'actes/asf', canActivate: [AuthGuard], loadChildren: () => import('./actes/asf/asf.module').then(m => m.AsfModule) },
    ])],
    exports: [RouterModule]
})
export class LandingRoutingModule { }
