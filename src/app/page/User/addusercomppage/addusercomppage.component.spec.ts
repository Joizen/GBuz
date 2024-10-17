import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddusercomppageComponent } from './addusercomppage.component';

describe('AddusercomppageComponent', () => {
  let component: AddusercomppageComponent;
  let fixture: ComponentFixture<AddusercomppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddusercomppageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddusercomppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
