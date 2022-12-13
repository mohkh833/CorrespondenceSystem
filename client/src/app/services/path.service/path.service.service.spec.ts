import { TestBed } from '@angular/core/testing';

import { PathServiceService } from './path.service.service';

describe('PathServiceService', () => {
  let service: PathServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
