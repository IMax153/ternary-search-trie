# Ternary Search Trie

A ternary search trie implementation in TypeScript.

## Installing

You can install the package via npm or yarn.

#### NPM

```
npm install ternary-search-trie
```

#### Yarn

```
yarn add ternary-search-trie
```

## Documentation

## Trie

Represents a [ternary search trie](https://en.wikipedia.org/wiki/Ternary_search_tree).

#### Usage

```typescript
import { Trie } from 'ternary-search-trie';

interface Value {
  data: string;
}

const trie = new Trie<Value>();
```

### Members

- [isEmpty](#isEmpty)
- [size](#size)

#### isEmpty

Returns true if the tree contains any nodes, otherwise false.

```typescript
console.log(trie.isEmpty);
//=> true
```

#### size

Gets the size of the tree in terms of the number of nodes present within the tree.

```typescript
console.log(trie.size);
//=> 0
```

### Methods

- [set](#set)
- [get](#get)
- [del](#del)
- [contains](#contains)
- [keys](#keys)
- [keysWithPrefix](#keysWithPrefix)
- [searchWithPrefix](#searchWithPrefix)
- [dfs](#dfs)

#### set

```typescript
set(key: string, value: Value): Trie<Value>
```

Adds the specified key/value pair to the tree.

Example:

```typescript
const value = { data: 'test' };

trie.set('data', value);
```

#### get

```typescript
get(key: string): Value | null
```

Returns the value of the node with the specified key.

Example:

```typescript
const value = { data: 'test' };

trie.set('data', value);

console.log(trie.get('data'));
//=> { data: 'test' }
```

#### del

```typescript
del(key: string): Trie<Value>
```

Deletes the node with the specified key.

Example:

```typescript
const value = { data: 'test' };

trie.set('data', value);

console.log(trie.get('data'));
//=> { data: 'test' }

trie.del('data');

console.log(trie.get('data'));
//=> null;
```

#### contains

```typescript
contains(key: string): boolean
```

Checks if a node with the specified key exists in the tree.

Example:

```typescript
console.log(trie.contains('foo'));
//=> false
```

#### keys

```typescript
keys(): string[]
```

Returns an array of all keys present in the tree.

Example:

```typescript
const value = { data: 'test' };

trie.set('foo', value);
trie.set('bar', value);
trie.set('baz', value);

console.log(trie.keys());
//=>  [ 'bar', 'baz', 'foo' ]
```

#### keysWithPrefix

```typescript
keysWithPrefix(prefix: string): string[]
```

Returns all keys present in the tree that begin with the specified prefix.

Example:

```typescript
const value = { data: 'test' };

trie.set('foo', value);
trie.set('bar', value);
trie.set('baz', value);

console.log(trie.keysWithPrefix('ba'));
//=>  [ 'bar', 'baz' ]
```

#### searchWithPrefix

```typescript
searchWithPrefix(prefix: string, callback: (key: string, value: Value) => void): void;
```

Executes the specified callback at each node in the tree whose key begins with the specified prefix.

Example:

```typescript
const value = { data: 'test' };

trie.set('foo', value);
trie.set('bar', value);
trie.set('baz', value);

trie.searchWithPrefix('ba', (key, value) => console.log({ key, value }));
//=> { key: 'bar', value: { data: 'test' } }
//=> { key: 'baz', value: { data: 'test' } }
```

#### dfs

```typescript
dfs(callback: (key: string, value: Value | null) => void): void;
```

Performs a depth-first search of the tree beginning from the root node. Executes the specified callback at each visited node.

Example:

```typescript
const value = { data: 'test' };

trie.set('foo', value);

trie.dfs((key, value) => console.log({ key, value }));
//=> { key: 'f', value: null }
//=> { key: 'o', value: null }
//=> { key: 'o', value: { data: 'test' } }
```

#### toString()

Returns the tree as a string.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- This project was heavily inspired by work done by @jakwings on [node-ternary-search-trie](https://github.com/jakwings/node-ternary-search-trie). This project differs in that it is written in TypeScript and chose to implement the underlying functionality of the tree by making heavy use of recursion instead of loops.
