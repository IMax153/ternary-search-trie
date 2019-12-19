/**
 * Represents a single node in the ternary search trie.
 */
export class Node<Value> {
  /**
   * The key assigned to the node.
   */
  public readonly key: string;

  /**
   * The value assigned to the node.
   */
  public value: Value | null;

  /**
   * The left child of the node. Has a key value
   * that is less than the key value of its parent.
   */
  public left: Node<Value> | null;

  /**
   * The middle child of the node. Has a key value
   * that is equivalent to the key value of its parent.
   */
  public middle: Node<Value> | null;

  /**
   * The right child of the node. Has a key value
   * that is greater than the key value of its parent.
   */
  public right: Node<Value> | null;

  /**
   * The parent of the node.
   */
  public parent: Node<Value> | null;

  public constructor(key: string, value: Value | null = null) {
    this.key = key;
    this.value = value;
    this.parent = null;
    this.left = null;
    this.middle = null;
    this.right = null;
  }
}
