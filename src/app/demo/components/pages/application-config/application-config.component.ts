import { Component } from '@angular/core';
import { ApplicationConfigDrtpsComponent } from './application-config-drtps/application-config-drtps.component';
import { ApplicationConfigAjeComponent } from './application-config-aje/application-config-aje.component';
import { AuthService } from 'src/app/demo/services/auth.service';
import { CommonModule } from '@angular/common';
import { ApplicationConfigActeComponent } from './application-config-acte/application-config-acte.component';

@Component({
  selector: 'app-application-config',
  standalone: true,
  imports: [
    CommonModule,
    ApplicationConfigActeComponent,
    // ApplicationConfigDrtpsComponent,
    // ApplicationConfigAjeComponent
  ],
  templateUrl: './application-config.component.html',
  styleUrl: './application-config.component.scss'
})
export class ApplicationConfigComponent {


    userRole: any;
   constructor(private authService: AuthService ){
    this.userRole = this.authService.getUserRole();

    const userDetails = localStorage.getItem('currentUser');
    const user = JSON.parse(userDetails);

    this.userRole = user.role;
   }

}
