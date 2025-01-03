import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AjeConfig } from 'src/app/demo/models/appConfig';
import { ApplicationConfigService } from 'src/app/demo/services/application-config.service';
import { UtilsModuleModule } from 'src/app/demo/shared/utils-module/utils-module.module';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-application-config-aje',
    standalone: true,
    imports: [UtilsModuleModule],
    templateUrl: './application-config-aje.component.html',
    styleUrl: './application-config-aje.component.scss',
    providers: [ConfirmationService, MessageService],
})
export class ApplicationConfigAjeComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    configForn: FormGroup;

    deleteDialog = false;

    // Pagination

    constructor(
        public layoutService: LayoutService,
        public router: Router,
        private appConfigService: ApplicationConfigService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private http: HttpClient
    ) {}
    ngOnInit(): void {
        this.loadConfig();
    }

    appConfigArr: any[] = [];
    loadConfig() {
        this.appConfigService.getConfigAje().subscribe({
            next: (res: Params) => {
                this.appConfigArr = [];
                this.appConfigArr.push(res);
            },
            error: (error) => {
                const errorMessage = error?.error;
            },
        });

        this.configForn = this.fb.group({
            footer: [],
            header: [],

            processingTimeInDaysForLiquidation: [],
            processingTimeInDaysForSoumission: [],

            validityTimeInMonthsForLiquidation: [],
            validityTimeInMonthsForSoumission: [],

            // logo: [],
        });
    }

    submitted: boolean;
    modalDialog: boolean;
    openNew(config: AjeConfig) {
        this.initConfirForm(config);
        this.modalDialog = true;
    }

    initConfirForm(config: AjeConfig) {
        console.log(' mise a jour');
        this.configForn.setValue({
            footer: config.footer,
            header: config.header,
            processingTimeInDaysForLiquidation:
                config.processingTimeInDaysForLiquidation,
            processingTimeInDaysForSoumission:
                config.processingTimeInDaysForSoumission,

            validityTimeInMonthsForLiquidation:
                config.validityTimeInMonthsForLiquidation,
            validityTimeInMonthsForSoumission:
                config.validityTimeInMonthsForSoumission,

            //  logo: config.logo,
        });
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
            console.log('Fichier sélectionné:', this.selectedFile);
        }
    }

    onUpdateConfig() {
        const file = this.selectedFile;

        const configData = this.configForn.value;

        this.appConfigService
            .updateApplicationConfigDrtps(file, configData)
            .subscribe(
                (response) => {
                    this.handleSuccess(
                        'Mise à jour des informations effectuée avec succès.'
                    );
                },
                (error) => {
                    this.handleError(
                        'Échec de la mise à jour des informations. Veuillez réessayer.'
                    );
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
