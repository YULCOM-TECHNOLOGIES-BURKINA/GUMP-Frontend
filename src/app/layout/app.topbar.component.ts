import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { SignatureElectroniquesService } from '../demo/services/signature-electroniques.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{
    userRole:any
    items!: MenuItem[];
    user:any=[]
    userInfo:any=[]
//currentUser :"{"nom":"drtss-agent","prenom":"drtss-agent","email":"drtss-agent@gmail.com","role_realm_access":["offline_access","default-roles-gump","uma_authorization"],"role":["DRTSS_AGENT"],"username":"drtss-agent"}"
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,public signatureService:SignatureElectroniquesService ) {
        const userDetails = localStorage.getItem('currentUser');
         this.user = JSON.parse(userDetails);
         this.userRole = this.user.role;
        console.log("userRole",this.user);

    }
    ngOnInit(): void {

        this.signatureService.getUsersInfoByEmail(this.user.email).subscribe({
            next: (res: any) => {
                this.userInfo=res
             },
            error: (error) => {
             },
          });
    }
}
