import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchroutepageComponent } from './searchroutepage.component';

describe('SearchroutepageComponent', () => {
  let component: SearchroutepageComponent;
  let fixture: ComponentFixture<SearchroutepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchroutepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchroutepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
