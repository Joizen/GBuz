import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrivercheckinpageComponent } from './drivercheckinpage.component';

describe('DrivercheckinpageComponent', () => {
  let component: DrivercheckinpageComponent;
  let fixture: ComponentFixture<DrivercheckinpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrivercheckinpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrivercheckinpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
