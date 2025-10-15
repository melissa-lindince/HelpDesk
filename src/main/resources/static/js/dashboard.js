import { getTickets } from "./api/ticket.js"

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

  function formatText(str) {
    if (!str) return "";
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  //pega as informações dos cards e adiciona nas tags, verificar se tá escrito igual ao que vem do BD::
  function getStatusTag(status) {
    switch(status.toLowerCase()) {
      case 'em_andamento': return 'em_andamento';
      case 'finalizado': return 'finalizado';
      case 'pendente': return 'pendente';
      default: return '';
    }
  }

  function getCategoryTag(category) {
    switch(category.toLowerCase()) {
      case 'bug': return 'bug';
      case 'feature': return 'melhoria';
      case 'suporte': return 'suporte';
      case 'duvida': return 'duvida';
      default: return '';
    }
  }

  function getPriorityTag(priority) {
    switch(priority.toLowerCase()) {
      case 'alta': return 'alta';
      case 'media': return 'média';
      case 'baixa': return 'baixa';
      default: return '';
    }
  }

  function parseDate(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  //filtra o card por data ou status
  function filterCards() {
    const searchText = formatText(searchInput.value);
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
              ${card.status} <span class="status-arrow">▾</span>
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
        localStorage.setItem('cardsMock', JSON.stringify(cards));
        window.location.href = `edit-card.html?id=${id}`;
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
        const options = ['Em andamento', 'Pendente', 'Finalizado'];

        options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (opt === currentStatus) option.selected = true;
          select.appendChild(option);
        });

        // Substitui o span pelo select
        currentTag.replaceWith(select);
        select.focus();

        // Evita que cliques dentro do select subam para a linha
        select.addEventListener('click', (ev) => ev.stopPropagation());

        // Ao mudar o valor, atualiza no mock (ou chame a API aqui)
        select.addEventListener('change', () => {
          const newStatus = select.value;
          const cardIndex = cards.findIndex(c => c.id === cardId);
          if (cardIndex !== -1) {
            // atualiza no array local
            cards[cardIndex].status = newStatus;

            // por enquanto, só re-renderiza o front
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

  // Lógicas do modal de calendário
  btnDataVencimento.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarModal.style.display = calendarModal.style.display === 'block' ? 'none' : 'block';
  });

  closeCalendar.addEventListener('click', () => {
    const startValue = document.getElementById('startDate').value;
    const endValue = document.getElementById('endDate').value;

    selectedStartDate = startValue ? new Date(startValue) : null;
    selectedEndDate = endValue ? new Date(endValue) : null;

    if (selectedStartDate && selectedEndDate) {
      btnDataVencimento.textContent = `De ${startValue.split('-').reverse().join('/')} até ${endValue.split('-').reverse().join('/')}`;
    } else {
      btnDataVencimento.textContent = "Data de vencimento";
    }

    calendarModal.style.display = 'none';
    filterCards();
  });

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

  //eventos de status na tabela :
  document.addEventListener('click', function(e) {
    // Se clicar em uma tag de status
    if (e.target.closest('.status-tag')) {
      const wrapper = e.target.closest('.status-wrapper');
      const select = wrapper.querySelector('.status-select');

      // Alterna a exibição do select
      select.style.display = select.style.display === 'none' ? 'inline-block' : 'none';
      wrapper.querySelector('.status-tag').classList.toggle('open');
    }
  });

  // Ao alterar o select, atualiza o status
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('status-select')) {
      const select = e.target;
      const wrapper = select.closest('.status-wrapper');
      const tag = wrapper.querySelector('.status-tag');

      const value = select.value;
      tag.textContent = select.options[select.selectedIndex].text + ' ▾';

      // Atualiza cor dinamicamente
      tag.className = 'tag ' + value + ' status-tag';
      select.style.display = 'none';
      tag.classList.remove('open');
    }
  });

  //update resumos
  function updateResumo(){
    totalCards.textContent = cards.length;
    pendentes.textContent = cards.filter(card => card.status == 'pendente').length;
    andamento.textContent = cards.filter(card => card.status == 'em_andamento').length;
    finalizados.textContent = cards.filter(card => card.status == 'finalizado').length;
  }

  (async function init() {
      try {
          cards = await getTickets();
          console.log(cards)
          filteredCards = [...cards];
          updateResumo();
          renderTable(cards)
      } catch(error) {
          console.log(error)
      }
  })();




