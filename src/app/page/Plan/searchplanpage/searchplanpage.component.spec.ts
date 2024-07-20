import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchplanpageComponent } from './searchplanpage.component';

describe('SearchplanpageComponent', () => {
  let component: SearchplanpageComponent;
  let fixture: ComponentFixture<SearchplanpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchplanpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchplanpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
