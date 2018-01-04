import Packery from 'packery';
import Draggabilly from 'draggabilly';
import imagesLoaded from 'imagesloaded';
import $ from 'jquery';
import cardsData from '../../data/cardsData';
import userCardOrder from '../../data/cardOrder';
import drawVoteSvg, { setVoteData } from './cardVoteChart';

(() => {
  function cardTemplate(cardData, size = 'medium') {
    const imageTemplate = `
      <a href="${cardData.link}">
        <h2 class="card-title">${cardData.title}</h2>
        <img src="${cardData.size[size]}">
      </a>`;

    const chartTemplate = `
      <h1 align="right" class="chart-title--large"></h1>
      <h2 align="right" class="chart-title--small"></h2>
      <div
        questionId="${cardData.questionId}" id="vote">
      </div>`;

    const innerTemplate = (!cardData.type.localeCompare('vote')) ? chartTemplate : imageTemplate;

    return `
      <div class="card grid-item grid-item--${size}">
        <div class="card-inner">
          ${innerTemplate}
        </div>
        <div class="card-removeBtn">X</div>
      </div>`;
  }

  function setAllCardsDOM(cardOrderList) {
    return cardOrderList.reduce((cardsDom, cardData) => {
      let currentDom = cardsDom;
      currentDom += cardTemplate(cardsData[cardData.id], cardData.size);
      return currentDom;
    }, '');
  }

  function bindGridEvent($grid) {
    // bind card drag events to Grid
    function makeCardDraggable(grid, gridItem) {
      const dragEvent = new Draggabilly(gridItem);
      grid.bindDraggabillyEvents(dragEvent);
    }

    // bind drag event to each card
    $('.grid').find('.grid-item').each((i, gridItem) => {
      makeCardDraggable($grid, gridItem);
    });

    // bind remove event to each card
    $('.grid').on('click', '.card-removeBtn', (event) => {
      // remove clicked element
      $grid.remove(event.target.parentNode);
      // shiftLayout remaining item elements
      $grid.shiftLayout();
    });

    // bind add event to grid & addCard buttons
    $('.cards-pool').on('click', '.pool-btn', async (event) => {
      const cardID = event.target.dataset.id;
      const cardDOM = $(cardTemplate(cardsData[cardID]));
      // append new card to grid
      $('.grid').append(cardDOM);
      // get a node which is child of appended to .grid
      const cardElement = cardDOM.find('[id=vote]')[0];
      await setVoteData(cardElement);
      const newCard = $('.grid-item').last();
      $grid.appended(newCard);
      makeCardDraggable($grid, newCard[0]);
      // remove clicked button
      event.target.parentNode.remove();
    });
  }

  // Make cards Draggable & display with masonry layout
  async function initCardsLayout() {
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
    await drawVoteSvg();
    imagesLoaded(cardsList).on('progress', () => {
      $grid.layout();
    });
    bindGridEvent($grid);
    return $('[id=vote]');
  }

  $(document).ready(() => {
    initCardsLayout();
    // remove loader when loading complete
    $('.loader--cards').remove();
  });
})();
