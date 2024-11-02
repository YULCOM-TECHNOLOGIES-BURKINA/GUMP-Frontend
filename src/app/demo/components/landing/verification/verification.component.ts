import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';


interface VerificationResult {
  docType: string;
  reference: string;
  status: 'valid' | 'invalid' | 'pending';
  issueDate?: string;
  expiryDate?: string;
  organization?: string;
  additionalInfo?: string;
}

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  providers: [MessageService]
})
export class VerificationComponent implements OnInit {
  items: MenuItem[] = [];
  reference: string = '';
  loading: boolean = false;
  showResult: boolean = false;
  selectedDocType: string = '';
  verificationResult: VerificationResult | null = null;

  documentTypes = [
    { label: 'Attestation DRTPS', value: 'DRTPS' },
    { label: 'Attestation CNSS', value: 'CNSS' },
    { label: 'Attestation AJE', value: 'AJE' },
    { label: 'Attestation ANPE', value: 'ANPE' },
    { label: 'Attestation ASF', value: 'ASF' }
  ];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-home',
        routerLink: ['/']
      },
      {
        label: 'Guide d\'utilisation',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Textes reglémentaires',
            icon: 'pi pi-file-pdf',
            routerLink: ['/about']
          },
          {
            label: 'DRTSS',
            icon: 'pi pi-file',
            routerLink: ['/guide/drtss']
          },
          {
            label: 'AJE',
            icon: 'pi pi-file',
            routerLink: ['/guide/aje']
          },
          {
            label: 'CNSS',
            icon: 'pi pi-file',
            routerLink: ['/guide/cnss']
          },
          {
            label: 'ANPE',
            icon: 'pi pi-file',
            routerLink: ['/guide/anpe']
          },
          {
            label: 'ASF',
            icon: 'pi pi-file',
            routerLink: ['/guide/asf']
          }
        ]
      },
      {
        label: 'Vérification',
        icon: 'pi pi-check-circle',
        routerLink: ['/verification']
      },
      {
        label: 'FAQ',
        icon: 'pi pi-question-circle',
        routerLink: ['/faq']
      }
      // {
      //   label: 'Contact',
      //   icon: 'pi pi-envelope',
      //   routerLink: ['/contact']
      // }
    ];
  }

  verify() {
    if (!this.reference || !this.selectedDocType) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez saisir une référence et sélectionner un type de document'
      });
      return;
    }

    this.loading = true;
    this.showResult = false;

    setTimeout(() => {
      this.verificationResult = {
        docType: this.selectedDocType,
        reference: this.reference,
        status: 'valid',
        issueDate: '2024-01-15',
        expiryDate: '2024-12-31',
        organization: 'Direction Régionale du Travail et de la Protection Sociale',
        additionalInfo: 'Document émis par la DRPTS du Centre'
      };

      this.loading = false;
      this.showResult = true;
    }, 1500);
  }

  reset() {
    this.reference = '';
    this.selectedDocType = '';
    this.showResult = false;
    this.verificationResult = null;
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'valid':
        return 'success';
      case 'invalid':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'valid':
        return 'pi pi-check-circle';
      case 'invalid':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-info-circle';
    }
  }
}