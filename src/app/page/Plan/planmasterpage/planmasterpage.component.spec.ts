import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanmasterpageComponent } from './planmasterpage.component';

describe('PlanmasterpageComponent', () => {
  let component: PlanmasterpageComponent;
  let fixture: ComponentFixture<PlanmasterpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanmasterpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanmasterpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
