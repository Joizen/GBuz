import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WakedashboardpageComponent } from './wakedashboardpage.component';

describe('WakedashboardpageComponent', () => {
  let component: WakedashboardpageComponent;
  let fixture: ComponentFixture<WakedashboardpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WakedashboardpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WakedashboardpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
