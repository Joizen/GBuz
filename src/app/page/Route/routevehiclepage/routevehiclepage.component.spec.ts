import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutevehiclepageComponent } from './routevehiclepage.component';

describe('RoutevehiclepageComponent', () => {
  let component: RoutevehiclepageComponent;
  let fixture: ComponentFixture<RoutevehiclepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutevehiclepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutevehiclepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
