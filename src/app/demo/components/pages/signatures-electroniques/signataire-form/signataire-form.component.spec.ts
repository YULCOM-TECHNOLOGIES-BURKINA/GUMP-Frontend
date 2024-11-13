import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignataireFormComponent } from './signataire-form.component';

describe('SignataireFormComponent', () => {
  let component: SignataireFormComponent;
  let fixture: ComponentFixture<SignataireFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignataireFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignataireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
