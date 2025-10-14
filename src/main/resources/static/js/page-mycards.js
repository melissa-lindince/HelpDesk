const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const statusFilter = document.getElementById('statusFilter');
const container = document.getElementById('cardsGrid');

searchInput.addEventListener("input", filterCards);
priorityFilter.addEventListener('change', filterCards);
statusFilter.addEventListener('change', filterCards);

const cards = [
    {
        id: 1,
        status: 'andamento',
        priority: 'Alta',
        title: 'Erro no sistema de login',
        description: 'Usuários não conseguem fazer login após atualização. Esse erro...',
        category: 'Bug',
        createdAt: '10/01/2025, 10:30',
        dueDate: '10/02/2025, 10:30',
    },
    {
        id: 2,
        status: 'pendente',
        priority: 'Média',
        title: 'Melhorar performance do dashboard',
        description: 'Dashboard está lento ao carregar muitos dados. Necessário...',
        category: 'Melhoria',
        createdAt: '10/01/2025, 10:30',
        dueDate: '10/06/2025, 10:30',
    },
    {
        id: 5,
        status: 'concluido',
        priority: 'Baixa',
        title: 'Criar paginação da tabela de dashboard',
        description: 'Muitos dados estão sendo trazidos e deixando a página com...',
        category: 'Melhoria',
        createdAt: '10/01/2025, 10:30',
        dueDate: '10/06/2025, 10:30',
    }
];

let filteredCards = [...cards];

function getStatusText(status) {
    const statusMap = {
        pendente: "Pendente",
        andamento: "Em andamento",
        concluido: "Concluído",
    };
    return statusMap[status];
}

function getNextStatus(currentStatus) {
    const statusFlow = {
        pendente: 'andamento',
        andamento: 'concluido',
        concluido: 'pendente'
    };
    return statusFlow[currentStatus];
}

function createCard(card) {
    const statusClass = card.status.toLowerCase().replace(' ', '-');
    const priorityClass = card.priority.toLowerCase();

    const actionTextMap = {
        pendente: 'Iniciar',
        andamento: 'Finalizar',
        concluido: 'Reabrir'
    };

    const actionButtonClass = card.status === 'concluido' ? 'btn btn-outline' : 'btn btn-primary';
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

function renderCards(cardsToRender) {
    container.innerHTML = cardsToRender.map(card => createCard(card)).join('');
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

function filterCards() {
    const searchText = formatText(searchInput.value);
    const priority = priorityFilter.value;
    const status = statusFilter.value;

    filteredCards = cards.filter(card =>
        filterSearch(card.title, card.description, searchText) &&
        filterPriority(card.priority, priority) &&
        filterStatus(card.status, status)
    );

    renderCards(filteredCards);
}

function handleAction(cardId, action) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    switch (action) {
        case "Finalizar":
        case "Iniciar":
        case "Reabrir":
            card.status = getNextStatus(card.status);
            filterCards();
            break;
        case "Ver Detalhes":
            alert(`testandoooooooooo"`);
            break;
    }
}

function formatText(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

renderCards(filteredCards);
