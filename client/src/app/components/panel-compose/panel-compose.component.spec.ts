import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelComposeComponent } from './panel-compose.component';

describe('PanelComposeComponent', () => {
  let component: PanelComposeComponent;
  let fixture: ComponentFixture<PanelComposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelComposeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelComposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
