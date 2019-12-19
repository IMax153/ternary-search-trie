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

End with an example of getting some data out of the system or using it for a little demo

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

#### Trie.size

Gets the size of the tree in terms of the number of nodes present within the tree.

#### Trie.isEmpty

Returns true if the tree contains any nodes, otherwise false.

### Methods

#### set(key, value)

Adds the specified key/value pair to the tree.

| Param |  Type  | Description          |
| ----- | :----: | :------------------- |
| key   | string | The key to add       |
| value | Value  | The value of the key |

#### get(key)

Returns the value of the node with the specified key.

| Param |  Type  | Description         |
| ----- | :----: | :------------------ |
| key   | string | The key of the node |

#### del(key)

Deletes the node with the specified key.

| Param |  Type  | Description                   |
| ----- | :----: | :---------------------------- |
| key   | string | The key of the node to delete |

#### contains(key)

Checks if a node with the specified key exists in the tree.

| Param |  Type  | Description                  |
| ----- | :----: | :--------------------------- |
| key   | string | The key of the node to check |

#### dfs(callback)

Performs a depth-first search of the tree beginning from the root node. Executes the specified callback at each visited node.

| Param    |              Type               | Description             |
| -------- | :-----------------------------: | :---------------------- |
| callback | (node: Node<ValueType>) => void | The callback to execute |

#### keys()

Returns an array of all keys present in the tree.

#### keysWithPrefix(prefix)

Returns all keys present in the tree that begin with the specified prefix.

| Param  |  Type  | Description             |
| ------ | :----: | :---------------------- |
| prefix | string | The prefix to search by |

#### searchWithPrefix(prefix, callback)

Executes the specified callback at each node in the tree whose key begins with the specified prefix.

| Param    |                       Type                        | Description             |
| -------- | :-----------------------------------------------: | :---------------------- |
| prefix   |                      string                       | The prefix to search by |
| callback | (prefix: string, (node: Node<ValueType>) => void) | The callback to execute |

#### toString()

Returns the tree as a string.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- This project was heavily inspired by work done by @jakwings on [node-ternary-search-trie](https://github.com/jakwings/node-ternary-search-trie). This project differs in that it is written in TypeScript and chose to implement the underlying functionality of the tree by making heavy use of recursion instead of loops.
