import { HttpClient, HttpHeaders } from '@angular/common/http';
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
// import { U } from '@fullcalendar/core/internal-common';
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

    private token = localStorage.getItem('currentToken');

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
        });
    }

    signDocForm: FormGroup;
    dataSource: any[];
    demandes: Demande[];

    totalRecords = 0;
    loading: boolean = false;

    dataResponse: any;
    deleteDialog = false;
    viewpdfDialog = false;

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
        const userDetails = localStorage.getItem('currentUser');
        const user = JSON.parse(userDetails);
        this.checkSignatory(user.email);
    }

    loadDemande(page: number, size: number) {
        this.loading = true;
        this.signElectService.listDemandes(page, size).subscribe(
            (response: any) => {
                this.dataResponse = response;
                this.demandes = [...response.content];
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
        this.loadDemande(this.pageNumber, this.pageSize);
    }
    selectLine: Demande;
    onLineClick(event: any) {
        this.selectLine = event;
    }

    submitted: boolean;
    modalDialog: boolean;
    openNew(attestationPath: string, pdfSrc: string, demandeId: any) {
        this.attestationPath = '';
        if (!attestationPath) {
            this.messageSucces('Le document est en traitement', 'error');
        } else {
            console.log('Select doc', demandeId);

            this.demandeId = demandeId;
            this.attestationPath = attestationPath;
            this.pdfSrc = pdfSrc;
            this.signElectService
                .listUtilisateurSignataieDrtss(0, 1000)
                .subscribe(
                    (response: any) => {
                        this.listeFiltreUtilisateurs = response.content;
                        this.totalRecords = response.totalPages;
                        this.loading = false;
                        this.cdr.detectChanges();
                    },
                    (error) => {
                        this.loading = false;
                        this.cdr.detectChanges();
                    }
                );

            this.modalDialog = true;
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
    /* onUpload(event: any) {
        this.selectedFile = event;

        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
        });
    }*/

    /*  downloadFile(url: string) {
        // window.open(url, '_blank');
        console.log("url",url);let urls = 'src/assets/e50976a3-1b45-4a89-bc06-1aabca4467091.pdf';
        window.open(urls, '_blank');
    }
*/

    downloadFile(url: string) {
        console.log('url', url);
          window.open(url, '_blank');
    }

    pdfSrc: string | null = null;
    viewAttestation(url: string) {
        this.http
            .get(url, { responseType: 'blob', headers: this.getHeaders() })
            .subscribe(
                (response: Blob) => {
                    if (response.size > 0) {
                        this.pdfSrc = url;
                        this.viewpdfDialog = true;
                    } else {
                        alert(
                            'Le document PDF est vide et ne peut pas être ouvert.'
                        );
                    }
                },
                (error) => {
                    alert("Le document n'a pas pu être chargé.");
                }
            );
    }

    closeDialog() {
        this.viewpdfDialog = false;
    }
    onFileSelect(event: any): void {
        /* if (event.currentFiles && event.currentFiles.length > 0) {
            this.selectedFile = event.currentFiles[0];
        }*/
    }

    selectedUser: any;

    // selectedFile!: any;
    signatoryId!: number;
    demandeId!: string;
    attestationPath!: any;

    submitForm() {
        /*  if (!this.selectedFile) {
            this.messageSucces('Vous devez Ajouter votre certificat', 'error');

            return;
        }*/
        /*
        if (!this.keyStorePassword) {
            this.messageSucces(
                'Vous devez Ajouter votre  Password certificat',
                'error'
            );

            return;
        }
*/
        /*  if (!this.alias) {
            this.messageSucces(
                'Vous devez Ajouter votre alias certificat',
                'error'
            );

            return;
        }
        if (!this.selectedUser) {
            this.messageSucces('Aucun utilisateur sélectionné.', 'error');

            return;
        }*/

        this.signElectService.approveRequestSigned(this.demandeId).subscribe({
            next: () => {
                this.handleSuccess('Document signé avec succès');
            },
            error: (error) => {
               /* const errorMessage =
                    error?.error ||
                    'Échec: Utilisateur inactif ou signature non autorisée';*/
               // this.handleError(errorMessage);
            },
        });
                            this.handleSuccess('Document signé avec succès');

        this.signatoryId = this.signataire.id;

        this.loading = false;
      /*  this.signElectService
            .signDocument(
                this.signataire.id,
                this.demandeId,
                this.attestationPath
            )
            .subscribe({
                next: () => {
                    this.handleSuccess('Document signé avec succès');
                },
                error: (error) => {
                    const errorMessage =
                        error?.error ||
                        'Échec: Utilisateur inactif ou signature non autorisée';
                    this.handleError(errorMessage);
                },
            });*/
    }

    private handleSuccess(message: string): void {
        this.messageSucces(message, 'success');
        this.modalDialog = false;
        this.loadDemande(0, 50);
    }

    private handleError(message: string): void {
        this.messageSucces(message, 'error');
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
    signataire: any;
    checkSignatory(email: string): void {
        this.signElectService.getSignatoryByEmail(email).subscribe({
            next: (res: any) => {
                if (!!res?.signatureCertificat) {
                    console.log('Signataire', res);
                    this.signataire = res;
                }
            },
            error: (error) => {},
        });
    }

}
