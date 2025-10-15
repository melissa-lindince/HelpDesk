import { fetchTickets, updateTicketStatus } from './api/api.js';
import { renderCards, formatText, getNextStatus } from './ui.js';

const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const statusFilter = document.getElementById('statusFilter');
const container = document.getElementById('cardsGrid');

let cards = [];
let filteredCards = [];

searchInput.addEventListener("input", filterCards);
priorityFilter.addEventListener('change', filterCards);
statusFilter.addEventListener('change', filterCards);

function filterCards() {
    const searchText = formatText(searchInput.value);
    const priority = priorityFilter.value;
    const status = statusFilter.value;

    filteredCards = cards.filter(card =>
        filterSearch(card.title, card.description, searchText) &&
        filterPriority(card.priority, priority) &&
        filterStatus(card.status, status)
    );

    renderCards(container, filteredCards);
}

function filterSearch(title, description, searchText) {
    if (!searchText) return true;
    return formatText(description).includes(searchText) || formatText(title).includes(searchText);
}

function filterPriority(cardPriority, filterValue) {
    if (!filterValue) return true;
    return cardPriority.toLowerCase() === filterValue.toLowerCase();
}

function filterStatus(cardStatus, filterValue) {
    if (!filterValue) return true;
    return cardStatus.toLowerCase() === filterValue.toLowerCase();
}

window.handleAction = async function(cardId, action) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    switch (action) {
        case "Finalizar":
        case "Iniciar":
        case "Reabrir":
            const nextStatus = getNextStatus(card.status);
            const updatedTicket = await updateTicketStatus(card.id, nextStatus);
            if (updatedTicket) {
                card.status = updatedTicket.status.toLowerCase();
                filterCards();
            }
            break;
        case "Ver Detalhes":
            alert(`Título: ${card.title} \n Descrição: ${card.description} \n ${card.id}`);
            break;
    }
};

(async function init() {
    try {
        cards = await fetchTickets();
        filteredCards = [...cards];
        renderCards(container, filteredCards);
    } catch {
        container.innerHTML = `<p>Erro ao carregar tickets.</p>`;
    }
})();
