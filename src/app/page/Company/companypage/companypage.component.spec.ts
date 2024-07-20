import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypageComponent } from './companypage.component';

describe('CompanypageComponent', () => {
  let component: CompanypageComponent;
  let fixture: ComponentFixture<CompanypageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanypageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
