let isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
let isSuperAdmin = localStorage.getItem('isAdminSuper') === 'true';
let adminAccounts = loadAdminAccounts();

// Seleção de elementos do DOM
const loginSection = document.getElementById('login-section');
const adminContent = document.getElementById('admin-content');
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


// Dados iniciais
let products = loadProductsFromLocalStorage();
let news = loadNewsFromLocalStorage();

// Funções para manipulação de dados no localStorage
function loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

function saveProductsToLocalStorage(productsToSave) {
    localStorage.setItem('products', JSON.stringify(productsToSave));
}

function loadNewsFromLocalStorage() {
    const storedNews = localStorage.getItem('news');
    return storedNews ? JSON.parse(storedNews) : [];
}

function saveNewsToLocalStorage(newsToSave) {
    localStorage.setItem('news', JSON.stringify(newsToSave));
}

function loadAdminAccounts() {
    const storedAccounts = localStorage.getItem('adminAccounts');
    return storedAccounts ? JSON.parse(storedAccounts) : [];
}

function saveAdminAccounts(accounts) {
    localStorage.setItem('adminAccounts', JSON.stringify(accounts));
}

// Funções para controle da interface
function showAdminPanel() {
    const tabAdmins = document.getElementById('tab-admins');
    const adminsContent = document.getElementById('admins-content');
    const loggedInAdminNameElement = document.getElementById('logged-in-admin-name');

    if (loginSection) loginSection.style.display = 'none';
    if (adminContent) adminContent.style.display = 'block';

    if (loggedInAdminNameElement) {
        const loggedInName = localStorage.getItem('loggedInAdminName');
        if (loggedInName) {
            loggedInAdminNameElement.textContent = loggedInName;
        } else {
            loggedInAdminNameElement.textContent = '';
        }
    }

    if (tabAdmins) {
        tabAdmins.style.display = isSuperAdmin ? 'inline-block' : 'none';
    }

    if (isSuperAdmin) {
        renderAdminList();
        if (adminsContent) adminsContent.style.display = 'block';
    } else if (adminsContent) {
        adminsContent.innerHTML = '<p>Acesso restrito.</p>';
        adminsContent.style.display = 'block';
    }

    setupTabs();
    renderAdminProducts(products);
    renderNewsList();
    renderOrcamentos();
    renderPedidosSuporte();
    renderMensagensFaleConosco();
}


function logoutAdmin() {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('loggedInAdminEmail');
    localStorage.removeItem('isAdminSuper');
    window.location.href = 'ADM.html';
}

function loginAdmin() {
    const emailInput = document.getElementById('admin-email').value;
    const passwordInput = document.getElementById('admin-password').value;
    const loginError = document.getElementById('login-error');

    console.log('Email digitado:', emailInput);
    console.log('Senha digitada:', passwordInput);
    console.log('Lista de admins:', adminAccounts);

    if (emailInput === '1@gmail.com' && passwordInput === '1') {
        isAdminLoggedIn = true;
        isSuperAdmin = true;
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('loggedInAdminEmail', emailInput);
        localStorage.setItem('isAdminSuper', 'true');
        localStorage.setItem('loggedInAdminName', 'Super Admin'); // Salva o nome para o Super Admin
        loginError.style.display = 'none';
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        showAdminPanel();
    } else {
        const admin = adminAccounts.find(acc => acc.email === emailInput && acc.password === passwordInput);
        if (admin) {
            isAdminLoggedIn = true;
            isSuperAdmin = false;
            localStorage.setItem('isAdminLoggedIn', 'true');
            localStorage.setItem('loggedInAdminEmail', emailInput);
            localStorage.setItem('isAdminSuper', 'false');
            localStorage.setItem('loggedInAdminName', admin.name); // Salva o nome do admin logado
            loginError.style.display = 'none';
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            showAdminPanel();
        } else {
            console.log('Credenciais inválidas!');
            loginError.style.display = 'block';
        }
    }
}

