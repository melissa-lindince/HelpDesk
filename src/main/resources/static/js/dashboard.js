import { getTickets } from "./api/ticket.js"
import { cardModalTest } from "./components/test.js";
import { formatText } from "./utils/format.js";
import { updateElementSummary } from "./ui/update-summary.js";
import { setupCalendar } from "./ui/calendar.js";
import { renderTable } from "./ui/table.js";
import { filterCards } from "./utils/filter.js";

  const totalCards = document.getElementById('total-cards');
  const pendentes = document.getElementById('cards-pendentes');
  const andamento = document.getElementById('cards-andamento');
  const finalizados = document.getElementById('cards-finalizados');

  const tableBody = document.querySelector(".table-section tbody");
  const statusFilter = document.getElementById('statusFilter');
  const searchInput = document.getElementById("filterInput");
  
  const btnDataVencimento = document.getElementById("btnDataVencimento");
  const calendarModal = document.getElementById("calendarModal");
  const closeCalendar = document.getElementById("closeCalendar");

  let cards = [];
  let filteredCards = [...cards];

  const card = {
    title: "Erro ao logar no sistema",
    description: "Usuário não consegue fazer login com credenciais válidas.",
    category: "Bug",
    priority: "Alta",
    responsible: "Larissa Faria",
    created: "11/10/2025",
    dueDate: "15/10/2025",
    author: "Fernanda Tisco"
};

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
     cardModalTest(card, "create")

  })

  searchInput.addEventListener("input", () => applyFilters());
  statusFilter.addEventListener("change", () => applyFilters());

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
    renderTable(filteredCards, tableBody, () => updateElementSummary(filteredCards, totalCards, pendentes, andamento, finalizados));
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
          console.log(cards)
          filteredCards = [...cards];
          updateElementSummary(cards, totalCards, pendentes, andamento, finalizados);
          renderTable(cards, tableBody, () => updateElementSummary(cards, totalCards, pendentes, andamento, finalizados));
      } catch(error) {
          console.log(error)
      }
  })();




