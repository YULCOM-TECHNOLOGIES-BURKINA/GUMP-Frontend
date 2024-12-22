import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AnpeService } from '../../../../services/anpe.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-anpe',
  providers: [MessageService],
  templateUrl: './anpe.component.html',
})
export class AnpeComponent implements OnInit {

  anpeForm: FormGroup;

  constructor(
    private messageService: MessageService,
    private anpeService: AnpeService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.anpeForm = this.fb.group({
      nombreDemandes: ['', [Validators.required, Validators.min(1)]],
      codeOTP: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}$/)]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{2}-\d{2}-\d{2}$/)]]
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    if (this.anpeForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Votre demande a été soumise avec succès'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez remplir correctement tous les champs'
      });
    }
  }

}