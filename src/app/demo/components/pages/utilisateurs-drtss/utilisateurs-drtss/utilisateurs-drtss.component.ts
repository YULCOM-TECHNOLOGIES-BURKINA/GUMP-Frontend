import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  providers: [ConfirmationService, MessageService]
})
export class UtilisateursDrtssComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;

    userForm: FormGroup;
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

    }

    dataResponse: any;
    loadUsers(page: number, size: number) {
        this.loading = true;
        this.signElectService.listUtilisateurDrtss(page, size).subscribe(
            (response: any) => {
                this.dataResponse = response;
                this.utilisateurs = response.content;
                this.totalRecords = response.totalPages; // Mettre à jour le nombre total d'enregistrements
                this.loading = false;
                this.cdr.detectChanges(); // Forcer la détection des changements

                console.log('dataResponse', this.dataResponse);
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
    selectlabel=""
    selectLine:Utilisateur
    onLineClick(event: any){
        this.selectLine=event
        console.log(this.selectLine);
        let modifier=true
        if (this.selectLine.actif==true) {
            this.selectlabel="Desactiver"
        }else{
            this.selectlabel="Activer"
            modifier=false
        }

        this.items = [
            {
                label: 'Modifier',
                icon: 'pi pi-refresh',
                visible:modifier,
                command: () => {
                    console.log('TEST');
                    this.openNew("UPDATE");
                },
            },
            { separator: true },
            { label: this.selectlabel, icon: 'pi pi-times' ,command: () => {
                console.log('TEST');
                this.openDeleteDialog(this.selectLine);
            },},
         ];



    }


    onConfirm(){
        this.signElectService.modifierStatusUtilisateurDrtss(this.selectLine.id).subscribe(
            (response: any) => {

                 this.loadUsers(this.pageNumber, this.pageSize);
                this.messageSucces("Operation éffectueé avec succès.","success")

                this.deleteDialog = false;
             },
            (error) => {
                 this.messageSucces("Une erreur s'est produite","error")

              }
        );

    }
    submitted: boolean;
    modalDialog: boolean;
    openNew(type:string) {

        this.modalDialog = true;
        if (type=="UPDATE") {
            this.initForm()
            this.userForm.setValue({
                id:this.selectLine.id,
                nom:this.selectLine.nom,
                prenom:this.selectLine.prenom,
                tel: this.selectLine.tel,
                matricule: this.selectLine.matricule,
                titre_honorifique:this.selectLine.titre_honorifique,
                email: this.selectLine.email
            })
        }else{
            this.initForm()
        }
    }

    openDeleteDialog(Utilisateur:Utilisateur){

        this.confirmDeleteSelected()

    }
    public initForm(){
        this.userForm = this.fb.group({
            id:[],
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            tel: [],
            matricule: [],
            titre_honorifique:[],
            email: ['', Validators.email],
          });
    }
    submitForm(){
        this.signElectService.creerUtilisateurDrtss(this.userForm.value).subscribe(
            (response: any) => {

                 this.loadUsers(this.pageNumber, this.pageSize);
                this.messageSucces("Utilisateur créé avec succès.","success")

                this.modalDialog = false;
             },
            (error) => {
                 this.messageSucces("Une erreur s'est produite","error")

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


    messageSucces(message:string, severity: string) {
        this.messageService.add({ key: 'tst', severity: severity, summary: 'Message information ', detail: message });
    }
}
