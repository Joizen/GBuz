import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverworkpageComponent } from './driverworkpage.component';

describe('DriverworkpageComponent', () => {
  let component: DriverworkpageComponent;
  let fixture: ComponentFixture<DriverworkpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverworkpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverworkpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
