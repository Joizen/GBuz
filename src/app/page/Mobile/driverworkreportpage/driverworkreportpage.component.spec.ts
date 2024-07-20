import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverworkreportpageComponent } from './driverworkreportpage.component';

describe('DriverworkreportpageComponent', () => {
  let component: DriverworkreportpageComponent;
  let fixture: ComponentFixture<DriverworkreportpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverworkreportpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverworkreportpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