function switchTab(tabName) {
    const tabs = [tabProducts, tabAddProduct, tabAddNews, tabAdmins, tabBudgets, tabSupportRequests, tabContactUs];
    const contents = [productsContent, addProductContent, addNewsContent, adminsContent, budgetsContent, supportRequestsContent, contactUsContent];
    const tabAdminsButton = document.getElementById('tab-admins');
    const adminsContentDiv = document.getElementById('admins-content');

    tabs.forEach(tab => {
        if (tab) tab.classList.remove('active');
    });

    contents.forEach(content => {
        if (content) content.classList.remove('active');
    });

    if (tabName === 'products' && tabProducts && productsContent) {
        tabProducts.classList.add('active');
        productsContent.classList.add('active');
        products = loadProductsFromLocalStorage();
        // *** ADICIONANDO UM PEQUENO DELAY ANTES DE RENDERIZAR ***
        setTimeout(() => {
            const productList = document.getElementById('product-list');
            if (productList) {
                renderAdminProducts(products);
            } else {
                console.error('Elemento productList não encontrado APÓS o timeout ao trocar para a aba Produtos.');
            }
        }, 50); // Um delay de 50 milissegundos
        if (adminsContentDiv) adminsContentDiv.style.display = 'none';
    } else if (tabName === 'add-product' && tabAddProduct && addProductContent) {
        tabAddProduct.classList.add('active');
        addProductContent.classList.add('active');
        if (adminsContentDiv) adminsContentDiv.style.display = 'none';
    } else if (tabName === 'add-news' && tabAddNews && addNewsContent) {
        tabAddNews.classList.add('active');
        addNewsContent.classList.add('active');
        renderNewsList();
        if (adminsContentDiv) adminsContentDiv.style.display = 'none';
    } else if (tabName === 'admins' && tabAdmins && adminsContent) {
        tabAdmins.classList.add('active');
        adminsContent.classList.add('active');
        if (isSuperAdmin) renderAdminList();
        if (adminsContentDiv) adminsContentDiv.style.display = 'block';
    } else if (tabName === 'budgets' && tabBudgets && budgetsContent) {
        tabBudgets.classList.add('active');
        budgetsContent.classList.add('active');
        renderOrcamentos();
        if (adminsContentDiv) adminsContentDiv.style.display = 'none';
    } else if (tabName === 'support-requests' && tabSupportRequests && supportRequestsContent) {
        tabSupportRequests.classList.add('active');
        supportRequestsContent.classList.add('active');
        renderPedidosSuporte();
        if (adminsContentDiv) adminsContentDiv.style.display = 'none';
    } else if (tabName === 'contact-us' && tabContactUs && contactUsContent) {
        tabContactUs.classList.add('active');
        contactUsContent.classList.add('active');
        renderMensagensFaleConosco();
        if (adminsContentDiv) adminsContentDiv.style.display = 'none';
    }

    if (tabAdminsButton) {
        tabAdminsButton.style.display = isSuperAdmin ? 'inline-block' : 'none';
    }
}

// Garante que a seção de admins esteja escondida inicialmente
window.addEventListener('load', () => {
    loadAdminAccounts();

    // *** GARANTE QUE productList SEJA DEFINIDO IMEDIATAMENTE ***
    const productList = document.getElementById('product-list');
    console.log('Elemento productList (no load):', productList);

    const loginSectionElement = document.getElementById('loginSection');
    const adminContentElement = document.getElementById('adminContent');

    // Verifica se o admin já está logado
    if (isAdminLoggedIn) {
        showAdminPanel();
        if (loginSectionElement) {
            loginSectionElement.style.display = 'none';
        }
        if (adminContentElement) {
            adminContentElement.style.display = 'block';
        }
    } else {
        if (loginSectionElement) {
            loginSectionElement.style.display = 'flex';
        }
        if (adminContentElement) {
            adminContentElement.style.display = 'none';
        }
    }

    const loginButtonElement = document.getElementById('login-button');
    if (loginButtonElement) {
        loginButtonElement.addEventListener('click', loginAdmin);
    }

    const logoutButtonAdminElement = document.getElementById('logout-admin-button');
    if (logoutButtonAdminElement) {
        logoutButtonAdminElement.addEventListener('click', logoutAdmin);
    }

    setupTabs();
    // A CHAMADA A renderAdminProducts JÁ ESTÁ DENTRO DE showAdminPanel()
});

function setupTabs() {
    if (tabProducts) tabProducts.addEventListener('click', () => switchTab('products'));
    if (tabAddProduct) tabAddProduct.addEventListener('click', () => switchTab('add-product'));
    if (tabAddNews) tabAddNews.addEventListener('click', () => switchTab('add-news'));
    if (tabAdmins) tabAdmins.addEventListener('click', () => switchTab('admins'));
    if (tabBudgets) tabBudgets.addEventListener('click', () => switchTab('budgets'));
    if (tabSupportRequests) tabSupportRequests.addEventListener('click', () => switchTab('support-requests'));
    if (tabContactUs) tabContactUs.addEventListener('click', () => switchTab('contact-us'));

    switchTab('add-news');
}

