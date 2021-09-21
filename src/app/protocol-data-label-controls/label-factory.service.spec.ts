import { TestBed } from '@angular/core/testing';

import { LabelFactoryService } from './label-factory.service';

describe('LabelFactoryService', () => {
  let service: LabelFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
