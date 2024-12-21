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

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private anpeService: AnpeService,
    private router: Router
  ) {}

  ngOnInit() {

  }

}