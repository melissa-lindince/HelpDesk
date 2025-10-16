export function formatText(str) {
  if (!str) return "";
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function parseDate(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('/');
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

export function formatStatusLabel(status) {
  switch (status.toLowerCase()) {
    case 'em_andamento': return 'Em andamento';
    case 'pendente': return 'Pendente';
    case 'finalizado': return 'Finalizado';
    default: return status;
  }
}
