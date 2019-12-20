import { inspect } from 'util';

import { Node } from './node';

/**
 * Represents a ternary search trie.
 * https://en.wikipedia.org/wiki/Ternary_search_tree
 */
export class Trie<Value> {
  /**
   * The root node of the tree.
   */
  private root: Node<Value> | null;

  /**
   * The number of nodes within the tree.
   */
  private count: number;

  public constructor() {
    this.root = null;
    this.count = 0;
  }

  /**
   * Returns true if the tree contains any nodes, otherwise false.
   */
  public get isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Returns the number of words that have been inserted into the tree.
   */
  public get size(): number {
    return this.count;
  }

  /**
   * Adds the specified key/value pair to the tree.
   * @param key The key to add.
   * @param value The value of the key.
   */
  public set(key: string, value: Value): this {
    this.validateKey(key);

    this.insert(this.root, key, value);

    return this;
  }

  /**
   * Returns the value of the node with the specified key.
   * @param key The key of the node.
   */
  public get(key: string): Value | null {
    this.validateKey(key);

    const node = this.find(key, this.root);

    return node?.value ?? null;
  }

  /**
   * Deletes the node with the specified key.
   * @param key The key of the node to delete.
   */
  public del(key: string): this {
    const node = this.find(key, this.root);

    if (node) {
      node.value = null;
      this.delete(node);
    }

    return this;
  }

  /**
   * Checks if a node with the specified key exists in the tree.
   * @param key The key of the node to check.
   */
  public contains(key: string): boolean {
    return this.keys().includes(key);
  }

  /**
   * Returns an array of all keys present in the tree.
   */
  public keys(): string[] {
    const keys: string[] = [];

    this.getKeyValuePairs(this.root, '', word => keys.push(word));

    return keys;
  }

  /**
   * Returns all keys present in the tree that begin with the specified prefix.
   * @param prefix The key prefix to search by.
   */
  public keysWithPrefix(prefix: string): string[] {
    const keys: string[] = [];

    const start = this.find(prefix, this.root);
    if (start) this.getKeyValuePairs(start.middle, prefix, word => keys.push(word));

    return keys;
  }

  /**
   * Executes the specified callback at each node in the tree whose key begins with the specified prefix.
   * @param prefix The key prefix to search by.
   * @param callback The callback to execute.
   */
  public searchWithPrefix(prefix: string, callback: (key: string, value: Value) => void): void {
    const start = this.find(prefix, this.root);
    if (start) this.getKeyValuePairs(start.middle, prefix, callback);
  }

  /**
   * Performs a depth-first search of the tree beginning from the root node. Executes the specified callback at each visited node.
   * @param callback The callback to execute.
   */
  public dfs(callback: (key: string, value: Value | null) => void): void {
    this.depthFirstSearch(this.root, callback);
  }

  /**
   * Returns the tree as a string.
   */
  public toString(): string {
    return inspect(this.root, { showHidden: false, depth: null });
  }

  private insert(node: Node<Value> | null, word: string, value: Value): Node<Value> {
    // Respect astral / 32bit / surrogate Unicode characters
    // See https://stackoverflow.com/questions/21397316/split-javascript-string-into-array-of-codepoints-taking-into-account-surrogat
    const key = [...word][0];

    // Create a new node if the input node is null
    if (!node) {
      node = new Node(key);
    }

    // If the root is null then the tree is empty
    if (!this.root) {
      this.root = node;
    }

    // Recurse Left
    if (key < node.key) {
      node.left = this.insert(node.left, word, value);
      node.left.parent = node;
      // Recurse Right
    } else if (key > node.key) {
      node.right = this.insert(node.right, word, value);
      node.right.parent = node;
      // Recurse Middle
    } else if (word.length > 1) {
      node.middle = this.insert(node.middle, word.slice(1), value);
      node.middle.parent = node;
      // End of input
    } else {
      node.value = value;
      this.count += 1;
    }

    return node;
  }

  private find(word: string, node: Node<Value> | null): Node<Value> | null {
    if (!node) return null;

    const key = [...word][0];

    // Recurse Left
    if (key < node.key) {
      return this.find(word, node.left);
      // Recurse Right
    } else if (key > node.key) {
      return this.find(word, node.right);
      // Recurse Middle
    } else if (word.length > 1) {
      return this.find(word.slice(1), node.middle);
      // End of input
    } else {
      return node;
    }
  }

  private delete(node: Node<Value> | null): void {
    if (!node) return;

    if (node.middle) {
      return;
    } else if (!node.middle && !node.left && !node.right && node.value) {
      return;
    } else if (!node.middle && !node.left && !node.right) {
      if (!node.parent) {
        this.root = null;
      } else if (node.parent.left === node) {
        node.parent.left = null;
      } else if (node.parent.middle === node) {
        node.parent.middle = null;
      } else if (node.parent.right === node) {
        node.parent.right = null;
      }

      this.delete(node.parent);
    } else if ((!node.left && !node.middle) || (!node.right && !node.middle)) {
      const child = (node.left || node.right) as Node<Value>;

      if (!node.parent) {
        this.root = child;
      } else if (node.parent.left === node) {
        node.parent.left = child;
      } else if (node.parent.middle === node) {
        node.parent.middle = child;
      } else if (node.parent.right === node) {
        node.parent.right = child;
      }

      child.parent = node.parent;
    } else if (node.right && node.left && !node.middle) {
      let child = node.left;

      while (child.right) {
        child = child.right;
      }

      if (node.left !== child) {
        if (child.parent) {
          child.parent.right = child.left;

          if (child.left) {
            child.left.parent = child.parent;
          }
        }

        child.right = node.right;
        child.left = node.left;
        node.right.parent = child;
        node.left.parent = child;
      } else {
        child.right = node.right;
        child.right.parent = child;
      }

      child.parent = node.parent;

      if (!node.parent) {
        this.root = child;
      } else {
        if (node.parent.left === node) {
          node.parent.left = child;
          child.parent = node.parent;
        } else if (node.parent.middle === node) {
          node.parent.middle = child;
          child.parent = node.parent;
        } else if (node.parent.right === node) {
          node.parent.right = child;
          child.parent = node.parent;
        }
      }
    }
  }

  private getKeyValuePairs(
    node: Node<Value> | null,
    prefix: string,
    callback: (key: string, value: Value) => void,
  ) {
    if (!node) return;

    if (node.value) callback(prefix + node.key, node.value);

    this.getKeyValuePairs(node.left, prefix, callback);
    this.getKeyValuePairs(node.middle, prefix + node.key, callback);
    this.getKeyValuePairs(node.right, prefix, callback);
  }

  private depthFirstSearch(
    node: Node<Value> | null,
    callback: (key: string, value: Value | null) => void,
  ): void {
    if (!node) return;

    callback(node.key, node.value);

    // Left
    if (node.left) {
      this.depthFirstSearch(node.left, callback);
    }

    // Middle
    if (node.middle) {
      this.depthFirstSearch(node.middle, callback);
    }

    // Right
    if (node.right) {
      this.depthFirstSearch(node.right, callback);
    }
  }

  private validateKey(key: string): void {
    if (typeof key !== 'string') {
      throw new TypeError(
        `[Trie] Only string values can be used as keys. Received type ${typeof key}.`,
      );
    }

    if (key.length < 1) {
      throw new Error(`[Trie] Key values must have length greater than or equal to 1.`);
    }
  }
}
