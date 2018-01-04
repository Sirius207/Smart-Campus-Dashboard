import Packery from 'packery';
import Draggabilly from 'draggabilly';
import imagesLoaded from 'imagesloaded';
import $ from 'jquery';
import cardsData from '../../data/cardsData';
import defaultCardOrder from '../../data/cardOrder';
import drawVoteSvg, { setVoteData } from './cardVoteChart';
import setNewCardOrder, { getUserCardOrder, addNewCard, removeCard } from './userCardsOrder';

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
      <div class="card grid-item grid-item--${size}" data-card-id=${cardData.id}>
        <div class="card-inner">
          ${innerTemplate}
        </div>
        <div class="card-removeBtn">X</div>
      </div>`;
  }

  function setAllCardsDOM(cardOrderList) {
    return cardOrderList.usedID.reduce((cardsDom, cardID) => {
      let currentDom = cardsDom;
      currentDom += cardTemplate(cardsData[cardID], cardOrderList.size[cardID]);
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
      // save in user card order
      const cardID = event.target.parentNode.dataset.cardId;
      removeCard(cardID);
    });

    // bind add event to grid & addCard buttons
    $('.cards-pool').on('click', '.pool-btn', async (event) => {
      const cardID = event.target.dataset.id;
      const cardSize = cardsData[cardID].defaultSize;
      const cardDOM = $(cardTemplate(cardsData[cardID], cardSize));
      // append new card to grid
      $('.grid').append(cardDOM);
      // get a node which is child of appended to .grid
      const cardElement = cardDOM.find('[id=vote]')[0];
      if (cardElement) {
        await setVoteData(cardElement);
      }
      // save in user card order
      const newCardData = { id: cardID, size: cardSize };
      addNewCard(newCardData);
      // bind drag event
      const newCard = $('.grid-item').last();
      $grid.appended(newCard);
      makeCardDraggable($grid, newCard[0]);
      // remove clicked button
      event.target.parentNode.remove();
    });
  }

  async function renderCards() {
    const userCardOrder = getUserCardOrder();
    const cardOrder = userCardOrder || defaultCardOrder;
    const cardsDom = setAllCardsDOM(cardOrder);
    $('.grid').append(cardsDom);
  }

  // Make cards Draggable & display with masonry layout
  async function initCardsLayout() {
    await renderCards();

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
