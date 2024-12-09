import { APP_INITIALIZER, NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { DrtssService } from './demo/services/drtss.service';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeycloakAuthService } from './demo/services/keycloak-auth.service';
import { RouterModule } from '@angular/router';

export function initializeKeycloak(keycloak: KeycloakAuthService) {
    return () => keycloak.init();
}

@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserModule,
        ToastModule,
        ButtonModule,
        InputTextModule,
        RouterModule
    ],
    providers: [
        {

            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakAuthService]
        },
        
        DrtssService,
        MessageService,
        KeycloakAuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
