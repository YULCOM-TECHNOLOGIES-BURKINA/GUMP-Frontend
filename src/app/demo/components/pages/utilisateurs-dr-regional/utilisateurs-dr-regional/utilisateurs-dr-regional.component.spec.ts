import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateursDrRegionalComponent } from './utilisateurs-dr-regional.component';

describe('UtilisateursDrRegionalComponent', () => {
  let component: UtilisateursDrRegionalComponent;
  let fixture: ComponentFixture<UtilisateursDrRegionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateursDrRegionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilisateursDrRegionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
