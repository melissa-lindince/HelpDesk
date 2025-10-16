export function updateElementSummary(cards, totalCards, pendentes, andamento, finalizados) {
    totalCards.textContent = cards.length;
    pendentes.textContent = cards.filter(card => card.status == 'pendente').length;
    andamento.textContent = cards.filter(card => card.status == 'em_andamento').length;
    finalizados.textContent = cards.filter(card => card.status == 'finalizado').length;
}