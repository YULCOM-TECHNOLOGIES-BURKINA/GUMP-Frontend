import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { LayoutService } from '../../../../../layout/service/app.layout.service';
import { Router } from '@angular/router';
import { UtilsModuleModule } from '../../../../shared/utils-module/utils-module.module';
import { SignatureElectroniquesService } from '../../../../services/signature-electroniques.service';
import { Utilisateur } from 'src/app/demo/models/utilisateurs';
import { Table } from 'primeng/table';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import {
    HttpClient,
} from '@angular/common/http';

@Component({
    selector: 'app-signataire',
    standalone: true,
    imports: [UtilsModuleModule],
    templateUrl: './signataire.component.html',
    styleUrl: './signataire.component.scss',
    providers: [ConfirmationService, MessageService],
})
export class SignataireComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    userForm: FormGroup;
    dataSource: any[];
    utilisateurs: Utilisateur[];
    listeFiltreUtilisateurs: any[] | Utilisateur[];

    totalRecords = 0;
    loading: boolean = false;

    dataResponse: any;
    deleteDialog = false;

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
        private confirmationService: ConfirmationService,
        private http: HttpClient
    ) {}
    ngOnInit(): void {
        this.loadUsers(this.pageNumber, this.pageSize);
        this.items = [

            { separator: true },
            {
                label: 'Activer',
                icon: 'pi pi-times',
                command: () => {
                    this.confirmToggleStatus(this.selectLine);
                },
            },
        ];
    }

    selectlabel=""
    selectLine:any
    onLineClick(event: any){
        this.selectLine=event
        console.log("this.selectLine",this.selectLine);
        let modifier=true
        if (this.selectLine.actif==true) {
            this.selectlabel="Desactiver"
        }else{
            this.selectlabel="Activer"
            modifier=false
        }

        this.items = [

            { separator: true },
            { label: this.selectlabel, icon: 'pi pi-times' ,command: () => {
                console.log('TEST');
                this.confirmToggleStatus(this.selectLine.id);
            },},
         ];



    }

    loadUsers(page: number, size: number) {
        this.loading = true;
        this.signElectService
            .listUtilisateurSignataieDrtss(page, size)
            .subscribe(
                (response: any) => {
                        console.log("response",response);

               const filterdrtpsUser = response.content.filter(user => user.utilisateur.userType === "DRTSS_USER" );
                this.utilisateurs =filterdrtpsUser;

               /* this.totalRecords = response.totalPages;
                this.loading = false;
                this.cdr.detectChanges();
                console.log('dataResponse', this.dataResponse);*/

                    this.dataResponse = response;
                  //  this.utilisateurs = response.content;

                    this.totalRecords = response.totalPages;
                    this.loading = false;
                    this.cdr.detectChanges();
                },
                (error) => {
                    console.log("Une erreur s'est produite :", error);
                    this.loading = false;
                    this.cdr.detectChanges(); // Forcer la détection des changements
                }
            );

        this.signElectService.listUtilisateurDrtss(0, 100000).subscribe(
            (response: any) => {


               const filterdrtpsUser = response.content.filter(user => user.userType === "DRTSS_USER" );
               this.listeFiltreUtilisateurs=filterdrtpsUser;
               /*this.utilisateurs =filterdrtpsUser;
                this.totalRecords = response.totalPages;
                this.loading = false;
                this.cdr.detectChanges();
                console.log('dataResponse', this.dataResponse);*/

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
        console.log('Changement++', event);

        this.pageNumber = event.first / event.rows;
        this.pageSize = event.rows;
        this.loadUsers(this.pageNumber, this.pageSize);
    }


    submitted: boolean;
    modalDialog: boolean;
    openNew(type: string) {
        this.selectedUser=''
        this.selectedFile=''
        this.modalDialog = true;
        if (type == 'UPDATE') {
            this.initForm();
            this.userForm.setValue({
                id: this.selectLine.id,
                userId: this.selectLine.id,
                file: [],
            });
        } else {
            this.initForm();
        }
    }


    public initForm() {
        this.userForm = this.fb.group({
            userId: ['', Validators.required],
            file: ['', Validators.required],
        });
    }

    download(file: any) {


        const url = file.path;
        window.open(url, '_blank');
        this.messageService.add({
            severity: 'info',
            summary: 'Succès',
            detail: 'Fichier téléchargé',
            life: 3000,
        });
    }

    downloadCertificat(path: string,certificatFile:string) {


        this.signElectService
        .telechargerCertificat(path,certificatFile)
    }

    confirmToggleStatus(id:number) {

        this.signElectService.toggleSignatoryStatus(id).subscribe({
            next: (response: any) => {
                 this.loadUsers(this.pageNumber, this.pageSize);

                 this.messageSucces('Operation effecuee avec succès.', 'success');

                 this.userForm.reset();
                this.modalDialog = false;
             },
            error: (err) => {

                 this.messageSucces("Une erreur s'est produite", 'error');

             },
        });
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

    filteredUsersAutoComplete: any[] = [];

    filterUsers(event: any) {
        const filtered: any[] = [];
        const query = event.query.toLowerCase();

        if (Array.isArray(this.listeFiltreUtilisateurs)) {
            for (let i = 0; i < this.listeFiltreUtilisateurs.length; i++) {
                const utilisateur = this.listeFiltreUtilisateurs[i];
                if (
                    (utilisateur?.nom &&
                        utilisateur.nom.toLowerCase().includes(query)) ||
                    (utilisateur?.prenom &&
                        utilisateur.prenom.toLowerCase().includes(query)) ||
                    (utilisateur?.matricule &&
                        utilisateur.matricule.toLowerCase().includes(query)) ||
                    (utilisateur?.email &&
                        utilisateur.email.toLowerCase().includes(query))
                ) {
                    this.listeFiltreUtilisateurs[
                        i
                    ].nomComplet = `${utilisateur.nom} ${utilisateur.prenom}`;
                    filtered.push(this.listeFiltreUtilisateurs[i]);
                }
            }
        }

        this.filteredUsersAutoComplete = filtered;
    }

    selectedFile!: any;
    uploadedFiles: any[] = [];
    onUpload(event: any) {
        this.selectedFile = event;
        console.log('Fichier uploadé:', this.selectedFile);

        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
        });
    }

    onFileSelect(event: any): void {
        if (event.currentFiles && event.currentFiles.length > 0) {
            this.selectedFile = event.currentFiles[0];
            console.log('Fichier sélectionné:', this.selectedFile);
        }
    }

    selectedUser: any;
    submitForm() {
        if (!this.selectedFile) {
            this.messageSucces('Aucun fichier sélectionné.', 'error');

            return;
        }

        if (!this.selectedUser) {
            this.messageSucces('Aucun utilisateur sélectionné.', 'error');

            return;
        }

        this.signElectService
            .createSignataire(this.selectedFile, this.selectedUser)
            .subscribe(
                (event: any) => {
                    this.messageSucces(
                        'Signataire enregistré avec succès',
                        'success'
                    );
                    this.loadUsers(0, 1000);
                    this.modalDialog = false;
                },
                (error) => {
                    this.messageSucces('Échec Creation signataire ', 'error');
                }
            );
    }
}
