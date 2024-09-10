import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutecomppageComponent } from './routecomppage.component';

describe('RoutecomppageComponent', () => {
  let component: RoutecomppageComponent;
  let fixture: ComponentFixture<RoutecomppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutecomppageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutecomppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
