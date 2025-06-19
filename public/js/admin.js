console.log("admin.js carregado - Versão: " + new Date().toLocaleTimeString());
let isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
let loggedInAdmin = localStorage.getItem('loggedInAdmin') ? JSON.parse(localStorage.getItem('loggedInAdmin')) : null;
let adminAccounts = loadAdminAccounts();
let isSuperAdmin = loggedInAdmin ? loggedInAdmin.isSuper : false;
let products = [];
let news = [];
let popularProductsList = loadPopularProductsFromLocalStorage();
let newProductsListAdmin = loadNewProductsAdminFromLocalStorage();
let offersListAdmin = loadOffersAdminFromLocalStorage();

const loginSection = document.getElementById('loginSection');
const adminContent = document.getElementById('adminContent');
const loginButton = document.getElementById('login-button');
const logoutButtonAdmin = document.getElementById('logout-admin-button');
const addAdminBtn = document.getElementById('add-admin-btn');
const adminList = document.getElementById('admin-list');
const tabAdmins = document.getElementById('tab-admins');
const adminsContent = document.getElementById('admins-content');
const tabProducts = document.getElementById('tab-products');
const tabAddProduct = document.getElementById('tab-add-product');
const tabAddNews = document.getElementById('tab-add-news');
const tabBudgets = document.getElementById('tab-budgets');
const tabSupportRequests = document.getElementById('tab-support-requests');
const tabContactUs = document.getElementById('tab-contact-us');
const productsContent = document.getElementById('products-content');
const addProductContent = document.getElementById('add-product-content');
const addNewsContent = document.getElementById('add-news-content');
const budgetsContent = document.getElementById('budgets-content');
const supportRequestsContent = document.getElementById('support-requests-content');
const contactUsContent = document.getElementById('contact-us-content'); 
const addProductForm = document.getElementById('add-product-form');
const addNewsForm = document.getElementById('add-news-form');
const themeToggleButton = document.getElementById('theme-toggle-button');
const popularProductsContent = document.getElementById('popular-products-content');
const newProductsContent = document.getElementById('new-products-content');
const offersContent = document.getElementById('offers-content');
const tabPopularProducts = document.getElementById('tab-popular-products');
const tabNewProducts = document.getElementById('tab-new-products');
const tabOffers = document.getElementById('tab-offers');
const tabClients = document.getElementById('tab-clients');
const clientContent = document.getElementById('clients-content');
const productSearchInput = document.getElementById('product-search');

const API_URL = 'http://localhost:8080/api';

function loadProductsFromLocalStorage() { return []; }
function saveProductsToLocalStorage(productsToSave) { }
function loadNewsFromLocalStorage() { return []; }
function saveNewsToLocalStorage(newsToSave) { }

function loadAdminAccounts() {
    const storedAccounts = localStorage.getItem('adminAccounts');
    return storedAccounts ? JSON.parse(storedAccounts) : [];
}

function saveAdminAccounts(accounts) {
    localStorage.setItem('adminAccounts', JSON.stringify(accounts));
}
function loadPopularProductsFromLocalStorage() {
    const storedPopular = localStorage.getItem('popularProducts');
    return storedPopular ? JSON.parse(storedPopular) : [];
}

function savePopularProductsToLocalStorage(popularProducts) {
    localStorage.setItem('popularProducts', JSON.stringify(popularProducts));
}

function loadNewProductsAdminFromLocalStorage() {
    const storedNew = localStorage.getItem('newProductsAdmin');
    return storedNew ? JSON.parse(storedNew) : [];
}

function saveNewProductsAdminToLocalStorage(newProducts) {
    localStorage.setItem('newProductsAdmin', JSON.stringify(newProducts));
}

function loadOffersAdminFromLocalStorage() {
    const storedOffers = localStorage.getItem('offersAdmin');
    return storedOffers ? JSON.parse(storedOffers) : [];
}

function saveOffersAdminToLocalStorage(offers) {
    localStorage.setItem('offersAdmin', JSON.stringify(offers));
}

async function showAdminPanel() {
    const tabAdmins = document.getElementById('tab-admins');
    const adminsContent = document.getElementById('admins-content');
    const loggedInAdminNameElement = document.getElementById('logged-in-admin-name');
    const adminToken = localStorage.getItem('adminToken');

    const loginSectionElement = document.getElementById('loginSection');
    const adminContentElement = document.getElementById('adminContent');

    if (!adminToken) {
        if (loginSectionElement) loginSectionElement.style.display = 'flex';
        if (adminContentElement) adminContentElement.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/perfil`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (!response.ok) {
            logoutAdmin();
            return;
        }
        const adminProfile = await response.json();
        isSuperAdmin = adminProfile.is_admin;
        if (loggedInAdminNameElement) loggedInAdminNameElement.textContent = adminProfile.email;

        if (loginSectionElement) loginSectionElement.style.display = 'none';
        if (adminContentElement) adminContentElement.style.display = 'block';

        if (tabAdmins) {
            tabAdmins.style.display = isSuperAdmin ? 'inline-block' : 'none';
        }

        await fetchAndRenderProducts();
        await fetchAndRenderNews();
        renderPopularProductsAdmin();
        renderNewProductsAdminList();
        renderOffersAdminList();

        setupTabs();
        
    } catch (error) {
        console.error('Erro ao verificar status do admin:', error);
        logoutAdmin();
    }
}

async function logoutAdmin() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('loggedInAdminEmail');
    localStorage.removeItem('isAdminSuper');
    window.location.href = 'ADM.html';
}

async function loginAdmin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const loginErrorElement = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Credenciais inválidas.');
        }

        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('loggedInAdminEmail', data.email);
        localStorage.setItem('isAdminSuper', data.is_admin);

        isAdminLoggedIn = true;
        loggedInAdmin = { email: data.email, isSuper: data.is_admin };
        isSuperAdmin = data.is_admin;

        await showAdminPanel();
        loginErrorElement.style.display = 'none';
        // Redireciona para a aba de orçamentos após o login, por exemplo
        switchTab('budgets'); // Ou 'support-requests'
    } catch (error) {
        console.error("Erro no login do admin:", error);
        loginErrorElement.textContent = error.message;
        loginErrorElement.style.display = 'block';
    }
}

async function fetchAndRenderProducts() {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        console.error("Token de admin ausente para buscar produtos.");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/produtos`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (!response.ok) throw new Error('Erro ao carregar produtos da API.');
        products = await response.json();
        renderAdminProducts(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        document.getElementById('product-list').innerHTML = '<li class="no-products-message">Erro ao carregar produtos.</li>';
    }
}

async function fetchAndRenderNews() {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        console.error("Token de admin ausente para buscar notícias.");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/noticias`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (!response.ok) throw new Error('Erro ao carregar notícias da API.');
        news = await response.json();
        renderNewsList();
    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        document.getElementById('news-list').innerHTML = '<li class="no-news-message">Erro ao carregar notícias.</li>';
    }
}

async function addProductHandler(event) {
    event.preventDefault();
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { alert('Você não está autenticado como administrador.'); return; }

    const nameInput = document.getElementById('new-product-name');
    const detailsInput = document.getElementById('new-product-details');
    const valueInput = document.getElementById('new-product-value');
    const quantityInput = document.getElementById('new-product-quantity');
    const imageInput = document.getElementById('new-product-image');

    const name = nameInput.value.trim();
    const details = detailsInput.value.trim();
    const value = parseFloat(valueInput.value);
    const quantity = parseInt(quantityInput.value);
    const image = imageInput.value.trim();

    if (!name) { alert('Por favor, informe o nome do produto.'); nameInput.focus(); return; }
    if (isNaN(value) || value < 0) { alert('Por favor, digite um valor válido.'); valueInput.focus(); return; }
    if (isNaN(quantity) || quantity < 0) { alert('Por favor, digite uma quantidade válida.'); quantityInput.focus(); return; }

    const newProduct = {
        name: name,
        details: details,
        value: value,
        quantity: quantity,
        image: image,
        oferta: false
    };

    try {
        const response = await fetch(`${API_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao adicionar produto.');
        }
        await fetchAndRenderProducts();
        addProductForm.reset();
        alert('Produto adicionado com sucesso!');
        switchTab('products');
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert(`Erro ao adicionar produto: ${error.message}`);
    }
}

