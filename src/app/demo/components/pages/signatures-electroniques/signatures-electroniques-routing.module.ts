import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignataireComponent } from './signataire/signataire.component';
import { SignatureAttestationComponent } from './signature-attestation/signature-attestation.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'signataire', component: SignataireComponent },
        { path: 'sign_attestation', component: SignatureAttestationComponent },
    ])],
  exports: [RouterModule]
})
export class SignaturesElectroniquesRoutingModule { }
