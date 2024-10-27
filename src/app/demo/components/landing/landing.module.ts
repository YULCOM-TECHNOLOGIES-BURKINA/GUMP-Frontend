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
import {SlideMenuModule} from 'primeng/slidemenu';
import { FAQComponent } from './faq/faq.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from "primeng/inputtext";

@NgModule({
    imports: [
        CommonModule,
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
        InputTextModule
    ],
    declarations: [LandingComponent, FAQComponent]
})
export class LandingModule { }
