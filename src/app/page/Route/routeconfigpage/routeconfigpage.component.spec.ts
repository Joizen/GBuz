import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteconfigpageComponent } from './routeconfigpage.component';

describe('RouteconfigpageComponent', () => {
  let component: RouteconfigpageComponent;
  let fixture: ComponentFixture<RouteconfigpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteconfigpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteconfigpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
