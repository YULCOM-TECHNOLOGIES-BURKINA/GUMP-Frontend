import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateursAjeComponent } from './utilisateurs-aje/utilisateurs-aje.component';

const routes: Routes = [];

@NgModule({

    imports: [RouterModule.forChild([
        { path: 'gestions', component: UtilisateursAjeComponent },
    ])],
    exports: [RouterModule]
})
export class UtilisateursAjeRoutingModule { }
