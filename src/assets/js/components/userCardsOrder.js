import defaultCardOrder from '../../data/cardOrder';

/**
 * Local Storage Access Method
 */

function setUserCardOrder(email, userOrder) {
  localStorage.setItem(`order/${email}`, JSON.stringify(userOrder));
}

export function getUserCardOrder(email) {
  const userOrder = localStorage.getItem(`order/${email}`);
  return JSON.parse(userOrder);
}

export function setDefaultUserCardOrder(email) {
  setUserCardOrder(email, defaultCardOrder);
}


/**
 * Append new card in user cards order
 *
 * @param   Object  newCard: e.g. { id: 1, size: 'large' },
 * @param   String  email: unique key of user card order
 */
export function addNewCard(newCard, email) {
  const currentOrder = getUserCardOrder(email);
  currentOrder.size[newCard.id] = newCard.size;
  currentOrder.usedID.push(newCard.id);
  setUserCardOrder(email, currentOrder);
}

export function removeCard(cardId, email) {
  const currentOrder = getUserCardOrder(email);
  const toRemovedCardIndex = currentOrder.usedID.indexOf(cardId);
  delete currentOrder.size(cardId);
  currentOrder.usedID.splice(toRemovedCardIndex, 1);
  setUserCardOrder(email, currentOrder);
}

export default function reOrderCards(cardOrder, email) {
  const currentOrder = getUserCardOrder(email);
  currentOrder.usedID = cardOrder;
  setUserCardOrder(email, currentOrder);
}
