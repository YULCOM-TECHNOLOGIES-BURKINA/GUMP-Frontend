import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    providers: [MessageService],
    animations: [
        trigger('cardAnimation', [
            state('initial', style({
                transform: 'scale(1)',
                width: '400px'
            })),
            state('expanded', style({
                transform: 'scale(1)',
                width: '800px'
            })),
            transition('initial => expanded', animate('300ms ease-out')),
            transition('expanded => initial', animate('300ms ease-in'))
        ]),
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class RegisterComponent implements OnInit {
    ifuForm: FormGroup;
    registerForm: FormGroup;
    submitted = false;
    loading = false;
    showFullForm = false;
    legalForms: any[] = [
        { label: 'SARL', value: 'SARL' },
        { label: 'SA', value: 'SA' },
        { label: 'SAS', value: 'SAS' },
        { label: 'Entreprise individuelle', value: 'EI' }
    ];

    cnibFile: File | null = null;
    statutFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initializeForms();
    }

    initializeForms() {
        this.ifuForm = this.fb.group({
            ifuNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]]
        });

        this.registerForm = this.fb.group({
            companyName: [''],
            legalForm: [''],
            address: [''],
            phoneNumber: [''],
            phoneNumberR: [''],
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            passwordConfirmation: ['', [Validators.required]],
            ifuNumber: [''],
            rccm: [''],
            cnssNumber: ['']
        },{
            validators: this.passwordMatchValidator
        });
    }

    verifyIfu() {
        this.submitted = true;
        if (this.ifuForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.verifyIfu(this.ifuForm.get('ifuNumber')?.value).subscribe({
            next: (response) => {
                this.loading = false;

                this.userService.getUserByIfu(this.ifuForm.get('ifuNumber')?.value).subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Un compte avec ce numéro IFU existe déjà.'
                        });
                    },
                    error: (error) => {
                        this.showFullForm = true;

                        // Pré-remplir le formulaire avec les données de l'entreprise
                        this.registerForm.patchValue({
                            companyName: response.name,
                            legalForm: response.legalForm,
                            address: response.address,
                            phoneNumber: response.phoneNumber,
                            ifuNumber: this.ifuForm.get('ifuNumber')?.value
                        });

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'IFU vérifié avec succès'
                        }); 
                    }
                });
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Numéro IFU invalide ou non trouvé'
                });
            }
        });
    }

    onFileSelect(event: any, fileType: string) {
        const file = event.files[0];
        if (fileType === 'cnibFile') {
          this.cnibFile = file;
        } else if (fileType === 'statutFile') {
          this.statutFile = file;
        }
        this.messageService.add({ severity: 'info', summary: 'Fichier chargé', detail: `${file.name} a été chargé.` });
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('passwordConfirmation');

        // Si les contrôles n'existent pas encore, retournez null
        if (!password || !confirmPassword) return null;

        if (password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        } else {
            // Effacez l'erreur de non-correspondance si elle existait
            const errors = confirmPassword.errors;
            if (errors) {
                delete errors['passwordMismatch'];
                confirmPassword.setErrors(Object.keys(errors).length === 0 ? null : errors);
            }
            return null;
        }
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

        this.loading = true;
        if (this.cnibFile && this.statutFile) {
            const userData = {
            ifuNumber: this.registerForm.get('ifuNumber')?.value,
            cnssNumber: this.registerForm.get('cnssNumber')?.value,
            password: this.registerForm.get('password')?.value,
            email: this.registerForm.get('email')?.value,
            cnibFile: this.cnibFile,
            statutFile: this.statutFile,
            };

            this.userService.register(userData).subscribe({
                next: () => {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Inscription réussie ! Vous allez être redigé vers la page de connexion.',
                        life: 5000
                    });
                    setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 5000);
                },
                error: (error) => {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.message || 'Erreur lors de l\'inscription.'
                    });
                }
            });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez charger correctement les fichiers.' });
        }
    }
}
