import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActesComponent } from './actes.component';


@NgModule({
  declarations: [ActesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ActesComponent,
      },
    ]),
  ],
})
export class ActesModule {}
