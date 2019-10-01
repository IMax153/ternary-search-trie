import { PrintTree, PrintTreeOptions } from './print-tree';

/**
 * Represents a single node in the ternary search trie.
 */
class TrieNode<Value> {
  /**
   * The key of the node.
   */
  public readonly key: string;

  /**
   * The value of the node.
   */
  public value: Value | null;

  /**
   * The parent of the node.
   */
  public parent: TrieNode<Value> | null;

  /**
   * The left subtree. Has a lower key value.
   */
  public left: TrieNode<Value> | null;

  /**
   * The left subtree. Has an equivalent key value
   */
  public middle: TrieNode<Value> | null;

  /**
   * The left subtree. Has a higher key value.
   */
  public right: TrieNode<Value> | null;

  public constructor(key: string) {
    this.key = key;
    this.value = null;
    this.parent = null;
    this.left = null;
    this.middle = null;
    this.right = null;
  }

  /**
   * Determines if the node has a left child.
   */
  public hasLeftChild(): boolean {
    return !!this.left;
  }

  /**
   * Determines if the node has a middle child.
   */
  public hasMiddleChild(): boolean {
    return !!this.middle;
  }

  /**
   * Determines if the node has a right child.
   */
  public hasRightChild(): boolean {
    return !!this.right;
  }

  /**
   * Determines if the node is a parent for any subtrees.
   */
  public hasChildren(): boolean {
    return this.hasLeftChild() || this.hasMiddleChild() || this.hasRightChild();
  }
}

/**
 * Represents a ternary search trie.
 * https://en.wikipedia.org/wiki/Ternary_search_tree
 */
export class Trie<Value> {
  /**
   * The root node of the tree.
   */
  private root: TrieNode<Value> | null;

  /**
   * The number of nodes within the tree.
   */
  private nodeCount: number;

  /**
   * Gets the size of the tree in terms of the number of nodes present.
   */
  public get size(): number {
    return this.nodeCount;
  }

  public constructor() {
    this.root = null;
    this.nodeCount = 0;
  }

  /**
   * Gets all keys present in the tree.
   */
  public keys(): string[] {
    const found: string[] = [];

    this.traversal(this.root, node => {
      found.push(node.key);
    });

    return found;
  }

  /**
   * Creates a new node in the tree with the specified key and value.
   * @param {string} key - The key of the node.
   * @param {Value} value - The value of the node.
   */
  public set(key: string, value: Value): Trie<Value> {
    this.validateInput(key);

    if (!this.root) {
      this.root = new TrieNode<Value>([...key][0]);
    }

    this.insert(key, value, this.root);

    return this;
  }

  /**
   * Recursively searches the tree for the node with the specified key and returns its value, if possible.
   * @param {string} key - The key of the node.
   * @param {boolean} splay - // TODO: FIGURE THIS SHIT OUT
   */
  public get(key: string, splay?: boolean): Value | null {
    this.validateInput(key);
    const node = splay ? new TrieNode<Value>(key) : this.find(key, this.root);
    return node ? node.value : null;
  }

  /**
   * Deletes a node from the tree.
   * @param {string} key - The key of the node to delete.
   */
  public del(key: string): Trie<Value> {
    this.validateInput(key);

    const node = this.find(key, this.root);

    if (node) {
      node.value = null;
      this.delete(node);
      this.nodeCount--;
    }

    return this;
  }

  /**
   * Performs a depth-first traversal of the tree starting from the root node.
   * @param {function(TrieNode<Value>): void} callback - The callback to execute at each visited node.
   */
  public traverse(callback: (node: TrieNode<Value>) => void) {
    this.traversal(this.root, callback);
  }

  /**
   * Searches the tree using the specified prefix.
   * @param {string} prefix - The prefix to search by.
   * @param {(TrieNode<Value>): void} callback - The callback to execute at each visited node.
   */
  public searchByPrefix(
    prefix: string,
    callback: (prefix: string, root: TrieNode<Value>) => void,
  ): Trie<Value> {
    this.validateInput(prefix);

    const root = this.find(prefix, this.root);

    if (!root) return this;

    // If the node we are searching from has a value (i.e. there is a one letter word
    // beginning with the specified prefix), execute the callback
    if (root.value) callback(prefix, root);

    // All words should start with the root node found using the prefix
    let word = [root.key];

    // Traversal starts from the middle child - we only care about words that start with the specified prefix
    this.traversal(root.middle, node => {
      // Add each node's key found during the traversal to the word
      word.push(node.key);

      // If a value is found at a given node, execute the callback
      if (node.value) {
        callback(word.join(''), node);

        // If the found node has any children, the current letter must be popped off the stack
        if (node.hasChildren()) {
          word.pop();
        } else {
          // Otherwise we reset the word to the root prefix and allow traversal to continue
          word = [root.key];
        }
      }
    });

    return this;
  }

