import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRenderingComponent } from './form-rendering.component';

describe('FormRenderingComponent', () => {
  let component: FormRenderingComponent;
  let fixture: ComponentFixture<FormRenderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRenderingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRenderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
