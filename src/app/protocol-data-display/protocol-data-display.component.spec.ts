import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolDataDisplayComponent } from './protocol-data-display.component';

describe('ProtocolDataDisplayComponent', () => {
  let component: ProtocolDataDisplayComponent;
  let fixture: ComponentFixture<ProtocolDataDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtocolDataDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolDataDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
