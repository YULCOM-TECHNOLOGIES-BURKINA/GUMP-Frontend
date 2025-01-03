import { RouterModule } from '@angular/router'; 
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from '../app/demo/guards/auth.guard';  
import { RoleGuard } from '../app/demo/guards/role.guard';  

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'app', component: AppLayoutComponent,
                canActivate: [AuthGuard, RoleGuard], 
                children: [
                    // { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    {
                        path: '',
                        loadChildren: () => {
                          const user = JSON.parse(localStorage.getItem('currentUser'));
                          if (user.role.includes('DRTSS_AGENT') || user.role.includes('DRTSS_REGIONAL_MANAGER')) {
                            return import('./demo/components/traitement/drtss/drtss.module').then(m => m.DrtssModule);
                          } else if (user.role.includes('TRESOR_AGENT')) {
                            return import('./demo/components/traitement/aje/aje.module').then(m => m.AjeModule);
                          } else {
                            return import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule);
                          }
                        }
                      },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'traitement', loadChildren: () => import('./demo/components/traitement/traitement.module').then(m => m.TraitementModule) }
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: '', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
