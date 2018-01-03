import Packery from 'packery';
import Draggabilly from 'draggabilly';
import $ from 'jquery';
import cardsData from '../../data/cardsData';
import userCardOrder from '../../data/cardOrder';

(() => {
  function cardTemplate(cardData, size = 'medium') {
    const imageTemplate = `
      <a href="${cardData.link}">
        <img src="${cardData.size[size]}">
      </a>`;

    const chartTemplate = `
      <h1 align="right" class="chart-title--large"></h1>
      <h2 align="right" class="chart-title--small"></h2>
        <div tag="${cardData.questionId}" id="vote" href="${cardData.link}">
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

  function setAllCardsDOM(dataList) {
    return dataList.reduce((cardsDom, cardData) => {
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
    $('.cards-pool').on('click', '.pool-btn', (event) => {
      const cardID = event.target.dataset.id;
      const cardDOM = $(cardTemplate(cardsData[cardID]));
      // append new card to grid
      $('.grid').append(cardDOM);
      // get a node which is child of appended to .grid
      const cardElement = cardDOM.find('[id=vote]');
      $.get(`${cardElement.attr('href')}${cardElement.attr('tag')}/statistics`, (getData) => {
        // already from vendors import Morris
        const voteChart = new Morris.Donut({
          element: cardElement,
          data: getData.option,
        });
        // get the previous node (title)
        const headerSmall = cardElement.prev().text(`${getData.title}`);
        headerSmall.prev().text(`${getData.question}`);
        cardElement.on('click', () => {
          const userData = JSON.parse(localStorage.getItem('userData'));
          window.location.href = (!userData.email || userData.email.length === 0) ? '#' :
            `${cardElement.attr('href')}${userData.email}/${cardElement.attr('tag')}`;
        });
        return voteChart;
      });
      const newCard = $('.grid-item').last();
      $grid.appended(newCard);
      makeCardDraggable($grid, newCard[0]);
      // remove clicked button
      event.target.parentNode.remove();
    });
  }

  // Make cards Draggable & display with masonry layout
  function initCardsLayout() {
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
    bindGridEvent($grid);
    return $('[id=vote]');
  }

  $(document).ready(() => {
    $.when(initCardsLayout()).done((p) => {
      $.each(p, (i, cardDOM) => {
        $.get(`${cardDOM.getAttribute('href')}${cardDOM.getAttribute('tag')}/statistics`, (getData) => {
          // already from vendors import Morris
          const voteChart = new Morris.Donut({
            element: cardDOM,
            data: getData.option,
          });
          const headerSmall = cardDOM.previousElementSibling;
          const headerLarger = headerSmall.previousElementSibling;
          headerLarger.innerText = `${getData.title}`;
          headerSmall.innerText = `${getData.question}`;
          cardDOM.addEventListener('click', () => {
            const userData = JSON.parse(localStorage.getItem('userData'));
            window.location.href = (!userData.email || userData.email.length === 0) ? '#' :
              `${cardDOM.getAttribute('href')}${userData.email}/${cardDOM.getAttribute('tag')}`;
          });
          return voteChart;
        });
      });
    });
    // remove loader when loading complete
    $('.loader').remove();
  });
})();
