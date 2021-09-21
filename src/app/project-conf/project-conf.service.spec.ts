import { TestBed } from '@angular/core/testing';

import { ProjectConfService } from './project-conf.service';

describe('ProjectConfService', () => {
  let service: ProjectConfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectConfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
