import { replaceTextInString } from './replaceTextInString';

describe('replaceTextInString', () => {
  it('will replace content in the string correctly', () => {
    const test = 'I like :replace:';
    const replacer = 'rabbits';

    expect(replaceTextInString(test, replacer)(/:replace:/)).toBe(
      'I like rabbits'
    );
  });
});
