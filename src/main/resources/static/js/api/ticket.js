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
            status: ticket.status.toLowerCase()
        }));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateTicketStatus(ticketId, newStatus) {
    try {
        const response = await fetch(`http://localhost:8080/tickets/status/${ticketId}`, {
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

export async function createTicket(ticketData) {
    try {
        const response = await fetch('http://localhost:8080/tickets/addTicket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Erro ao criar ticket: ' + errorText);
        }

        const ticket = await response.json();

        return {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority,
            status: ticket.status.toLowerCase(),
        };
    } catch (error) {
        console.error(error);
        alert('Erro ao criar ticket');
        throw error;
    }
}

export async function updateTicket(ticketId, updatedData) {
    try {
        const response = await fetch(`http://localhost:8080/tickets/${ticketId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Erro ao atualizar ticket: ' + errorText);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar ticket');
        throw error;
    }
}


