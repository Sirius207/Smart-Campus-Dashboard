import Packery from 'packery';
import Draggabilly from 'draggabilly';

(() => {
  // Make cards Draggable & display with masonry layout
  function initCardsLayout() {
    const cardsList = document.querySelector('.grid');
    const pckry = new Packery(cardsList, {
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
  initCardsLayout();
}
)();
