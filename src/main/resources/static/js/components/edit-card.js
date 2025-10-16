import { updateTicket } from "../api/ticket.js";
import { renderCards } from "./cards.js";

lucide.createIcons();

export function getButtonText(mode) {
    const buttonsText = {
        view: "Editar",
        edit: "Salvar",
        create: "Criar"
    };
    return buttonsText[mode];
}

export function cardModal(card, mode) {
    const modalOverlay = document.createElement("div");

    modalOverlay.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal">
        <header class="modal-header">
          <h2>Detalhes do Card</h2>
        </header>

        <form id="cardForm">
          <div class="form-group">
            <label for="card-title">Título do card *</label>
            <input type="text" id="card-title" name="title" required disabled />
          </div>

          <div class="form-group">
            <label for="card-description">Descrição *</label>
            <textarea id="card-description" name="description" rows="3" required disabled></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="card-category">Categoria *</label>
              <select id="card-category" name="category" required disabled>
                <option value="">Selecione</option>
                <option value="BUG">Bug</option>
                <option value="FEATURE">Melhoria</option>
                <option value="SUPORTE">Suporte</option>
              </select>
            </div>
            <div class="form-group">
              <label for="card-priority">Prioridade *</label>
              <select id="card-priority" name="priority" required disabled>
                <option value="">Selecione</option>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="card-responsible">Responsável *</label>
              <select id="card-responsible" name="responsible" required disabled>
                <option value="">Selecione</option>
                <option value="1">Larissa Faria</option>
                <option value="2">João Silva</option>
                <option value="3">Camila Rocha</option>
              </select>
            </div>
            <div class="form-group">
              <label for="card-created">Criado em *</label>
              <input type="text" id="card-created" name="created" required disabled />
            </div>
          </div>

          <div class="form-group">
            <label for="card-dueDate">Data de Vencimento *</label>
            <input type="date" id="card-dueDate" name="dueDate" required disabled />
          </div>

          <div class="form-group">
            <label for="card-author">Autor</label>
            <input type="text" id="card-author" name="author" disabled />
          </div>

          <div class="form-actions">
            <button type="button" id="editBtn" class="edit-btn">${getButtonText(mode)}</button>
            <button type="button" id="cancelBtn" class="cancel-btn">
              ${mode !== "edit" && mode !== "create" ? "Sair" : "Cancelar"}
            </button>
          </div>
        </form>
      </div>
    </div>
    `;

    document.body.appendChild(modalOverlay);

    const form = modalOverlay.querySelector("#cardForm");
    const editBtn = modalOverlay.querySelector("#editBtn");
    const cancelBtn = modalOverlay.querySelector("#cancelBtn");

    if (card) {
        form.querySelector("#card-title").value = card.title || "";
        form.querySelector("#card-description").value = card.description || "";
        form.querySelector("#card-category").value = card.category || "";
        form.querySelector("#card-priority").value = card.priority || "";
        form.querySelector("#card-responsible").value = card.responsibleId || "";
        form.querySelector("#card-created").value = card.createdAt || "";
        form.querySelector("#card-dueDate").value = card.dueDate || "";
        form.querySelector("#card-author").value = card.author || "";
    }

    let isEditing = mode === "edit" || mode === "create";

    editBtn.addEventListener("click", async () => {
    if (!isEditing) {

        isEditing = true;
        form.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
        editBtn.textContent = getButtonText("edit");
        cancelBtn.textContent = "Cancelar";
    } else {

        const updatedData = {
            category: form.querySelector("#card-category").value.toUpperCase(),
            priority: form.querySelector("#card-priority").value.toUpperCase()
        };

        try {
            const updatedTicket = await updateTicket(card.id, updatedData);
            console.log("Ticket atualizado:", updatedTicket);

            const cardEl = document.querySelector(`.card[data-id="${card.id}"]`);
            if (cardEl) {

                const categoryEl = cardEl.querySelector(".card-category"); // ajusta a classe se tiver diferente
                const priorityEl = cardEl.querySelector(".priority-badge");
                if (categoryEl) categoryEl.textContent = updatedTicket.category;
                if (priorityEl) priorityEl.textContent = updatedTicket.priority;
            }

            modalOverlay.remove();
        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar o ticket");
        }
        
    }
});

    cancelBtn.addEventListener("click", () => {
        modalOverlay.remove();
    });

    return modalOverlay;
}
