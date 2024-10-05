import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemandesComponent } from './demandes.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DemandesComponent }
    ])],
    exports: [RouterModule]
})
export class DemandesRoutingModule { }
