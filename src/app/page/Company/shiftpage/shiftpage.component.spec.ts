import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftpageComponent } from './shiftpage.component';

describe('ShiftpageComponent', () => {
  let component: ShiftpageComponent;
  let fixture: ComponentFixture<ShiftpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
