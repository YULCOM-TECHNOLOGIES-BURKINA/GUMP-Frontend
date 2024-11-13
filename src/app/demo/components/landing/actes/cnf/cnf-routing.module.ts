import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CnfComponent } from './cnf.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CnfComponent }
    ])],
    exports: [RouterModule]
})
export class CnfRoutingModule { }
