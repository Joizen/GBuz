import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercompageComponent } from './usercompage.component';

describe('UsercompageComponent', () => {
  let component: UsercompageComponent;
  let fixture: ComponentFixture<UsercompageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsercompageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercompageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
