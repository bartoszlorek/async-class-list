import './__mocks__/raf';
import AsyncClassList from './AsyncClassList';

jest.useFakeTimers();

function mockDom() {
  const $element = global.document.createElement('div');

  $element.classList.add('js-element');
  $element.textContent = 'text';
  global.document.body.innerHTML = '';
  global.document.body.appendChild($element);
}

describe('AsyncClassList()', () => {
  beforeEach(mockDom);

  it('handle falsy element', async () => {
    const falsy = new AsyncClassList(null);

    expect(() => {
      falsy.add('no-error');
    }).not.toThrow();
  });

  it('adds new class to the element', () => {
    const $element = global.document.querySelector('.js-element');
    const elemClass = new AsyncClassList($element);

    elemClass.add('first');
    expect($element.classList.contains('first')).toBe(true);
  });

  it('adds multiple classes to the element', () => {
    const $element = global.document.querySelector('.js-element');
    const elemClass = new AsyncClassList($element);

    elemClass.add('first', 'second');
    expect($element.classList.contains('first')).toBe(true);
    expect($element.classList.contains('second')).toBe(true);
  });

  it('adds one class after another', () => {
    const $element = global.document.querySelector('.js-element');
    const elemClass = new AsyncClassList($element);

    elemClass.add('first').add('second');

    expect($element.classList.contains('first')).toBe(true);
    expect($element.classList.contains('second')).toBe(false);

    jest.runTimersToTime(100);
    expect($element.classList.contains('second')).toBe(true);
  });

  it('removes class from the element', () => {
    const $element = global.document.querySelector('.js-element');
    const elemClass = new AsyncClassList($element);

    $element.classList.add('first');
    expect($element.classList.contains('first')).toBe(true);

    elemClass.remove('first');
    expect($element.classList.contains('first')).toBe(false);
  });

  it('removes multiple classes from the element', () => {
    const $element = global.document.querySelector('.js-element');
    const elemClass = new AsyncClassList($element);

    $element.classList.add('first', 'second');
    expect($element.classList.contains('first')).toBe(true);
    expect($element.classList.contains('second')).toBe(true);

    elemClass.remove('first', 'second');
    expect($element.classList.contains('first')).toBe(false);
    expect($element.classList.contains('second')).toBe(false);
  });

  it('adds and removes classes in one query', () => {
    const $element = global.document.querySelector('.js-element');
    const elemClass = new AsyncClassList($element);

    $element.classList.add('first');
    expect($element.classList.contains('first')).toBe(true);
    expect($element.classList.contains('second')).toBe(false);

    elemClass.set(['second'], ['first']);
    expect($element.classList.contains('first')).toBe(false);
    expect($element.classList.contains('second')).toBe(true);
  });

  it('toggles multiple classes of given element', () => {
    const $element = global.document.querySelector('.js-element');
    const elemClass = new AsyncClassList($element);

    $element.classList.add('first');
    expect($element.classList.contains('first')).toBe(true);
    expect($element.classList.contains('second')).toBe(false);

    elemClass.toggle('first', 'second');
    expect($element.classList.contains('first')).toBe(false);
    expect($element.classList.contains('second')).toBe(true);
  });
});
