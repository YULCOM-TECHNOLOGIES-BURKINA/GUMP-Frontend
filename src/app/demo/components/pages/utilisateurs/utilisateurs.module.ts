import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateursRoutingModule } from './utilisateurs-routing.module';
import { UtilisateursComponent } from './utilisateurs.component';


@NgModule({
//   declarations: [ UtilisateursComponent
// ],
  imports: [
    CommonModule,
    UtilisateursRoutingModule
  ]
})
export class UtilisateursModule { }
