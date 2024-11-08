import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateursDrtssComponent } from './utilisateurs-drtss.component';

describe('UtilisateursDrtssComponent', () => {
  let component: UtilisateursDrtssComponent;
  let fixture: ComponentFixture<UtilisateursDrtssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateursDrtssComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilisateursDrtssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
