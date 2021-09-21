import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSetComponent } from './control-set.component';

describe('ControlSetComponent', () => {
  let component: ControlSetComponent;
  let fixture: ComponentFixture<ControlSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
