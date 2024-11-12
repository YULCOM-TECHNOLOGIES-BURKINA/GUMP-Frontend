import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AnpeService } from '../../../../services/anpe.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface YesNoOption {
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-anpe',
  providers: [MessageService],
  templateUrl: './anpe.component.html',
})
export class AnpeComponent implements OnInit {
  @ViewChild('anpeForm') anpeForm!: NgForm;

  // Stepper configuration
  items: MenuItem[] = [];
  currentStep = 0;

  // Yes/No options for radio buttons
  yesNoOptions: YesNoOption[] = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ];

  // Files
  rccmFile: File | null = null;
  statutFile: File | null = null;
  cnssFile: File | null = null;
  openingDeclarationFile: File | null = null;
  workInspectionFile: File | null = null;

  // Form data
  formData: any = {
    // Contract information
    contractReference: '',
    contractPurpose: '',
    contractingOrganizationName: '',
    organizationAddress: '',
    organizationPhone: '',
    
    // Employer information
    employerIdentification: '',
    province: '',
    commune: '',
    street: '',
    activitySector: '',
    
    // Establishment information
    establishmentName: '',
    managerLastName: '',
    managerFirstName: '',
    openingDate: null,
    cnssNumber: '',
    mainActivity: '',
    secondaryActivity: '',
    
    // Staff numbers
    permanentWorkers: 0,
    temporaryWorkers: 0,
    apprentices: 0,
    interns: 0,
    
    // Employment periods
    fullEmploymentStart: null,
    fullEmploymentEnd: null,
    lowEmploymentStart: null,
    lowEmploymentEnd: null,
    
    // Intentions
    currentYearRecruitment: false,
    nextYearRecruitment: false,
    staffReduction: false,
    
    // Training needs
    trainingDomain: '',
    trainingCount: 0,
    perfectionnementModules: '',
    perfectionnementCount: 0,
    
    // ANPE expectations
    anpeExpectations: ''
  };

  constructor(
    private messageService: MessageService,
    private anpeService: AnpeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.items = [
      { label: 'Informations du contrat' },
      { label: 'Situation de l\'employeur' },
      { label: 'Renseignements établissement' },
      { label: 'Intentions et besoins' },
      { label: 'Documents' }
    ];
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onFileSelect(event: any, fileType: string) {
    const file = event.files[0];
    switch (fileType) {
      case 'rccmFile':
        this.rccmFile = file;
        break;
      case 'statutFile':
        this.statutFile = file;
        break;
      case 'cnssFile':
        this.cnssFile = file;
        break;
      case 'openingDeclarationFile':
        this.openingDeclarationFile = file;
        break;
      case 'workInspectionFile':
        this.workInspectionFile = file;
        break;
    }
    this.messageService.add({
      severity: 'info',
      summary: 'Fichier chargé',
      detail: `${file.name} a été chargé.`
    });
  }

  onSubmit() {
    if (this.anpeForm.valid) {
      const formData = new FormData();

      // Append all files
      if (this.rccmFile) formData.append('rccm', this.rccmFile);
      if (this.statutFile) formData.append('statut', this.statutFile);
      if (this.cnssFile) formData.append('cnss', this.cnssFile);
      if (this.openingDeclarationFile) formData.append('openingDeclaration', this.openingDeclarationFile);
      if (this.workInspectionFile) formData.append('workInspection', this.workInspectionFile);

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