// Funções para renderizar dados na página
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
        const newAdmin = { name: name, email: email, password: password, isSuper: false }; // Defina isSuper como false por padrão
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

function renderAdminProducts(productsToRender) {
    console.log('Função renderAdminProducts chamada com:', productsToRender);

    const productList = document.getElementById('product-list'); // Garante que productList esteja definida LOCALMENTE

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
        listItem.dataset.productId = product.id || index;

        const valueAsNumber = parseFloat(product.value);
        const formattedValue = !isNaN(valueAsNumber)
            ? valueAsNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : 'Valor inválido';

        listItem.innerHTML = `
            <div class="product-info">
                <div class="product-name">${product.name || 'Nome Indefinido'}</div>
                <div class="product-details">${product.details || 'Sem detalhes'}</div>
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
            <div class="edit-controls">
                <div class="edit-control-group">
                    <label for="value-${index}">Novo Valor (Ex: 1800.00):</label>
                    <input type="number" step="0.01" min="0" id="value-${index}" value="${product.value || ''}">
                </div>
                <div class="edit-control-group">
                    <label for="quantity-${index}">Nova Qtd:</label>
                    <input type="number" id="quantity-${index}" value="${product.quantity || 0}" min="0">
                </div>
                <div class="edit-action-buttons">
                    <button class="button save" data-index="${index}">Salvar</button>
                    <button class="button cancel" data-index="${index}">Cancelar</button>
                </div>
            </div>
        `;
        productList.appendChild(listItem); // Adiciona o item à lista
    });

    attachProductEventListeners(); // Vincula os eventos aos botões
}

function renderNewsList() {
    const newsListElement = document.getElementById('news-list');
    if (!newsListElement) return;

    newsListElement.innerHTML = ''; // Limpa a lista

    if (!news || news.length === 0) {
        newsListElement.innerHTML = '<li class="no-news-message">Nenhuma notícia cadastrada.</li>';
        return;
    }

    news.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('news-item');
        listItem.innerHTML = `
            <div class="news-info">
                <h3>${item.title}</h3>
                <p class="news-date">${item.date}</p>
                <p class="news-description">${item.description}</p>
            </div>
            <div class="news-actions">
                <button class="button edit-news" data-index="${index}">Editar</button>
                <button class="button delete-news danger" data-index="${index}">Excluir</button>
            </div>
            <div class="edit-news-controls" style="display: none;">
                <label for="edit-title-${index}">Título:</label>
                <input type="text" id="edit-title-${index}" value="${item.title}">
                <label for="edit-description-${index}">Descrição:</label>
                <textarea id="edit-description-${index}">${item.description}</textarea>
                <div class="edit-action-buttons">
                    <button class="button save-edit-news" data-index="${index}">Salvar</button>
                    <button class="button cancel-edit-news" data-index="${index}">Cancelar</button>
                </div>
            </div>
        `;
        newsListElement.appendChild(listItem);
    });

    // Adicione os event listeners PARA OS BOTÕES DE EDITAR E SALVAR AQUI
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
    const index = parseInt(button.dataset.index);
    const productInfo = productItem.querySelector('.product-info');
    const productActions = productItem.querySelector('.product-actions');
    const editControls = productItem.querySelector('.edit-controls');

    // Oculta a informação e os botões de ação
    productInfo.style.display = 'none';
    productActions.style.display = 'none';

    // Exibe os controles de edição
    editControls.style.display = 'flex';
}

function handleDeleteProduct(event) {
    const button = event.currentTarget;
    const index = parseInt(button.dataset.index);
    const productToDelete = products[index]; // 'products' é o seu array global de produtos

    if (confirm(`Tem certeza que deseja excluir o produto "${productToDelete.name || 'sem nome'}"?`)) {
        products.splice(index, 1);
        saveProductsToLocalStorage(products);
        renderAdminProducts(products); // Atualiza a lista na tela
        alert('Produto excluído com sucesso!');
    }
}

function handleCancelProductEdit(event) {
    const button = event.currentTarget;
    const productItem = button.closest('.product-item');
    const actions = productItem.querySelector('.product-actions');
    const editControls = productItem.querySelector('.edit-controls');

    actions.style.display = 'flex';
    editControls.style.display = 'none';
}

