import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaddockDetailsComponent } from './paddock-details.component';

describe('PaddockDetailsComponent', () => {
  let component: PaddockDetailsComponent;
  let fixture: ComponentFixture<PaddockDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaddockDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaddockDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
