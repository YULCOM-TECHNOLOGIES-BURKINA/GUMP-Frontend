import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActesRoutingModule } from './actes-routing.module';
import { ReactiveFormsModule } from '@angular/forms'; 
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActesRoutingModule,
    ButtonModule
  ]
})
export class ActesModule { }
