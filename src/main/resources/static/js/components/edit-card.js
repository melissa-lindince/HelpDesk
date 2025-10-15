lucide.createIcons();

const modalOverlay = document.getElementById("modal-overlay");
const closeModal = document.getElementById("closeModal");
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const form = document.getElementById("cardForm");

// MOCK: dados de exemplo
const mockCard = {
  title: "Erro ao logar no sistema",
  description: "Usuário não consegue fazer login com credenciais válidas.",
  category: "Bug",
  priority: "Alta",
  responsible: "Larissa Faria",
  created: "11/10/2025",
  dueDate: "15/10/2025",
  author: "Fernanda Tisco"
};

// Preenche os campos com dados do card
function loadCardDetails() {
  for (const key in mockCard) {
    const field = document.getElementById(`card-${key}`);
    if (field) field.value = mockCard[key];
  }
}

// Permite edição e bloqueia ediçao de alguns campos
editBtn.addEventListener("click", () => {
  form.querySelectorAll("input, textarea, select").forEach(el => {
    if (
        el.id !== "card-author" &&
        el.id !== "card-created" &&
        el.id !== "card-dueDate"
      ) {
        el.disabled = false;
      }
  });
  editBtn.disabled = true;
  saveBtn.disabled = false;
 
});

// Salva alterações
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const updatedCard = {};
  form.querySelectorAll("input, textarea, select").forEach(el => {
    updatedCard[el.name] = el.value;
  });

  console.log("Card atualizado:", updatedCard);

  // Desabilita novamente
  form.querySelectorAll("input, textarea, select").forEach(el => el.disabled = true);
  saveBtn.disabled = true;
  editBtn.disabled = false;
  alert("Alterações salvas com sucesso!");
  window.location.href = "index.html";
});

// Fecha o modal
closeModal.addEventListener("click", () => {
    window.location.href = "index.html"
});

// Carrega dados ao abrir
window.addEventListener("DOMContentLoaded", loadCardDetails);
