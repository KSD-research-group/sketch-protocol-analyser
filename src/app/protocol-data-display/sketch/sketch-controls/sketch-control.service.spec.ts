import { TestBed } from '@angular/core/testing';

import { SketchControlService } from './sketch-control.service';

describe('SketchControlService', () => {
  let service: SketchControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SketchControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
