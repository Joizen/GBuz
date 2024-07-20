import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchplanactivepageComponent } from './searchplanactivepage.component';

describe('SearchplanactivepageComponent', () => {
  let component: SearchplanactivepageComponent;
  let fixture: ComponentFixture<SearchplanactivepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchplanactivepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchplanactivepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
