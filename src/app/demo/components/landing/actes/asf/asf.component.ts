import { Component, OnInit} from '@angular/core';
import { MessageService } from 'primeng/api';
import { AsfService } from '../../../../services/asf.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asf',
  providers: [MessageService],
  templateUrl: './asf.component.html',
})


export class AsfComponent implements OnInit {
  ifu: string;
  nes: string;

  constructor(
    private messageService: MessageService, 
    private asfService: AsfService,
    private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    if (this.ifu && this.nes) {
      const requestData = {
        ifu: this.ifu,
        nes: this.nes
      }

      this.asfService.submitAttestationRequest(requestData).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Formulaire envoyé avec succès !' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de l\'envoi.' });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez remplir les champs obligatoires.' });
    }
  }

}
