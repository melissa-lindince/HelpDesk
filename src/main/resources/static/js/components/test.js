import { createTicket } from "../api/ticket.js";
import { getUserName } from "../api/user.js";

const userName = async () => {
    try {
        const name = await getUserName();
        const select = document.getElementById('user-responsible')
        console.log(2222, name)

        select.innerHTML = '<option value="">Selecione um responsável</option>';       
        name.forEach(user => {
            const option = document.createElement('option') 
            option.value = user.id;
            option.textContent = user.name;
        select.appendChild(option)
        });

    }catch (error) {
        console.log(error);
    }

    
}

 export function cardModalTest() {

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
            <input type="text" id="card-title" name="title" required/>
          </div>

          <div class="form-group">
            <label for="card-description">Descrição *</label>
            <textarea id="card-description" name="description" rows="3" required ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="card-category">Categoria *</label>
              <select id="card-category" name="category" required >
                <option value="">Selecione</option>
                <option value="BUG">Bug</option>
                <option value="FEATURE">Melhoria</option>
                <option value="SUPORTE">Suporte</option>
              </select>
            </div>
            <div class="form-group">
              <label for="card-priority">Prioridade *</label>
              <select id="card-priority" name="priority" required >
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
              <select id="user-responsible" name="responsible" required >
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" id="editBtn" class="edit-btn">Criar</button>
            <button type="button" id="cancelBtn" class="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
    `;

    
    document.body.appendChild(modalOverlay);
        userName()
    const form = modalOverlay.querySelector("#cardForm");
        const editBtn = modalOverlay.querySelector("#editBtn");
        const cancelBtn = modalOverlay.querySelector("#cancelBtn");
    
        // if (card) {
        //     form.querySelector("#card-title").value = card.title;
        //     form.querySelector("#card-description").value = card.description;
        //     form.querySelector("#card-category").value = card.category;
        //     form.querySelector("#card-priority").value = card.priority;
        //     form.querySelector("#card-responsible").value = card.responsibleId;
        // }
    
    
        editBtn.addEventListener("click", async () => {

    
            const createdData = {
                title: form.querySelector("#card-title").value,
                description: form.querySelector("#card-description").value,
                category: form.querySelector("#card-category").value.toUpperCase(),
                priority: form.querySelector("#card-priority").value.toUpperCase(),
                responsableUserId: 1,
                authorId: 1,


            };
    
            try {
                const updatedTicket = await createTicket(createdData);
                console.log("Ticket criado:", updatedTicket);
    
    
                modalOverlay.remove();
            } catch (err) {
                console.error(err);
                alert("Erro ao criar o ticket");
            }
            
})


}
