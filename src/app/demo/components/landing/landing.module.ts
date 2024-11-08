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
import { CardModule } from 'primeng/card';
import { InputTextModule } from "primeng/inputtext";

import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { TimelineModule } from 'primeng/timeline';
import { SharedModule } from './shared/shared.module';

import ActService from '../../services/actes.service';

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
        SharedModule
    ],
    declarations: [LandingComponent, FAQComponent, VerificationComponent, GuideComponent, GuideDetailComponent],
    providers: [ActService]
})
export class LandingModule { }
