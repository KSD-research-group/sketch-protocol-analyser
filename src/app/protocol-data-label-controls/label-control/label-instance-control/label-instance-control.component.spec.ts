import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelInstanceControlComponent } from './label-instance-control.component';

describe('LabelInstanceControlComponent', () => {
  let component: LabelInstanceControlComponent;
  let fixture: ComponentFixture<LabelInstanceControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelInstanceControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelInstanceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
