document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const servico = urlParams.get('servico');
    const orcamentoForm = document.getElementById('orcamento-form');

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
        const voltarDetalhesLink = document.querySelector('.servico-info .botao-voltar a');
        if (voltarDetalhesLink) {
            voltarDetalhesLink.href = getServicoDetalhesLink(servico);
        }
    }

    if (orcamentoForm) {
        orcamentoForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const descricao = document.getElementById('descricao').value;
            const dataEnvio = new Date().toLocaleString();
            const servicoSolicitado = servico ? getServicoNome(servico) : 'Não especificado';

            const novoOrcamento = { nome, email, telefone, descricao, dataEnvio, servico: servicoSolicitado };

            let orcamentos = localStorage.getItem('orcamentos');
            orcamentos = orcamentos ? JSON.parse(orcamentos) : [];
            orcamentos.push(novoOrcamento);
            localStorage.setItem('orcamentos', JSON.stringify(orcamentos));

            alert('Orçamento enviado com sucesso!');
            orcamentoForm.reset(); // Limpa o formulário
            window.location.href = 'orcamento-enviado.html'; // Redireciona para a página de confirmação
        });
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