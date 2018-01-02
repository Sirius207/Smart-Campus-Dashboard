import Packery from 'packery';
import Draggabilly from 'draggabilly';
import $ from 'jquery';
import Chart from 'chart.js';
import cardsData from '../../data/cardsData';
import userCardOrder from '../../data/cardOrder';
import defaultChartConfig from '../../data/chartConfig';

(() => {
  function cardTemplate(cardData, size = 'medium') {
    if (!cardData.type.localeCompare('vote')) {
      const card = `<div class="card grid-item grid-item--${size}">
                      <canvas id="${cardData.questionId}" width="400" height="400"
                        href="${cardData.link}">
                      </canvas>
                      <div class="card-removeBtn">X</div>
                    </div>`;
      return card;
    }
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
    return $('canvas');
  }

  $(document).ready(() => {
    $.when(initCardsLayout()).done((p) => {
      $.each(p, (i, e) => {
        $.get(`${e.getAttribute('href')}${e.getAttribute('id')}/statistics`, (getData) => {
          // parse the array
          const dataLabels = [];
          const count = [];
          getData.option.forEach((element) => {
            dataLabels.push(element.label);
            count.push(element.count);
          });
          // combine the config
          const dataset = {
            datasets: [
              Object.assign({
                data: count,
              }, defaultChartConfig)],
            labels: dataLabels,
          };

          const voteChart = new Chart(e, {
            type: 'doughnut',
            data: dataset,
            options: {
              // navigate to the vote page
              onClick: () => {
                window.location.href =
                  `${e.getAttribute('href')}${localStorage.getItem('userName')}${e.getAttribute('id')}/statistics`;
              },
            },
          });
          return voteChart;
        });
      });
    });
    // remove loader when loading complete
    $('.loader').remove();
  });
})();