async function handleSaveProductEdit(event) {
    const button = event.currentTarget;
    const productItem = button.closest('.product-item');
    const index = parseInt(button.dataset.index);
    const productToUpdate = products[index];

    const newName = productItem.querySelector(`#edit-name-${index}`).value.trim();
    const newDetails = productItem.querySelector(`#edit-details-${index}`).value.trim();
    const newValue = parseFloat(productItem.querySelector(`#edit-value-${index}`).value);
    const newQuantity = parseInt(productItem.querySelector(`#edit-quantity-${index}`).value);
    const newImage = productItem.querySelector(`#edit-image-${index}`).value.trim();
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) { alert('Você não está autenticado.'); return; }

    if (!newName || isNaN(newValue) || isNaN(newQuantity) || newValue < 0 || newQuantity < 0) {
        alert('Por favor, preencha nome, valores e quantidade válidos.');
        return;
    }

    const updatedProduct = {
        id: productToUpdate.id,
        name: newName,
        details: newDetails,
        value: newValue,
        quantity: newQuantity,
        image: newImage,
        oferta: productToUpdate.oferta
    };

    try {
        const response = await fetch(`${API_URL}/produtos/${updatedProduct.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(updatedProduct)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao atualizar produto.');
        }
        await fetchAndRenderProducts();
        alert('Produto atualizado com sucesso!');
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        alert(`Erro ao atualizar produto: ${error.message}`);
    }
}

async function handleDeleteProduct(event) {
    const button = event.currentTarget;
    const index = parseInt(button.dataset.index);
    const productToDelete = products[index];
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) { alert('Você não está autenticado.'); return; }

    if (confirm(`Tem certeza que deseja excluir o produto "${productToDelete.name || 'sem nome'}"?`)) {
        try {
            const response = await fetch(`${API_URL}/produtos/${productToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Erro ao excluir produto.');
            }
            await fetchAndRenderProducts();
            alert('Produto excluído com sucesso!');
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            alert(`Erro ao deletar produto: ${error.message}`);
        }
    }
}

async function addNewsHandler(event) {
    event.preventDefault();
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { alert('Você não está autenticado como administrador.'); return; }

    const titleInput = document.getElementById('news-title');
    const subtitleInput = document.getElementById('news-subtitle');
    const descriptionInput = document.getElementById('news-description');
    const authorInput = document.getElementById('news-author');

    const newNews = {
        titulo: titleInput.value.trim(),
        subtitulo: subtitleInput.value.trim(),
        conteudo: descriptionInput.value.trim(),
        autor: authorInput.value.trim() || (localStorage.getItem('loggedInAdminEmail') || 'Admin')
    };

    try {
        const response = await fetch(`${API_URL}/admin/noticias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(newNews)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Status: ${response.status} ${response.statusText}`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.erro || errorMessage;
            } catch (e) {
                errorMessage = `Resposta do servidor: ${errorText}. ${errorMessage}`;
            }
            console.error("Erro ao adicionar notícia (detalhes):", errorText);
            throw new Error(errorMessage);
        }
        await fetchAndRenderNews();
        addNewsForm.reset();
        alert('Notícia adicionada com sucesso!');
        switchTab('add-news');
    } catch (error) {
        console.error("Erro ao adicionar notícia:", error);
        alert(`Erro ao adicionar notícia: ${error.message}`);
    }
}

async function handleSaveEditNews(event) {
    const button = event.currentTarget;
    const newsItem = button.closest('.news-item');
    const index = parseInt(button.dataset.index);
    const newsToUpdate = news[index];

    const newTitle = newsItem.querySelector(`#edit-title-${index}`).value.trim();
    const newSubtitle = newsItem.querySelector(`#edit-subtitle-${index}`).value.trim();
    const newDescription = newsItem.querySelector(`#edit-description-${index}`).value.trim();
    const newAuthor = newsItem.querySelector(`#edit-author-${index}`).value.trim();

    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) { alert('Você não está autenticado.'); return; }

    if (newTitle && newDescription) {
        const updatedNews = {
            id: newsToUpdate.id,
            titulo: newTitle,
            subtitulo: newSubtitle,
            conteudo: newDescription,
            autor: newAuthor
        };

        try {
            const response = await fetch(`${API_URL}/admin/noticias/${updatedNews.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(updatedNews)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Erro ao atualizar notícia.');
            }
            await fetchAndRenderNews();
            alert('Notícia atualizada com sucesso!');
        } catch (error) {
            console.error("Erro ao atualizar notícia:", error);
            alert(`Erro ao atualizar notícia: ${error.message}`);
        }
    } else {
        alert('Por favor, preencha o título e a descrição da notícia.');
    }
}

async function handleDeleteNewsItem(event) {
    const button = event.currentTarget;
    const index = parseInt(button.dataset.index);
    const newsToDelete = news[index];
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) { alert('Você não está autenticado.'); return; }

    if (confirm(`Tem certeza que deseja excluir a notícia "${newsToDelete.titulo}"?`)) {
        try {
            const response = await fetch(`${API_URL}/admin/noticias/${newsToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || 'Erro ao excluir notícia.');
            }
            await fetchAndRenderNews();
            alert('Notícia excluída com sucesso!');
        } catch (error) {
            console.error("Erro ao deletar notícia:", error);
            alert(`Erro ao deletar notícia: ${error.message}`);
        }
    }
}

