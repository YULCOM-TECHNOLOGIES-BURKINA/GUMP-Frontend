import { animate, state, style, transition, trigger } from '@angular/animations';
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
import { ActeConfig, DrtpsConfig } from 'src/app/demo/models/appConfig';
import { Utilisateur } from 'src/app/demo/models/utilisateurs';
import { ApplicationConfigService } from 'src/app/demo/services/application-config.service';
import { AuthService } from 'src/app/demo/services/auth.service';
import { SignatureElectroniquesService } from 'src/app/demo/services/signature-electroniques.service';
import { UtilsModuleModule } from 'src/app/demo/shared/utils-module/utils-module.module';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

interface Params {
    id: number;
    icon: string;
    title: string;
    code: string;
    description: string;
    logo: any;
    acteConfig: ParamsConfigActe [];
  }

  interface ParamsConfigActe {
    id: number;
    param: string;
    labelle: string;
    value: any;
  }
@Component({
    selector: 'app-application-config-acte',
    standalone: true,
    imports: [UtilsModuleModule],
    templateUrl: './application-config-acte.component.html',
    styleUrl: './application-config-acte.component.scss',
    providers: [ConfirmationService, MessageService],animations: [
        trigger('fadeInOut', [
          state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
          transition('void <=> *', animate('300ms ease-in-out'))
        ])
      ]
})

