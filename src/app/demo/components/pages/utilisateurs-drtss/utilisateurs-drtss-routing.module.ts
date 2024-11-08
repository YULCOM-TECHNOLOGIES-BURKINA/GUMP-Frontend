import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateursDrtssComponent } from './utilisateurs-drtss/utilisateurs-drtss.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'gestions', component: UtilisateursDrtssComponent },
    ])],
  exports: [RouterModule]
})
export class UtilisateursDrtssRoutingModule { }
