import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SignatureElectroniquesService } from 'src/app/demo/services/signature-electroniques.service';

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

    cnibFile: File | null = null;
    statutFile: File | null = null;

    filteredRegionsAutoComplete: any[] = [];
    listeFiltreRegions: any[] = [];

    selectedRegion: any ;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private messageService: MessageService,
        private signElectService: SignatureElectroniquesService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initializeForms();
        this.listRegions();
    }

    initializeForms() {
        this.ifuForm = this.fb.group({
            ifuNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
            nes: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]]
        });

        this.registerForm = this.fb.group({
            companyName: [''],
            address: [''],
            phoneNumber: [''],
            phoneNumberR: [''],
            lastname: ['', Validators.required],
            forename: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            passwordConfirmation: ['', [Validators.required]],
            ifuNumber: [''],
            nip: [''],
            rccm: [''],
            cnssNumber: [''],
            selectedRegion: [''],
            nes: ['']
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
        const vData = {
            ifu: this.ifuForm.get('ifuNumber')?.value,
            nes: this.ifuForm.get('nes')?.value
        };

        // Vérification du NES
        this.userService.verifyNes(vData).subscribe({
            next: (response) => {
                // Vérifions si la réponse contient data.error
                if (response?.data?.error?.code === 404) {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'NES invalide ou non trouvé'
                    });
                    return;
                }

                // Si le NES est valide, on vérifie l'IFU
                this.userService.verifyIfu(this.ifuForm.get('ifuNumber')?.value).subscribe({
                    next: (ifuResponse) => {
                        // Vérification de l'existence d'un compte avec le même IFU
                        this.userService.getUserByIfu(this.ifuForm.get('ifuNumber')?.value).subscribe({
                            next: () => {
                                this.loading = false;
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Erreur',
                                    detail: 'Un compte avec ce numéro IFU existe déjà.'
                                });
                            },
                            error: () => {
                                this.loading = false;
                                this.showFullForm = true;

                                // Pré-remplir le formulaire avec les données de l'entreprise
                                this.registerForm.patchValue({
                                    companyName: ifuResponse.name,
                                    address: ifuResponse.address,
                                    phoneNumber: ifuResponse.phoneNumber,
                                    ifuNumber: this.ifuForm.get('ifuNumber')?.value
                                });

                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Succès',
                                    detail: 'Vérification réussie. Vous pouvez continuer votre inscription.'
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
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de la vérification du NES'
                });
            }
        });
        this.submitted = false;
        this.loading = false;
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
            const formData = new FormData();
            const registerRequest = {
                ifuNumber: this.registerForm.get('ifuNumber')?.value,
                cnssNumber: this.registerForm.get('cnssNumber')?.value,
                password: this.registerForm.get('password')?.value,
                passwordConfirmation: this.registerForm.get('passwordConfirmation')?.value,
                representantPhone: this.registerForm.get('phoneNumberR')?.value,
                representantLastname: this.registerForm.get('lastname')?.value,
                representantFirstname: this.registerForm.get('forename')?.value,
                representantNip: this.registerForm.get('nip')?.value,
                email: this.registerForm.get('email')?.value,
                nes: this.ifuForm.get('nes')?.value,
                region: this.registerForm.get('selectedRegion')?.value.code
            };

            formData.append('registerRequest', new Blob([JSON.stringify(registerRequest)], {
                type: 'application/json'
            }));

            formData.append('cnibFile', this.cnibFile);
            formData.append('statutFile', this.statutFile);

            this.userService.register(formData).subscribe({
                next: (response) => {
                    this.loading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Inscription réussie ! Vous allez être redigé vers la page de connexion.',
                        life: 5000
                    });
                    setTimeout(() => {
                        this.router.navigate(['/auth/login']);
                    }, 1000);
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
            this.loading = false;
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Veuillez charger correctement les fichiers.' });
        }
        this.loading = false;
    }

    listRegions() {
        this.signElectService.listRegions().subscribe((regions) => {
            this.listeFiltreRegions = regions;
        });
    }
    
    filterRegion(event: any) {
        const filtered: any[] = [];
        const query = event.query.toLowerCase();

        if (Array.isArray(this.listeFiltreRegions)) {
            for (let i = 0; i < this.listeFiltreRegions.length; i++) {
                const region = this.listeFiltreRegions[i];
                if (
                    region?.code?.toLowerCase().includes(query) ||
                    region?.name?.toLowerCase().includes(query)
                ) {
                    region.nomComplet = `${region.name}`;
                    filtered.push(region);
                }
            }
        }

        this.filteredRegionsAutoComplete = filtered;
        console.log('Résultats du filtre :', this.filteredRegionsAutoComplete);
    }
}
