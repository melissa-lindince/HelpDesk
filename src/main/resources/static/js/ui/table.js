import { getStatusTag, getCategoryTag, getPriorityTag } from "../utils/tags.js";
import { formatStatusLabel } from "../utils/format.js";
import { updateTicketStatus } from "../api/ticket.js";
import { cardModal } from "../components/edit-card.js";

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

export function renderTable(cards, tableBody, onStatusChange, updateResumo) {
  if (!cards || cards.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">Nenhum card encontrado com os filtros aplicados.</td></tr>';
    return;
  }

  tableBody.innerHTML = cards.map(createTableRow).join('');

  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => {
    const fresh = row.cloneNode(true);
    row.replaceWith(fresh);
  });

  const freshRows = tableBody.querySelectorAll('tr');
  freshRows.forEach(row => {
    row.addEventListener('click', (e) => {
      const id = row.dataset.id;
      const card = cards.find(c => c.id == id);
      if (card) {
        cardModal(card, "view");
      }
    });
  });

  const statusTags = tableBody.querySelectorAll('.status-tag');
  statusTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();

      const currentTag = e.currentTarget;
      const tr = currentTag.closest('tr');
      const cardId = parseInt(tr.dataset.id, 10);
      const currentStatus = currentTag.dataset.status;

      const select = document.createElement('select');
      select.classList.add('status-select');

      const options = [
        { value: 'em_andamento', label: 'Em andamento' },
        { value: 'pendente', label: 'Pendente' },
        { value: 'finalizado', label: 'Finalizado' }
      ];

      options.forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = opt.value;
        optionEl.textContent = opt.label;
        if (opt.value === currentStatus) optionEl.selected = true;
        select.appendChild(optionEl);
      });

      currentTag.replaceWith(select);
      select.focus();

      select.addEventListener('click', (ev) => ev.stopPropagation());

      select.addEventListener('change', async () => {
        const newStatus = select.value;
        const statusForBackend = newStatus.toLowerCase().replace(/ /g,'_');

        try {
          await updateTicketStatus(cardId, statusForBackend);

          if (typeof onStatusChange === 'function') {
            await onStatusChange(cardId, statusForBackend);
          }

          if (typeof updateResumo === 'function') updateResumo();

          renderTable(cards, tableBody, onStatusChange, updateResumo);
        } catch (err) {
          console.error('Erro ao atualizar status:', err);
          renderTable(cards, tableBody, onStatusChange, updateResumo);
        }

      });

      select.addEventListener('blur', () => {
        renderTable(cards, tableBody, onStatusChange, updateResumo);
      });
    });
  });
}
