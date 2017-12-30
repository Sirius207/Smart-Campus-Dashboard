import Packery from 'packery';
import Draggabilly from 'draggabilly';
import $ from 'jquery';
import cardsData from './data/cardsData';
import userCardOrder from './data/cardOrder';

(() => {
  function cardTemplate(cardData, size = 'medium') {
    const card = `<div class="card grid-item grid-item--${size}">
                    <div class="card-inner">
                      <a href="${cardData.link}">
                        <img src="${cardData.size[size]}">
                      </a>
                    </div>
                    <div class="card-removeBtn">X</div>
                  </div>`;
    return card;
  }

  function setAllCardsDOM(dataList) {
    return dataList.reduce((cardsDom, cardData) => {
      let currentDom = cardsDom;
      currentDom += cardTemplate(cardsData[cardData.id], cardData.size);
      return currentDom;
    }, '');
  }

  // Make cards Draggable & display with masonry layout
  function initCardsLayout() {
    // bind card drag events to Grid
    function makeCardDraggable(grid, gridItem) {
      const dragEvent = new Draggabilly(gridItem);
      grid.bindDraggabillyEvents(dragEvent);
    }

    // render cards
    const cardsDom = setAllCardsDOM(userCardOrder.order);
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
      makeCardDraggable($grid, gridItem);
    });

    // bind card remove event
    $('.grid').on('click', '.card-removeBtn', (event) => {
      // remove clicked element
      $grid.remove(event.target.parentNode);
      // shiftLayout remaining item elements
      $grid.shiftLayout();
    });

    // bind card add event
    $('.cards-pool').on('click', '.pool-btn', (event) => {
      const cardID = event.target.dataset.id;
      const cardDOM = cardTemplate(cardsData[cardID]);
      // append new card to grid
      $('.grid').append(cardDOM);
      const newCard = $('.grid-item').last();
      $grid.appended(newCard);
      makeCardDraggable($grid, newCard[0]);
      // remove clicked button
      event.target.parentNode.remove();
    });
  }

  $(document).ready(() => {
    initCardsLayout();
    // remove loader when loading complete
    $('.loader').remove();
  });
})();
