import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RccmComponent } from './rccm.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RccmComponent }
    ])],
    exports: [RouterModule]
})
export class RccmRoutingModule { }
