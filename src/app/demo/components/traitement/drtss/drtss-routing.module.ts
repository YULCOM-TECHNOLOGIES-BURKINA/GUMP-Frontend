import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TraitementDrtssComponent } from './drtss.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TraitementDrtssComponent }
    ])],
    exports: [RouterModule]
})
export class TraitementDrtssRoutingModule { }
