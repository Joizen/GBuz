import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmjobpageComponent } from './confirmjobpage.component';

describe('ConfirmjobpageComponent', () => {
  let component: ConfirmjobpageComponent;
  let fixture: ComponentFixture<ConfirmjobpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmjobpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmjobpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
