import { Trie } from '../src/trie';

describe('Trie', () => {
  describe('Trie.isEmpty', () => {
    it('should return true if the trie is empty', () => {
      const trie = new Trie<string>();
      expect(trie.isEmpty).toBeTruthy();
    });

    it('should return false when the trie contains nodes', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');

      expect(trie.isEmpty).toBeFalsy();
    });
  });

  describe('Trie.size', () => {
    it('should return the correct size of the trie', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('😀', '😀');
      trie.set('!', '!');

      expect(trie.size).toBe(3);
    });

    it('should return zero when the trie is empty', () => {
      const trie = new Trie<string>();

      expect(trie.size).toBe(0);
    });
  });

  describe('Trie.set', () => {
    it('should set a key/value pair in the trie', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('汉字', '汉字');
      trie.set('!', '!');

      expect(trie.get('foo')).toBe('foo');
      expect(trie.get('汉字')).toBe('汉字');
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
    it('should get a value from the trie based upon the specified key', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('汉字', '汉字');
      trie.set('!', '!');

      expect(trie.get('foo')).toBe('foo');
      expect(trie.get('汉字')).toBe('汉字');
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
    it('should delete a node from the trie', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('fooooo', 'fooooo');
      trie.set('bar', 'bar');
      trie.set('baz', 'baz');
      trie.set('汉字', '汉字');
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

  describe('Trie.contains', () => {
    it('should return true if a key exists within the trie', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('fooooo', 'fooooo');
      trie.set('bar', 'bar');
      trie.set('baz', 'baz');
      trie.set('汉字', '汉字');
      trie.set('!', '!');

      expect(trie.contains('baz')).toBeTruthy();
    });

    it('should return false if a key does not exist within the trie', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('fooooo', 'fooooo');
      trie.set('bar', 'bar');
      trie.set('baz', 'baz');
      trie.set('汉字', '汉字');
      trie.set('!', '!');

      expect(trie.contains('fo')).toBeFalsy();
    });
  });

  describe('Trie.dfs', () => {
    it('should perform a depth-first search, visiting each node in the trie', () => {
      const trie = new Trie<string>();
      const keys = ['foo', '汉字', '!', 'fooo', 'bar'];

      keys.forEach(key => trie.set(key, key));

      trie.dfs(node => {
        expect(keys.some(key => key.includes(node.key))).toBeTruthy();

        if (node.value) {
          expect(keys).toContain(node.value);
        }
      });
    });
  });

  describe('Trie.keys', () => {
    it('should return all keys in the trie', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('汉字', '汉字');
      trie.set('!', '!');

      expect(trie.keys()).toMatchObject(['!', 'foo', '汉字']);
    });

    it('should return an empty array when the trie is empty', () => {
      const trie = new Trie<string>();

      expect(trie.keys()).toEqual([]);
    });
  });

  describe('Trie.keysWithPrefix', () => {
    it('should return a list of keys found in the trie that begin with the specified prefix', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('fooooo', 'fooooo');
      trie.set('fore', 'fore');
      trie.set('fobe', 'fobe');
      trie.set('bar', 'bar');
      trie.set('baz', 'baz');
      trie.set('汉字', '汉字');
      trie.set('!', '!');

      const expectedKeys = ['foo', 'fore', 'fobe', 'fooooo'];

      expect(trie.keysWithPrefix('fo').sort()).toMatchObject(expectedKeys.sort());
    });
  });

  describe('Trie.searchWithPrefix', () => {
    it('shoud return a list of nodes found in the trie whose keys begin with the specified prefix', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('fooooo', 'fooooo');
      trie.set('fore', 'fore');
      trie.set('fobe', 'fobe');
      trie.set('bar', 'bar');
      trie.set('baz', 'baz');
      trie.set('汉字', '汉字');
      trie.set('!', '!');

      const expectedValues = ['foo', 'fore', 'fobe', 'fooooo'];
      const actualValues: (string | null)[] = [];

      trie.searchWithPrefix('fo', node => {
        actualValues.push(node.value);
      });

      expect(actualValues.sort()).toMatchObject(expectedValues.sort());
    });
  });

  describe('Trie.toString', () => {
    it('should correctly return the tree as a string', () => {
      const trie = new Trie<string>();

      trie.set('foo', 'foo');
      trie.set('fooooo', 'fooooo');
      trie.set('bar', 'bar');
      trie.set('baz', 'baz');
      trie.set('汉字', '汉字');
      trie.set('!', '!');

      expect(trie.toString()).toMatchSnapshot();
    });
  });
});
