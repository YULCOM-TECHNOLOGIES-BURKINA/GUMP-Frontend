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
import { DrtssService } from 'src/app/demo/services/drtss.service';
import { finalize } from 'rxjs';

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
    pageSize: number = 1000;
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
        private http: HttpClient,
        private drtssService: DrtssService
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
    openNew(demande: any) {
        console.log('demande', demande);
        console.log('this.signataire', this.signataire);

        this.attestationPath = '';
        if (!demande.attestation.pathFile) {
            this.messageSucces('Le document est en traitement', 'error');
        } else {
            this.demandeId = demande.id;
            this.attestationPath = demande.attestation.pathFile;
            this.pdfSrc = demande.attestation?.path;
            /*          this.signElectService
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
*/
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

    downloadFile(url: string) {
        console.log("Téléchargement du fichier à partir de l'URL:", url);

        // Créer un élément <a> temporaire
        const a = document.createElement('a');
        a.href = url; // URL du fichier
        a.target = '_blank'; // Ouvrir dans un nouvel onglet (optionnel)

        // Extraire le nom du fichier de l'URL (ou un nom par défaut)
        a.download = url.split('/').pop() || 'fichier.pdf';

        // Ajouter l'élément <a> au DOM, simuler un clic pour télécharger, puis le retirer
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    pdfSrc: string | null = null;
    async viewAttestation(url: string) {
        try {
            const response: Blob = await this.http
                .get(url, { responseType: 'blob', headers: this.getHeaders() })
                .toPromise();

            if (response.size > 0) {
                const blobUrl = URL.createObjectURL(response);
                this.pdfSrc = blobUrl;
                this.viewpdfDialog = true;

                setTimeout(() => {
                    URL.revokeObjectURL(blobUrl);
                }, 1000);
            } else {
                this.handleError(
                    'Le document PDF est vide et ne peut pas être ouvert.'
                );
            }
        } catch (error) {
            this.handleError("Le document n'a pas pu être chargé.");
        }
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
    demandeId!: number;
    attestationPath!: any;

    signedForm() {
        this.loading = true;

        this.signElectService
            .signDocument(
                this.signataire.user_id,
                this.demandeId,
                this.attestationPath
            )
            .subscribe({
                next: (response: Blob) => {
                    this.drtssService.signedRequest(this.demandeId).subscribe({
                        next: () => {
                            this.handleSuccessfulSignature(response);
                        },
                        error: (error) => {
                            this.handleError(
                                error?.error ||
                                    "Erreur lors de l'enregistrement de la signature."
                            );
                        },
                    });
                },
                error: (error) => {
                    this.handleError(
                        error?.error ||
                            'Échec: Utilisateur inactif ou signature non autorisée.'
                    );
                },
                complete: () => {
                    this.loading = false;
                },
            });
    }

    private handleSuccessfulSignature(response: Blob): void {
        const blobUrl = URL.createObjectURL(response);
        this.pdfSrc = blobUrl;

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 1000);

        this.viewpdfDialog = true;
        this.modalDialog = false;
        this.handleSuccess('Signature réussie');
    }

    private handleError(errorMessage: string): void {
        this.loading = false;
        this.modalDialog = false;
        console.error(errorMessage);
        this.handleError(errorMessage);
    }

    private handleSuccess(message: string): void {
        this.messageSucces(message, 'success');
        this.modalDialog = false;
        this.loadDemande(0, 50);
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
    processReviewRequest(identifiant) {
        this.drtssService.reviewRequest(identifiant).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Demande traitée et en attente de validation',
                    life: 3000,
                });
                setTimeout(() => {
                    this.router.navigate(['/app/traitement/drtss']);
                }, 500);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de la validation de la demande.',
                    life: 3000,
                });
            },
        });
    }

    statusMapping: { [key: string]: { class: string; label: string } } = {
        SIGNED: { class: 'p-badge-success', label: 'Signer' },
        APPROVED: { class: 'p-badge-success', label: 'Approuver' },
        REJECTED: { class: 'p-badge-danger', label: 'Rejeter' },
        PENDING: { class: 'p-badge-primary', label: 'En cours de Traitement' },
        PROCESSING: { class: 'p-badge-secondary', label: 'En Attente' },
    };
}
