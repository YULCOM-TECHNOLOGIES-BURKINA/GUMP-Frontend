import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateursAjeComponent } from './utilisateurs-aje.component';

describe('UtilisateursAjeComponent', () => {
  let component: UtilisateursAjeComponent;
  let fixture: ComponentFixture<UtilisateursAjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateursAjeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilisateursAjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
