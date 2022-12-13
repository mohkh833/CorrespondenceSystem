import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmnDialogComponent } from './confirm-dialog.component';

describe('ConfirmnDialogComponent', () => {
  let component: ConfirmnDialogComponent;
  let fixture: ComponentFixture<ConfirmnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmnDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
