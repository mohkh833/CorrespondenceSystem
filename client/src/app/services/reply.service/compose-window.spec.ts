import { TestBed } from '@angular/core/testing';

import { ComposeService } from './reply.service';

describe('ComposeWindowServiceService', () => {
  let service: ComposeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComposeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
