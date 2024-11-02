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
import { VerificationComponent } from './verification/verification.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from "primeng/inputtext";

import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

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
        ToastModule
    ],
    declarations: [LandingComponent, FAQComponent, VerificationComponent]
})
export class LandingModule { }
