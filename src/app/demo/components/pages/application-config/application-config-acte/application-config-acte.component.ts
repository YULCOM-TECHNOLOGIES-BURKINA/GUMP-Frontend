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

    deleteDialog = false;
    params: Params[] = [];
    selectedParams: Params | null = null;
    loading: boolean = true;
    selectedActeConfig: ParamsConfigActe[] = [];
    userRole: any;

    configForn = this.fb.group({
        id:[null],
        param: [this.selectedParams?.code! ?? "", Validators.required],
        labelle: ["", Validators.required],
        value: ["", Validators.required],
    })

    ActeConfigForn = this.fb.group({
        id:[this.selectedParams?.id!, Validators.required],
        code: [this.selectedParams?.code!, Validators.required],
        title: [this.selectedParams?.title!, Validators.required],
        description: [this.selectedParams?.description!, Validators.required],
        logo: [this.selectedParams?.logo!, Validators.required]
    })

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

    }

    ngOnInit(): void {

        this.loadConfig();

        setTimeout(() => {
            this.loading = false;
        }, 1000);

        // disable default input
        this.ActeConfigForn.controls.code.disable();
        this.configForn.controls.param.disable();
        this.configForn.controls.labelle.disable();

    }

    filterParamByUser(res: any){

        let tmp = res;
        let resByUser = [];
        switch (this.userRole) {
            case "DRTSS_AGENT":
                resByUser = tmp.filter(p => p.code == 'drtps');
                break;

            case "TRESOR_AGENT":
                resByUser = tmp.filter(p => p.code == 'aje');
                break;

            default:
                resByUser = tmp;
                break;
        }
        return resByUser;
    }

    selectParam(param: Params) {
        this.selectedParams = param;
        this.selectedActeConfig = param.acteConfig!.sort((a,b) => a.labelle.localeCompare(b.labelle));
        this._changeRef.markForCheck();
    }

    loadConfig() {
        this.appConfigService.getConfigDrtps().subscribe(
            res => {
                this.params = this.filterParamByUser(res);
                this.selectParam(this.params[0]!);
                this._changeRef.markForCheck();
             }
        );
    }

    submitted: boolean;
    modalDialog: boolean;
    modalDialogActe: boolean;
    openActeInfoConfig() {
        this.resetConfirForm();
        this.modalDialogActe = true;
        this._changeRef.markForCheck();
    }

    updateConfig(config: ActeConfig) {
        this.initConfirForm(config);
        this.modalDialog = true;
        this._changeRef.markForCheck();
    }

    initConfirForm(config: ActeConfig) {
        console.log(' mise a jour');
        this.configForn.setValue({
            id: config.id,
            param: config.param,
            labelle: config.labelle,
            value: config.value,
        });

        this._changeRef.markForCheck();
    }

    resetConfirForm() {
        this.ActeConfigForn.setValue({
            id: this.selectedParams.id,
            code: this.selectedParams.code!,
            title: this.selectedParams.title!,
            description: this.selectedParams.description!,
            logo: this.selectedParams.logo!
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

        const configData = this.configForn.value
        this.appConfigService.updateActeConfig(this.selectedParams.code,configData).subscribe(
          (response) => {
            this.handleSuccess("Mise à jour des informations effectuée avec succès.")
           },
          (error) => {
            this.handleError("Échec de la mise à jour des informations. Veuillez réessayer.")
           }
        );

      }

      onUpdateActeInfoConfig() {
        const configData = this.ActeConfigForn.value;
        const file = this.selectedFile;
        this.appConfigService.updateActeInfoConfig(this.selectedParams.code,configData, file).subscribe(
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
