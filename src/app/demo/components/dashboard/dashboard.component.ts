import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    userRole: string = '';

    constructor(private router: Router, public layoutService: LayoutService, private authService: AuthService) {}

    ngOnInit() {
        const savedUser = localStorage.getItem('currentUser');
        this.userRole=  JSON.parse(savedUser).role ;
    }

    onCardClick(type: 'drtps' | 'aje' | 'entreprises' | 'signatures'): void {
        switch (type) {
          case 'drtps':
            this.router.navigate(['/app/traitement/drtss']);
            break;
          case 'aje':
            this.router.navigate(['/app/traitement/aje']);
            break;
          case 'entreprises':
            this.router.navigate(['/app/pages/utilisateurs']);
            break;
          case 'signatures':
            this.router.navigate(['/app/pages/signature-electronique/signataire']);
            break;
        }
      }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
