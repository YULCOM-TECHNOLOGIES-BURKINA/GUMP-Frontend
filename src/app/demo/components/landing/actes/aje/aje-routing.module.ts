import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AjeComponent } from './aje.component';
import { PaymentCallbackComponent } from './paymentCallback.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AjeComponent },
        { path: 'payment-callback/:demandeId', component: PaymentCallbackComponent }
    ])],
    exports: [RouterModule]
})
export class AjeRoutingModule { }
