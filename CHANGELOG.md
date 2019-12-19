# Release Notes

## 2.0.0

- Fixes `Trie.del(key)` to have the correct behavior when deleting nodes.
- Fixes `Trie.keys()` to return the list of keys that have been added to the `Trie`, not the list of keys for each individual `Node`.
- Adds `Trie.contains(key)` to allow for checking if a key exists in the `Trie`.
- Adds `Trie.keysWithPrefix(prefix)` to allow for obtaining the list of keys within the `Trie` that start with the specified prefix.
- Renames `Trie.traverse` to `Trie.dfs` to better indicate the algorithm used for traversing the `Trie`.
- Renames `Trie.searchByPrefix` to `Trie.searchWithPrefix`.
- Refactors `Trie.toString()` to use `util.inspect()`.
