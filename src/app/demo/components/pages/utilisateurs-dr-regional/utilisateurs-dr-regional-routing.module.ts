import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateursDrtssComponent } from './utilisateurs-dr-regional/utilisateurs-dr-regional.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'gestions', component: UtilisateursDrtssComponent},
    ])],
  exports: [RouterModule]
})
export class UtilisateursDrRegionalRoutingModule { }
