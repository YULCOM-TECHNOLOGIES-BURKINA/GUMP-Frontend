import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { FAQComponent } from './faq/faq.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LandingComponent },
        { path: 'faq', component: FAQComponent }
    ])],
    exports: [RouterModule]
})
export class LandingRoutingModule { }
