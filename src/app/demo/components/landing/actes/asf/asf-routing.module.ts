import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsfComponent } from './asf.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AsfComponent }
    ])],
    exports: [RouterModule]
})
export class AsfRoutingModule { }