function handleCancelEditNews(event) {
    const button = event.currentTarget;
    const newsItem = button.closest('.news-item');
    const newsInfo = newsItem.querySelector('.news-info');
    const newsActions = newsItem.querySelector('.news-actions');
    const editControls = newsItem.querySelector('.edit-news-controls');

    console.log('newsItem:', newsItem);
    console.log('newsInfo:', newsInfo);
    console.log('newsActions:', newsActions);
    console.log('editControls:', editControls);

    if (newsInfo) newsInfo.style.display = 'block';
    if (newsActions) newsActions.style.display = 'flex';
    if (editControls) editControls.style.display = 'none';
}

function handleSaveProductEdit(event) {
    const button = event.currentTarget;
    const productItem = button.closest('.product-item');
    const index = parseInt(button.dataset.index);
    const valueInput = productItem.querySelector(`#value-${index}`);
    const quantityInput = productItem.querySelector(`#quantity-${index}`);
    const productInfo = productItem.querySelector('.product-info');
    const productActions = productItem.querySelector('.product-actions');
    const editControls = productItem.querySelector('.edit-controls');

    const newValue = parseFloat(valueInput.value);
    const newQuantity = parseInt(quantityInput.value);

    if (!isNaN(newValue) && !isNaN(newQuantity) && newValue >= 0 && newQuantity >= 0) {
        products[index].value = newValue.toFixed(2);
        products[index].quantity = newQuantity;
        saveProductsToLocalStorage(products);
        renderAdminProducts(products); // Atualiza a lista na tela

        // Volta para a visualização normal
        productInfo.style.display = 'block';
        productActions.style.display = 'flex';
        editControls.style.display = 'none';
    } else {
        alert('Por favor, insira valores válidos para valor e quantidade.');
    }
}

function handleEditNewsItem(event) {
    const button = event.currentTarget;
    const newsItem = button.closest('.news-item');
    const index = parseInt(button.dataset.index);
    const newsInfo = newsItem.querySelector('.news-info');
    const newsActions = newsItem.querySelector('.news-actions');
    const editControls = newsItem.querySelector('.edit-news-controls');
    const editTitleInput = editControls.querySelector(`#edit-title-${index}`);
    const editDescriptionTextarea = editControls.querySelector(`#edit-description-${index}`);

    // Preenche os campos de edição com os valores atuais
    editTitleInput.value = news[index].title;
    editDescriptionTextarea.value = news[index].description;

    // Oculta a informação e os botões de ação
    newsInfo.style.display = 'none';
    newsActions.style.display = 'none';

    // Exibe os controles de edição
    editControls.style.display = 'flex';
}

function handleSaveEditNews(event) {
    const button = event.currentTarget;
    const newsItem = button.closest('.news-item');
    const index = parseInt(button.dataset.index);
    const editTitleInput = newsItem.querySelector(`#edit-title-${index}`);
    const editDescriptionTextarea = newsItem.querySelector(`#edit-description-${index}`);
    const newsInfo = newsItem.querySelector('.news-info');
    const newsActions = newsItem.querySelector('.news-actions');
    const editControls = newsItem.querySelector('.edit-news-controls');

    const newTitle = editTitleInput.value.trim();
    const newDescription = editDescriptionTextarea.value.trim();

    if (newTitle && newDescription) {
        news[index].title = newTitle;
        news[index].description = newDescription;
        saveNewsToLocalStorage(news);
        renderNewsList(); // Atualiza a lista na tela

        // Volta para a visualização normal
        newsInfo.style.display = 'block';
        newsActions.style.display = 'flex';
        editControls.style.display = 'none';
    } else {
        alert('Por favor, preencha o título e a descrição da notícia.');
    }
}


function handleDeleteNewsItem(event) {
    const button = event.currentTarget;
    const index = parseInt(button.dataset.index);
    const newsItem = news[index];

    if (confirm(`Tem certeza que deseja excluir a notícia "${newsItem.title}"?`)) {
        news.splice(index, 1);
        saveNewsToLocalStorage(news);
        renderNewsList();
        alert('Notícia excluída com sucesso!');
    }
}

