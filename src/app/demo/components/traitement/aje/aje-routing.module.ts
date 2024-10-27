import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TraitementAjeComponent } from './aje.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TraitementAjeComponent }
    ])],
    exports: [RouterModule]
})
export class TraitementAjeRoutingModule { }
