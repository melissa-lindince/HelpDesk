export function getStatusText(status) {
    const statusMap = {
        pendente: "Pendente",
        em_andamento: "Em andamento",
        finalizado: "Concluído"
    };

    return statusMap[status];
}

export function createCard(card) {
    const statusClass = card.status.toLowerCase().replace(' ', '-');
    const priorityClass = card.priority.toLowerCase();

    const actionTextMap = {
        pendente: 'Iniciar',
        em_andamento: 'Finalizar',
        finalizado: 'Reabrir'
    };

    const actionButtonClass = card.status === 'finalizado' ? 'btn btn-outline' : 'btn btn-primary';

    return `
        <div class="card" data-id="${card.id}">
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
                    <span class="value-label">${card.createdAt}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Vencimento:</span>
                    <span class="value-label">${card.dueDate}</span>
                </div>
            </div>

            <div class="card-actions">
                <button class="btn btn-outline" onclick="handleAction(${card.id}, 'Ver Detalhes')">
                    Ver Detalhes
                </button>
                <button class="${actionButtonClass}" onclick="handleAction(${card.id}, '${actionTextMap[card.status]}')">
                    ${actionTextMap[card.status]}
                </button>
            </div>
        </div>
    `;
}

export function renderCards(container, cardsToRender) {
    container.innerHTML = cardsToRender.map(card => createCard(card)).join('');
}
