import { TestBed } from '@angular/core/testing';

import { SketchVizSettingsService } from './sketch-viz-settings.service';

describe('SketchVizSettingsService', () => {
  let service: SketchVizSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SketchVizSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
