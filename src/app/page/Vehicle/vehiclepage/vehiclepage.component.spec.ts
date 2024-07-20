import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclepageComponent } from './vehiclepage.component';

describe('VehiclepageComponent', () => {
  let component: VehiclepageComponent;
  let fixture: ComponentFixture<VehiclepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
