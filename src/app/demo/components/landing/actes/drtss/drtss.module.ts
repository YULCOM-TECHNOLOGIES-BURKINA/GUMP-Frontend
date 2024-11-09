import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrtssRoutingModule } from './drtss-routing.module';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { FileUploadModule } from "primeng/fileupload";
import { ToastModule } from 'primeng/toast';
import { DrtssComponent } from './drtss.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DrtssComponent],
  imports: [
		CommonModule,
		DrtssRoutingModule,
		FormsModule,
		AutoCompleteModule,
		CalendarModule,
		ChipsModule,
		DropdownModule,
		InputMaskModule,
		InputNumberModule,
		CascadeSelectModule,
		MultiSelectModule,
		InputTextareaModule,
		InputTextModule,
		ToastModule,
		FileUploadModule,
		SharedModule    
  ]
})
export class DrtssModule { }
