import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Utilisateur } from 'src/app/demo/models/utilisateurs';
import { SignatureElectroniquesService } from 'src/app/demo/services/signature-electroniques.service';
import { UtilsModuleModule } from 'src/app/demo/shared/utils-module/utils-module.module';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-utilisateurs-drtss',
    standalone: true,
    imports: [UtilsModuleModule],
    templateUrl: './utilisateurs-drtss.component.html',
    styleUrl: './utilisateurs-drtss.component.scss',
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
    currentUser:any
    userInfo: any;
    constructor(
        public layoutService: LayoutService,
        public router: Router,
        private signElectService: SignatureElectroniquesService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private signatureService: SignatureElectroniquesService
    ) {}
    ngOnInit(): void {
        const userDetails = localStorage.getItem('currentUser');
        let user = JSON.parse(userDetails);
        this.currentUser=user
        this.signatureService.getUsersInfoByEmail(user.email).subscribe({
            next: (res: any) => {
                this.userInfo = res;
             },
            error: (error) => {},
        });

        this.loadUsers(this.pageNumber, this.pageSize);
        this.listRegions()
    }

    dataResponse: any;
    loadUsers(page: number, size: number) {
        const userDetails = localStorage.getItem('currentUser');
        let user = JSON.parse(userDetails);

        this.loading = true;
        this.signElectService.listUtilisateurDrtss(page, size).subscribe(
            (response: any) => {
                if (user.role=='ADMIN') {
                    const filterdrtpsUser = response.content
                    this.utilisateurs = filterdrtpsUser;

                }else{
                const filterdrtpsUser = response.content.filter(
                    (user) =>
                        user.region === this.userInfo.region

                );

                }


                this.totalRecords = response.totalPages;
                this.loading = false;
                this.cdr.detectChanges();
             },
            (error) => {
                 this.loading = false;
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
        if (this.selectLine.isActive == true) {
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
                region: this.userInfo.region,
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
        if (this.currentUser.role=="ADMIN") {
            this.userForm = this.fb.group({
                id: [],
                forename: ['', Validators.required],
                lastname: ['', Validators.required],
                tel: [],
                matricule: [],
                titre_honorifique: [],
                email: ['', Validators.required],
                region: [''],

                role: ['DRTSS_AGENT'],
                userType: ['DRTSS_USER'],
                password: ['password'],
                username: [''],
            });
        } else {
            this.userForm = this.fb.group({
                id: [],
                forename: ['', Validators.required],
                lastname: ['', Validators.required],
                tel: [],
                matricule: [],
                titre_honorifique: [],
                email: ['', Validators.required],
                region: [this.userInfo.region],

                role: ['DRTSS_AGENT'],
                userType: ['DRTSS_USER'],
                password: ['password'],
                username: [''],
            });
        }

    }
    submitForm() {
        if (this.userForm.valid) {

            if (this.currentUser.role=="ADMIN") {
             this.userForm.patchValue({
            region:this.selectedRegion.code
        })
            }
            let usersInfo = this.userForm.value;

            this.createUsersCompteRequest();
        } else {
            this.messageSucces(
                'Veillez remplire tout les champs du formulaire',
                'error'
            );
        }
    }

    isClicked: boolean = false;

    createUsersCompteRequest() {
        let form = this.userForm.value;
        this.userForm.patchValue({ username: form.email });
               this.signElectService.createUserRequest(this.userForm.value).subscribe(
            (response: any) => {
                 this.modalDialog;
                this.loadUsers(0, 100000);
                this.loadUsers(this.pageNumber, this.pageSize);
                this.messageSucces('Utilisateur créé avec succès.', 'success');
                this.modalDialog = false;
                this.isClicked = true;
            },
            (error) => {
                this.messageSucces("Une erreur s'est produite", 'error');
                this.isClicked = true;
            }
        );
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
}
