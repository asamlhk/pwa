import { TestBed } from '@angular/core/testing';

import { DataEncryptionService } from './data-encryption.service';

describe('DataEncryptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataEncryptionService = TestBed.get(DataEncryptionService);
    expect(service).toBeTruthy();
  });
});
