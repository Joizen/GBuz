import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdatapageComponent } from './userdatapage.component';

describe('UserdatapageComponent', () => {
  let component: UserdatapageComponent;
  let fixture: ComponentFixture<UserdatapageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserdatapageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserdatapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
