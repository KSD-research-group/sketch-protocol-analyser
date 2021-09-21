import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolDataPlaybackControlsComponent } from './protocol-data-playback-controls.component';

describe('ProtocolDataPlaybackControlsComponent', () => {
  let component: ProtocolDataPlaybackControlsComponent;
  let fixture: ComponentFixture<ProtocolDataPlaybackControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProtocolDataPlaybackControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolDataPlaybackControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
