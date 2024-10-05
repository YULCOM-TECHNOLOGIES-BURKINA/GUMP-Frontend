import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HistoriqueComponent } from './historique.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';

//import { DropdownMenusModule } from '../dropdown-menus/dropdown-menus.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [HistoriqueComponent],
  imports: [
    CommonModule,
    //DropdownMenusModule,
    InlineSVGModule,
    NgApexchartsModule,
    NgbDropdownModule,
  
    RouterModule.forChild([
      {
        path: '',
        component: HistoriqueComponent,
      },
    ]),
  ],
})
export class HistoriqueModule {}
