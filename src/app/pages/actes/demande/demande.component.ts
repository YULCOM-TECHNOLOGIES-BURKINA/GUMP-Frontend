import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
})
export class DemandeComponent implements OnInit, OnDestroy  {
  actes: { label: string, description: string, slug: string }[] = [
    {
      label: 'Attestation DRTSS',
      description: 'Petite description de l\'acte',
      slug: 'attestation-drtss'

    },
    {
      label: 'Attestation de situation cotisante CNSS',
      description: 'Petite description de l\'acte',
      slug: 'attestation-de-situation-cotisante-cnss'

    },
    {
      label: 'Attestation de Situation Fiscale',
      description: 'Petite description de l\'acte',
      slug: 'attestation-de-situation-fiscale'

    },
    {
      label: 'Attestation de non engagement de l\'Agent judiciaire de l\'ETAT (AJE)',
      description: 'Petite description de l\'acte',
      slug: 'attestation-de-non-engagement-aje'

    },
    {
      label: ' Registre du commerce et du crédit Mobilier (RCCM)',
      description: 'Petite description de l\'acte',
      slug: 'rccm'

    },
    {
      label: 'Certificat de non faillite',
      description: 'Petite description de l\'acte',
      slug: 'certificat-de-non-faillite'

    },
    {
      label: 'Attestation ANPE',
      description: 'Petite description de l\'acte',
      slug: 'attestation-anpe'

    }
  ];

  acte_slug: any;

  acte: any;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private cdr: ChangeDetectorRef
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.acte_slug = this.route.snapshot.paramMap.get('slug');

    for (let item of this.actes) {
      if (item.slug === this.acte_slug) {
        this.acte = item;
      }
    }
  }

  saveSettings() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
