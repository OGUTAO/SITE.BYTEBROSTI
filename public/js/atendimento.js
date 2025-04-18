document.addEventListener('DOMContentLoaded', () => {
    const atendimentoForm = document.querySelector('.atendimento form');

    atendimentoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;
        const problema = 'Pedido de Suporte (Formulário)'; // Problema padrão
        const detalhes = mensagem; // Usando a mensagem como detalhes
        const dataEnvio = new Date().toLocaleString();

        const novoPedidoSuporte = { nome, email, problema, detalhes, dataEnvio };

        let pedidosSuporte = localStorage.getItem('pedidosSuporte');
        pedidosSuporte = pedidosSuporte ? JSON.parse(pedidosSuporte) : [];
        pedidosSuporte.push(novoPedidoSuporte);
        localStorage.setItem('pedidosSuporte', JSON.stringify(pedidosSuporte));

        alert('Pedido de suporte enviado com sucesso!');
        atendimentoForm.reset(); // Limpa o formulário
    });
});