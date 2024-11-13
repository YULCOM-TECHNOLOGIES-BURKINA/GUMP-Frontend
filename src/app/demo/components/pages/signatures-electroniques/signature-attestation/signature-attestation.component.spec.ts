import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureAttestationComponent } from './signature-attestation.component';

describe('SignatureAttestationComponent', () => {
  let component: SignatureAttestationComponent;
  let fixture: ComponentFixture<SignatureAttestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignatureAttestationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignatureAttestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
