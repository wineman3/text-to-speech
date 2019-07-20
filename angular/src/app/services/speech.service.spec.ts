import { TestBed } from '@angular/core/testing';

import { SpeechService } from './speech.service';

describe('SpeechServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpeechService = TestBed.get(SpeechService);
    expect(service).toBeTruthy();
  });
});
