import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActesRoutingModule } from './actes-routing.module';
import { ReactiveFormsModule } from '@angular/forms'; 
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ActesComponent } from './actes.component';

@NgModule({
  declarations: [
    ActesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActesRoutingModule,
    ButtonModule,
    RouterModule
  ]
})
export class ActesModule { }
