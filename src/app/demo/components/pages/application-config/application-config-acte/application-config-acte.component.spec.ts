import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationConfigActeComponent } from './application-config-acte.component';

describe('ApplicationConfigActeComponent', () => {
  let component: ApplicationConfigActeComponent;
  let fixture: ComponentFixture<ApplicationConfigActeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationConfigActeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationConfigActeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
