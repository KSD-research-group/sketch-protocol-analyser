import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelTypeControlComponent } from './label-type-control.component';

describe('LabelTypeControlComponent', () => {
  let component: LabelTypeControlComponent;
  let fixture: ComponentFixture<LabelTypeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelTypeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelTypeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
