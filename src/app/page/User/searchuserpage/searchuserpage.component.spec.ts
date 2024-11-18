import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchuserpageComponent } from './searchuserpage.component';

describe('SearchuserpageComponent', () => {
  let component: SearchuserpageComponent;
  let fixture: ComponentFixture<SearchuserpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchuserpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchuserpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
