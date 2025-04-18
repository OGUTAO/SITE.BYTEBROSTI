document.addEventListener('DOMContentLoaded', () => {
    const faleConoscoForm = document.querySelector('.fale-conosco form');

    faleConoscoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;
        const assunto = 'Mensagem do Fale Conosco'; // Assunto padrão
        const dataEnvio = new Date().toLocaleString();

        const novaMensagem = { nome, email, assunto, mensagem, dataEnvio };

        let mensagensFaleConosco = localStorage.getItem('mensagensFaleConosco');
        mensagensFaleConosco = mensagensFaleConosco ? JSON.parse(mensagensFaleConosco) : [];
        mensagensFaleConosco.push(novaMensagem);
        localStorage.setItem('mensagensFaleConosco', JSON.stringify(mensagensFaleConosco));

        alert('Mensagem enviada com sucesso!');
        faleConoscoForm.reset(); // Limpa o formulário
    });
});