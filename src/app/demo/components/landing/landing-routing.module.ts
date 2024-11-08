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
        { path: 'demandes', component: DemandesComponent }
    ])],
    exports: [RouterModule]
})
export class LandingRoutingModule { }
