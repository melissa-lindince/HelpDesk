export async function getTickets() {
    try {
        const response = await fetch('http://localhost:8080/tickets/all');
        if (!response.ok) throw new Error('Erro ao buscar cards');
        const data = await response.json();

        return data.map(ticket => ({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority,
            status: ticket.status.toLowerCase(),
            createdAt: new Date(ticket.createdAt).toLocaleString(),
            dueDate: ticket.dueDate ? new Date(ticket.dueDate).toLocaleString() : '-'
        }));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateTicketStatus(ticketId, newStatus) {
    try {
        const response = await fetch(`http://localhost:8080/tickets/${ticketId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus.toUpperCase() })
        });

        if (!response.ok) {
        const text = await response.text();
            throw new Error('Erro ao atualizar status');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar status');
    }
}

