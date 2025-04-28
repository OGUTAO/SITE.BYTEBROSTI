document.addEventListener('DOMContentLoaded', () => {
    const faleConoscoForm = document.querySelector('.fale-conosco form');

    faleConoscoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;
        const tipo = 'Contato'; // Adicionando o tipo
        const assunto = 'Mensagem do Fale Conosco'; // Assunto padrão
        const dataEnvio = new Date().toLocaleDateString();

        const novaMensagem = { nome, email, assunto, mensagem, dataEnvio, tipo }; // Adicionando 'tipo' ao objeto

        const clienteEmailLogado = localStorage.getItem('loggedInUserEmail');

        if (clienteEmailLogado) {
            const chaveHistoricoCliente = `historico_${clienteEmailLogado.replace(/[^a-zA-Z0-9]/g, '')}`;
            const historicoExistente = JSON.parse(localStorage.getItem(chaveHistoricoCliente)) || [];

            historicoExistente.push(novaMensagem);
            localStorage.setItem(chaveHistoricoCliente, JSON.stringify(historicoExistente));

            // Salva a mensagem na lista geral para o admin
            let mensagensFaleConoscoAdmin = JSON.parse(localStorage.getItem('mensagensFaleConosco')) || [];
            mensagensFaleConoscoAdmin.push(novaMensagem);
            localStorage.setItem('mensagensFaleConosco', JSON.stringify(mensagensFaleConoscoAdmin));

            alert('Mensagem enviada com sucesso!');
            faleConoscoForm.reset(); // Limpa o formulário
        } else {
            alert('Você precisa estar logado para enviar uma mensagem de contato.');
            // Opcional: Redirecionar para a página de login
            // window.location.href = 'login.html';
        }
    });
});