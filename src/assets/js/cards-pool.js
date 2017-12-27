import $ from 'jquery';
import cardsData from './data/cardsData';
import cardOrder from './data/cardOrder';

(() => {
  const usedCardsID = cardOrder.usedID;

  function cardPoolItemTemplate(cardData) {
    const poolItem = `
                      <li class="pool-item">
                        <button data-id="${cardData.id}" class="btn btn--reset pool-btn">${cardData.title}</button>
                      </li>
                    `;
    return poolItem;
  }

  function keepUnusedCard(cardData) {
    return !(usedCardsID.includes(cardData.id));
  }

  function setCardsPoolDOM() {
    return Object.values(cardsData)
      .filter(keepUnusedCard)
      .reduce((poolsDOM, cardData) => {
        let currentDom = poolsDOM;
        currentDom += cardPoolItemTemplate(cardData);
        return currentDom;
      }, '');
  }

  function renderCardsPool() {
    const cardsPoolDOM = setCardsPoolDOM();
    $('.cards-pool  ul').append(cardsPoolDOM);
  }

  renderCardsPool();
})();
