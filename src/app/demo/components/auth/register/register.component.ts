import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UtilisateurService } from '../../../services/utilisateurs.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    providers: [MessageService],
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    submitted = false;
  
    constructor(
      private fb: FormBuilder,
      private utilisateurService: UtilisateurService,
      private messageService: MessageService,
      public layoutService: LayoutService
    ) {}
  
    ngOnInit(): void {
      this.registerForm = this.fb.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {
        validator: this.checkPasswords
      });
    }
  
    checkPasswords(group: FormGroup) {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { notSame: true };
    }
  
    onSubmit() {
      this.submitted = true;
  
      if (this.registerForm.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Veuillez corriger les erreurs dans le formulaire.'
        });
        return;
      }
  
      const newUser = this.registerForm.value;
      this.utilisateurService.register(newUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
          });
          this.registerForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: err.message || 'Erreur lors de l\'inscription.'
          });
        }
      });
    }
  }
