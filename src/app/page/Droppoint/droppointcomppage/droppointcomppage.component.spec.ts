import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroppointcomppageComponent } from './droppointcomppage.component';

describe('DroppointcomppageComponent', () => {
  let component: DroppointcomppageComponent;
  let fixture: ComponentFixture<DroppointcomppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DroppointcomppageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DroppointcomppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
