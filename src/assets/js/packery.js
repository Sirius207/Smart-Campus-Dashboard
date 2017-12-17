import Packery from 'packery';
import Draggabilly from 'draggabilly';

(() => {
  const elem = document.querySelector('.grid');
  const pckry = new Packery(elem, {
    // options
    itemSelector: '.grid-item',
    gutter: 0,
  });

  function makeItemDraggable(itemElem) {
    // make element draggable with Draggabilly
    const draggie = new Draggabilly(itemElem);
    // bind Draggabilly events to Packery
    pckry.bindDraggabillyEvents(draggie);
  }

  // bind draggabilly events to item elements
  pckry.items.forEach((item) => {
    makeItemDraggable(item.element);
  });
}
)();