function renderOrcamentos() {
    const budgetsContent = document.getElementById('budgets-content');
    if (!budgetsContent) return;
    budgetsContent.innerHTML = '';

    const orcamentos = localStorage.getItem('orcamentos');
    const listaOrcamentos = orcamentos ? JSON.parse(orcamentos) : [];

    if (listaOrcamentos.length === 0) {
        budgetsContent.innerHTML = '<p>Nenhum orçamento recebido.</p>';
        return;
    }

    const listaHTML = document.createElement('ul');
    listaOrcamentos.forEach((orcamento, index) => {
        const isConcluido = orcamento.concluido || false;

        const itemLista = document.createElement('li');
        itemLista.innerHTML = `
            <strong>Nome:</strong> ${orcamento.nome}<br>
            <strong>Email:</strong> ${orcamento.email}<br>
            <strong>Telefone:</strong> ${orcamento.telefone}<br>
            <strong>Serviço Solicitado:</strong> ${orcamento.servico}<br>
            <strong>Descrição:</strong> ${orcamento.descricao}<br>
            <strong>Data de Envio:</strong> ${orcamento.dataEnvio}<br>
            <label>
                Concluído:
                <input type="checkbox" data-index="${index}" ${isConcluido ? 'checked' : ''} onchange="atualizarStatusOrcamento(this)">
            </label>
            <button class="button delete-button danger" onclick="excluirOrcamento(${index})">Excluir</button>
            <hr>
        `;
        listaHTML.appendChild(itemLista);
    });

    budgetsContent.appendChild(listaHTML);
}

window.excluirOrcamento = function(index) {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
        const orcamentos = localStorage.getItem('orcamentos');
        let listaOrcamentos = orcamentos ? JSON.parse(orcamentos) : [];

        if (index >= 0 && index < listaOrcamentos.length) {
            listaOrcamentos.splice(index, 1);
            localStorage.setItem('orcamentos', JSON.stringify(listaOrcamentos));
            renderOrcamentos();
        } else {
            console.error('Índice de orçamento inválido:', index);
        }
    }
};

window.atualizarStatusOrcamento = function(checkbox) {
    const index = parseInt(checkbox.dataset.index);
    const isChecked = checkbox.checked;

    const orcamentos = localStorage.getItem('orcamentos');
    let listaOrcamentos = orcamentos ? JSON.parse(orcamentos) : [];

    if (index >= 0 && index < listaOrcamentos.length) {
        listaOrcamentos[index] = { ...listaOrcamentos[index], concluido: isChecked };
        localStorage.setItem('orcamentos', JSON.stringify(listaOrcamentos));
    } else {
        console.error('Índice de orçamento inválido para atualização de status:', index);
    }
};

function renderPedidosSuporte() {
    const supportRequestsContent = document.getElementById('support-requests-content');
    if (!supportRequestsContent) return;
    supportRequestsContent.innerHTML = '<h2>Pedidos de Suporte</h2>';
    const pedidos = loadPedidosSuporte();
    if (pedidos.length === 0) {
        supportRequestsContent.innerHTML += '<p>Nenhum pedido de suporte recebido.</p>';
        return;
    }
    const listaPedidos = document.createElement('ul');
    pedidos.forEach((pedido, index) => {
        const isConcluido = pedido.concluido || false;

        const item = document.createElement('li');
        item.innerHTML = `
            <strong>Nome:</strong> ${pedido.nome}<br>
            <strong>Email:</strong> ${pedido.email}<br>
            <strong>Problema:</strong> ${pedido.problema}<br>
            <strong>Detalhes:</strong> ${pedido.detalhes}<br>
            <strong>Enviado em:</strong> ${pedido.dataEnvio}<br>
            <label>
                Concluído:
                <input type="checkbox" data-index="${index}" ${isConcluido ? 'checked' : ''} onchange="atualizarStatusSuporte(this)">
            </label>
            <button class="button delete-button danger" onclick="excluirPedidoSuporte(${index})">Excluir</button>
            <hr>
        `;
        listaPedidos.appendChild(item);
    });
    supportRequestsContent.appendChild(listaPedidos);
}

window.atualizarStatusSuporte = function(checkbox) {
    const index = parseInt(checkbox.dataset.index);
    const isChecked = checkbox.checked;

    let pedidos = loadPedidosSuporte();
    if (index >= 0 && index < pedidos.length) {
        pedidos[index] = { ...pedidos[index], concluido: isChecked };
        localStorage.setItem('pedidosSuporte', JSON.stringify(pedidos));
    } else {
        console.error('Índice inválido de pedido de suporte:', index);
    }
};

