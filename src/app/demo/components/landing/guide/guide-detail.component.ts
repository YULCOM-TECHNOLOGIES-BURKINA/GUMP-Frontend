import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ActService from '../../../services/actes.service';

interface LegalText {
    title: string;
    content: string;
    link?: string;
}

interface Prerequisite {
    title: string;
    description: string;
    id: string;
}

interface Step {
    title: string;
    description: string;
    image?: string;
}

interface ActDetail {
    id: string;
    title: string;
    description: string;
    icon: string;
    organization: string;
    validityPeriod: string;
    processingTime: string;
    price: string;
    category: string;
    usages: string[];
    requiredDocuments: string[];
    prerequisites: Prerequisite[];
    legalTexts: LegalText[];
    steps: Step[];
    img: string;
}

@Component({
    selector: 'app-guide-detail',
    templateUrl: './guide-detail.component.html'
})
export class GuideDetailComponent implements OnInit {
    act: ActDetail | undefined;
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private actService: ActService
    ) {}

    ngOnInit() {
        if (localStorage.getItem('currentUser') !== null) {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user.role.includes('USER')){
              this.router.navigate(['']);
            } else{
              this.router.navigate(['app/']);
            }
        }
        this.route.params.subscribe((params) => {
            const id = params['id'];
            this.getActInfo(id);
          });
          this.loading = false;
    }

    getActInfo(id: string) {
        this.actService.getActInfo(id).subscribe((a) => {
          if (a) {
            console.log(a);
            this.act = a;
          } else {
            console.log(`Aucune information trouvée pour l'acte ${id}`);
          }
        });
    }
}