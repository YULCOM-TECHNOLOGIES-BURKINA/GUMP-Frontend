import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActesComponent } from './actes.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ActesComponent }
    ])],
    exports: [RouterModule]
})
export class ActesRoutingModule { }
