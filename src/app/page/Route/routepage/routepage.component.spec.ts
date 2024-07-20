import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutepageComponent } from './routepage.component';

describe('RoutepageComponent', () => {
  let component: RoutepageComponent;
  let fixture: ComponentFixture<RoutepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
