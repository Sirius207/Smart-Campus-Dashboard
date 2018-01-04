import $ from 'jquery';
import cardsData from '../../data/cardsData';
import defaultCardOrder from '../../data/cardOrder';
import { getUserCardOrder } from './userCardsOrder';

function cardPoolItemTemplate(cardData) {
  const poolItem = `
                    <li class="pool-item">
                      <button data-id="${cardData.id}" class="btn btn--reset pool-btn">${cardData.title}</button>
                    </li>
                  `;
  return poolItem;
}

export default function addNewAddCardButton(cardID) {
  const newCardPoolItem = cardPoolItemTemplate(cardsData[cardID]);
  $('.cards-pool  ul').append(newCardPoolItem);
}

(() => {
  const userCardOrder = getUserCardOrder();
  const usedCardsID = (userCardOrder) ? userCardOrder.usedID : defaultCardOrder.usedID;

  function keepUnusedCard(cardData) {
    return !(usedCardsID.includes(cardData.id.toString()));
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
