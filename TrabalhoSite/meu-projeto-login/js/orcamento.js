document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const servico = urlParams.get('servico');

    if (servico) {
        let imagem = '';
        switch (servico) {
            case 'troca-pecas':
                imagem = 'pecas.jpg';
                break;
            case 'formatacao-instalacao':
                imagem = 'formatacao.jpg';
                break;
            case 'remocao-virus':
                imagem = 'remocao.jpg';
                break;
            case 'limpeza':
                imagem = 'limpeza.png';
                break;
            case 'montagem-computadores':
                imagem = 'montagem.jpg';
                break;
            case 'diagnostico-problemas':
                imagem = 'diagnostico.jpg';
                break;
            default:
                imagem = '';
        }
        document.getElementById('servico-imagem').src = `img/${imagem}`;
        document.getElementById('servico-nome').textContent = getServicoNome(servico);
        document.getElementById('voltar-detalhes').href = getServicoDetalhesLink(servico);
    }
});

function getServicoNome(servico) {
    switch (servico) {
        case 'troca-pecas':
            return 'Troca de Peças';
        case 'formatacao-instalacao':
            return 'Formatação e Instalação de Sistemas';
        case 'remocao-virus':
            return 'Remoção de Vírus e Malwares';
        case 'limpeza':
            return 'Limpeza';
        case 'montagem-computadores':
            return 'Montagem de Computadores';
        case 'diagnostico-problemas':
            return 'Diagnóstico de Problemas';
        default:
            return '';
    }
}

document.getElementById('orcamento-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    // Adicione aqui o código para enviar os dados do formulário para o servidor, se necessário
    window.location.href = 'orcamento-enviado.html'; // Redireciona para a página de confirmação
});

function getServicoDetalhesLink(servico) {
    switch (servico) {
        case 'troca-pecas':
            return 'troca-pecas.html';
        case 'formatacao-instalacao':
            return 'formatacao-instalacao.html';
        case 'remocao-virus':
            return 'remocao-virus.html';
        case 'limpeza':
            return 'limpeza.html';
        case 'montagem-computadores':
            return 'montagem-computadores.html';
        case 'diagnostico-problemas':
            return 'diagnostico-problemas.html';
        default:
            return '#';
    }
}