  /**
   * Creates a string representation of the tree.
   */
  public toString(options: PrintTreeOptions = {}): string {
    const treeify = PrintTree.create(this.root, options);
    return treeify.asTree();
  }

  /**
   * Recursively searches the tree for the node with the specified key and returns its value, if possible.
   * @param {string} word - The key of the node to find.
   * @param {TrieNode<Value>} root - The node to start the search from.
   */
  private find(word: string, node: TrieNode<Value> | null): TrieNode<Value> | null {
    const key = [...word][0];

    if (!node) return null;

    // Recurse down the left subtree
    if (key < node.key) {
      return this.find(word, node.left);
    }

    // Recurse down the middle subtree.
    if (key === node.key) {
      // If there are still characters in the key, move the search cursor forward by one.
      if (word.length > 1) {
        return this.find(word.slice(1), node.middle);
      }

      return node;
    }

    // Recurse down the right subtree
    return this.find(word, node.right);
  }

  /**
   * Recursively inserts a word into the tree. Each character in the word becomes a node in the tree.
   * The the specified value is set to the terminal node of the word.
   * @param {string} word - The word to insert.
   * @param {TrieNode<Value>} node - The node to insert.
   * @param {Value} value - The value for the node.
   */
  private insert(word: string, value: Value, node: TrieNode<Value> | null): TrieNode<Value> | null {
    const key = [...word][0];

    if (!key) return null;

    if (!node) {
      node = new TrieNode(key);
    }

    if (!this.root) {
      this.root = node;
      this.nodeCount++;
    }

    if (key < node.key) {
      node.left = this.insert(word, value, node.left);

      if (node.left) node.left.parent = node;
    } else if (key === node.key) {
      if (word.length > 1) {
        node.middle = this.insert(word.slice(1), value, node.middle);

        if (node.middle) node.middle.parent = node;
      } else {
        node.value = value;
        this.nodeCount++;
      }
    } else {
      node.right = this.insert(word, value, node.right);

      if (node.right) node.right.parent = node;
    }

    return node;
  }

  /**
   * Recursively deletes a node from the tree if the node has no left or right sub-tree.
   * @param {TrieNode<Value>} node - The node to delete.
   */
  private delete(node: TrieNode<Value>) {
    if (!node) return;

    const { parent, left, middle, right } = node;

    if (middle) return;

    const hasUnequalChildren = !!(left || right);

    if (!hasUnequalChildren) {
      if (parent) {
        this.erase(parent, node);
        this.delete(parent);
      } else {
        const child = left || right;
        this.root = child;
        if (this.root) this.root.parent = null;
      }
    }
  }

  /**
   * Validates input to the tree.
   * @param {string} input - The input value.
   */
  private validateInput(input: string) {
    if (typeof input !== 'string') {
      throw new TypeError(
        `[Trie] Only string values can be used as keys. Received type ${typeof input}.`,
      );
    }

    if (input.length < 1) {
      throw new Error(`[Trie] Key values must have length greater than or equal to 1.`);
    }
  }

  /**
   * Erases a node from the tree.
   * @param {TrieNode<Value>} node - The node to erase.
   * @param {TrieNode<Value>} parent - The parent of the node to erase.
   */
  private erase(node: TrieNode<Value>, parent: TrieNode<Value>) {
    node.parent = null;

    switch (node) {
      case parent.left:
        parent.left = null;
        break;

      case parent.middle:
        parent.middle = null;
        break;

      case parent.right:
        parent.right = null;
        break;

      default:
        break;
    }
  }

  /**
   * Performs a depth-first traversal of the tree.
   * @param {TrieNode<Value>} root - The node to start the traversal from.
   * @param {function(TrieNode<Value>): void} callback - The callback to execute at each visited node.
   */
  private traversal(root: TrieNode<Value> | null, callback: (node: TrieNode<Value>) => void): void {
    if (!root) return;

    callback(root);

    if (root.left) {
      this.traversal(root.left, callback);
    }

    if (root.middle) {
      this.traversal(root.middle, callback);
    }

    if (root.right) {
      this.traversal(root.right, callback);
    }
  }
}
