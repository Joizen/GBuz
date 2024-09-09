import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardpageComponent } from './maindashboardpage.component';

describe('MaindashboardpageComponent', () => {
  let component: MaindashboardpageComponent;
  let fixture: ComponentFixture<MaindashboardpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaindashboardpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaindashboardpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
