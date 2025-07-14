import { TestBed } from '@angular/core/testing';

import { ChitgroupService } from './chitgroup.service';

describe('ChitgroupService', () => {
  let service: ChitgroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChitgroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