export class ApplicationConfigActeComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    configForn: FormGroup = this.fb.group({
        param: [],
        labelle: [],
        value: [],
    })

    deleteDialog = false;
    params: Params[] = [];
    selectedParams: Params | null = null;
    loading: boolean = true;
    selectedActeConfig: ParamsConfigActe[] | null = [];
    userRole: any;

    constructor(
        public layoutService: LayoutService,
        public router: Router,
        private appConfigService: ApplicationConfigService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private http: HttpClient,
        private _changeRef: ChangeDetectorRef,
        private authService: AuthService ){
        this.userRole = this.authService.getUserRole();

        const userDetails = localStorage.getItem('currentUser');
        const user = JSON.parse(userDetails);

        this.userRole = user.role;

        this.params = [
            {
                "id": 1,
                "icon": "pi pi-briefcase",
                "title": "Attestation DRTPS",
                "code": "drtps",
                "description": "Informations sur l'attestation de la Direction Régionale du Travail et de la Protection Sociale.",
                "logo": "https://gump-gateway.yulpay.com/api/files/1/uploads-a8efd3de-c530-4826-9599-8207ec3fd6c6.png?service=drtss-ms",
                "acteConfig": [
                    {
                        id: 1,
                        param: "drtps",
                        labelle: "validiteMois",
                        value: 1
                    },
                    {
                        id: 1,
                        param: "drtps",
                        labelle: "validiteJours",
                        value: 1
                    },
                    {
                        id: 2,
                        param: "drtps",
                        labelle: "delaiTraitement",
                        value: 1
                    },
                    {
                        id: 3,
                        param: "drtps",
                        labelle: "prixActe",
                        value: 250000
                    },
                    {
                        id: 4,
                        param: "drtps",
                        labelle: "description",
                        value: "Description de l’acte"
                    },
                    {
                        id: 5,
                        param: "drtps",
                        labelle: "intitule",
                        value: "Intitulé de l’acte"
                    },
                    {
                        id: 7,
                        param: "drtps",
                        labelle: "titreActe",
                        value: "Le titre des actes"
                    },
                    {
                        id: 8,
                        param: "drtps",
                        labelle: "ministaire",
                        value: "Ministraire DRTPS"
                    },
                    {
                        id: 9,
                        param: "drtps",
                        labelle: "devise",
                        value: "La Patrie ou la Mort, Nous Vaincrons."
                    },
                    {
                        id: 10,
                        param: "drtps",
                        labelle: "adressEntreprise",
                        value: "L’adresse de l’entreprise"
                    },
                    {
                        id: 11,
                        param: "drtps",
                        labelle: "titreSignataire",
                        value: "Le Directeur Régional"
                    },
                    {
                        id: 12,
                        param: "drtps",
                        labelle: "adressEmetrice",
                        value: "Adresse de la structure émétrice"
                    },
                    {
                        id: 13,
                        param: "drtps",
                        labelle: "contactEmetrice",
                        value: "Contact de la structure émétrice"
                    },
                    {
                        id: 13,
                        param: "drtps",
                        labelle: "vu1",
                        value: "Vue Decret 1"
                    },
                    {
                        id: 13,
                        param: "drtps",
                        labelle: "vu2",
                        value: "Vue Decret 2"
                    }
                ]
            },
            {
                "id": 2,
                "icon": "pi pi-chart-line",
                "title": "Attestation AJE",
                "code": "aje",
                "description": "Informations sur l'attestation de l'Agence pour la Jeunesse et l'Emploi.",
                "logo": "https://gump-gateway.yulpay.com/api/files/3/uploads-logo.png?service=tresor-ms",
                "acteConfig": [
                    {
                        id: 1,
                        param: "aje",
                        labelle: "contactEmetrice",
                        value: "Contact de la structure émétrice"
                    },
                    {
                        id: 2,
                        param: "aje",
                        labelle: "delaiTraitement",
                        value: "3 Mois"
                    },
                    {
                        id: 3,
                        param: "aje",
                        labelle: "prixActe",
                        value: "250.000 Fr CFA"
                    },
                    {
                        id: 4,
                        param: "aje",
                        labelle: "description",
                        value: "Description de l’acte"
                    },
                    {
                        id: 5,
                        param: "aje",
                        labelle: "intitule",
                        value: "Intitulé de l’acte"
                    },
                    {
                        id: 6,
                        param: "aje",
                        labelle: "logo",
                        value: "Logo de la structure"
                    },
                    {
                        id: 7,
                        param: "aje",
                        labelle: "titreActe",
                        value: "Le titre des actes"
                    },
                    {
                        id: 8,
                        param: "aje",
                        labelle: "ministaire",
                        value: "Ministraire DRTPS"
                    },
                    {
                        id: 9,
                        param: "aje",
                        labelle: "devise",
                        value: "La Patrie ou la Mort, Nous Vaincrons."
                    },
                    {
                        id: 10,
                        param: "aje",
                        labelle: "adressEntreprise",
                        value: "L’adresse de l’entreprise"
                    },
                    {
                        id: 12,
                        param: "aje",
                        labelle: "adressEmetrice",
                        value: "Adresse de la structure émétrice"
                    },
                    {
                        id: 13,
                        param: "aje",
                        labelle: "contactEmetrice",
                        value: "Contact de la structure émétrice"
                    }
                ]
            }
        ];

        this.params = this.filterParamByUser();
    }

    ngOnInit(): void {
        this.loadConfig();

        this.selectedParams = this.params[0];
        this.selectedActeConfig = this.params[0].acteConfig!;

        setTimeout(() => {
            this.loading = false;
        }, 1000);

        this._changeRef.markForCheck();
    }

    filterParamByUser(){

        let tmp = this.params;
        console.log("UserRol : ", this.userRole)

        switch (this.userRole) {
            case "DRTSS_AGENT":
                this.params = tmp.filter(p => p.code == 'drtps');
                break;

            case "TRESOR_AGENT":
                this.params = tmp.filter(p => p.code == 'aje');
                break;

            default:
                this.params = tmp;
                break;
        }

        return this.params;
    }

    selectParam(param: Params) {
        this.selectedParams = param;
        this.selectedActeConfig = param.acteConfig!;

        this._changeRef.markForCheck();
      }

    appConfigArr: any[] = [];
    loadConfig() {

         this.appConfigService.getConfigDrtps().subscribe({
            next: (res: DrtpsConfig) => {
                this.appConfigArr=[]
                this.appConfigArr.push(res);
             },
            error: (error) => {
                const errorMessage = error?.error;
            },
        });
    }

    submitted: boolean;
    modalDialog: boolean;
    openNew() {
        this.resetConfirForm();
        this.modalDialog = true;
        this._changeRef.markForCheck();
    }

    updateConfig(config: ActeConfig) {
        this.initConfirForm(config);
        this.modalDialog = true;
        this._changeRef.markForCheck();
    }

    // openNew(config: DrtpsConfig) {
    //     this.initConfirForm(config);
    //     this.modalDialog = true;
    // }

    // initConfirForm(config: DrtpsConfig) {
    //     console.log(' mise a jour');
    //     this.configForn.setValue({
    //         footer: config.footer,
    //         header: config.header,
    //         processingTimeInDays: config.processingTimeInDays,
    //         validityTimeInMonths: config.validityTimeInMonths,
    //       //  logo: config.logo,
    //     });
    // }

    initConfirForm(config: ActeConfig) {
        console.log(' mise a jour');
        this.configForn.setValue({
            param: config.param,
            labelle: config.labelle,
            value: config.value,
        });

        this._changeRef.markForCheck();
    }

    resetConfirForm() {
        this.configForn.setValue({
            param: this.selectedParams.code!,
            labelle: "",
            value: ""
        });

        this._changeRef.markForCheck();
    }

    openDeleteDialog(Utilisateur: Utilisateur) {
        this.confirmDeleteSelected();
    }

    confirmDeleteSelected() {
        this.deleteDialog = true;
    }

    hideDialog() {
        this.modalDialog = false;
        this.submitted = false;
    }

    messageSucces(message: string, severity: string) {
        this.messageService.add({
            key: 'tst',
            severity: severity,
            summary: 'Message information ',
            detail: message,
        });
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
            this.configForn.controls['value'].setValue(this.selectedFile);
            console.log('Fichier sélectionné:', this.selectedFile);
        }
    }


    onUpdateConfig() {
        const file = this.selectedFile;

        const configData = this.configForn.value

        this.appConfigService.updateApplicationConfigDrtps(file, configData).subscribe(
          (response) => {
            this.handleSuccess("Mise à jour des informations effectuée avec succès.")
           },
          (error) => {
            this.handleError("Échec de la mise à jour des informations. Veuillez réessayer.")
           }
        );
      }

      private handleSuccess(message: string): void {
        this.loadConfig();

        this.messageSucces(message, 'success');
        this.modalDialog = false;
    }

    private handleError(message: string): void {
        this.messageSucces(message, 'error');
    }
}
