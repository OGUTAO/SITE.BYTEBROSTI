document.addEventListener('DOMContentLoaded', () => {
    const atendimentoForm = document.querySelector('.atendimento form');

    atendimentoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;
        const tipo = 'Suporte'; // Adicionando o tipo
        const problema = 'Pedido de Suporte (Formulário)'; // Problema padrão
        const detalhes = mensagem; // Usando a mensagem como detalhes
        const dataEnvio = new Date().toLocaleDateString();

        const novoPedidoSuporte = { nome, email, problema, detalhes, dataEnvio, tipo }; // Adicionando 'tipo' ao objeto

        const clienteEmailLogado = localStorage.getItem('loggedInUserEmail');

        if (clienteEmailLogado) {
            const chaveHistoricoCliente = `historico_${clienteEmailLogado.replace(/[^a-zA-Z0-9]/g, '')}`;
            const historicoExistente = JSON.parse(localStorage.getItem(chaveHistoricoCliente)) || [];

            historicoExistente.push(novoPedidoSuporte);
            localStorage.setItem(chaveHistoricoCliente, JSON.stringify(historicoExistente));

            // Salva o pedido de suporte na lista geral para o admin
            let pedidosSuporteAdmin = JSON.parse(localStorage.getItem('pedidosSuporte')) || [];
            pedidosSuporteAdmin.push(novoPedidoSuporte);
            localStorage.setItem('pedidosSuporte', JSON.stringify(pedidosSuporteAdmin));

            alert('Pedido de suporte enviado com sucesso!');
            atendimentoForm.reset(); // Limpa o formulário
        } else {
            alert('Você precisa estar logado para enviar uma mensagem de suporte.');
            // Opcional: Redirecionar para a página de login
            // window.location.href = 'login.html';
        }
    });
});