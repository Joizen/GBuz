import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchplanmasterpageComponent } from './searchplanmasterpage.component';

describe('SearchplanmasterpageComponent', () => {
  let component: SearchplanmasterpageComponent;
  let fixture: ComponentFixture<SearchplanmasterpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchplanmasterpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchplanmasterpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
