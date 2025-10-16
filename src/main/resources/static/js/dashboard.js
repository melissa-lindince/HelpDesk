import { getTickets, updateTicketStatus } from "./api/ticket.js"
import { cardModal } from "./components/edit-card.js";
import { cardModalTest } from "./components/test.js";
import { formatText, parseDate, formatStatusLabel } from "./utils/format.js";
import { getStatusTag, getCategoryTag, getPriorityTag } from "./utils/tags.js";
import { updateElementSummary } from "./ui/update-summary.js";
import { setupCalendar } from "./ui/calendar.js";
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

    renderTable(filtered);
  }

  //cria a tabela principal pegando as tags
  function createTableRow(card) {
    return `
      <tr data-id="${card.id}">
        <td><strong>${card.title}</strong><p>${card.description.substring(0, 50)}...</p></td>
        <td><span class="tag ${getCategoryTag(card.category)}">${card.category}</span></td>
        <td><span class="tag ${getPriorityTag(card.priority)}">${card.priority}</span></td>
        <td>
          <div class="status-wrapper">
            <span class="tag ${getStatusTag(card.status)} status-tag" data-status="${card.status}">
              ${formatStatusLabel(card.status)} <span class="status-arrow">▾</span>
            </span>
            <select class="status-select" style="display:none;">
              <option value="em_andamento" ${card.status === 'em_andamento' ? 'selected' : ''}>Em andamento</option>
              <option value="pendente" ${card.status === 'pendente' ? 'selected' : ''}>Pendente</option>
              <option value="finalizado" ${card.status === 'finalizado' ? 'selected' : ''}>Finalizado</option>
            </select>
          </div>
        </td>
        <td>${card.responsable}</td>
        <td>${card.createdOn}</td>
        <td>${card.dueDate}</td>
      </tr>`;
  }

  function renderTable(data = cards) {
    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7">Nenhum card encontrado com os filtros aplicados.</td></tr>';
      return;
    }

    // 1) Renderiza a tabela
    tableBody.innerHTML = data.map(createTableRow).join('');

    // 2) Torna cada linha clicável (abre detalhes)
    const rows = document.querySelectorAll('.table-section tbody tr');
    rows.forEach(row => {
      // remove listeners duplicados (se houver) antes de adicionar
      row.replaceWith(row.cloneNode(true));
    });
    // re-seleciona depois do clone
    const freshRows = document.querySelectorAll('.table-section tbody tr');
    freshRows.forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.id;
        const card = cards.find(c => c.id == id);
        if (card) {
          cardModal(card, "view"); 
        }
      });
    });

    // 3) Adiciona evento de clique em cada status (depois de configurar as linhas)
    const statusTags = document.querySelectorAll('.status-tag');
    statusTags.forEach(tag => {
      tag.addEventListener('click', (e) => {
        // impede que o clique no status dispare o clique da linha
        e.stopPropagation();

        const currentTag = e.currentTarget;
        const tr = currentTag.closest('tr');
        const cardId = parseInt(tr.dataset.id, 10);
        const currentStatus = currentTag.dataset.status;

        // Cria o select de status
        const select = document.createElement('select');
        select.classList.add('status-select');
        const options = [
          { value: 'em_andamento', label: 'Em andamento' },
          { value: 'pendente', label: 'Pendente' },
          { value: 'finalizado', label: 'Finalizado' }
        ];

        options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          if (opt.value === currentStatus) option.selected = true;
          select.appendChild(option);
        });

        // Substitui o span pelo select
        currentTag.replaceWith(select);
        select.focus();

        // Evita que cliques dentro do select subam para a linha
        select.addEventListener('click', (ev) => ev.stopPropagation());

        // Ao mudar o valor, atualiza no mock (ou chame a API aqui)
        select.addEventListener('change', async () => {
          const newStatus = select.value;
          const cardIndex = cards.findIndex(c => c.id === cardId);
          if (cardIndex !== -1) {
                const statusForBackend = newStatus.toLowerCase().replace(/ /g, '_');

                // 2. Atualiza o array local
                cards[cardIndex].status = statusForBackend;

                // 3. Chama a API para atualizar o status no banco de dados
                // Esta linha agora chama a função que você forneceu
                await updateTicketStatus(cardId, statusForBackend);

                // 4. Re-renderiza o front e atualiza o resumo
                updateElementSummary(cards, totalCards, pendentes, andamento, finalizados);
                renderTable();
          }
        });

        // Se perder o foco sem mudar, volta ao original
        select.addEventListener('blur', () => {
          renderTable();
        });
      });
    });
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
    renderTable();
  });

  setupCalendar(btnDataVencimento, calendarModal, closeCalendar, filterCards);

  (async function init() {
      try {
          cards = await getTickets();
          console.log(cards)
          filteredCards = [...cards];
          updateElementSummary(cards, totalCards, pendentes, andamento, finalizados);
          renderTable(cards)
      } catch(error) {
          console.log(error)
      }
  })();




