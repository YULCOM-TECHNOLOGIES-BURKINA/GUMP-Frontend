import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { SlideMenuModule } from 'primeng/slidemenu';
import { FAQComponent } from './faq/faq.component';
import { GuideComponent } from './guide/guide.component';
import { GuideDetailComponent } from './guide/guide-detail.component';
import { VerificationComponent } from './verification/verification.component';
import { ProfilComponent } from './profil/profil.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from "primeng/inputtext";
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { TimelineModule } from 'primeng/timeline';
import { SharedModule } from './shared/shared.module';
import ActService from '../../services/actes.service';
import { RippleModule } from 'primeng/ripple';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { DemandesComponent } from './demandes/demandes.component';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { TabViewModule } from 'primeng/tabview';
import { ChipsModule } from 'primeng/chips';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LandingRoutingModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule,
        ButtonModule,
        MenuModule,
        MenubarModule,
        SlideMenuModule,
        CardModule,
        InputTextModule,
        SelectButtonModule,
        TagModule,
        ToastModule,
        AccordionModule,
        TimelineModule,
        SharedModule,
        RippleModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        PasswordModule,
        ToggleButtonModule,
        DialogModule,
        TableModule,
        FileUploadModule,
        ToolbarModule,
        RatingModule,
        TooltipModule,
        BadgeModule,
        TabViewModule,
        ChipsModule,
        ReactiveFormsModule,
        InputMaskModule
    ],
    declarations: [
        LandingComponent, 
        FAQComponent, 
        VerificationComponent, 
        GuideComponent, 
        GuideDetailComponent,
        ProfilComponent,
        DemandesComponent],
    providers: [ActService]
})
export class LandingModule { }
