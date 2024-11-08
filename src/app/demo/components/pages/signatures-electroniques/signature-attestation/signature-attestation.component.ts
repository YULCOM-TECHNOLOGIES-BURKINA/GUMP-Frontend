import { HttpClient } from '@angular/common/http';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SignatureElectroniquesService } from 'src/app/demo/services/signature-electroniques.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { U } from '@fullcalendar/core/internal-common';
import { UtilsModuleModule } from 'src/app/demo/shared/utils-module/utils-module.module';
import { Demande } from 'src/app/demo/models/demande';

@Component({
    selector: 'app-signature-attestation',
    standalone: true,
    imports: [UtilsModuleModule],
    templateUrl: './signature-attestation.component.html',
    styleUrl: './signature-attestation.component.scss',
    providers: [ConfirmationService, MessageService],
})
export class SignatureAttestationComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    signDocForm: FormGroup;
    dataSource: any[];
    demandes: Demande[];

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
        this.loadDemande(this.pageNumber, this.pageSize);
        this.items = [
            {
                label: 'Modifier',
                icon: 'pi pi-pencil',
                command: () => {
                    console.log('TEST');
                    this.openNew('UPDATE');
                },
            },
            { separator: true },
            {
                label: 'Suprimer',
                icon: 'pi pi-times',
                command: () => {
                    console.log('TEST');
                    //this.openDeleteDialog(this.selectLine);
                },
            },
        ];
    }

    loadDemande(page: number, size: number) {
        this.loading = true;
        this.signElectService.listDemandes(page, size).subscribe(
            (response: any) => {
                this.dataResponse = response;
                this.demandes = response.content;
                this.totalRecords = response.totalPages;
                this.loading = false;
                this.cdr.detectChanges();
            },
            (error) => {
                console.log("Une erreur s'est produite :", error);
                this.loading = false;
                this.cdr.detectChanges();
            }
        );
    }

    onPageChange(event: any) {
        console.log('Changement++', event);

        this.pageNumber = event.first / event.rows;
        this.pageSize = event.rows;
        this.loadDemande(this.pageNumber, this.pageSize);
    }
    selectLine: Demande;
    onLineClick(event: any) {
        this.selectLine = event;
        console.log(this.selectLine);
    }

    submitted: boolean;
    modalDialog: boolean;
    openNew(type: string) {
        this.signElectService.listUtilisateurSignataieDrtss(0, 1000).subscribe(
            (response: any) => {
                this.listeFiltreUtilisateurs = response.content;
                this.totalRecords = response.totalPages;
                this.loading = false;
                this.cdr.detectChanges();
            },
            (error) => {
                console.log("Une erreur s'est produite :", error);
                this.loading = false;
                this.cdr.detectChanges();
            }
        );

        this.modalDialog = true;
        if (type == 'UPDATE') {
            this.signDocForm.setValue({
                id: this.selectLine.id,
                userId: this.selectLine.id,
                file: [],
            });
        } else {
        }
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

    selectedFile!: any;
    signDocumentselectedFile: any;
    signatoryId!: any;
    attestationPath!: any;
    alias!: any;
    keyStorePassword!: any;
    submitForm() {
        if (!this.selectedFile) {
            this.messageSucces('Vous devez Ajouter votre certificat', 'error');

            return;
        }

        if (!this.keyStorePassword) {
            this.messageSucces(
                'Vous devez Ajouter votre  Password certificat',
                'error'
            );

            return;
        }

        if (!this.alias) {
            this.messageSucces(
                'Vous devez Ajouter votre alias certificat',
                'error'
            );

            return;
        }
        if (!this.selectedUser) {
            this.messageSucces('Aucun utilisateur sélectionné.', 'error');

            return;
        }
        this.signatoryId = this.selectedUser.id;
        this.attestationPath = 'attestations/format-sign-test2.pdf';
        this.signElectService
            .signDocument(
                this.selectedFile,
                this.signatoryId,
                this.attestationPath,
                this.alias,
                this.keyStorePassword
            )
            .subscribe(
                (event: any) => {
                    this.messageSucces('Document Signe avec succès', 'success');
                    this.loadDemande(0, 50);
                    this.modalDialog = false;
                },
                (error) => {
                    this.messageSucces(
                        'Échec  Signature Attestation ',
                        'error'
                    );
                }
            );
    }

    filteredUsersAutoComplete: any[] = [];
    listeFiltreUtilisateurs: any[] = [];
    filterUsers(event: any) {
        const filtered: any[] = [];
        const query = event.query.toLowerCase();

        if (Array.isArray(this.listeFiltreUtilisateurs)) {
            for (let i = 0; i < this.listeFiltreUtilisateurs.length; i++) {
                const utilisateur = this.listeFiltreUtilisateurs[i].utilisateur;
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
}
