import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DemandeComponent } from './demande.component';


@NgModule({
  declarations: [DemandeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DemandeComponent,
      },
    ]),
  ],
})
export class DemandeModule {}
