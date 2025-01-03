import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnpeRoutingModule } from './anpe-routing.module';
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
import { AnpeComponent } from './anpe.component';
import { SharedModule } from '../../shared/shared.module';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [AnpeComponent],
  imports: [
		CommonModule,
		AnpeRoutingModule,
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
		SharedModule,
		StepsModule,
		CardModule,
		FieldsetModule,
		SelectButtonModule,
		PanelModule,
		ChartModule,
		ButtonModule, 
		ReactiveFormsModule
  ]
})
export class AnpeModule { }
