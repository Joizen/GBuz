import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutepolygonpageComponent } from './routepolygonpage.component';

describe('RoutepolygonpageComponent', () => {
  let component: RoutepolygonpageComponent;
  let fixture: ComponentFixture<RoutepolygonpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutepolygonpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutepolygonpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
