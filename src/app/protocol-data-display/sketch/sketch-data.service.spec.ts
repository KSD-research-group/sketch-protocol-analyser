import { TestBed } from '@angular/core/testing';

import { SketchDataService } from './sketch-data.service';

describe('SketchDataService', () => {
  let service: SketchDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SketchDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
