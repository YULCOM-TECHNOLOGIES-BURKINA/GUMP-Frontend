import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DrtssComponent } from './drtss.component';
import { PaymentCallbackComponent } from './paymentCallback.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DrtssComponent },
        { path: 'payment-callback/:demandeId', component: PaymentCallbackComponent }
    ])],
    exports: [RouterModule]
})
export class DrtssRoutingModule { }
