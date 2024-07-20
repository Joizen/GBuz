import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverpageComponent } from './driverpage.component';

describe('DriverpageComponent', () => {
  let component: DriverpageComponent;
  let fixture: ComponentFixture<DriverpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
