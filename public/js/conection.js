const API_URL = 'http://localhost:8080/api';

const produtosContainer = document.getElementById('produtos-container');
const produtoForm = document.getElementById('produto-form');

async function fetchProdutos() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }
        
        const produtos = await response.json();
        displayProdutos(produtos);
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
}

function displayProdutos(produtos) {
    produtosContainer.innerHTML = '';
    
    if (produtos.length === 0) {
        produtosContainer.innerHTML = '<p>Nenhum produto cadastrado.</p>';
        return;
    }
    
    const ul = document.createElement('ul');
    
    produtos.forEach(produto => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${produto.nome}</strong> - R$ ${produto.preco.toFixed(2)}
            <button onclick="deleteProduto(${produto.id})">Excluir</button>
        `;
        ul.appendChild(li);
    });
    
    produtosContainer.appendChild(ul);
}

async function addProduto(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const preco = parseFloat(document.getElementById('preco').value);
    
    try {
        const response = await fetch(`${API_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, preco })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao adicionar produto');
        }
        

        produtoForm.reset();
        fetchProdutos();
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
}

async function deleteProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/produtos/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao excluir produto');
        }
        
        fetchProdutos();
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
}

produtoForm.addEventListener('submit', addProduto);

document.addEventListener('DOMContentLoaded', fetchProdutos);

async function login(email, senha) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })
        });
        
        if (!response.ok) {
            throw new Error('Credenciais inválidas');
        }
        
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}
