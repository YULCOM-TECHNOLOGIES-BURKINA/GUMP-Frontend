import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { RoleGuard } from '../..//guards/role.guard'; 

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'drtss', loadChildren: () => import('./drtss/drtss.module').then(m => m.DrtssModule), canActivate: [RoleGuard], data: { roles: ['admin', 'admin_drtss'] } },
        // { path: 'actes', loadChildren: () => import('./actes/actes.module').then(m => m.ActesModule) },
        // { path: 'actes/attestation-drtss', loadChildren: () => import('./actes/drtss/drtss.module').then(m => m.DrtssModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class TraitementRoutingModule { }