window.excluirPedidoSuporte = function(index) {
    if (confirm('Deseja excluir este pedido de suporte?')) {
        let pedidos = loadPedidosSuporte();
        if (index >= 0 && index < pedidos.length) {
            pedidos.splice(index, 1);
            localStorage.setItem('pedidosSuporte', JSON.stringify(pedidos));
            renderPedidosSuporte();
        } else {
            console.error('Índice inválido para exclusão de suporte:', index);
        }
    }
};

function renderMensagensFaleConosco() {
    const contactUsContent = document.getElementById('contact-us-content');
    if (!contactUsContent) return;
    contactUsContent.innerHTML = '<h2>Mensagens Fale Conosco</h2>';
    const mensagens = loadMensagensFaleConosco();
    if (mensagens.length === 0) {
        contactUsContent.innerHTML += '<p>Nenhuma mensagem recebida.</p>';
        return;
    }
    const listaMensagens = document.createElement('ul');
    mensagens.forEach((mensagem, index) => {
        const isConcluido = mensagem.concluido || false;

        const item = document.createElement('li');
        item.innerHTML = `
            <strong>Nome:</strong> ${mensagem.nome}<br>
            <strong>Email:</strong> ${mensagem.email}<br>
            <strong>Assunto:</strong> ${mensagem.assunto}<br>
            <strong>Mensagem:</strong> ${mensagem.mensagem}<br>
            <strong>Enviado em:</strong> ${mensagem.dataEnvio}<br>
            <label>
                Concluído:
                <input type="checkbox" data-index="${index}" ${isConcluido ? 'checked' : ''} onchange="atualizarStatusMensagem(this)">
            </label>
            <button class="button delete-button danger" onclick="excluirMensagem(${index})">Excluir</button>
            <hr>
        `;
        listaMensagens.appendChild(item);
    });
    contactUsContent.appendChild(listaMensagens);
}

window.atualizarStatusMensagem = function(checkbox) {
    const index = parseInt(checkbox.dataset.index);
    const isChecked = checkbox.checked;

    let mensagens = loadMensagensFaleConosco();
    if (index >= 0 && index < mensagens.length) {
        mensagens[index] = { ...mensagens[index], concluido: isChecked };
        localStorage.setItem('mensagensFaleConosco', JSON.stringify(mensagens));
    } else {
        console.error('Índice inválido de mensagem Fale Conosco:', index);
    }
};

window.excluirMensagem = function(index) {
    if (confirm('Deseja excluir esta mensagem?')) {
        let mensagens = loadMensagensFaleConosco();
        if (index >= 0 && index < mensagens.length) {
            mensagens.splice(index, 1);
            localStorage.setItem('mensagensFaleConosco', JSON.stringify(mensagens));
            renderMensagensFaleConosco();
        } else {
            console.error('Índice inválido para exclusão de mensagem:', index);
        }
    }
};

function loadOrcamentos() {
    const storedOrcamentos = localStorage.getItem('orcamentos');
    return storedOrcamentos ? JSON.parse(storedOrcamentos) : [];
}

function loadPedidosSuporte() {
    const storedPedidos = localStorage.getItem('pedidosSuporte');
    return storedPedidos ? JSON.parse(storedPedidos) : [];
}

function loadMensagensFaleConosco() {
    const storedMensagens = localStorage.getItem('mensagensFaleConosco');
    return storedMensagens ? JSON.parse(storedMensagens) : [];
}

window.addEventListener('load', () => {
    loadAdminAccounts();

    const productList = document.getElementById('product-list');
    console.log('Elemento productList (no load):', productList);

    const loginSectionElement = document.getElementById('loginSection'); // Use o ID correto (com 'S' maiúsculo)
    const adminContentElement = document.getElementById('adminContent');   // Use o ID correto (com 'C' maiúsculo)

    // Garante que a seção de login seja mostrada inicialmente e o conteúdo admin escondido
    if (loginSectionElement) {
        loginSectionElement.style.display = 'flex'; // Ou 'block', dependendo do seu CSS
    }
    if (adminContentElement) {
        adminContentElement.style.display = 'none';
    }

    // Verifica se o admin já está logado
    if (isAdminLoggedIn) {
        showAdminPanel();
        if (loginSectionElement) {
            loginSectionElement.style.display = 'none'; // Esconde o login se já estiver logado
        }
        if (adminContentElement) {
            adminContentElement.style.display = 'block'; // Mostra o painel se já estiver logado
        }
    }

    const loginButtonElement = document.getElementById('login-button'); // Use o ID correto do botão
    if (loginButtonElement) {
        loginButtonElement.addEventListener('click', loginAdmin);
    }

    const logoutButtonAdminElement = document.getElementById('logout-admin-button'); // Use o ID correto
    if (logoutButtonAdminElement) {
        logoutButtonAdminElement.addEventListener('click', logoutAdmin);
    }

    setupTabs();
});;

