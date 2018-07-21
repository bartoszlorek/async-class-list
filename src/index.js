// @flow

import AsyncClassList from './AsyncClassList';

const animating = 'box--animating';
const bottom = 'box--bottom';
const center = 'box--center';
const top = 'box--top';

const box = document.querySelector('.js-box');
const boxClass = new AsyncClassList(box);

boxClass
  .add(bottom)
  .add(animating, center)
  .remove(bottom);

setTimeout(() => {
  boxClass
    .remove(animating, center)
    .add(top)
    .add(animating, center)
    .remove(top);
}, 2000);
