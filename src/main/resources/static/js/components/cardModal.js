import { createTicket, getTickets, updateTicket } from "../api/ticket.js";
import { getUserName } from "../api/user.js";
import { renderCards } from "./cards.js";



export function getButtonText(mode) {
  return {
    view: "Editar",
    edit: "Salvar",
    create: "Criar"
  }[mode];
}

export async function cardModal(card = null, mode = "view", onSaveCallback) {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  modalOverlay.innerHTML = `
    <div class="modal">
      <header class="modal-header">
        <h2>Detalhes do Card</h2>
      </header>
      <form id="cardForm">
        <div class="form-group">
          <label for="card-title">Título do card *</label>
          <input type="text" id="card-title" name="title" required />
        </div>
        <div class="form-group">
          <label for="card-description">Descrição *</label>
          <textarea id="card-description" name="description" rows="3" required></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="card-category">Categoria *</label>
            <select id="card-category" name="category" required>
              <option value="">Selecione</option>
              <option value="BUG">Bug</option>
              <option value="FEATURE">Melhoria</option>
              <option value="SUPORTE">Suporte</option>
            </select>
          </div>
          <div class="form-group">
            <label for="card-priority">Prioridade *</label>
            <select id="card-priority" name="priority" required>
              <option value="">Selecione</option>
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="card-responsable">Responsável *</label>
          <select id="card-responsable" name="responsable" required></select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="card-created">Criado em</label>
            <input type="date" id="card-created" name="created" disabled />
          </div>
          <div class="form-group">
            <label for="card-dueDate">Data de Vencimento *</label>
            <input type="date" id="card-dueDate" name="dueDate" required />
          </div>
        </div>
        <div class="form-group">
          <label for="card-author">Autor</label>
          <input type="text" id="card-author" name="author" disabled />
        </div>
        <div class="form-actions">
          <button type="button" id="actionBtn" class="edit-btn">${getButtonText(mode)}</button>
          <button type="button" id="cancelBtn" class="cancel-btn">${mode === "view" ? "Sair" : "Cancelar"}</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const form = modalOverlay.querySelector("#cardForm");
  const actionBtn = modalOverlay.querySelector("#actionBtn");
  const cancelBtn = modalOverlay.querySelector("#cancelBtn");
  const responsableSelect = modalOverlay.querySelector("#card-responsable");

  let users = [];

  try {
    users = await getUserName();
    responsableSelect.innerHTML = '<option value="">Selecione</option>';
    users.forEach(user => {
      const opt = document.createElement("option");
      opt.value = user.id;
      opt.textContent = user.name;
      responsableSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
    responsableSelect.innerHTML = '<option value="">Erro ao carregar usuários</option>';
  }

  function formatDateForInput(dateString) {
    if (!dateString) return "";

    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }

    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  if (card) {
    const responsableName = card.responsable || "";
    if (responsableName) {
      const matchedUser = users.find(u => u.name === responsableName);

      if (matchedUser) {
        responsableSelect.value = matchedUser.id;

      } else {
        const tempOption = document.createElement("option");
        tempOption.value = "temp";
        tempOption.textContent = responsableName;
        tempOption.selected = true;
        responsableSelect.appendChild(tempOption);
      }
    }

    const categorySelect = form.querySelector("#card-category");
    const prioritySelect = form.querySelector("#card-priority");
    categorySelect.value = card.category?.toUpperCase() || "";
    prioritySelect.value = card.priority?.toUpperCase() || "";

    form.querySelector("#card-title").value = card.title || "";
    form.querySelector("#card-description").value = card.description || "";

    form.querySelector("#card-created").value = formatDateForInput(card.createdOn);
    form.querySelector("#card-dueDate").value = formatDateForInput(card.dueDate);
    form.querySelector("#card-author").value = card.author || "";
  }

  let isEditing = mode === "edit" || mode === "create";

  form.querySelectorAll("input, textarea, select").forEach(el => {
    if (mode === "view") el.disabled = true;
    if (mode === "create") el.disabled = false;
  });

  if (mode === "create") {
    form.querySelector("#card-author").closest(".form-group").style.display = "none";
    form.querySelector("#card-created").closest(".form-group").style.display = "none";
    form.querySelector("#card-dueDate").closest(".form-group").style.display = "none";
  }

  actionBtn.addEventListener("click", async () => {
    if (!isEditing && mode === "view") {
      isEditing = true;
      mode = "edit";

      form.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
      actionBtn.textContent = getButtonText("edit");
      cancelBtn.textContent = "Cancelar";

      form.querySelector("#card-author").disabled = true;
      form.querySelector("#card-created").disabled = true;
      form.querySelector("#card-dueDate").disabled = true;

      return;
    }
    console.log(22, form.querySelector("#card-responsable").value)
    const payload = {
      title: form.querySelector("#card-title").value,
      description: form.querySelector("#card-description").value,
      category: form.querySelector("#card-category").value.toUpperCase(),
      priority: form.querySelector("#card-priority").value.toUpperCase(),
      createdOn: form.querySelector("#card-created").value,
      dueDate: form.querySelector("#card-dueDate").value,
      responsableUserId: form.querySelector("#card-responsable").value,
      authorId: 6,
    };

    try {
      let result;
      if (mode === "create") {
        result = await createTicket(payload);
        console.log("Ticket criado:", result);

      } else if (card && mode === "edit") {
        console.log("Atualizando ticket:", card.id, payload);
        result = await updateTicket(card.id, payload);

        const tickets = await getTickets();
        refresh(tickets)

        console.log("Ticket atualizado:", result);
      }
      
      modalOverlay.remove();
      if (typeof onSaveCallback === "function") {
        onSaveCallback();
      }

    } catch (err) {
      console.error("Erro ao salvar ticket:", err);
      alert("Erro ao salvar ticket");
    }
  });

 function refresh(tickets) {
    document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('cardsGrid');
    renderCards(container, tickets);
  })

 } 

  cancelBtn.addEventListener("click", () => modalOverlay.remove());
}
