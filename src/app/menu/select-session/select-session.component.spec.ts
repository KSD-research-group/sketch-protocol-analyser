import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSessionComponent } from './select-session.component';

describe('SelectSessionComponent', () => {
  let component: SelectSessionComponent;
  let fixture: ComponentFixture<SelectSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSessionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
