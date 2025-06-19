document.addEventListener('DOMContentLoaded', () => {
    const atendimentoForm = document.querySelector('.atendimento form');
    const API_URL = 'http://localhost:8080/api';

    atendimentoForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;
        const tipoInteracao = 'suporte'; 
        const userToken = localStorage.getItem('userToken'); 
        const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

        const payloadEmail = loggedInUserEmail && loggedInUserEmail === email ? loggedInUserEmail : email;

        const novoPedidoSuporte = {
            nome: nome,
            email: payloadEmail, 
            mensagem: mensagem,
            tipo_interacao: tipoInteracao
            
        };

        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (userToken) {
                headers['Authorization'] = `Bearer ${userToken}`;
            }

            const response = await fetch(`${API_URL}/suporte`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(novoPedidoSuporte)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Erro ao enviar pedido de suporte para o servidor.');
            }

            const responseData = await response.json();
            console.log('Pedido de suporte enviado para o backend:', responseData);

            alert('Pedido de suporte enviado com sucesso!');
            atendimentoForm.reset();
        } catch (error) {
            console.error("Erro ao enviar pedido de suporte:", error);
            alert(`Ocorreu um erro ao enviar seu pedido de suporte: ${error.message}. Tente novamente.`);
        }
    });
});