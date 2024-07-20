import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverregisterpageComponent } from './driverregisterpage.component';

describe('DriverregisterpageComponent', () => {
  let component: DriverregisterpageComponent;
  let fixture: ComponentFixture<DriverregisterpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverregisterpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverregisterpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
