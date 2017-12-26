import Packery from 'packery';
import Draggabilly from 'draggabilly';
import $ from 'jquery';
import cardsData from './list';


function cardTemplate(cardData) {
  const card = `<div class="card grid-item grid-item--${cardData.size}">
                  <div class="card-inner"><a href="${cardData.link}"><img src="${cardData.image}"></a></div>
                </div>`;
  return card;
}

function setCards(list) {
  return list.reduce((cardsDom, cardData) => {
    let currentDom = cardsDom;
    currentDom += cardTemplate(cardData);
    return currentDom;
  }, '');
}

(() => {
  // Make cards Draggable & display with masonry layout
  async function initCardsLayout() {
    function makeItemDraggable(itemElem) {
      // make element draggable with Draggabilly
      const draggie = new Draggabilly(itemElem);
      // bind Draggabilly events to Packery
      pckry.bindDraggabillyEvents(draggie);
    }

    // render cards
    const cardsDom = await setCards(cardsData);
    $('.grid').append(cardsDom);

    // order cards
    const cardsList = document.querySelector('.grid');
    const pckry = new Packery(cardsList, {
      itemSelector: '.grid-item',
      gutter: 0,
    });

    // bind draggabilly events to item elements
    pckry.items.forEach((item) => {
      makeItemDraggable(item.element);
    });
  }
  initCardsLayout();
}
)();

