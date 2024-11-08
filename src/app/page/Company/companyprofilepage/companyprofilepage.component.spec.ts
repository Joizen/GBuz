import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyprofilepageComponent } from './companyprofilepage.component';

describe('CompanyprofilepageComponent', () => {
  let component: CompanyprofilepageComponent;
  let fixture: ComponentFixture<CompanyprofilepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyprofilepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyprofilepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
