import { getTickets } from "./api/ticket.js"
import { formatText } from "./utils/format.js";
import { updateElementSummary } from "./ui/update-summary.js";
import { setupCalendar } from "./ui/calendar.js";
import { renderTable } from "./ui/table.js";
import { filterCards } from "./utils/filter.js";
import { cardModal } from "./components/cardModal.js";

  const tableBody = document.querySelector(".table-section tbody");
  const statusFilter = document.getElementById('statusFilter');
  const searchInput = document.getElementById("filterInput");
  
  const btnDataVencimento = document.getElementById("btnDataVencimento");
  const calendarModal = document.getElementById("calendarModal");
  const closeCalendar = document.getElementById("closeCalendar");

  let cards = [];
  let filteredCards = [...cards];

  function applyFilters(startDate, endDate) {
  const filters = {
    searchText: formatText(searchInput.value),
    status: statusFilter.value,
    startDate,
    endDate
  };

  filteredCards = filterCards(cards, filters);
  renderTable(filteredCards, tableBody, () => updateElementSummary(filteredCards));
}

  const btnNewCard = document.getElementById("newCard")
  btnNewCard.addEventListener('click', () => {
    cardModal(null, "create", async () => {
      try {
        cards = await getTickets();        // pega tickets atualizados do banco
        filteredCards = [...cards];        // atualiza os filtros
        renderTable(filteredCards, tableBody, applyFilters);  // renderiza a tabela
        updateElementSummary(filteredCards); // atualiza resumo
      } catch (err) {
        console.error('Erro ao atualizar tickets:', err);
      }
    });
});

  searchInput.addEventListener("input", () => applyFilters());
  statusFilter.addEventListener("change", () => applyFilters());

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
    renderTable(filteredCards, tableBody, () => updateElementSummary(filteredCards));
  });

  setupCalendar(btnDataVencimento, calendarModal, closeCalendar, applyFilters);

  window.addEventListener('load', () => {
    const filterInputs = document.querySelectorAll('select, input[type="text"], input[type="search"]');
    filterInputs.forEach(input => {
      input.value = '';
    });
  });

  (async function init() {
      try {
          cards = await getTickets();
          filteredCards = [...cards];
          console.log(cards)
          filteredCards = [...cards];
          updateElementSummary(cards);
          renderTable(filteredCards, tableBody, applyFilters);
      } catch(error) {
          console.log(error)
      }
  })();




