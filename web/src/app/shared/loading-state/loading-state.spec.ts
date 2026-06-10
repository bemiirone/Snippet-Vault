import { TestBed } from '@angular/core/testing';
import { LoadingState } from './loading-state';

describe('LoadingState', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(LoadingState);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have default message', () => {
    const fixture = TestBed.createComponent(LoadingState);
    expect(fixture.componentInstance.message()).toBe('Loading...');
  });
});
