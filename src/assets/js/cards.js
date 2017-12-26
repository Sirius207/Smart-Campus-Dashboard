import Packery from 'packery';
import Draggabilly from 'draggabilly';
import $ from 'jquery';
import cardsData from './list';

(() => {
  function cardTemplate(cardData) {
    const card = `<div class="card grid-item grid-item--${cardData.size.defaultSize}">
                    <div class="card-inner"><a href="${cardData.link}"><img src="${cardData.size[cardData.size.defaultSize]}"></a></div>
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
    const grid = new Packery(cardsList, {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true,
      gutter: 0,
    });

    // make cards draggable
    $('.grid').find('.grid-item').each((i, gridItem) => {
      const dragEvent = new Draggabilly(gridItem);
      // bind drag events to Grid
      grid.bindDraggabillyEvents(dragEvent);
    });
  }

  initCardsLayout();
}
)();

