import { handleAction } from "../main.js";


export function getStatusText(status) {
    const statusMap = {
        pendente: "Pendente",
        em_andamento: "Em andamento",
        finalizado: "Concluído"
    };

    return statusMap[status];
}


export function createCard(card, cards) {
    const statusClass = card.status.toLowerCase().replace(' ', '-');
    const priorityClass = card.priority.toLowerCase();

    const actionTextMap = {
        pendente: 'Iniciar',
        em_andamento: 'Finalizar',
        finalizado: 'Reabrir'
    };

    const actionButtonClass = card.status === 'finalizado' ? 'btn btn-outline' : 'btn btn-primary';

    const cardHTML = document.createElement('div');
    cardHTML.className = 'card';
    cardHTML.dataset.id = card.id;

    cardHTML.innerHTML = `
        <div class="card-header">
            <div class="status-badge">
                <span class="status-icon ${statusClass}"></span>
                ${getStatusText(card.status)}
            </div>
            <span class="priority-badge ${priorityClass}">${card.priority}</span>
        </div>

        <h3 class="card-title">${card.title}</h3>
        <p class="card-description">${card.description}</p>

        <div class="card-details">
            <div class="detail-row">
                <span class="detail-label">Categoria:</span>
                <span class="category-tag">${card.category}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Criado em:</span>
                <span class="value-label">${card.createdOn}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Vencimento:</span>
                <span class="value-label">${card.dueDate}</span>
            </div>
        </div>

        <div class="card-actions">
            <button class="btn btn-outline details-btn">Ver Detalhes</button>
            <button class="${actionButtonClass} action-btn">${actionTextMap[card.status]}</button>
        </div>
    `;

    cardHTML.querySelector('.details-btn').addEventListener('click', () => handleAction(card.id, "Ver Detalhes", cards));
    cardHTML.querySelector('.action-btn').addEventListener('click', () => handleAction(card.id, actionTextMap[card.status], cards));

    return cardHTML;
}

export function renderCards(container, cardsToRender) {
    container.innerHTML = '';
    cardsToRender.forEach(card => container.appendChild(createCard(card, cardsToRender)));
}
