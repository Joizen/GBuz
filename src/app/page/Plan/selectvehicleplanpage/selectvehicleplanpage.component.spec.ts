import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectvehicleplanpageComponent } from './selectvehicleplanpage.component';

describe('SelectvehicleplanpageComponent', () => {
  let component: SelectvehicleplanpageComponent;
  let fixture: ComponentFixture<SelectvehicleplanpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectvehicleplanpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectvehicleplanpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