function enviarPedidoSuporte() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const problema = document.getElementById('problema').value;
    const detalhes = document.getElementById('detalhes').value;

    const novoPedidoSuporte = {
        id: Date.now().toString(),
        nome,
        email,
        problema,
        detalhes,
        dataEnvio: new Date().toLocaleString()
    };

    let pedidosSuporte = localStorage.getItem('pedidosSuporte');
    pedidosSuporte = pedidosSuporte ? JSON.parse(pedidosSuporte) : [];
    pedidosSuporte.push(novoPedidoSuporte);
    localStorage.setItem('pedidosSuporte', JSON.stringify(pedidosSuporte));

    alert('Pedido de suporte enviado com sucesso!');
}

addAdminBtn.addEventListener('click', () => {
    if (!isSuperAdmin) {
        alert('Você não tem permissão para adicionar novos administradores.');
        return;
    }

    const addAdminMessage = document.getElementById('add-admin-message');
    const addAdminError = document.getElementById('add-admin-error');
    const nameInput = document.getElementById('add-admin-name'); // Pegue o campo de nome
    const emailInput = document.getElementById('add-admin-email');
    const passwordInput = document.getElementById('add-admin-password');

    const newName = nameInput.value.trim(); // Obtenha o valor do nome
    const newEmail = emailInput.value;
    const newPassword = passwordInput.value;

    if (!newName || !newEmail || !newPassword) { // Verifique se o nome também foi preenchido
        addAdminError.textContent = 'Por favor, preencha todos os campos.';
        addAdminError.style.display = 'block';
        addAdminMessage.style.display = 'none';
        return;
    }

    if (adminAccounts.some(admin => admin.email === newEmail)) {
        addAdminError.textContent = 'Este email já está cadastrado.';
        addAdminError.style.display = 'block';
        addAdminMessage.style.display = 'none';
        return;
    }

    adminAccounts.push({
        name: newName, // Salve o nome aqui
        email: newEmail,
        password: newPassword,
        isSuper: false
    });

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
});

if (addProductForm) {
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();

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

        if (!name) {
            alert('Por favor, informe o nome do produto.');
            nameInput.focus();
            return;
        }

        if (isNaN(value) || value < 0) {
            alert('Por favor, digite um valor válido.');
            valueInput.focus();
            return;
        }

        if (isNaN(quantity) || quantity < 0) {
            alert('Por favor, digite uma quantidade válida.');
            quantityInput.focus();
            return;
        }

        const newProduct = {
            id: Date.now().toString(),
            name,
            details,
            value: value.toFixed(2),
            quantity,
            image
        };

        products = loadProductsFromLocalStorage(); // Recarregue os produtos
        products.push(newProduct);
        saveProductsToLocalStorage(products);
        renderAdminProducts(products);

        addProductForm.reset();
        alert('Produto adicionado com sucesso!');
        switchTab('products');
    });
}

if (addNewsForm) {
    addNewsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const titleInput = document.getElementById('news-title');
        const descriptionInput = document.getElementById('news-description');

        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!title) {
            alert('Por favor, informe o título da notícia.');
            titleInput.focus();
            return;
        }

        if (!description) {
            alert('Por favor, informe a descrição da notícia.');
            descriptionInput.focus();
            return;
        }

        const newNews = {
            id: Date.now().toString(),
            title,
            description,
            date: new Date().toLocaleDateString()
        };

        news.push(newNews);
        saveNewsToLocalStorage(news);
        renderNewsList();

        addNewsForm.reset();
        alert('Notícia adicionada com sucesso!');
        switchTab('add-news');
    });
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

    // Verifica se o admin está logado ao carregar a página
    if (isAdminLoggedIn) {
        showAdminPanel();
    } else {
        loginSection.style.display = 'flex';
        adminContent.style.display = 'none';
    }
    
