import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-actes',
  templateUrl: './actes.component.html',
})
export class ActesComponent  {


  constructor(public layoutService: LayoutService, public router: Router) { }
}
