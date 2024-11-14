import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AnpeService } from '../../../../services/anpe.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ChartOptions, ChartData } from 'chart.js';

interface RequiredDocument {
  key: string;
  label: string;
  required: boolean;
}

interface YesNoOption {
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-anpe',
  providers: [MessageService, ConfirmationService],
  templateUrl: './anpe.component.html',
})
export class AnpeComponent implements OnInit {
  @ViewChild('anpeForm') anpeForm!: NgForm;

  items: MenuItem[] = [];
  currentStep = 0;
  submitting = false;

   // Yes/No options for radio buttons
   yesNoOptions: YesNoOption[] = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ];

  progressValue: number = 0;


  // Documents requis
  requiredDocuments: RequiredDocument[] = [
    { key: 'rccmFile', label: 'Extrait du RCCM', required: true },
    { key: 'statutFile', label: 'Extrait des statuts', required: true },
    { key: 'cnssFile', label: 'Attestation CNSS', required: true },
    { key: 'openingDeclarationFile', label: 'Déclaration d\'ouverture', required: true },
    { key: 'workInspectionFile', label: 'Déclaration inspection du travail', required: true }
  ];

  // Gestion des fichiers
  uploadedFiles: { [key: string]: File } = {};

  // Options pour le graphique
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  // Données du formulaire
  formData: any = {
    // Informations du contrat
    contractReference: '',
    contractPurpose: '',
    contractingOrganizationName: '',
    organizationAddress: '',
    organizationPhone: '',

    // Situation de l'employeur
    employerIdentification: '',
    province: '',
    commune: '',
    street: '',
    activitySector: '',

    // Données de l'établissement
    establishmentName: '',
    managerLastName: '',
    managerFirstName: '',
    openingDate: null,
    cnssNumber: '',
    mainActivity: '',
    secondaryActivity: '',

    // Effectifs
    permanentWorkers: 0,
    temporaryWorkers: 0,
    apprentices: 0,
    accepted_apprentices: 0,
    interns: 0,
    accepted_interns: 0,

    // Périodes d'emploi
    fullEmploymentStart: null,
    fullEmploymentEnd: null,
    lowEmploymentStart: null,
    lowEmploymentEnd: null,

    // Intentions
    currentYearRecruitment: false,
    nextYearRecruitment: false,
    staffReduction: false,

    // Besoins en formation
    trainingDomain: '',
    trainingCount: 0,
    perfectionnementModules: '',
    perfectionnementCount: 0,

    // Attentes ANPE
    anpeExpectations: ''
  };

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private anpeService: AnpeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.items = [
      { label: 'Informations du contrat' },
      { label: 'Situation de l\'employeur' },
      { label: 'Renseignements établissement' },
      { label: 'Intentions et besoins' },
      { label: 'Documents' },
      { label: 'Récapitulatif' }
    ];

    // Restaurer la progression si elle existe
    this.loadSavedProgress();
    this.updateProgressValue();
  }

  updateProgressValue() {
    this.progressValue = Math.floor((this.currentStep + 1) / this.items.length * 100);
  }

  getEffectifsChartData(): ChartData<'pie'> {
    return {
      labels: ['Permanents', 'Temporaires', 'Apprentis', 'Stagiaires'],
      datasets: [
        {
          data: [
            this.formData.permanentWorkers,
            this.formData.temporaryWorkers,
            this.formData.apprentices,
            this.formData.interns
          ],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA']
        }
      ]
    };
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateProgressValue();
    }
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
      this.updateProgressValue();
    }
  }

  onStepChange(index: number) {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep = index;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs obligatoires avant de passer à l\'étape suivante.'
      });
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 0:
        return (
          this.formData.contractReference &&
          this.formData.contractPurpose &&
          this.formData.contractingOrganizationName &&
          this.formData.organizationAddress &&
          this.formData.organizationPhone
        );
      case 1:
        return (
          this.formData.employerIdentification &&
          this.formData.province &&
          this.formData.commune &&
          this.formData.street &&
          this.formData.activitySector
        );
      case 2:
        return (
          this.formData.establishmentName &&
          this.formData.managerLastName &&
          this.formData.managerFirstName &&
          this.formData.openingDate &&
          this.formData.cnssNumber &&
          this.formData.mainActivity
        );
      case 3:
        return true; // Toutes les données sont facultatives dans cette étape
      case 4:
        return Object.values(this.uploadedFiles).length === this.requiredDocuments.length;
      default:
        return true;
    }
  }

  onFileSelect(event: any, fileType: string) {
    const file = event.files[0];
    this.uploadedFiles[fileType] = file;
    this.messageService.add({
      severity: 'info',
      summary: 'Fichier chargé',
      detail: `${file.name} a été chargé.`
    });
  }

  removeFile(fileType: string) {
    delete this.uploadedFiles[fileType];
    this.messageService.add({
      severity: 'info',
      summary: 'Fichier supprimé',
      detail: `Le fichier a été supprimé.`
    });
  }

  saveProgress() {
    // Logique de sauvegarde de la progression
    this.messageService.add({
      severity: 'success',
      summary: 'Progrès enregistré',
      detail: 'Votre progression a été enregistrée.'
    });
  }

  loadSavedProgress() {
    // Logique de chargement de la progression sauvegardée
  }

  confirmSubmit() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir soumettre le formulaire ?',
      accept: () => {
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    if (this.anpeForm.valid) {
      this.submitting = true;
      const formData = new FormData();

      // Append all files
      Object.values(this.uploadedFiles).forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      // Append form data
      formData.append('data', JSON.stringify(this.formData));

      this.anpeService.submitAttestationRequest(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Formulaire envoyé avec succès !'
          });
          setTimeout(() => {
            this.router.navigate(['/app/pages/demandes']);
          }, 2000);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de l\'envoi.'
          });
        },
        complete: () => {
          this.submitting = false;
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs obligatoires.'
      });
    }
  }
}