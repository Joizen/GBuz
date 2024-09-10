import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclecomppageComponent } from './vehiclecomppage.component';

describe('VehiclecomppageComponent', () => {
  let component: VehiclecomppageComponent;
  let fixture: ComponentFixture<VehiclecomppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclecomppageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclecomppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
