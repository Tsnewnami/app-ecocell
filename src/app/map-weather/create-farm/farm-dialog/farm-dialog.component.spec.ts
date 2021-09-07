import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmDialogComponent } from './farm-dialog.component';

describe('FarmDialogComponent', () => {
  let component: FarmDialogComponent;
  let fixture: ComponentFixture<FarmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
