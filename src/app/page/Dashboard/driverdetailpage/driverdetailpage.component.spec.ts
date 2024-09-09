import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverdetailpageComponent } from './driverdetailpage.component';

describe('DriverdetailpageComponent', () => {
  let component: DriverdetailpageComponent;
  let fixture: ComponentFixture<DriverdetailpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverdetailpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverdetailpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
