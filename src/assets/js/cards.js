import Packery from 'packery';
import Draggabilly from 'draggabilly';
import $ from 'jquery';
import cardsData from './list';

(() => {
  function cardTemplate(cardData) {
    const card = `<div class="card grid-item grid-item--${cardData.size.defaultSize}">
                    <div class="card-inner"><a href="${cardData.link}"><img src="${cardData.size[cardData.size.defaultSize]}"></a></div>
                    <div class="card-removeBtn">X</div>
                  </div>`;
    return card;
  }

  function setAllCards(dataList) {
    return dataList.reduce((cardsDom, cardData) => {
      let currentDom = cardsDom;
      currentDom += cardTemplate(cardData);
      return currentDom;
    }, '');
  }

  // Make cards Draggable & display with masonry layout
  function initCardsLayout() {
    // render cards
    const cardsDom = setAllCards(cardsData);
    $('.grid').append(cardsDom);

    // reorder cards
    const cardsList = document.querySelector('.grid');
    const $grid = new Packery(cardsList, {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true,
      gutter: 0,
    });

    // bind card drag event
    $('.grid').find('.grid-item').each((i, gridItem) => {
      const dragEvent = new Draggabilly(gridItem);
      // bind drag events to Grid
      $grid.bindDraggabillyEvents(dragEvent);
    });

    // bind card remove event
    $('.grid').on('click', '.card-removeBtn', (event) => {
      // remove clicked element
      $grid.remove(event.target.parentNode);
      // shiftLayout remaining item elements
      $grid.shiftLayout();
    });
  }

  initCardsLayout();
}
)();

