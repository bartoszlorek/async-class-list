// @flow

const identity = a => a;
const requestFrame = window.requestAnimationFrame
  ? window.requestAnimationFrame
  : (fn: () => void): TimeoutID => setTimeout(fn, 16);

type ClassOperator = {
  addNames?: Array<string>,
  removeNames?: Array<string>,
  toggleNames?: Array<string>
};

class AsyncClassList {
  element: HTMLElement;
  stack: Array<ClassOperator>;

  constructor(element: HTMLElement): void {
    this.element = element;
    this.stack = [];
  }

  add(...classNames: Array<string>): AsyncClassList {
    this.stack.push({ addNames: classNames });
    this.resolve();
    return this;
  }

  remove(...classNames: Array<string>): AsyncClassList {
    this.stack.push({ removeNames: classNames });
    this.resolve();
    return this;
  }

  toggle(...classNames: Array<string>): AsyncClassList {
    this.stack.push({ toggleNames: classNames });
    this.resolve();
    return this;
  }

  set(addNames?: Array<string>, removeNames?: Array<string>): AsyncClassList {
    this.stack.push({ addNames, removeNames });
    this.resolve();
    return this;
  }

  apply({ addNames, removeNames, toggleNames }: ClassOperator): void {
    if (!this.element) {
      return;
    }
    if (addNames && addNames.length) {
      this.element.classList.add(...addNames);
    }
    if (removeNames && removeNames.length) {
      this.element.classList.remove(...removeNames);
    }
    if (toggleNames && toggleNames.length) {
      toggleNames.forEach(className => {
        this.element.classList.toggle(className);
      });
    }
  }

  resolve(): void {
    if (this.stack.length > 1) {
      return;
    }
    this.apply(this.stack[0]);
    requestFrame(() => {
      if (this.stack.length > 1) {
        this.stack.shift();
        this.stack.reverse();
        this.stack.reduce((fn, operator) => {
          return () => {
            this.apply(operator);
            requestFrame(fn);
          };
        }, identity)();
      }
      this.stack = [];
    });
  }
}

export default AsyncClassList;
