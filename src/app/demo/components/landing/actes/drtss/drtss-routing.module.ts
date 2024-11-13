import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DrtssComponent } from './drtss.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DrtssComponent }
    ])],
    exports: [RouterModule]
})
export class DrtssRoutingModule { }
