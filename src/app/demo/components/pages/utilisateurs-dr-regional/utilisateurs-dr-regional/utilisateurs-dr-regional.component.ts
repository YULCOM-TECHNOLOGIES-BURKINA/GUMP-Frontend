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
import { Observable, retry } from 'rxjs';
import { Utilisateur } from 'src/app/demo/models/utilisateurs';
import { SignatureElectroniquesService } from 'src/app/demo/services/signature-electroniques.service';
import { UtilsModuleModule } from 'src/app/demo/shared/utils-module/utils-module.module';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-utilisateurs-dr-regional',
    standalone: true,
    imports: [UtilsModuleModule, SpinnerComponent],
    templateUrl: './utilisateurs-dr-regional.component.html',
    styleUrl: './utilisateurs-dr-regional.component.scss',
    providers: [ConfirmationService, MessageService],
})
export class UtilisateursDrtssComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    userForm: FormGroup;
    //userCompteRequestForm: FormGroup;
    dataSource: any[];
    utilisateurs: Utilisateur[];

    totalRecords = 0;
    loading: boolean = false;

    // Pagination
    pageSize: number = 10000;
    pageNumber: number = 0;
    items: MenuItem[] = [];
    isLoading: boolean = false; // Contrôle l'affichage du spinner
    currentUser:any
    constructor(
        public layoutService: LayoutService,
        public router: Router,
        private signElectService: SignatureElectroniquesService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private spinner: NgxSpinnerService
    ) {}
    ngOnInit(): void {
        this.loadUsers(this.pageNumber, this.pageSize);
        this.listRegions();
        const userDetails = localStorage.getItem('currentUser');
        this.currentUser = JSON.parse(userDetails);
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
                this.isLoading = false;
            },
            (error) => {
                this.loading = false;
                this.isLoading = false;

                this.cdr.detectChanges();
            }
        );
    }

    onPageChange(event: any) {
        this.pageNumber = event.first / event.rows;
        this.pageSize = event.rows;
        this.loadUsers(this.pageNumber, this.pageSize);
    }
    selectlabel = '';
    selectLine: Utilisateur;
    onLineClick(event: any) {
        this.selectLine = event;
 
        let modifier = true;
        if (
            this.selectLine.isActive == true &&
            this.selectLine.email != this.currentUser.email) {
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
                    this.openNew('UPDATE');
                },
            },
            { separator: true },
            {
                label: this.selectlabel,
                icon: 'pi pi-times',
                command: () => {
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
            this.selectedRegion = {
                code: this.selectLine.region,
                name: this.selectLine.region,
                nomComplet: this.selectLine.region,
            };

            this.isUpdate = true;
            this.initForm();
            this.userForm.setValue({
                id: this.selectLine.id,
                forename: this.selectLine.forename,
                lastname: this.selectLine.lastname,
                tel: this.selectLine.tel,
                matricule: this.selectLine.matricule,
                titre_honorifique: this.selectLine.titre_honorifique,
                email: this.selectLine.email,
                region: this.selectLine.region,
                role: this.selectLine.role,
                userType: this.selectLine.userType,
                password: '',

                username: this.selectLine.username,
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
            forename: ['', Validators.required],
            lastname: ['', Validators.required],
            tel: [],
            matricule: [],
            titre_honorifique: [],
            email: ['', Validators.required],
            region: [''],

            role: ['DRTSS_REGIONAL_MANAGER'],
            userType: ['DRTSS_USER'],
            password: ['password'],
            username: [''],
        });
    }
    submitForm() {
        let form = this.userForm.value;

        this.userForm.patchValue({
            region: this.selectedRegion.code,
            username: form.email,
        });

        if (
            !this.isUpdate &&
            this.selectedRegion != undefined &&
            this.userForm.valid
        ) {
            this.createUsersCompteRequest();
        } else if (this.isUpdate) {
            this.UpdateUsersCompteRequest();
        } else {
            this.messageSucces(
                'Veillez remplire tout les champs du formulaire',
                'error'
            );
        }
    }

    isClicked: boolean = false;

    createUsersCompteRequest() {
        console.log(this.userForm.value);
        let region = this.userForm.get('region').value;
        let role = this.userForm.get('role').value;
        this.signElectService
            .createUserRequest(this.userForm.value)
            .pipe(retry(2))
            .subscribe({
                next: (response: any) => {
                    this.handleSuccess();
                },
                error: (error) => {
                    this.handleError(error);
                },
                complete: () => {
                    this.isClicked = false;
                },
            });
    }
    UpdateUsersCompteRequest() {
        const form = this.userForm.value;
        this.userForm.patchValue({ username: form.email });

        this.isClicked = true;
        console.log('Formulaire mis à jour :', this.userForm.value);

        this.signElectService
            .updateUserRequest(this.userForm.value)
            .pipe(retry(2))
            .subscribe({
                next: (response: any) => {
                    this.handleUpdateSuccess();
                },
                error: (error: any) => {
                    this.handleUpdateError(error);
                },
                complete: () => {
                    this.isClicked = false;
                },
            });
    }

    saveUsersDrtssCompte() {
        this.signElectService
            .creerUtilisateurDrtss(this.userForm.value)
            .subscribe(
                (response: any) => {
                    this.loadUsers(this.pageNumber, this.pageSize);
                    this.messageSucces(
                        'Utilisateur créé avec succès.',
                        'success'
                    );
                    this.userForm.reset();
                    this.modalDialog = false;
                    this.isClicked = true;
                },
                (error) => {
                    this.messageSucces("Une erreur s'est produite", 'error');
                    this.isClicked = true;
                }
            );
    }

    deleteDialog = false;
    confirmDeleteSelected() {
        this.deleteDialog = true;
    }

    hideDialog() {
        this.modalDialog = false;
        this.submitted = false;
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

    selectedRegion: any;

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
    }

    private handleSuccess(): void {
        this.loadUsers(0, 100000);
        this.userForm.reset();
        this.modalDialog = false;
        this.isUpdate = false;
        this.messageSucces('Utilisateur créé avec succès', 'success');
    }

    private handleError(error: any): void {
        this.messageSucces("Une erreur s'est produite", 'error');
    }

    private resetFormAndDialog(): void {
        this.userForm.reset();
        this.modalDialog = false;
        this.isUpdate = false;
    }

    private handleUpdateSuccess(): void {
        this.loadUsers(0, 100000);
        this.loadUsers(this.pageNumber, this.pageSize);
        this.messageSucces(
            'Information utilisateur mise à jour avec succès.',
            'success'
        );
        this.resetFormAndDialog();
    }

    private handleUpdateError(error: any): void {
        this.messageSucces(
            "Une erreur s'est produite lors de la mise à jour",
            'error'
        );
    }
}
