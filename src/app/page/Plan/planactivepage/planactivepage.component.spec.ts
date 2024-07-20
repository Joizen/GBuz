import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanactivepageComponent } from './planactivepage.component';

describe('PlanactivepageComponent', () => {
  let component: PlanactivepageComponent;
  let fixture: ComponentFixture<PlanactivepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanactivepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanactivepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
