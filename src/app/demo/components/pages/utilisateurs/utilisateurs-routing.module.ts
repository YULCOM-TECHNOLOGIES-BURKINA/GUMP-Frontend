import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilisateursComponent } from './utilisateurs.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UtilisateursComponent }
    ])],
    exports: [RouterModule]
})
export class UtilisateursRoutingModule { }
