import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignaturesElectroniquesRoutingModule } from './signatures-electroniques-routing.module';
import { UtilsModuleModule } from '../../../shared/utils-module/utils-module.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SignaturesElectroniquesRoutingModule,
    UtilsModuleModule,
  ]
})
export class SignaturesElectroniquesModule { }
