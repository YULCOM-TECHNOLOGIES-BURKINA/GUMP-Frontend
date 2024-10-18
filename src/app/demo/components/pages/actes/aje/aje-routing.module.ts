import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AjeComponent } from './aje.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AjeComponent }
    ])],
    exports: [RouterModule]
})
export class AjeRoutingModule { }
