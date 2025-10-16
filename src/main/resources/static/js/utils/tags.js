export function getStatusTag(status) {
  switch (status.toLowerCase()) {
    case 'em_andamento': return 'em_andamento';
    case 'finalizado': return 'finalizado';
    case 'pendente': return 'pendente';
    default: return '';
  }
}

export function getCategoryTag(category) {
  switch (category.toLowerCase()) {
    case 'bug': return 'bug';
    case 'feature': return 'melhoria';
    case 'suporte': return 'suporte';
    case 'duvida': return 'duvida';
    default: return '';
  }
}

export function getPriorityTag(priority) {
  switch (priority.toLowerCase()) {
    case 'alta': return 'alta';
    case 'media': return 'média';
    case 'baixa': return 'baixa';
    default: return '';
  }
}