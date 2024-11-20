import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationConfigAjeComponent } from './application-config-aje.component';

describe('ApplicationConfigAjeComponent', () => {
  let component: ApplicationConfigAjeComponent;
  let fixture: ComponentFixture<ApplicationConfigAjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationConfigAjeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationConfigAjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
