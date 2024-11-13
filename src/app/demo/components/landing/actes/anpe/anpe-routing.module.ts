import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnpeComponent } from './anpe.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AnpeComponent }
    ])],
    exports: [RouterModule]
})
export class AnpeRoutingModule { }
