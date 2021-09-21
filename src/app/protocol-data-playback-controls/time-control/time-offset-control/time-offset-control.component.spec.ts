import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOffsetControlComponent } from './time-offset-control.component';

describe('TimeOffsetControlComponent', () => {
  let component: TimeOffsetControlComponent;
  let fixture: ComponentFixture<TimeOffsetControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeOffsetControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeOffsetControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
