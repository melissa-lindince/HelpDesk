import { formatText, parseDate } from "./format.js";

export function filterCards(cards, filters) {
  const { searchText, status, startDate, endDate } = filters;

  let filtered = [...cards];

  if (startDate && endDate) {
    filtered = filtered.filter(card => {
      const cardDate = parseDate(card.dueDate);
      return cardDate >= startDate && cardDate <= endDate;
    });
  }

  if (status) {
    filtered = filtered.filter(card =>
      formatText(card.status) === formatText(status)
    );
  }

  if (searchText) {
    filtered = filtered.filter(card =>
      formatText(card.title).includes(searchText) ||
      formatText(card.description).includes(searchText)
    );
  }

  return filtered;
}