function renderAdminProducts(productsToRender) {
    const productList = document.getElementById('product-list');

    if (!productList) {
        console.error('Elemento productList não encontrado dentro de renderAdminProducts!');
        return;
    }

    productList.innerHTML = '';
    if (!productsToRender || productsToRender.length === 0) {
        productList.innerHTML = '<li class="no-products-message">Nenhuma peça cadastrada ainda.</li>';
        return;
    }

    productsToRender.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('product-item');
        listItem.dataset.productId = product.id;

        const valueAsNumber = parseFloat(product.value);
        const formattedValue = !isNaN(valueAsNumber)
            ? valueAsNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : 'Valor inválido';

        listItem.innerHTML = `
            <div class="product-info">
                <div class="product-name"><strong>${product.name}</strong></div>
                <div class="product-details">${product.details.String || 'Sem detalhes'}</div>
            </div>
            <div class="product-actions">
                <div class="stats">
                    <span class="product-value">Valor: ${formattedValue}</span>
                    <span class="product-quantity">Quantidade: ${product.quantity || 0}</span>
                </div>
                <div class="action-buttons">
                    <button class="button edit-button" data-index="${index}" title="Editar Produto">Editar</button>
                    <button class="button delete-button danger" data-index="${index}" title="Excluir Produto">Excluir</button>
                </div>
            </div>
            <div class="edit-controls" style="display: none;">
                <div class="edit-control-group">
                    <label for="edit-name-${index}">Nome:</label>
                    <input type="text" id="edit-name-${index}" value="${product.name}">
                </div>
                <div class="edit-control-group">
                    <label for="edit-details-${index}">Detalhes:</label>
                    <textarea id="edit-details-${index}">${product.details || ''}</textarea>
                </div>
                <div class="edit-control-group">
                    <label for="edit-value-${index}">Novo Valor (Ex: 1800.00):</label>
                    <input type="number" step="0.01" min="0" id="edit-value-${index}" value="${product.value}">
                </div>
                <div class="edit-control-group">
                    <label for="edit-quantity-${index}">Nova Qtd:</label>
                    <input type="number" id="edit-quantity-${index}" value="${product.quantity || 0}" min="0">
                </div>
                <div class="edit-control-group">
                    <label for="edit-image-${index}">URL da Imagem:</label>
                    <input type="text" id="edit-image-${index}" value="${product.image.String || ''}">
                </div>
                <div class="edit-action-buttons">
                    <button class="button save" data-index="${index}">Salvar</button>
                    <button class="button cancel" data-index="${index}">Cancelar</button>
                </div>
            </div>
        `;
        productList.appendChild(listItem);
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const productItem = event.currentTarget.closest('.product-item');
            const index = parseInt(event.currentTarget.dataset.index);
            const productToEdit = products[index];

            productItem.querySelector(`#edit-name-${index}`).value = productToEdit.name;
            productItem.querySelector(`#edit-details-${index}`).value = productToEdit.details.String || '';
            productItem.querySelector(`#edit-value-${index}`).value = productToEdit.value;
            productItem.querySelector(`#edit-quantity-${index}`).value = productToEdit.quantity;
            productItem.querySelector(`#edit-image-${index}`).value = productToEdit.image || '';

            productItem.querySelector('.product-info').style.display = 'none';
            productItem.querySelector('.product-actions').style.display = 'none';
            productItem.querySelector('.edit-controls').style.display = 'flex';
        });
    });

    document.querySelectorAll('.save').forEach(button => {
        button.addEventListener('click', handleSaveProductEdit);
    });

    document.querySelectorAll('.cancel').forEach(button => {
        button.addEventListener('click', handleCancelProductEdit);
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDeleteProduct);
    });
}

function attachProductEventListeners() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', handleEditProduct);
    });

    document.querySelectorAll('.save').forEach(button => {
        button.addEventListener('click', handleSaveProductEdit);
    });

    document.querySelectorAll('.cancel').forEach(button => {
        button.addEventListener('click', handleCancelProductEdit);
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDeleteProduct);
    });
}

function handleEditProduct(event) {
    const button = event.currentTarget;
    const productItem = button.closest('.product-item');
    const productInfo = productItem.querySelector('.product-info');
    const productActions = productItem.querySelector('.product-actions');
    const editControls = productItem.querySelector('.edit-controls');

    productInfo.style.display = 'none';
    productActions.style.display = 'none';

    editControls.style.display = 'flex';
}

function handleCancelProductEdit(event) {
    const button = event.currentTarget;
    const productItem = button.closest('.product-item');
    const actions = productItem.querySelector('.product-actions');
    const editControls = productItem.querySelector('.edit-controls');

    actions.style.display = 'flex';
    editControls.style.display = 'none';
}

function renderNewsList() {
    const newsListElement = document.getElementById('news-list');
    if (!newsListElement) return;

    newsListElement.innerHTML = '';

    if (!news || news.length === 0) {
        newsListElement.innerHTML = '<li class="no-news-message">Nenhuma notícia cadastrada.</li>';
        return;
    }

    news.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('news-item');
        listItem.innerHTML = `
            <div class="news-info">
                <h3>${item.titulo}</h3>
                <p class="news-date">${new Date(item.data).toLocaleDateString('pt-BR')}</p>
                <p class="news-description">${item.conteudo}</p>
                <p class="news-author">Autor: ${item.autor}</p>
            </div>
            <div class="news-actions">
                <button class="button edit-news" data-index="${index}">Editar</button>
                <button class="button delete-news danger" data-index="${index}">Excluir</button>
            </div>
            <div class="edit-news-controls" style="display: none;">
                <label for="edit-title-${index}">Título:</label>
                <input type="text" id="edit-title-${index}" value="${item.titulo}">
                <label for="edit-subtitle-${index}">Subtítulo:</label> <input type="text" id="edit-subtitle-${index}" value="${item.subtitulo || ''}"> <label for="edit-description-${index}">Conteúdo:</label>
                <textarea id="edit-description-${index}">${item.conteudo}</textarea>
                <label for="edit-author-${index}">Autor:</label> <input type="text" id="edit-author-${index}" value="${item.autor || ''}"> <div class="edit-action-buttons">
                    <button class="button save-edit-news" data-index="${index}">Salvar</button>
                    <button class="button cancel-edit-news" data-index="${index}">Cancelar</button>
                </div>
            </div>
        `;
        newsListElement.appendChild(listItem);
    });

    document.querySelectorAll('.edit-news').forEach(button => {
        button.addEventListener('click', handleEditNewsItem);
    });

    document.querySelectorAll('.save-edit-news').forEach(button => {
        button.addEventListener('click', handleSaveEditNews);
    });

    document.querySelectorAll('.delete-news').forEach(button => {
        button.addEventListener('click', handleDeleteNewsItem);
    });

    document.querySelectorAll('.cancel-edit-news').forEach(button => {
        button.addEventListener('click', handleCancelEditNews);
    });
}

function handleEditNewsItem(event) {
    const button = event.currentTarget;
    const newsItem = button.closest('.news-item');
    const index = parseInt(button.dataset.index);
    const newsInfo = newsItem.querySelector('.news-info');
    const newsActions = newsItem.querySelector('.news-actions');
    const editControls = newsItem.querySelector('.edit-news-controls');
    const editTitleInput = editControls.querySelector(`#edit-title-${index}`);
    const editSubtitleInput = editControls.querySelector(`#edit-subtitle-${index}`);
    const editDescriptionTextarea = editControls.querySelector(`#edit-description-${index}`);
    const editAuthorInput = editControls.querySelector(`#edit-author-${index}`);


    editTitleInput.value = news[index].titulo;
    editSubtitleInput.value = news[index].subtitulo || '';
    editDescriptionTextarea.value = news[index].conteudo;
    editAuthorInput.value = news[index].autor || '';

    newsInfo.style.display = 'none';
    newsActions.style.display = 'none';

    editControls.style.display = 'flex';
}

function handleCancelEditNews(event) {
    const button = event.currentTarget;
    const newsItem = button.closest('.news-item');
    const newsInfo = newsItem.querySelector('.news-info');
    const newsActions = newsItem.querySelector('.news-actions');
    const editControls = newsItem.querySelector('.edit-news-controls');

    if (newsInfo) newsInfo.style.display = 'block';
    if (newsActions) newsActions.style.display = 'flex';
    if (editControls) editControls.style.display = 'none';
}

