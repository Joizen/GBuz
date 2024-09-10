import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeecomppageComponent } from './employeecomppage.component';

describe('EmployeecomppageComponent', () => {
  let component: EmployeecomppageComponent;
  let fixture: ComponentFixture<EmployeecomppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeecomppageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeecomppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
