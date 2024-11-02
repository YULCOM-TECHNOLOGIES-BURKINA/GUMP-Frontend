import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CnssComponent } from './cnss.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CnssComponent }
    ])],
    exports: [RouterModule]
})
export class CnssRoutingModule { }