async function renderOrcamentos() {
    const budgetsContent = document.getElementById('budgets-content');
    if (!budgetsContent) return;
    budgetsContent.innerHTML = '<h2>Orçamentos Recebidos</h2>';

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        console.error("Token de admin ausente para carregar orçamentos.");
        budgetsContent.innerHTML += '<p>Não autenticado. Por favor, faça login como administrador.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/orcamentos`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ erro: "Resposta não JSON ou vazia" }));
            throw new Error(`Erro: ${response.status} ${response.statusText} - ${errorData.erro || 'Detalhes desconhecidos.'}`);
        }
        const orcamentos = await response.json();
        console.log("Orçamentos recebidos:", orcamentos);

        if (orcamentos.length === 0) {
            budgetsContent.innerHTML += '<p>Nenhum orçamento recebido.</p>';
            return;
        }

        const listaHTML = document.createElement('ul');
        orcamentos.forEach((orcamento) => {
            const itemLista = document.createElement('li');
            itemLista.innerHTML = `
                <strong>ID:</strong> ${orcamento.id}<br>
                <strong>Nome:</strong> ${orcamento.nome_cliente}<br>
                <strong>Email:</strong> ${orcamento.email_cliente}<br>
                <strong>Telefone:</strong> ${orcamento.telefone || 'N/A'}<br> <strong>Serviço:</strong> ${orcamento.servico_nome || 'Não especificado'}<br>
                <strong>Descrição:</strong> ${orcamento.descricao}<br>
                <strong>Data de Envio:</strong> ${new Date(orcamento.criado_em).toLocaleString('pt-BR')}<br>
                <label>
                    Status:
                    <select data-id="${orcamento.id}" onchange="atualizarStatusOrcamento(this)">
                        <option value="pendente" ${orcamento.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                        <option value="em_analise" ${orcamento.status === 'em_analise' ? 'selected' : ''}>Em Análise</option>
                        <option value="aprovado" ${orcamento.status === 'aprovado' ? 'selected' : ''}>Aprovado</option>
                        <option value="rejeitado" ${orcamento.status === 'rejeitado' ? 'selected' : ''}>Rejeitado</option>
                    </select>
                </label>
                <button class="button delete-button danger" onclick="excluirOrcamento(${orcamento.id})">Excluir</button>
                <hr>
            `;
            listaHTML.appendChild(itemLista);
        });
        budgetsContent.appendChild(listaHTML);
    } catch (error) {
        console.error("Erro ao carregar orçamentos:", error);
        budgetsContent.innerHTML += `<p>Erro ao carregar orçamentos: ${error.message}</p>`;
    }
}

window.atualizarStatusOrcamento = async function(selectElement) {
    const orcamentoId = selectElement.dataset.id;
    const novoStatus = selectElement.value;
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { alert('Não autenticado.'); return; }

    try {
        const response = await fetch(`${API_URL}/admin/orcamentos/${orcamentoId}/status`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status: novoStatus })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao atualizar status do orçamento.');
        }
        alert('Status do orçamento atualizado com sucesso!');
        renderOrcamentos();
    } catch (error) {
        console.error("Erro ao atualizar status do orçamento:", error);
        alert(`Erro ao atualizar status: ${error.message}`);
    }
};
window.excluirOrcamento = async function(orcamentoId) {
    if (!confirm('Tem certeza que deseja excluir este orçamento?')) { return; }
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { alert('Não autenticado.'); return; }

    try {
        const response = await fetch(`${API_URL}/suporte/${orcamentoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao excluir orçamento.');
        }
        alert('Orçamento excluído com sucesso!');
        renderOrcamentos();
    } catch (error) {
        console.error("Erro ao excluir orçamento:", error);
        alert(`Erro ao excluir orçamento: ${error.message}`);
    }
};

async function renderPedidosSuporte() {
    const supportRequestsContent = document.getElementById('support-requests-content');
    if (!supportRequestsContent) return;
    supportRequestsContent.innerHTML = '<h2>Pedidos de Suporte</h2>';

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        console.error("Token de admin ausente para carregar pedidos de suporte.");
        supportRequestsContent.innerHTML += '<p>Não autenticado. Por favor, faça login como administrador.</p>';
        return;
    }

    try {
        console.log("DEBUG: Tentando buscar pedidos de suporte (tipo=suporte)...");
        const responseSuporte = await fetch(`${API_URL}/suporte`, { // Apenas suporte aqui
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log("DEBUG: Resposta da API (suporte): Status", responseSuporte.status);
        if (!responseSuporte.ok) {
            let errorTextSuporte = await responseSuporte.text();
            try {
                const errorJsonSuporte = JSON.parse(errorTextSuporte);
                errorTextSuporte = errorJsonSuporte.erro || errorTextSuporte;
            } catch (e) { /* not JSON */ }
            throw new Error(`Erro ${responseSuporte.status} ao carregar pedidos de suporte: ${errorTextSuporte}`);
        }
        const pedidosSuporte = await responseSuporte.json();
        console.log("DEBUG: Pedidos de Suporte recebidos:", pedidosSuporte);

        const todosPedidos = [...pedidosSuporte]; // Apenas pedidos de suporte aqui
        todosPedidos.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));

        if (todosPedidos.length === 0) {
            supportRequestsContent.innerHTML += '<p>Nenhum pedido de suporte recebido.</p>';
            return;
        }

        const listaPedidos = document.createElement('ul');
        todosPedidos.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>ID:</strong> ${item.id}<br>
                <strong>Nome:</strong> ${item.nome}<br>
                <strong>Email:</strong> ${item.email}<br>
                <strong>Mensagem:</strong> ${item.mensagem}<br>
                <strong>Tipo de Interação:</strong> Suporte<br>
                <strong>Cliente Email (Logado):</strong> ${item.cliente_email || 'N/A'}<br>
                <strong>Enviado em:</strong> ${new Date(item.criado_em).toLocaleString('pt-BR')}<br>
                <label>
                    Status:
                    <select data-id="${item.id}" onchange="atualizarStatusSuporte(this)">
                        <option value="aberto" ${item.status === 'aberto' ? 'selected' : ''}>Aberto</option>
                        <option value="em_andamento" ${item.status === 'em_andamento' ? 'selected' : ''}>Em Andamento</option>
                        <option value="resolvido" ${item.status === 'resolvido' ? 'selected' : ''}>Resolvido</option>
                    </select>
                </label>
                <button class="button delete-button danger" onclick="excluirPedidoSuporte(${item.id})">Excluir</button>
                <hr>
            `;
            listaPedidos.appendChild(listItem);
        });
        supportRequestsContent.appendChild(listaPedidos);
    } catch (error) {
        console.error("Erro ao carregar pedidos de suporte:", error);
        supportRequestsContent.innerHTML = `<p>Erro ao carregar pedidos de suporte: ${error.message}</p>`;
    }
}

