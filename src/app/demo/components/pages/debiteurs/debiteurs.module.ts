import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebiteursRoutingModule } from './debiteurs-routing.module';
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
import { DebiteursComponent } from './debiteurs.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [DebiteursComponent],
  imports: [
    CommonModule,
    DebiteursRoutingModule,
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
	DialogModule,
	TableModule,
	ButtonModule,
	RippleModule,
	ToolbarModule,
	RatingModule,
	RadioButtonModule,
	TooltipModule,
	TabViewModule,
	BadgeModule
    
  ]
})
export class AjeModule { }
