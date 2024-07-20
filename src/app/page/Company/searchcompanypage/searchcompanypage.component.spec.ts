import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchcompanypageComponent } from './searchcompanypage.component';

describe('SearchcompanypageComponent', () => {
  let component: SearchcompanypageComponent;
  let fixture: ComponentFixture<SearchcompanypageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchcompanypageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchcompanypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
