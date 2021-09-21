import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolDataLabelControlsComponent } from './protocol-data-label-controls.component';

describe('ProtocolDataLabelControlsComponent', () => {
  let component: ProtocolDataLabelControlsComponent;
  let fixture: ComponentFixture<ProtocolDataLabelControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtocolDataLabelControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolDataLabelControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
