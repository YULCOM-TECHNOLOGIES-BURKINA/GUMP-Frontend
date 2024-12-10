import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DebiteursComponent } from './debiteurs.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DebiteursComponent }
    ])],
    exports: [RouterModule]
})
export class DebiteursRoutingModule { }
