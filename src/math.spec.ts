import { sum, sub, pow, mul } from './math';

describe('sub', () => {
  it('sub', () => {
    expect(sub(2, 1)).toBe(1);
  });
});
describe('sum', () => {
  it('sum', () => {
    expect(sum(2, 1)).toBe(3);
  });
});
describe('mul', () => {
  it('mul', () => {
    expect(mul(2, 1)).toBe(2);
  });
});
describe('pow', () => {
  it('pow', () => {
    expect(pow(2, 1)).toBe(2);
  });
});
