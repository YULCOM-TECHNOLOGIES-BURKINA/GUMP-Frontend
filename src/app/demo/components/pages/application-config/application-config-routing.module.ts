import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationConfigDrtpsComponent } from './application-config-drtps/application-config-drtps.component';
import { ApplicationConfigAjeComponent } from './application-config-aje/application-config-aje.component';
import { ApplicationConfigComponent } from './application-config.component';

const routes: Routes = [];

@NgModule({

    imports: [RouterModule.forChild([
        { path: '', component: ApplicationConfigComponent },
    ])],
 exports: [RouterModule]



})
export class ApplicationConfigRoutingModule { }
