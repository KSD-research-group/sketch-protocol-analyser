import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchVizComponent } from './sketch.component';

describe('SketchVizComponent', () => {
  let component: SketchVizComponent;
  let fixture: ComponentFixture<SketchVizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SketchVizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
