import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercomdatapageComponent } from './usercomdatapage.component';

describe('UsercomdatapageComponent', () => {
  let component: UsercomdatapageComponent;
  let fixture: ComponentFixture<UsercomdatapageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsercomdatapageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercomdatapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
