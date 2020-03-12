import { TestBed } from '@angular/core/testing';

import { TextbooksService } from './textbooks.service';

describe('TextbooksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextbooksService = TestBed.get(TextbooksService);
    expect(service).toBeTruthy();
  });
});
