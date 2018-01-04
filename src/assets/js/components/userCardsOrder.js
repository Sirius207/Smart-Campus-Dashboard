import defaultCardOrder from '../../data/cardOrder';
import { getUserEmail } from './authComponents/auth';
/**
 * Local Storage Access Method
 */

function setUserCardOrder(userOrder) {
  const email = getUserEmail();
  localStorage.setItem(`order/${email}`, JSON.stringify(userOrder));
}

export function getUserCardOrder() {
  const email = getUserEmail();
  const userOrder = localStorage.getItem(`order/${email}`);
  return JSON.parse(userOrder);
}

export function setDefaultUserCardOrder() {
  setUserCardOrder(defaultCardOrder);
}

/**
 * Append new card in user cards order
 *
 * @param   Object  newCard: e.g. { id: 1, size: 'large' },
 */
export function addNewCard(newCard) {
  const currentOrder = getUserCardOrder();
  if (!currentOrder) { return; }
  currentOrder.size[newCard.id] = newCard.size;
  currentOrder.usedID.push(newCard.id);
  setUserCardOrder(currentOrder);
}

export function removeCard(cardId) {
  const currentOrder = getUserCardOrder();
  if (!currentOrder) { return; }
  const toRemovedCardIndex = currentOrder.usedID.indexOf(cardId);
  delete currentOrder.size[cardId];
  currentOrder.usedID.splice(toRemovedCardIndex, 1);
  setUserCardOrder(currentOrder);
}

export default function setNewCardOrder(cardOrder) {
  const currentOrder = getUserCardOrder();
  if (!currentOrder) { return; }
  currentOrder.usedID = cardOrder;
  setUserCardOrder(currentOrder);
}
