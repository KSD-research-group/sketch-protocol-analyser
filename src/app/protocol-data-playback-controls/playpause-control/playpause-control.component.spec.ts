import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaypauseControlComponent } from './playpause-control.component';

describe('PlaypauseControlComponent', () => {
  let component: PlaypauseControlComponent;
  let fixture: ComponentFixture<PlaypauseControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaypauseControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaypauseControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