window.atualizarStatusSuporte = async function(selectElement) {
    const pedidoId = selectElement.dataset.id;
    const novoStatus = selectElement.value;
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { alert('Não autenticado.'); return; }

    try {
        const response = await fetch(`${API_URL}/suporte/${pedidoId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status: novoStatus })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao atualizar status do pedido de suporte.');
        }
        alert('Status do pedido de suporte atualizado com sucesso!');
        renderPedidosSuporte(); 
    } catch (error) {
        console.error("Erro ao atualizar status do suporte:", error);
        alert(`Erro ao atualizar status: ${error.message}`);
    }
};

window.excluirPedidoSuporte = async function(pedidoId) {
    if (!confirm('Deseja excluir este pedido de suporte?')) { return; }
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { alert('Não autenticado.'); return; }

    try {
        const response = await fetch(`${API_URL}/suporte/${pedidoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro ao excluir pedido de suporte.');
        }
        alert('Pedido de suporte excluído com sucesso!');
        renderPedidosSuporte();
    } catch (error) {
        console.error("Erro ao excluir pedido de suporte:", error);
        alert(`Erro ao excluir pedido de suporte: ${error.message}`);
    }
};

async function renderMensagensFaleConosco() {
    const contactUsContent = document.getElementById('contact-us-content');
    if (!contactUsContent) return;
    contactUsContent.innerHTML = '<h2>Mensagens Fale Conosco</h2>'; 

    contactUsContent.innerHTML += '<p>As mensagens do "Fale Conosco" agora são exibidas na aba "Pedidos de Suporte".</p>';
}

window.atualizarStatusMensagem = async function(selectElement) { /* ... Lógica similar a atualizarStatusSuporte ... */ };
window.excluirMensagem = async function(mensagemId) { /* ... Lógica similar a excluirPedidoSuporte ... */ };


async function handleBuscarCliente(event) {
    event.preventDefault();

    const buscaValor = document.getElementById('busca-email-telefone').value.trim();
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) { alert('Não autenticado.'); return; }

    if (!buscaValor) {
        if (resultadosBuscaDiv) resultadosBuscaDiv.innerHTML = '<p class="mensagem">Por favor, digite um email ou telefone para buscar.</p>';
        return;
    }

    if (detalhesClienteDiv) detalhesClienteDiv.innerHTML = '';
    if (listaPedidosClienteAdm) listaPedidosClienteAdm.innerHTML = '';
    if (listaHistoricoClienteAdm) listaHistoricoClienteAdm.innerHTML = '';
    if (resultadosBuscaDiv) resultadosBuscaDiv.innerHTML = '<p class="mensagem">Buscando...</p>'; // Mensagem de busca

    let clienteEncontrado = null;

    try {
        // 1. Tenta buscar como USUÁRIO NORMAL (Cliente)
        const responseUsuarios = await fetch(`${API_URL}/admin/usuarios?busca=${encodeURIComponent(buscaValor)}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (responseUsuarios.ok) {
            const allUsuarios = await responseUsuarios.json();
            const foundUsuario = allUsuarios.find(u =>
                (u.email && u.email.toLowerCase() === buscaValor.toLowerCase()) ||
                (u.telefone && u.telefone.toLowerCase() === buscaValor.toLowerCase())
            );

            if (foundUsuario) {
                clienteEncontrado = {
                    id: foundUsuario.id,
                    email: foundUsuario.email,
                    name: foundUsuario.nome_completo, // Use nome_completo conforme o model Usuario
                    telefone: foundUsuario.telefone || 'N/A',
                    tipo: 'usuario'
                };
                console.log('Cliente (usuário) encontrado via API:', clienteEncontrado);
            }
        } else {
             // Loga o erro, mas continua tentando funcionários
            console.warn(`Erro ao buscar usuários (Status: ${responseUsuarios.status}):`, await responseUsuarios.text());
        }

        // 2. Se não encontrou como usuário, tenta buscar como FUNCIONÁRIO
        if (!clienteEncontrado) {
            const responseFuncionarios = await fetch(`${API_URL}/admin/funcionarios`, { // Endpoint para listar todos os funcionários
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });

            if (responseFuncionarios.ok) {
                const allFuncionarios = await responseFuncionarios.json();
                const foundFuncionario = allFuncionarios.find(f =>
                    (f.email && f.email.toLowerCase() === buscaValor.toLowerCase()) // Funcionário não tem telefone no model atual, mas pode adicionar se necessário
                );

                if (foundFuncionario) {
                    clienteEncontrado = {
                        id: foundFuncionario.id,
                        email: foundFuncionario.email,
                        name: foundFuncionario.nome || 'N/A',
                        telefone: 'N/A', // Funcionário pode não ter telefone
                        tipo: 'funcionario'
                    };
                    console.log('Funcionário encontrado via API:', clienteEncontrado);
                }
            } else {
                 console.warn(`Erro ao buscar funcionários (Status: ${responseFuncionarios.status}):`, await responseFuncionarios.text());
            }
        }

        if (clienteEncontrado) {
            resultadosBuscaDiv.innerHTML = ''; // Limpa a mensagem de busca
            await exibirInformacoesClienteAPI(clienteEncontrado, adminToken);
        } else {
            resultadosBuscaDiv.innerHTML = '<p class="mensagem">Nenhum cliente ou funcionário encontrado com este email ou telefone.</p>';
        }

    } catch (error) {
        console.error('Erro ao buscar cliente ou seus dados:', error);
        resultadosBuscaDiv.innerHTML = `<p class="mensagem">Erro ao buscar cliente: ${error.message}</p>`;
    }
}

async function exibirInformacoesClienteAPI(cliente, adminToken) {
    console.log('Função exibirInformacoesClienteAPI foi chamada com:', cliente);

    if (!detalhesClienteDiv || !listaPedidosClienteAdm || !listaHistoricoClienteAdm) {
        console.error('Elementos do DOM para detalhes do cliente não encontrados.');
        return;
    }

    detalhesClienteDiv.innerHTML = `
        <h3>Detalhes do ${cliente.tipo === 'funcionario' ? 'Funcionário' : 'Cliente'}</h3>
        <p><strong>Nome:</strong> ${cliente.name || 'Não informado'}</p>
        <p><strong>Email:</strong> ${cliente.email || 'Não informado'}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone || 'Não informado'}</p>
        <p><strong>Tipo:</strong> ${cliente.tipo === 'funcionario' ? 'Funcionário' : 'Usuário Regular'}</p>
    `;

    listaPedidosClienteAdm.innerHTML = '';
    listaHistoricoClienteAdm.innerHTML = '';

    if (cliente.tipo === 'usuario') {
        // Carregar Pedidos de Loja (apenas para usuários)
        try {
            listaPedidosClienteAdm.innerHTML = '<h4>Pedidos Ativos (Loja)</h4><p>Carregando...</p>';
            const pedidosResponse = await fetch(`${API_URL}/admin/pedidos?cliente_email=${cliente.email}`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            if (!pedidosResponse.ok) {
                const errorData = await pedidosResponse.json().catch(() => ({ erro: "Resposta não JSON ou vazia" }));
                throw new Error(`Erro ao carregar pedidos de loja do cliente: ${pedidosResponse.status} ${pedidosResponse.statusText} - ${errorData.erro || 'Detalhes desconhecidos.'}`);
            }
            let pedidosLoja = await pedidosResponse.json();
            // GARANTE QUE É UM ARRAY:
            if (!Array.isArray(pedidosLoja)) {
                pedidosLoja = [];
                console.warn("API de pedidos de loja retornou algo que não é um array para o admin. Tratando como vazio.");
            }

            const pedidosAtivos = pedidosLoja.filter(p => p.status !== 'Entregue' && p.status !== 'Concluído' && p.status !== 'Pago');
            const historicoPedidos = pedidosLoja.filter(p => p.status === 'Entregue' || p.status === 'Concluído' || p.status === 'Pago');

            listaPedidosClienteAdm.innerHTML = '<h4>Pedidos Ativos (Loja)</h4>';
            if (pedidosAtivos.length > 0) {
                const ulAtivos = document.createElement('ul');
                pedidosAtivos.forEach(pedido => {
                    const li = document.createElement('li');
                    li.textContent = `ID: ${pedido.id}, Data: ${new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}, Status: ${pedido.status}, Total: R$ ${parseFloat(pedido.valor_total).toFixed(2).replace('.', ',')}`;
                    ulAtivos.appendChild(li);
                });
                listaPedidosClienteAdm.appendChild(ulAtivos);
            } else {
                listaPedidosClienteAdm.innerHTML += '<p>Nenhum pedido ativo encontrado para este cliente.</p>';
            }

            listaHistoricoClienteAdm.innerHTML = '<h4>Histórico de Pedidos (Loja)</h4>';
            if (historicoPedidos.length > 0) {
                const ulHistorico = document.createElement('ul');
                historicoPedidos.forEach(pedido => {
                    const li = document.createElement('li');
                    li.textContent = `ID: ${pedido.id}, Data: ${new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}, Status: ${pedido.status}, Total: R$ ${parseFloat(pedido.valor_total).toFixed(2).replace('.', ',')}`;
                    ulHistorico.appendChild(li);
                });
                listaHistoricoClienteAdm.appendChild(ulHistorico);
            } else {
                listaHistoricoClienteAdm.innerHTML += '<p>Nenhum histórico de pedidos de loja encontrado.</p>';
            }

        } catch (error) {
            console.error("Erro ao carregar pedidos do cliente:", error);
            listaPedidosClienteAdm.innerHTML = `<p>Erro ao carregar pedidos: ${error.message}</p>`; // Use = para sobrescrever
            listaHistoricoClienteAdm.innerHTML += `<p>Erro ao carregar histórico de pedidos: ${error.message}</p>`;
        }

        // Carregar Outras Interações (Suporte e Orçamento)
        try {
            listaHistoricoClienteAdm.innerHTML += '<h4>Outras Interações (Suporte e Orçamento)</h4><p>Carregando...</p>';
            
            // Buscar interações de Suporte
            const responseSuporte = await fetch(`${API_URL}/suporte?cliente_email=${cliente.email}`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            let interacoesSuporte = responseSuporte.ok ? await responseSuporte.json() : [];
            // GARANTE QUE É UM ARRAY:
            if (!Array.isArray(interacoesSuporte)) {
                interacoesSuporte = [];
                console.warn("API de suporte retornou algo que não é um array para o admin. Tratando como vazio.");
            }
            if (!responseSuporte.ok) console.warn('Erro ao buscar suporte do cliente (admin):', await responseSuporte.text());


            // Buscar interações de Orçamento
            const responseOrcamento = await fetch(`${API_URL}/admin/orcamentos?email=${cliente.email}`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            let interacoesOrcamento = responseOrcamento.ok ? await responseOrcamento.json() : [];
            // GARANTE QUE É UM ARRAY:
            if (!Array.isArray(interacoesOrcamento)) {
                interacoesOrcamento = [];
                console.warn("API de orçamentos retornou algo que não é um array para o admin. Tratando como vazio.");
            }
            if (!responseOrcamento.ok) console.warn('Erro ao buscar orçamentos do cliente (admin):', await responseOrcamento.text());


            const todasInteracoes = [...interacoesSuporte, ...interacoesOrcamento]; // Combine todos os tipos
            todasInteracoes.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em)); // Ordena

            listaHistoricoClienteAdm.innerHTML += '<h4>Outras Interações (Suporte e Orçamento)</h4>';
            if (todasInteracoes.length > 0) {
                const ulInteracoes = document.createElement('ul');
                todasInteracoes.forEach(interacao => {
                    const li = document.createElement('li');
                    let tipoExibicao = '';
                    if (interacao.hasOwnProperty('tipo_interacao')) { // Propriedade de Suporte (tipo_interacao = 'suporte' ou 'contato')
                        tipoExibicao = interacao.tipo_interacao === 'suporte' ? 'Suporte' : 'Contato';
                    } else if (interacao.hasOwnProperty('servico_nome') || interacao.hasOwnProperty('telefone')) { // Propriedade de Orçamento
                        tipoExibicao = 'Orçamento';
                    } else {
                        tipoExibicao = 'Desconhecido';
                    }

                    li.textContent = `Tipo: ${tipoExibicao}, Data: ${new Date(interacao.criado_em).toLocaleDateString('pt-BR')}, Status: ${interacao.status}, Mensagem: ${interacao.mensagem ? interacao.mensagem.substring(0, Math.min(interacao.mensagem.length, 50)) + '...' : 'N/A'}`;
                    ulInteracoes.appendChild(li);
                });
                listaHistoricoClienteAdm.appendChild(ulInteracoes);
            } else {
                listaHistoricoClienteAdm.innerHTML += '<p>Nenhuma outra interação encontrada para este cliente.</p>';
            }

        } catch (error) {
            console.error("Erro ao carregar interacoes do cliente:", error);
            listaHistoricoClienteAdm.innerHTML += `<p>Erro ao carregar outras interacoes: ${error.message}</p>`;
        }
    } else {
        listaPedidosClienteAdm.innerHTML = '<p>Pedidos de loja não aplicáveis para este tipo de usuário.</p>';
        listaHistoricoClienteAdm.innerHTML = '<p>Interações não aplicáveis para este tipo de usuário.</p>';
    }
}

function renderAdminList() {
    if (!adminList) return;

    adminList.innerHTML = '';

    if (adminAccounts.length === 0) {
        adminList.innerHTML = '<li>Nenhum administrador cadastrado.</li>';
        return;
    }

    adminAccounts.forEach((admin, index) => {
        const adminItem = document.createElement('li');
        adminItem.className = 'admin-item';

        adminItem.innerHTML = `
            <div class="admin-info">
                <span class="admin-name"><b>${admin.name}</b> - </span> <span class="admin-email">${admin.email}</span>
                ${admin.isSuper ? `<span class="admin-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Admin Superior
                </span>` : ''}
            </div>
            <button class="button delete-admin ${admin.isSuper ? 'disabled' : ''}"
                    data-index="${index}"
                    ${admin.isSuper ? 'disabled' : ''}>
                Remover
            </button>
        `;

        adminList.appendChild(adminItem);
    });

    document.querySelectorAll('.delete-admin').forEach(button => {
        if (!button.hasAttribute('disabled')) {
            button.addEventListener('click', handleRemoveAdmin);
        }
    });


    document.querySelectorAll('.delete-admin').forEach(button => {
        if (!button.hasAttribute('disabled')) {
            button.addEventListener('click', handleRemoveAdmin);
        }
    });
}

function addAdminAccount() {
    const nameInput = document.getElementById('add-admin-name');
    const emailInput = document.getElementById('add-admin-email');
    const passwordInput = document.getElementById('add-admin-password');
    const addAdminMessage = document.getElementById('add-admin-message');
    const addAdminError = document.getElementById('add-admin-error');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (name && email && password) {
        const newAdmin = { name: name, email: email, password: password, isSuper: false };
        adminAccounts.push(newAdmin);
        saveAdminAccounts(adminAccounts);
        renderAdminList();

        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        addAdminMessage.style.display = 'block';
        addAdminError.style.display = 'none';

        setTimeout(() => {
            addAdminMessage.style.display = 'none';
        }, 3000);
    } else {
        addAdminMessage.style.display = 'none';
        addAdminError.style.display = 'block';
        addAdminError.textContent = 'Por favor, preencha todos os campos.';
    }
}

function handleRemoveAdmin(event) {
    const button = event.currentTarget;
    const index = parseInt(button.dataset.index);
    const admin = adminAccounts[index];

    if (admin.isSuper) {
        alert('Não é possível remover o administrador superior.');
        return;
    }

    if (confirm(`Tem certeza que deseja remover o administrador ${admin.email}?`)) {
        adminAccounts.splice(index, 1);
        saveAdminAccounts(adminAccounts);
        renderAdminList();
        alert('Administrador removido com sucesso!');
    }
}

function setupTabs() {
    console.log("admin.js: setupTabs executado.");
    const allTabButtons = [
        tabProducts, tabAddProduct, tabAddNews, tabAdmins, tabBudgets,
        tabSupportRequests, tabPopularProducts, tabNewProducts,
        tabOffers, tabClients
    ];

    const allTabContents = [
        productsContent, addProductContent, addNewsContent, adminsContent, budgetsContent,
        supportRequestsContent, popularProductsContent, newProductsContent,
        offersContent, clientContent
    ];

    allTabButtons.forEach(button => {
        if (button) {
            const oldListener = button._eventListener;
            if (oldListener) {
                button.removeEventListener('click', oldListener);
            }
            const newListener = () => switchTab(button.id.replace('tab-', ''));
            button.addEventListener('click', newListener);
            button._eventListener = newListener;
        }
    });
}

function switchTab(tabName) {
    console.log(`admin.js: switchTab para: ${tabName}`); 
    const allTabButtons = [
        tabProducts, tabAddProduct, tabAddNews, tabAdmins, tabBudgets,
        tabSupportRequests, tabPopularProducts, tabNewProducts,
        tabOffers, tabClients
    ];

    const allTabContents = [
        productsContent, addProductContent, addNewsContent, adminsContent, budgetsContent,
        supportRequestsContent, popularProductsContent, newProductsContent,
        offersContent, clientContent
    ];
    const tabAdminsButton = document.getElementById('tab-admins');
    const clientsContentDiv = document.getElementById('clients-content');
    const footerButtons = document.querySelector('.footer');

    allTabButtons.forEach(tab => {
        if (tab) tab.classList.remove('active');
    });

    allTabContents.forEach(content => {
        if (content) content.style.display = 'none';
    });

    if (clientsContentDiv) {
        clientsContentDiv.style.display = 'none';
    }

    if (footerButtons) {
        footerButtons.style.display = 'none';
    }

    let targetButton;
    let targetContent;

    switch (tabName) {
        case 'products':
            targetButton = tabProducts;
            targetContent = productsContent;
            fetchAndRenderProducts();
            break;
        case 'add-product':
            targetButton = tabAddProduct;
            targetContent = addProductContent;
            break;
        case 'add-news':
            targetButton = tabAddNews;
            targetContent = addNewsContent;
            fetchAndRenderNews();
            break;
        case 'admins':
            targetButton = tabAdmins;
            targetContent = adminsContent;
            if (isSuperAdmin) renderAdminList();
            break;
        case 'budgets':
            targetButton = tabBudgets;
            targetContent = budgetsContent;
            renderOrcamentos();
            break;
        case 'support-requests':
            targetButton = tabSupportRequests;
            targetContent = supportRequestsContent;
            renderPedidosSuporte(); 
            break;
        case 'popular-products':
            targetButton = tabPopularProducts;
            targetContent = popularProductsContent;
            renderPopularProductsAdmin();
            break;
        case 'new-products':
            targetButton = tabNewProducts;
            targetContent = newProductsContent;
            renderNewProductsAdminList();
            break;
        case 'offers':
            targetButton = tabOffers;
            targetContent = offersContent;
            renderOffersAdminList();
            break;
        case 'clients':
            targetButton = tabClients;
            targetContent = clientContent;
            if (clientsContentDiv) clientsContentDiv.style.display = 'block';
            break;
        default:
            console.warn(`Aba desconhecida: ${tabName}`);
            return;
    }

    if (targetButton) {
        targetButton.classList.add('active');
    }
    if (targetContent) {
        targetContent.style.display = 'block';
    }

    if (tabAdminsButton) {
        tabAdminsButton.style.display = isSuperAdmin ? 'inline-block' : 'none';
    }
}

window.addEventListener('load', async () => {
    loadAdminAccounts();

    const loginSectionElement = document.getElementById('loginSection');
    const adminContentElement = document.getElementById('adminContent');

    await showAdminPanel();

    const loginButtonElement = document.getElementById('login-button');
    if (loginButtonElement) {
        loginButtonElement.addEventListener('click', loginAdmin);
    }

    const logoutButtonAdminElement = document.getElementById('logout-admin-button');
    if (logoutButtonAdminElement) {
        logoutButtonAdminElement.addEventListener('click', logoutAdmin);
    }

    const formBuscaClienteElement = document.getElementById('form-busca-cliente');
    if (formBuscaClienteElement) {
        formBuscaClienteElement.addEventListener('submit', handleBuscarCliente);
    }

    setupTabs();
    
    if (isAdminLoggedIn) {
        switchTab('budgets'); 
    }
});

const formBuscarCliente = document.getElementById('form-busca-cliente');
const resultadosBuscaDiv = document.getElementById('resultados-busca');
const detalhesClienteDiv = document.getElementById('detalhes-cliente');
const listaPedidosClienteAdm = document.getElementById('lista-pedidos-cliente-adm');
const listaHistoricoClienteAdm = document.getElementById('lista-historico-cliente-adm');

if (formBuscarCliente) {
    formBuscarCliente.addEventListener('submit', handleBuscarCliente);
}

if (productSearchInput) {
    productSearchInput.addEventListener('input', () => {
        const searchTerm = productSearchInput.value.trim().toLowerCase();
        const filteredProducts = products.filter(product => {
            const productNameLower = (product.name || '').toLowerCase();
            const productDetailsLower = (product.details || '').toLowerCase();
            return productNameLower.includes(searchTerm) || productDetailsLower.includes(searchTerm);
        });
        renderAdminProducts(filteredProducts);
    });
}

function carregarSuportesDoCliente(emailCliente) {
    const todosSuportes = localStorage.getItem('pedidosSuporte');
    return todosSuportes ? JSON.parse(todosSuportes).filter(suporte => suporte.email && suporte.email.trim().toLowerCase() === emailCliente.trim().toLowerCase()) : [];
}

function carregarFaleConoscosDoCliente(emailCliente) {
    const todasMensagens = localStorage.getItem('mensagensFaleConosco');
    return todasMensagens ? JSON.parse(todasMensagens).filter(mensagem => mensagem.email && mensagem.email.trim().toLowerCase() === emailCliente.trim().toLowerCase()) : [];
}

function carregarOrcamentosDoCliente(emailCliente) {
    const todosOrcamentos = localStorage.getItem('orcamentos');
    return todosOrcamentos ? JSON.parse(todosOrcamentos).filter(orcamento => orcamento.email && orcamento.email.trim().toLowerCase() === emailCliente.trim().toLowerCase()) : [];
}

function carregarPedidosAtivosDoCliente(emailCliente) {
    const chavePedidosCliente = `pedidos_${emailCliente.replace(/[^a-zA-Z0-9]/g, '')}`;
    const todosPedidos = localStorage.getItem(chavePedidosCliente);
    return todosPedidos ? JSON.parse(todosPedidos).filter(pedido => pedido.status !== 'Entregue' && pedido.status !== 'Concluido') : [];
}

function carregarHistoricoPedidosLojaDoCliente(emailCliente) {
    const chavePedidosCliente = `pedidos_${emailCliente.replace(/[^a-zA-Z0-9]/g, '')}`;
    const todosPedidos = localStorage.getItem(chavePedidosCliente);
    return todosPedidos ? JSON.parse(todosPedidos).filter(pedido => pedido.status === 'Entregue' || pedido.status === 'Concluido' || pedido.status === 'Pago') : [];
}

function addAdminAccount() {
    const nameInput = document.getElementById('add-admin-name');
    const emailInput = document.getElementById('add-admin-email');
    const passwordInput = document.getElementById('add-admin-password');
    const addAdminMessage = document.getElementById('add-admin-message');
    const addAdminError = document.getElementById('add-admin-error');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (name && email && password) {
        const newAdmin = { name: name, email: email, password: password, isSuper: false };
        adminAccounts.push(newAdmin);
        saveAdminAccounts(adminAccounts);
        renderAdminList();

        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        addAdminMessage.style.display = 'block';
        addAdminError.style.display = 'none';

        setTimeout(() => {
            addAdminMessage.style.display = 'none';
        }, 3000);
    } else {
        addAdminMessage.style.display = 'none';
        addAdminError.style.display = 'block';
        addAdminError.textContent = 'Por favor, preencha todos os campos.';
    }
}

if (addProductForm) {
    addProductForm.addEventListener('submit', addProductHandler);
}

if (addNewsForm) {
    addNewsForm.addEventListener('submit', addNewsHandler);
}

function renderPopularProductsAdmin() {
    const listElement = document.getElementById('popular-products-checkbox-list');
    if (!listElement) return;
    listElement.innerHTML = '';

    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.classList.add('popular-item');

        const productInfoDiv = document.createElement('div');
        productInfoDiv.classList.add('popular-product-info');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = product.id;
        checkbox.id = `popular-${product.id}`;
        checkbox.checked = popularProductsList.includes(product.id);

        const label = document.createElement('label');
        label.textContent = product.name;
        label.htmlFor = checkbox.id;

        productInfoDiv.appendChild(checkbox);
        productInfoDiv.appendChild(label);
        listItem.appendChild(productInfoDiv);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('button', 'delete-item-button', 'danger');
        deleteButton.dataset.productId = product.id;
        deleteButton.addEventListener('click', removePopularProduct);
        listItem.appendChild(deleteButton);

        listElement.appendChild(listItem);
    });

    const form = document.getElementById('popular-products-form');
    if (form) {
        form.addEventListener('submit', savePopularProducts);
    }
}

function savePopularProducts(event) {
    event.preventDefault();
    const checkboxes = document.querySelectorAll('#popular-products-checkbox-list input[type="checkbox"]:checked');
    const selectedProducts = Array.from(checkboxes).map(cb => cb.value);
    savePopularProductsToLocalStorage(selectedProducts);
    popularProductsList = selectedProducts;
    alert('Produtos mais procurados salvos!');
}

function removePopularProduct(event) {
    const productIdToRemove = event.currentTarget.dataset.productId;
    popularProductsList = popularProductsList.filter(id => id !== productIdToRemove);
    savePopularProductsToLocalStorage(popularProductsList);
    renderPopularProductsAdmin();
    alert('Produto removido dos Mais Procurados!');
}

function renderNewProductsAdminList() {
    const listElement = document.getElementById('new-products-checkbox-list');
    if (!listElement) return;
    listElement.innerHTML = '';

    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.classList.add('new-item');

        const productInfoDiv = document.createElement('div');
        productInfoDiv.classList.add('new-product-info');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = product.id;
        checkbox.id = `new-${product.id}`;
        checkbox.checked = newProductsListAdmin.includes(product.id);

        const label = document.createElement('label');
        label.textContent = product.name;
        label.htmlFor = checkbox.id;

        productInfoDiv.appendChild(checkbox);
        productInfoDiv.appendChild(label);
        listItem.appendChild(productInfoDiv);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('button', 'delete-item-button', 'danger');
        deleteButton.dataset.productId = product.id;
        deleteButton.addEventListener('click', removeNewProduct);
        listItem.appendChild(deleteButton);

        listElement.appendChild(listItem);
    });

    const form = document.getElementById('new-products-form');
    if (form) {
        form.addEventListener('submit', saveNewProductsAdmin);
    }
}

function saveNewProductsAdmin(event) {
    event.preventDefault();
    const checkboxes = document.querySelectorAll('#new-products-checkbox-list input[type="checkbox"]:checked');
    const selectedProducts = Array.from(checkboxes).map(cb => cb.value);
    saveNewProductsAdminToLocalStorage(selectedProducts);
    newProductsListAdmin = selectedProducts;
    alert('Novos produtos salvos!');
}

function removeNewProduct(event) {
    const productIdToRemove = event.currentTarget.dataset.productId;
    newProductsListAdmin = newProductsListAdmin.filter(id => id !== productIdToRemove);
    saveNewProductsAdminToLocalStorage(newProductsListAdmin);
    renderNewProductsAdminList();
    alert('Produto removido dos Novos Produtos!');
}

function renderOffersAdminList() {
    const listElement = document.getElementById('offers-checkbox-list');
    if (!listElement) return;
    listElement.innerHTML = '';

    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.classList.add('offer-item');

        const productInfoDiv = document.createElement('div');
        productInfoDiv.classList.add('offer-product-info');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = product.id;
        checkbox.id = `offer-${product.id}`;
        checkbox.checked = offersListAdmin.some(offer => offer.id === product.id);

        const label = document.createElement('label');
        label.textContent = product.name;
        label.htmlFor = checkbox.id;

        productInfoDiv.appendChild(checkbox);
        productInfoDiv.appendChild(label);
        listItem.appendChild(productInfoDiv);

        const offerPricesDiv = document.createElement('div');
        offerPricesDiv.classList.add('offer-prices');

        const offerData = offersListAdmin.find(offer => offer.id === product.id);
        const precoAntigoValue = offerData ? offerData.precoAntigo : '';
        const precoAtualValue = offerData ? offerData.precoAtual : '';

        const priceOldInput = document.createElement('input');
        priceOldInput.type = 'number';
        priceOldInput.placeholder = 'Preço Antigo';
        priceOldInput.id = `old-price-${product.id}`;
        priceOldInput.value = precoAntigoValue;

        const priceCurrentInput = document.createElement('input');
        priceCurrentInput.type = 'number';
        priceCurrentInput.placeholder = 'Preço Oferta';
        priceCurrentInput.id = `current-price-${product.id}`;
        priceCurrentInput.value = precoAtualValue;

        offerPricesDiv.appendChild(priceOldInput);
        offerPricesDiv.appendChild(priceCurrentInput);
        listItem.appendChild(offerPricesDiv);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.classList.add('button', 'delete-item-button', 'danger');
        deleteButton.dataset.productId = product.id;
        deleteButton.addEventListener('click', removeOfferProduct);
        listItem.appendChild(deleteButton);

        listElement.appendChild(listItem);
    });

    const form = document.getElementById('offers-form');
    if (form) {
        form.addEventListener('submit', saveOffersAdmin);
    }
}

function saveOffersAdmin(event) {
    event.preventDefault();
    const checkboxes = document.querySelectorAll('#offers-checkbox-list input[type="checkbox"]:checked');
    const selectedOffers = Array.from(checkboxes).map(cb => {
        const productId = cb.value;
        const oldPriceInput = document.getElementById(`old-price-${productId}`);
        const currentPriceInput = document.getElementById(`current-price-${productId}`);
        return {
            id: productId,
            precoAntigo: oldPriceInput ? parseFloat(oldPriceInput.value).toFixed(2) : null,
            precoAtual: currentPriceInput ? parseFloat(currentPriceInput.value).toFixed(2) : null
        };
    });
    saveOffersAdminToLocalStorage(selectedOffers);
    offersListAdmin = selectedOffers;
    alert('Ofertas da semana salvas!');
}

function removeOfferProduct(event) {
    const productIdToRemove = event.currentTarget.dataset.productId;
    offersListAdmin = offersListAdmin.filter(offer => offer.id !== productIdToRemove);
    saveOffersAdminToLocalStorage(offersListAdmin);
    renderOffersAdminList();
    alert('Produto removido das Ofertas da Semana!');
}

let isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

function applyTheme() {
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        if (themeToggleButton) themeToggleButton.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        if (themeToggleButton) themeToggleButton.textContent = '🌙';
    }
}

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        localStorage.setItem('isDarkTheme', isDarkTheme);
        applyTheme();
    });
}

applyTheme();

async function loadAdminDashboard() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        document.getElementById('admin-name').textContent = data.usuario;
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}