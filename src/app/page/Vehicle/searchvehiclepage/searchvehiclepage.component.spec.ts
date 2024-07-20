import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchvehiclepageComponent } from './searchvehiclepage.component';

describe('SearchvehiclepageComponent', () => {
  let component: SearchvehiclepageComponent;
  let fixture: ComponentFixture<SearchvehiclepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchvehiclepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchvehiclepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
