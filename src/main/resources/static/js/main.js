import { getTickets, updateTicketStatus } from './api/ticket.js';
import { formatText } from './helpers/helpers.js';
import { renderCards } from './components/cards.js';
import { cardModal } from './components/edit-card.js';

const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const statusFilter = document.getElementById('statusFilter');
const container = document.getElementById('cardsGrid');

let cards = [];
let filteredCards = [];

searchInput.addEventListener("input", filterCards);
priorityFilter.addEventListener('change', filterCards);
statusFilter.addEventListener('change', filterCards);


export function getNextStatus(currentStatus) {
    const statusFlow = {
        pendente: 'em_andamento',
        em_andamento: 'finalizado',
        finalizado: 'pendente' };

    return statusFlow[currentStatus];
}

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

export async function updateCardStatus(card,action, refreshCallback) {
    const nextStatus = getNextStatus(card.status);
    const updatedTicket = await updateTicketStatus(card.id, nextStatus);
    if (updatedTicket) {
        card.status = updatedTicket.status.toLowerCase();
        filterCards()
    }
}

export function openCardModal(card = null, mode = "view") {
    cardModal(card, mode);
}

export async function handleAction(cardId, action, cards) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    
    switch (action) {
        case "Finalizar":
        case "Iniciar":
        case "Reabrir":
            await updateCardStatus(card, action, filterCards);
            break;
        case "Ver Detalhes":
            openCardModal(card, "view");
            break;
        case "Editar":
            openCardModal(card, "edit");
            break;
        case "Criar":
            openCardModal(null, "create");
            break;
    }
}

(async function init() {
    try {
        cards = await getTickets();
        console.log(cards, 33)
        filteredCards = [...cards];
        renderCards(container, filteredCards);
    } catch {
        container.innerHTML = `<p>Erro ao carregar tickets.</p>`;
    }
})();
