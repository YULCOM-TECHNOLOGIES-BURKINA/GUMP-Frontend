import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraitementDrtssRoutingModule } from './drtss-routing.module';
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
import { TraitementDrtssComponent } from './drtss.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { PanelModule } from 'primeng/panel';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [TraitementDrtssComponent],
  imports: [
    CommonModule,
    TraitementDrtssRoutingModule,
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
	BadgeModule,
	PanelModule,
	PdfViewerModule
  ]
})
export class DrtssModule { }
