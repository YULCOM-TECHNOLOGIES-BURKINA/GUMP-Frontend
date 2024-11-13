import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { RoleGuard } from '../..//guards/role.guard'; 

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'drtss', loadChildren: () => import('./drtss/drtss.module').then(m => m.DrtssModule), canActivate: [RoleGuard], data: { roles: ['ADMIN', 'DRTSS_USER'] } },
        { path: 'aje', loadChildren: () => import('./aje/aje.module').then(m => m.AjeModule), canActivate: [RoleGuard], data: { roles: ['ADMIN', 'TRESOR_USER'] } },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class TraitementRoutingModule { }
