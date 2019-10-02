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

interface ValueType {
  data: string;
}

const trie = new Trie<ValueType>();
```

### Members

#### Trie.size

Gets the size of the tree in terms of the number of nodes present within the tree.

### Methods

#### keys()

Gets all keys present in the tree.

#### set(key, value)

Creates a new node in the tree with the specified key and value.

| Param |   Type    | Description           |
| ----- | :-------: | :-------------------- |
| key   |  string   | The key of the node   |
| value | ValueType | The value of the node |

#### get(key)

Recursively searches the tree for the node with the specified key and returns its value if it exists.

| Param |  Type  | Description         |
| ----- | :----: | :------------------ |
| key   | string | The key of the node |

#### del(key)

Deletes a node from the tree if it exists.

| Param |  Type  | Description                   |
| ----- | :----: | :---------------------------- |
| key   | string | The key of the node to delete |

#### traverse(callback)

Performs a depth-first traversal of the tree starting from the root node.

| Param    |                Type                 | Description                                  |
| -------- | :---------------------------------: | :------------------------------------------- |
| callback | (node: TrieNode<ValueType>) => void | The callback to execute at each visited node |

#### searchByPrefix(prefix, callback)

Searches the tree using the specified prefix.

| Param    |                        Type                         | Description                                  |
| -------- | :-------------------------------------------------: | :------------------------------------------- |
| prefix   |                       string                        | The prefix to search by                      |
| callback | (prefix: string, node: TrieNode<ValueType>) => void | The callback to execute at each visited node |

#### toString(options)

| Param                 |   Type   | Description                                                          |
| --------------------- | :------: | :------------------------------------------------------------------- |
| options               |  object  | Optional parameters for printing the tree                            |
| options.showFunctions | boolean  | Determines whether or not functions in the tree should be displayed. |
| options.showValues    | boolean  | Determines whether or not values in the tree should be displayed.    |
| options.skipKeys      | string[] | Keys in the tree that should not be displayed.                       |

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- This project was heavily inspired by work done by @jakwings on [node-ternary-search-trie](https://github.com/jakwings/node-ternary-search-trie), but chose to implement the underlying functionality of the tree by making heavy use of recursion instead of loops.
- Also the printing functionality of the tree is a replica of [treeify](https://github.com/notatestuser/treeify) from @notatestuser, but implemented in TypeScript
