export function updateElementSummary(cards) {
    document.getElementById('total-cards').textContent = cards.length;
    document.getElementById('cards-pendentes').textContent = cards.filter(card => card.status == 'pendente').length;
    document.getElementById('cards-andamento').textContent = cards.filter(card => card.status == 'em_andamento').length;
    document.getElementById('cards-finalizados').textContent = cards.filter(card => card.status == 'finalizado').length;
}