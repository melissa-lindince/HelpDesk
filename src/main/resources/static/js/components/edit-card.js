import { formatText } from "../helpers/helpers.js";

lucide.createIcons();

export function getButtonText(mode) {
     const buttonsText = {
      view: "Editar",
      edit: "Salvar",
      create: "Criar"
    }

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
                <option value="MELHORIA">melhoria</option>
                <option value="DUVIDA">duvida</option>
                <option value="SUPORTE">suporte</option>
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

          <div class="form-row">
            <div class="form-group">
              <label for="card-responsible">Responsável *</label>
              <select id="card-responsible" name="responsible" required>
                <option value="">Selecione</option>
                <option value="Larissa Faria">Larissa Faria</option>
                <option value="João Silva">João Silva</option>
                <option value="Camila Rocha">Camila Rocha</option>
              </select>
            </div>
            <div class="form-group">
              <label for="card-created">Criado em *</label>
              <input type="text" id="card-created" name="created" required />
            </div>
          </div>

          <div class="form-group">
            <label for="card-dueDate">Data de Vencimento *</label>
            <input type="date" id="card-dueDate" name="dueDate" required />
          </div>

          <div class="form-group">
            <label for="card-author">Autor</label>
            <input type="text" id="card-author" name="author" />
          </div>

          <div class="form-actions">
            <button type="button" id="editBtn" class="edit-btn">${getButtonText(mode)}</button>
            <button type="submit" id="saveBtn" class="save-btn" disabled>Cancelar</button>
          </div>
        </form>
      </div>
    </div>  
    `;

    document.body.appendChild(modalOverlay);
    const form = modalOverlay.querySelector("#cardForm");

  if (card) {
    form.querySelector("#card-title").value = card.title || "";
    form.querySelector("#card-description").value = card.description || "";
    form.querySelector("#card-category").value = card.category || "";
    form.querySelector("#card-priority").value = card.priority || "";
    form.querySelector("#card-responsible").value = card.responsible || "";
    form.querySelector("#card-created").value = card.createdAt || "";
    form.querySelector("#card-dueDate").value = card.dueDate || "";
    form.querySelector("#card-author").value = card.author || "";
  }

    // modalOverlay.querySelector(".close-btn").addEventListener("click", () => {
    //     modalOverlay.remove();
    // });

    return modalOverlay;
}

