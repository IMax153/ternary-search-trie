/**
 * Optional parameters for printing the tree.
 * @typedef {Object} TreePrinterOptions
 * @param {boolean} [showFunctions=false] - Determines whether or not functions should be displayed.
 * @param {boolean} [showValues=false] - Determines whether or not values should be displayed.
 * @param {string[]} [skipKeys] - Keys that should not be displayed.
 */
export interface TreePrinterOptions {
  showFunctions?: boolean;
  showValues?: boolean;
  skipKeys?: string[];
}

/**
 * A class that handles printing of trees in an easy-to-read format.
 */
export class TreePrinter<T extends Record<string, any>> {
  /**
   *
   * @param {T} tree - The tree to print.
   * @param {TreePrinterOptions} options - Optional parameters for printing the tree.
   */
  public static create<T>(tree: T, options: TreePrinterOptions): TreePrinter<T> {
    return new TreePrinter(tree, options);
  }

  /**
   * The tree that will be printed.
   */
  private obj: T;

  /**
   * Determines whether or not functions should be displayed.
   */
  private showFunctions: boolean;

  /**
   * Determines whether or not values should be displayed.
   */
  private showValues: boolean;

  /**
   * Keys that should not be displayed.
   */
  private skipKeys: string[];

  private constructor(
    obj: T,
    { showFunctions = false, showValues = false, skipKeys = [] }: TreePrinterOptions,
  ) {
    this.obj = obj;
    this.showFunctions = showFunctions;
    this.showValues = showValues;
    this.skipKeys = skipKeys;
  }

  /**
   * Gets a string representation of the entire object as a tree line-by-line and passes each line to the specified callback function.
   * @param {(line: string) => void} lineCallback - The callback that will be fired with each line.
   */
  public asLines(lineCallback: (line: string) => void): void {
    this.growBranch(
      '.',
      this.obj,
      false,
      [],
      this.showValues,
      this.showFunctions,
      this.skipKeys,
      lineCallback,
    );
  }

  /**
   * Gets a string representation of the entire object as a tree with line breaks.
   */
  public asTree(): string {
    let tree = '';

    this.growBranch(
      '.',
      this.obj,
      false,
      [],
      this.showValues,
      this.showFunctions,
      this.skipKeys,
      line => {
        tree += `${line}\n`;
      },
    );

    return tree;
  }

  /**
   * Creates a prefix for the tree branch.
   * @param hasKey - Determines if there is a key.
   * @param isTerminal - Determines if this is a terminal key.
   */
  private makePrefix(hasKey: boolean, isTerminal: boolean) {
    const str = isTerminal ? '└' : '├';
    return hasKey ? str.concat('─ ') : str.concat('──┐');
  }

  /**
   * Filters the keys of the specified object.
   * @param obj - The object whose keys to filter.
   * @param hideFunctions - Determines if functions should be displayed.
   * @param skipKeys - Determins which keys to skip.
   */
  private filterKeys(obj: T, hideFunctions: boolean, skipKeys: string[]): string[] {
    const keys: string[] = [];

    if (!obj) return keys;

    Object.keys(obj).forEach((branch: string) => {
      let isFunction = false;

      // Only display values that are not in the Object prototype chain
      const hasProp = Object.prototype.hasOwnProperty.call(obj, branch);

      if (hasProp) {
        isFunction = typeof obj[branch] === 'function';
      }

      // Determine if the current item should be shown
      const shouldDisplay = !skipKeys.some(key => key === branch) || !(hideFunctions && isFunction);

      if (hasProp || shouldDisplay) {
        keys.push(branch);
      }
    });

    return keys;
  }

  /**
   * Recursively grows a branch in the tree until all subtrees are resolved.
   * @param {string} key - The key of the branch.
   * @param {Object} root - The root of the branch.
   * @param {boolean} isTerminal - Determines if the branch is terminal.
   * @param {(T,boolean)[]} lastStates - The previous branches states.
   * @param {boolean} showValues - Determines if values should be displayed.
   * @param {boolean} hideFunctions - Determines if values should be displayed.
   * @param {string[]} skipKeys - Which keys should be hidden if any.
   * @param {(key: string) => void} callback - Callback with the current key value.
   */
  private growBranch(
    key: keyof T,
    root: T,
    isTerminal: boolean,
    lastStates: [T, boolean][],
    showValues: boolean,
    hideFunctions: boolean,
    skipKeys: string[],
    callback: (line: string) => void,
  ) {
    let line = '';
    let index = 0;
    let lastKey = false;
    let circular = false;
    const lastStatesCopy = lastStates.slice(0);

    if (lastStatesCopy.push([root, isTerminal]) && lastStates.length > 0) {
      // Based on the `isTerminal` state of whatever we're nested within,
      // we need to append either blankness or a branch to our line
      lastStates.forEach((lastState, idx) => {
        if (idx > 0) {
          line += `${lastState[1] ? ' ' : '│'}  `;
        }

        if (!circular && lastState[0] === root) {
          circular = true;
        }
      });

      // The generated prefix varies based on whether the key contains something to show and
      // whether we're dealing with the last element in this collection
      line += this.makePrefix(!!key, isTerminal) + key;

      if (showValues && (typeof root !== 'object' || root instanceof Date)) {
        line += `: ${root}`;
      }

      if (circular) {
        line += ' (circular ref.)';
      }

      callback(line);
    }

    // Can we descend into the next item?
    if (!circular && typeof root === 'object') {
      const keys = this.filterKeys(root, hideFunctions, skipKeys);

      keys.forEach(branch => {
        // The last key is always printed with a different prefix, so we'll need to know if we have it
        lastKey = ++index === keys.length;

        this.growBranch(
          branch,
          root[branch],
          lastKey,
          lastStatesCopy,
          showValues,
          hideFunctions,
          skipKeys,
          callback,
        );
      });
    }
  }
}
