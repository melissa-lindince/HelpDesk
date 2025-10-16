import { getTickets, updateTicketStatus } from "./api/ticket.js"
import { cardModal } from "./components/edit-card.js";
import { cardModalTest } from "./components/test.js";
import { formatText, parseDate } from "./utils/format.js";
import { updateElementSummary } from "./ui/update-summary.js";
import { setupCalendar } from "./ui/calendar.js";
import { renderTable } from "./ui/table.js";

// variaveis
  let cards = [];
  let filteredCards = [...cards];
  let selectedStartDate = null;
  let selectedEndDate = null;

  //=======================================================
  //elementos do resumo
  const totalCards = document.getElementById('total-cards');
  const pendentes = document.getElementById('cards-pendentes');
  const andamento = document.getElementById('cards-andamento');
  const finalizados = document.getElementById('cards-finalizados');

  //elementos da tabela
  const tableBody = document.querySelector(".table-section tbody");
  const statusFilter = document.getElementById('statusFilter');
  const searchInput = document.getElementById("filterInput");

  //elemento do calendario:
  const btnDataVencimento = document.getElementById("btnDataVencimento");
  const calendarModal = document.getElementById("calendarModal");
  const closeCalendar = document.getElementById("closeCalendar");

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

  const btnNewCard = document.getElementById("newCard")
  btnNewCard.addEventListener('click', () => {
     cardModalTest(card, "create")

  })

  function filterCards() {
    const searchText = formatText(searchInput.value) || "";
    const status = statusFilter.value;
    const hasDateFilter = selectedStartDate && selectedEndDate;

    let filtered = [...cards];

    if (hasDateFilter) {
      filtered = cards.filter(card => {
        const cardDate = parseDate(card.dueDate);
        return cardDate >= selectedStartDate && cardDate <= selectedEndDate;
      });
    } else if (status) {
      filtered = cards.filter(card => formatText(card.status) === formatText(status));
    } else if (searchText) {
      filtered = cards.filter(card =>
        formatText(card.title).includes(searchText) ||
        formatText(card.description).includes(searchText)
      );
    }

    renderTable(filteredCards, tableBody, () => updateElementSummary(filteredCards))
  }

  // EVENTOS DE FILTRO
  searchInput.addEventListener("input", filterCards);
  statusFilter.addEventListener("change", filterCards);

  document.addEventListener('click', (e) => {
    if (calendarModal.style.display === 'block' && !calendarModal.contains(e.target) && e.target !== btnDataVencimento) {
      calendarModal.style.display = 'none';
    }
  });

  //icones lucide
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
    renderTable(filteredCards, tableBody, () => updateElementSummary(filteredCards, totalCards, pendentes, andamento, finalizados));
  });

  setupCalendar(btnDataVencimento, calendarModal, closeCalendar, filterCards);

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




