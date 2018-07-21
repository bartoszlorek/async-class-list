// @flow

const identity = a => a;
const requestFrame = window.requestAnimationFrame
  ? window.requestAnimationFrame
  : (fn: () => void): TimeoutID => setTimeout(fn, 16);

type ClassState = {
  addNames?: Array<string>,
  removeNames?: Array<string>
};

class AsyncClassList {
  element: ?HTMLElement;
  stack: Array<ClassState>;

  constructor(element: ?HTMLElement): void {
    this.element = element;
    this.stack = [];
  }

  add(...classNames: Array<string>): AsyncClassList {
    this.stack.push({ addNames: classNames, removeNames: [] });
    this.resolve();
    console.log(this.stack);
    return this;
  }

  remove(...classNames: Array<string>): AsyncClassList {
    this.stack.push({ addNames: [], removeNames: classNames });
    this.resolve();
    return this;
  }

  set(addNames?: Array<string>, removeNames?: Array<string>): AsyncClassList {
    this.stack.push({ addNames, removeNames });
    this.resolve();
    return this;
  }

  setState({ addNames, removeNames }: ClassState): AsyncClassList {
    if (this.element) {
      if (addNames && addNames.length) {
        this.element.classList.add(...addNames);
      }
      if (removeNames && removeNames.length) {
        this.element.classList.remove(...removeNames);
      }
    }
    return this;
  }

  resolve(): AsyncClassList {
    if (this.stack.length > 1) {
      return this;
    }
    this.setState(this.stack[0]);
    requestFrame(() => {
      this.stack.shift();
      this.stack.reverse();
      this.stack.reduce((fn, state) => {
        return () => {
          requestFrame(() => fn());
          this.setState(state);
        };
      }, identity)();
      this.stack = [];
    });

    return this;
  }
}

export default AsyncClassList;
