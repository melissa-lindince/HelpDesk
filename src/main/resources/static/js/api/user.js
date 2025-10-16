export async function getUserName() {
    try {
        const response = await fetch('http://localhost:8080/users');
        if (!response.ok) throw new Error('Erro ao buscar nomes dos usuários');
        const data = await response.json();

        return data.map(user => ({
            id: user.id,
            name: user.name
        }));
    } catch (error) {
        console.error(error);
        throw error;
    }
}