import { Trie } from '../src';

describe('Trie', () => {
  describe('Trie.size', () => {
    it('should return the correct size of the tree', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('😀', '😀');
      trie.set('!', '!');

      expect(trie.size).toBe(3);
    });

    it('should return zero when the tree is empty', () => {
      const trie = new Trie<string>();

      expect(trie.size).toBe(0);
    });
  });

  describe('Trie.keys', () => {
    it('should return all keys in the tree', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('😀', '😀');
      trie.set('!', '!');

      expect(trie.keys()).toContain('f');
      expect(trie.keys()).toContain('o');
      expect(trie.keys()).toContain('😀');
      expect(trie.keys()).toContain('!');
    });

    it('should return an empty array when the tree is empty', () => {
      const trie = new Trie<string>();

      expect(trie.keys()).toEqual([]);
    });
  });

  describe('Trie.set', () => {
    it('should set a key/value pair in the tree', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('😀', '😀');
      trie.set('!', '!');

      expect(trie.get('foo')).toBe('foo');
      expect(trie.get('😀')).toBe('😀');
      expect(trie.get('!')).toBe('!');
    });

    it('should not set a key/value pair when provided an invalid key', () => {
      const trie = new Trie<string>();

      // @ts-ignore
      expect(() => trie.set(1, '1')).toThrow(
        '[Trie] Only string values can be used as keys. Received type number.',
      );
      expect(() => trie.set('', '1')).toThrow(
        '[Trie] Key values must have length greater than or equal to 1.',
      );
    });
  });

  describe('Trie.get', () => {
    it('should get a value from the tree based upon the specified key', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('😀', '😀');
      trie.set('!', '!');

      expect(trie.get('foo')).toBe('foo');
      expect(trie.get('😀')).toBe('😀');
      expect(trie.get('!')).toBe('!');
    });

    it('should not get a value when provided an invalid key', () => {
      const trie = new Trie<string>();

      // @ts-ignore
      expect(() => trie.get(1)).toThrow(
        '[Trie] Only string values can be used as keys. Received type number.',
      );
      expect(() => trie.get('')).toThrow(
        '[Trie] Key values must have length greater than or equal to 1.',
      );
    });
  });

  describe('Trie.del', () => {
    it('should delete a node from the tree', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('fooooo', 'fooooo');
      trie.set('bar', 'bar');
      trie.set('baz', 'baz');
      trie.set('😀', '😀');
      trie.set('!', '!');

      expect(trie.get('foo')).toBe('foo');
      expect(trie.get('fooooo')).toBe('fooooo');
      expect(trie.get('bar')).toBe('bar');
      expect(trie.get('baz')).toBe('baz');

      trie.del('foo');
      trie.del('baz');

      expect(trie.get('foo')).toBe(null);
      expect(trie.get('baz')).toBe(null);
      expect(trie.get('bar')).toBe('bar');
      expect(trie.get('fooooo')).toBe('fooooo');
    });
  });

  describe('Trie.traverse', () => {
    it('should traverse each node in the tree', () => {
      const trie = new Trie<string>();
      const keys = ['foo', '😀', '!', 'fooo', 'bar'];

      keys.forEach(key => trie.set(key, key));

      trie.traverse(node => {
        expect(keys.some(key => key.includes(node.key))).toBeTruthy();

        if (node.value) {
          expect(keys).toContain(node.value);
        }
      });
    });
  });

  describe('Trie.searchByPrefix', () => {
    it('shoud return a list of words found using the specified prefix', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('fooooo', 'fooooo');
      trie.set('fore', 'fore');
      trie.set('fobe', 'fobe');
      trie.set('bar', 'bar');
      trie.set('baz', 'baz');
      trie.set('😀', '😀');
      trie.set('!', '!');

      const expected = ['foo', 'fore', 'fobe', 'fooooo'];

      trie.searchByPrefix('fo', word => {
        expect(expected).toContain(word);
      });

      trie.searchByPrefix('😀', word => {
        expect(word).toBe('😀');
      });
    });
  });

  describe('Trie.toString', () => {
    it('should correctly print the tree', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('fooooo', 'fooooo');
      trie.set('bar', 'bar');
      trie.set('baz', 'baz');
      trie.set('😀', '😀');
      trie.set('!', '!');

      expect(trie.toString()).toMatchSnapshot();
    });
  });
});
