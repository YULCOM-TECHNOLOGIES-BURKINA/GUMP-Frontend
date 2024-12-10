import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Utilisateur } from 'src/app/demo/models/utilisateurs';
import { SignatureElectroniquesService } from 'src/app/demo/services/signature-electroniques.service';
import { UtilsModuleModule } from 'src/app/demo/shared/utils-module/utils-module.module';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-utilisateurs-dr-regional',
    standalone: true,
    imports: [UtilsModuleModule],
    templateUrl: './utilisateurs-dr-regional.component.html',
    styleUrl: './utilisateurs-dr-regional.component.scss',
    providers: [ConfirmationService, MessageService],
})
export class UtilisateursDrtssComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    userForm: FormGroup;
    userCompteRequestForm: FormGroup;
    dataSource: any[];
    utilisateurs: Utilisateur[];

    totalRecords = 0;
    loading: boolean = false;

    // Pagination
    pageSize: number = 10;
    pageNumber: number = 0;
    items: MenuItem[] = [];

    constructor(
        public layoutService: LayoutService,
        public router: Router,
        private signElectService: SignatureElectroniquesService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}
    ngOnInit(): void {
        this.loadUsers(this.pageNumber, this.pageSize);
        this.listRegions();
    }

    dataResponse: any;
    loadUsers(page: number, size: number) {
        this.loading = true;
        this.signElectService.listUtilisateurDrtss(page, size).subscribe(
            (response: any) => {
                const filterdrtpsUser = response.content.filter(
                    (user) => user.role === 'DRTSS_REGIONAL_MANAGER'
                );
                this.utilisateurs = filterdrtpsUser;
                this.totalRecords = response.totalPages;
                this.loading = false;
                this.cdr.detectChanges();
                console.log('dataResponse', filterdrtpsUser);
            },
            (error) => {
                console.log("Une erreur s'est produite :", error);
                this.loading = false;
                this.cdr.detectChanges(); // Forcer la détection des changements
            }
        );
    }

    onPageChange(event: any) {
        console.log('Changement++', event);

        this.pageNumber = event.first / event.rows;
        this.pageSize = event.rows;
        this.loadUsers(this.pageNumber, this.pageSize);
    }
    selectlabel = '';
    selectLine: Utilisateur;
    onLineClick(event: any) {
        this.selectLine = event;
        console.log(this.selectLine);
        let modifier = true;
        if (this.selectLine.actif == true) {
            this.selectlabel = 'Desactiver';
        } else {
            this.selectlabel = 'Activer';
            modifier = false;
        }

        this.items = [
            {
                label: 'Modifier',
                icon: 'pi pi-refresh',
                visible: modifier,
                command: () => {
                    console.log('TEST');
                    this.openNew('UPDATE');
                },
            },
            { separator: true },
            {
                label: this.selectlabel,
                icon: 'pi pi-times',
                command: () => {
                    console.log('TEST');
                    this.openDeleteDialog(this.selectLine);
                },
            },
        ];
    }

    onConfirm() {
        this.signElectService
            .modifierStatusUtilisateurDrtss(this.selectLine.id)
            .subscribe(
                (response: any) => {
                    this.loadUsers(this.pageNumber, this.pageSize);
                    this.messageSucces(
                        'Operation éffectueé avec succès.',
                        'success'
                    );

                    this.deleteDialog = false;
                },
                (error) => {
                    this.messageSucces("Une erreur s'est produite", 'error');
                }
            );
    }
    submitted: boolean;
    modalDialog: boolean;
    isUpdate: boolean = false;
    openNew(type: string) {
        this.modalDialog = true;
        if (type == 'UPDATE') {
            console.log('selecter', this.selectLine);
            this.selectedRegion = {
                code: this.selectLine.region,
                name: this.selectLine.region,
                nomComplet: this.selectLine.region,
            };

            this.isUpdate = true;
            this.initForm();
            this.userForm.setValue({
                id: this.selectLine.id,
                nom: this.selectLine.nom,
                prenom: this.selectLine.prenom,
                tel: this.selectLine.tel,
                matricule: this.selectLine.matricule,
                titre_honorifique: this.selectLine.titre_honorifique,
                email: this.selectLine.email,
                region: this.selectLine.region,
                role: this.selectLine.role,
                userType: this.selectLine.userType,
                password: '',
                lastname: this.selectLine.lastname,

                username: this.selectLine.username,
                forename: this.selectLine.forename,
            });
        } else {
            this.initForm();
        }
    }

    openDeleteDialog(Utilisateur: Utilisateur) {
        this.confirmDeleteSelected();
    }
    public initForm() {
        this.userForm = this.fb.group({
            id: [],
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            tel: [],
            matricule: [],
            titre_honorifique: [],
            email: ['', Validators.required],
            region: [''],

            /********* */
            role: ['DRTSS_REGIONAL_MANAGER'],
            userType: ['DRTSS_USER'],
            password: ['password'],
            lastname: [''],
            username: [''],
            forename: [''],
        });

        this.userCompteRequestForm = this.fb.group({
            email: [],
            password: [''],
            lastname: [''],
            username: [''],
            forename: [''],
            region: [],
            role: ['DRTSS_REGIONAL_MANAGER'],
            userType: ['DRTSS_USER'],
        });
    }
    isClicked: boolean = false;
    submitForm() {
        this.isClicked = true;
        if (this.selectedRegion != undefined && this.userForm.valid) {
            this.userForm.patchValue({
                region: this.selectedRegion.code,
            });
            let usersInfo = this.userForm.value;

            this.userCompteRequestForm.patchValue({
                email: usersInfo.email,
                password: usersInfo.password,
                username: usersInfo.username,
                lastname: usersInfo.prenom,
                forename: usersInfo.nom,
                region: usersInfo.region,
                role: usersInfo.role,
                userType: usersInfo.userType,
            });

            console.log(
                'userCompteRequestForm',
                this.userCompteRequestForm.value
            );
            console.log('userForm', this.userForm.value);

            this.createUsersCompteRequest();
        } else {
            this.messageSucces(
                'Veillez remplire tout les champs du formulaire',
                'error'
            );
        }
    }

    createUsersCompteRequest() {
        this.signElectService
            .createUserRequest(this.userCompteRequestForm.value)
            .subscribe(
                (response: any) => {
                    console.log('response creation', response);
                    this.saveUsersDrtssCompte();
                    // this.userCompteRequestForm.reset()
                },
                (error) => {
                    this.isClicked = false;
                    this.messageSucces("Une erreur s'est produite", 'error');
                }
            );
    }

    saveUsersDrtssCompte(): void {
        if (this.userForm.valid) {
            this.signElectService.creerUtilisateurDrtss(this.userForm.value).subscribe({
                next: (response: any) => {
                     this.loadUsers(this.pageNumber, this.pageSize);

                     this.messageSucces('Utilisateur créé avec succès.', 'success');

                     this.userForm.reset();
                    this.modalDialog = false;
                    this.isClicked = true;
                },
                error: (err) => {
                     console.error("Erreur lors de la création de l'utilisateur :", err);

                     this.messageSucces("Une erreur s'est produite", 'error');

                     this.isClicked = true;
                },
            });
        } else {
            this.messageSucces('Veuillez remplir correctement le formulaire.', 'warning');
        }
    }


    deleteDialog = false;
    confirmDeleteSelected() {
        this.deleteDialog = true;
    }

    hideDialog() {
        this.modalDialog = false;
        this.submitted = false;
    }

    /************************************* */
    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    messageSucces(message: string, severity: string) {
        this.messageService.add({
            key: 'tst',
            severity: severity,
            summary: 'Message information ',
            detail: message,
        });
    }

    listRegions() {
        this.signElectService.listRegions().subscribe((regions) => {
            this.listeFiltreRegions = regions;
        });
    }
    filteredRegionsAutoComplete: any[] = [];
    listeFiltreRegions: any[] = [];

    selectedRegion: any = { code: 'ss', name: 'test', nomComplet: 'qwert' };

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
