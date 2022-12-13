import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeSideComponent } from './compose-side.component';

describe('ComposeSideComponent', () => {
  let component: ComposeSideComponent;
  let fixture: ComponentFixture<ComposeSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposeSideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposeSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
