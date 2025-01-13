import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanymappageComponent } from './companymappage.component';

describe('CompanymappageComponent', () => {
  let component: CompanymappageComponent;
  let fixture: ComponentFixture<CompanymappageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanymappageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanymappageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
