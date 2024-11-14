import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationConfigDrtpsComponent } from './application-config-drtps.component';

describe('ApplicationConfigDrtpsComponent', () => {
  let component: ApplicationConfigDrtpsComponent;
  let fixture: ComponentFixture<ApplicationConfigDrtpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationConfigDrtpsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationConfigDrtpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
