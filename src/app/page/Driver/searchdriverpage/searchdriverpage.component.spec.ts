import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchdriverpageComponent } from './searchdriverpage.component';

describe('SearchdriverpageComponent', () => {
  let component: SearchdriverpageComponent;
  let fixture: ComponentFixture<SearchdriverpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchdriverpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchdriverpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
