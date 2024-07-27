import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchdriverPageComponent } from './searchdriver-page.component';

describe('SearchdriverPageComponent', () => {
  let component: SearchdriverPageComponent;
  let fixture: ComponentFixture<SearchdriverPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchdriverPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchdriverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
