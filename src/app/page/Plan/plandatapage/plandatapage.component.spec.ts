import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlandatapageComponent } from './plandatapage.component';

describe('PlandatapageComponent', () => {
  let component: PlandatapageComponent;
  let fixture: ComponentFixture<PlandatapageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlandatapageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlandatapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
