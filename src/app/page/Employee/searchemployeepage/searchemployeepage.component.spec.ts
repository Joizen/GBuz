import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchemployeepageComponent } from './searchemployeepage.component';

describe('SearchemployeepageComponent', () => {
  let component: SearchemployeepageComponent;
  let fixture: ComponentFixture<SearchemployeepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchemployeepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchemployeepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
