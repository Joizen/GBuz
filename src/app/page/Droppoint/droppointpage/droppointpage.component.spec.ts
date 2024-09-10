import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroppointpageComponent } from './droppointpage.component';

describe('DroppointpageComponent', () => {
  let component: DroppointpageComponent;
  let fixture: ComponentFixture<DroppointpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DroppointpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DroppointpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
