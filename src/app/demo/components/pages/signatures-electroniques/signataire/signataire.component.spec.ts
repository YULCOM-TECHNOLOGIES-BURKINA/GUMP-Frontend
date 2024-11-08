import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignataireComponent } from './signataire.component';

describe('SignataireComponent', () => {
  let component: SignataireComponent;
  let fixture: ComponentFixture<SignataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignataireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
