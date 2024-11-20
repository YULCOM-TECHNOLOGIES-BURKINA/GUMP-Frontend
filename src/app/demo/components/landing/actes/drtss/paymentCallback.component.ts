import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrtssService } from '../../../../services/drtss.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-payment-callback',
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen">
      <p-toast></p-toast>
      <h2 class="text-xl mb-4">Traitement du paiement en cours...</h2>
      <p-progressSpinner *ngIf="loading"></p-progressSpinner>
    </div>
  `,
  providers: [MessageService]
})
export class PaymentCallbackComponent implements OnInit {
  loading = true;

  demandeId!: number; // Paramètre de route
//   paymentRequestID!: string; // Paramètre de requête
//   status!: string; // Paramètre de requête

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private drtssService: DrtssService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Récupérer les paramètres de l'URL
    // Récupérer le paramètre de route et le convertir en nombre
    const demandeIdParam = this.route.snapshot.paramMap.get('demandeId');
    this.demandeId = demandeIdParam ? Number(demandeIdParam) : 0;
    
    this.route.queryParams.subscribe(params => {
    //   const demandeId = params['demandeId'];
      const paymentId = params['paymentRequestID'];
      const status = params['status'];

      if (status === 'SUCCESS') {
        // Vérifier le statut du paiement 
        this.drtssService.updatePaymentStatus(this.demandeId, paymentId).subscribe({
          next: (response) => {
            // if (response.status === 'PAID') {
            //   this.messageService.add({
            //     severity: 'success',
            //     summary: 'Succès',
            //     detail: 'Paiement effectué avec succès!'
            //   });
            //   setTimeout(() => {
            //     this.router.navigate(['/demandes']);
            //   }, 2000);
            // } else {
            //   this.handlePaymentError();
            // }
          },
          error: () => this.handlePaymentError()
        });

        // Vérifier le statut du paiement 
        this.drtssService.getOneDemande(this.demandeId).subscribe({
            next: (response) => {
              if (response.isPaid) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Succès',
                  detail: 'Paiement effectué avec succès!'
                });
                setTimeout(() => {
                  this.router.navigate(['/demandes']);
                }, 3000);
              } else {
                this.handlePaymentError();
              }
            },
            error: () => this.handlePaymentError()
        });
      } else {
        this.handlePaymentError();
      }
    });

    // this.route.queryParams.subscribe(params => {
    //     const demandeId = params['demandeId'];
    //     // this.drtssService.getOneDemande(requestDrtss.id).subscribe(data => {
    //     //     this.requestDrtss = data;
    //     //   });
  

    //       // Vérifier le statut du paiement 
    //       this.drtssService.getOneDemande(demandeId).subscribe({
    //         next: (response) => {
    //           if (response.isPaid) {
    //             this.messageService.add({
    //               severity: 'success',
    //               summary: 'Succès',
    //               detail: 'Paiement effectué avec succès!'
    //             });
    //             setTimeout(() => {
    //               this.router.navigate(['/demandes']);
    //             }, 3000);
    //           } else {
    //             this.handlePaymentError();
    //           }
    //         },
    //         error: () => this.handlePaymentError()
    //       });

    //   });
  }

  private handlePaymentError() {
    this.loading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Le paiement a échoué ou a été annulé.'
    });
    setTimeout(() => {
      this.router.navigate(['/demandes']);
    }, 5000);
  }
}