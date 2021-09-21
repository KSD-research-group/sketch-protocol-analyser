import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchControlsComponent } from './sketch-controls.component';

describe('SketchControlsComponent', () => {
  let component: SketchControlsComponent;
  let fixture: ComponentFixture<SketchControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SketchControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
