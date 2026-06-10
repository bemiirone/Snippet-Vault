import { parseTags, extractErrorMessage } from './helpers';

describe('parseTags', () => {
  it('should parse comma-separated tags', () => {
    expect(parseTags('typescript, javascript, node')).toEqual(['typescript', 'javascript', 'node']);
  });

  it('should trim whitespace from tags', () => {
    expect(parseTags('  typescript  ,  javascript  ')).toEqual(['typescript', 'javascript']);
  });

  it('should convert tags to lowercase', () => {
    expect(parseTags('TypeScript, JavaScript')).toEqual(['typescript', 'javascript']);
  });

  it('should filter out empty tags', () => {
    expect(parseTags('typescript, , javascript,')).toEqual(['typescript', 'javascript']);
  });

  it('should handle single tag', () => {
    expect(parseTags('typescript')).toEqual(['typescript']);
  });

  it('should return empty array for empty string', () => {
    expect(parseTags('')).toEqual([]);
  });

  it('should return empty array for only commas and spaces', () => {
    expect(parseTags(', , ,')).toEqual([]);
  });
});

describe('extractErrorMessage', () => {
  it('should return error message from Error instance', () => {
    const error = new Error('Something went wrong');
    expect(extractErrorMessage(error, 'Fallback')).toBe('Something went wrong');
  });

  it('should return fallback for non-Error values', () => {
    expect(extractErrorMessage('string error', 'Fallback')).toBe('Fallback');
  });

  it('should return fallback for null', () => {
    expect(extractErrorMessage(null, 'Fallback')).toBe('Fallback');
  });

  it('should return fallback for undefined', () => {
    expect(extractErrorMessage(undefined, 'Fallback')).toBe('Fallback');
  });
});
