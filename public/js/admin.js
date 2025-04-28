let isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
let loggedInAdmin = localStorage.getItem('loggedInAdmin') ? JSON.parse(localStorage.getItem('loggedInAdmin')) : null;
let adminAccounts = loadAdminAccounts();
let isSuperAdmin = loggedInAdmin ? loggedInAdmin.isSuper : false;
let products = loadProductsFromLocalStorage();
let news = loadNewsFromLocalStorage();
let popularProductsList = loadPopularProductsFromLocalStorage();
let newProductsListAdmin = loadNewProductsAdminFromLocalStorage();
let offersListAdmin = loadOffersAdminFromLocalStorage();

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
const popularProductsContent = document.getElementById('popular-products-content');
const newProductsContent = document.getElementById('new-products-content');
const offersContent = document.getElementById('offers-content');
const tabPopularProducts = document.getElementById('tab-popular-products');
const tabNewProducts = document.getElementById('tab-new-products');
const tabOffers = document.getElementById('tab-offers');
const formBuscaCliente = document.getElementById('form-busca-cliente');
const tabClients = document.getElementById('tab-clients');
const clientContent = document.getElementById('clients-content')
const productSearchInput = document.getElementById('product-search');

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
    const tabs = [tabProducts, tabAddProduct, tabAddNews, tabAdmins, tabBudgets, tabSupportRequests, tabContactUs, tabPopularProducts, tabNewProducts, tabOffers, tabClients];
    const contents = [productsContent, addProductContent, addNewsContent, adminsContent, budgetsContent, supportRequestsContent, contactUsContent, popularProductsContent, newProductsContent, offersContent, clientContent];
    const tabAdminsButton = document.getElementById('tab-admins');
    const adminsContentDiv = document.getElementById('admins-content');
    const clientsContentDiv = document.getElementById('clients-content'); // Obtém a div de clientes
    const footerButtons = document.querySelector('.footer');

    tabs.forEach(tab => {
        if (tab) tab.classList.remove('active');
    });

    contents.forEach(content => {
        if (content) content.classList.remove('active');
    });

    // Esconde a seção de clientes por padrão
    if (clientsContentDiv) {
        clientsContentDiv.style.display = 'none';
    }

    if (footerButtons) {
        footerButtons.style.display = 'none';
    }

    if (tabName === 'products' && tabProducts && productsContent) {
        tabProducts.classList.add('active');
        productsContent.classList.add('active');
        products = loadProductsFromLocalStorage();
        setTimeout(() => {
            const productList = document.getElementById('product-list');
            if (productList) {
                renderAdminProducts(products);
            } else {
                console.error('Elemento productList não encontrado APÓS o timeout ao trocar para a aba Produtos.');
            }
        }, 50);
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
    } else if (tabName === 'popular-products' && tabPopularProducts && popularProductsContent) {
        tabPopularProducts.classList.add('active');
        popularProductsContent.classList.add('active');
        renderPopularProductsAdmin();
        if (adminsContentDiv) adminsContentDiv.style.display = 'none';
    } else if (tabName === 'new-products' && tabNewProducts && newProductsContent) {
        tabNewProducts.classList.add('active');
        newProductsContent.classList.add('active');
        renderNewProductsAdminList();
        if (adminsContentDiv) adminsContentDiv.style.display = 'none';
    } else if (tabName === 'offers' && tabOffers && offersContent) {
        tabOffers.classList.add('active');
        offersContent.classList.add('active');
        renderOffersAdminList();
        if (adminsContentDiv) adminsContentDiv.style.display = 'none';
    } else if (tabName === 'clients' && tabClients && clientContent && clientsContentDiv) {
        tabClients.classList.add('active');
        clientContent.classList.add('active');
        clientsContentDiv.style.display = 'block'; // Mostra a div de clientes
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
        renderPopularProductsAdmin();
        renderNewProductsAdminList();
        renderOffersAdminList();

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

    if (formBuscaCliente) {
        formBuscaCliente.addEventListener('submit', handleBuscarCliente);
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
    if (tabPopularProducts) tabPopularProducts.addEventListener('click', () => switchTab('popular-products'));
    if (tabNewProducts) tabNewProducts.addEventListener('click', () => switchTab('new-products'));
    if (tabOffers) tabOffers.addEventListener('click', () => switchTab('offers'));
    if (tabClients) tabClients.addEventListener('click', () => switchTab('clients'));

    switchTab('products');
}

const formBuscarCliente = document.getElementById('form-busca-cliente');
const resultadosBuscaDiv = document.getElementById('resultados-busca');
const detalhesClienteDiv = document.getElementById('detalhes-cliente');
const listaPedidosClienteAdm = document.getElementById('lista-pedidos-cliente-adm');
const listaHistoricoClienteAdm = document.getElementById('lista-historico-cliente-adm');

if (formBuscarCliente) {
    formBuscarCliente.addEventListener('submit', handleBuscarCliente);
}

// Event listener para o campo de busca de produtos (filtragem em tempo real)
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

async function handleBuscarCliente(event) {
    event.preventDefault();

    const buscaValor = document.getElementById('busca-email-telefone').value.trim().toLowerCase();
    console.log('Valor da busca (trim() e lowercase):', buscaValor);

    if (!buscaValor) {
        if (resultadosBuscaDiv) {
            resultadosBuscaDiv.innerHTML = '<p class="mensagem">Por favor, digite um email ou telefone para buscar.</p>';
        }
        return;
    }

    const chaveUsuarios = 'users';
    const usuariosSalvos = localStorage.getItem(chaveUsuarios);
    let clienteEncontrado = null;

    if (usuariosSalvos) {
        try {
            const usuariosObjeto = JSON.parse(usuariosSalvos);
            console.log('Dados de usuários parseados:', usuariosObjeto);

            for (const email in usuariosObjeto) {
                const emailLower = email.trim().toLowerCase();
                const telefoneLower = (usuariosObjeto[email].phone || '').trim().toLowerCase();

                if (emailLower === buscaValor || telefoneLower === buscaValor) {
                    clienteEncontrado = {
                        email: email,
                        telefone: usuariosObjeto[email].phone,
                        name: usuariosObjeto[email].name,
                        suportes: carregarSuportesDoCliente(email),
                        faleConoscos: carregarFaleConoscosDoCliente(email),
                        orcamentosCliente: carregarOrcamentosDoCliente(email),
                        pedidosAtivos: carregarPedidosAtivosDoCliente(email),
                        historicoPedidosLoja: carregarHistoricoPedidosLojaDoCliente(email) // Renomeado para clareza
                    };
                    break;
                }
            }
            console.log('Cliente encontrado:', clienteEncontrado);

        } catch (error) {
            console.error('Erro ao parsear JSON de usuários:', error);
            if (resultadosBuscaDiv) {
                resultadosBuscaDiv.innerHTML = '<p class="mensagem">Erro ao carregar dados de usuários.</p>';
            }
            return;
        }
    } else {
        if (resultadosBuscaDiv) {
            resultadosBuscaDiv.innerHTML = '<p class="mensagem">Nenhum usuário cadastrado.</p>';
        }
        return;
    }

    if (clienteEncontrado) {
        console.log('Cliente encontrado para exibir:', clienteEncontrado);
        exibirInformacoesCliente(clienteEncontrado);
    } else {
        if (resultadosBuscaDiv) {
            resultadosBuscaDiv.innerHTML = '<p class="mensagem">Nenhum cliente encontrado com este email ou telefone.</p>';
            if (detalhesClienteDiv) detalhesClienteDiv.innerHTML = '';
            if (listaPedidosClienteAdm) listaPedidosClienteAdm.innerHTML = '';
            if (listaHistoricoClienteAdm) listaHistoricoClienteAdm.innerHTML = '';
        }
    }
}

function exibirInformacoesCliente(cliente) {
    console.log('Função exibirInformacoesCliente foi chamada com:', cliente);

    if (!detalhesClienteDiv || !listaPedidosClienteAdm || !listaHistoricoClienteAdm) {
        console.error('Elementos do DOM para detalhes do cliente não encontrados.');
        return;
    }

    detalhesClienteDiv.innerHTML = `
        <h3>Detalhes do Cliente</h3>
        <p><strong>Nome:</strong> ${cliente.name || 'Não informado'}</p>
        <p><strong>Email:</strong> ${cliente.email || 'Não informado'}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone || 'Não informado'}</p>
    `;

    // Limpa as listas
    listaPedidosClienteAdm.innerHTML = '';
    listaHistoricoClienteAdm.innerHTML = '';

    // Exibe Pedidos Ativos (da loja)
    const pedidosAtivosTitulo = document.createElement('h4');
    pedidosAtivosTitulo.textContent = 'Pedidos Ativos';
    listaPedidosClienteAdm.appendChild(pedidosAtivosTitulo);

    if (cliente.pedidosAtivos && cliente.pedidosAtivos.length > 0) {
        const listaAtivos = document.createElement('ul');
        cliente.pedidosAtivos.forEach(pedido => {
            const itemPedido = document.createElement('li');
            itemPedido.textContent = `ID: ${pedido.id || 'N/A'}, Data: ${pedido.dataPedido || 'N/A'}, Status: ${pedido.status || 'N/A'}`; // Use dataPedido
            listaAtivos.appendChild(itemPedido);
        });
        listaPedidosClienteAdm.appendChild(listaAtivos);
    } else {
        const mensagemNenhumPedido = document.createElement('p');
        mensagemNenhumPedido.textContent = 'Nenhum pedido ativo encontrado para este cliente.';
        listaPedidosClienteAdm.appendChild(mensagemNenhumPedido);
    }

    // Exibe Histórico de Pedidos (da loja) e Outras Interações
    const historicoTitulo = document.createElement('h4');
    historicoTitulo.textContent = 'Histórico de Pedidos e Interações';
    listaHistoricoClienteAdm.appendChild(historicoTitulo);

    const listaHistorico = document.createElement('ul');
    let hasHistorico = false;

    // Adiciona histórico de pedidos da loja
    if (cliente.historicoPedidosLoja && cliente.historicoPedidosLoja.length > 0) {
        cliente.historicoPedidosLoja.forEach(pedido => {
            const itemHistoricoPedido = document.createElement('li');
            itemHistoricoPedido.textContent = `Tipo: Pedido Loja, ID: ${pedido.id || 'N/A'}, Data: ${pedido.dataPedido || 'N/A'}, Status: ${pedido.status || 'N/A'}`; // Use dataPedido
            listaHistorico.appendChild(itemHistoricoPedido);
        });
        hasHistorico = true;
    }

    // Adiciona pedidos de suporte ao histórico
    if (cliente.suportes && cliente.suportes.length > 0) {
        cliente.suportes.forEach(suporte => {
            const itemSuporte = document.createElement('li');
            itemSuporte.textContent = `Tipo: Suporte, ID: ${suporte.id || 'N/A'}, Problema: ${suporte.problema || 'N/A'}, Enviado em: ${suporte.dataEnvio || 'N/A'}`;
            listaHistorico.appendChild(itemSuporte);
        });
        hasHistorico = true;
    }

    // Adiciona mensagens Fale Conosco ao histórico
    if (cliente.faleConoscos && cliente.faleConoscos.length > 0) {
        cliente.faleConoscos.forEach(mensagem => {
            const itemMensagem = document.createElement('li');
            itemMensagem.textContent = `Tipo: Fale Conosco, Assunto: ${mensagem.assunto || 'N/A'}, Enviado em: ${mensagem.dataEnvio || 'N/A'}`;
            listaHistorico.appendChild(itemMensagem);
        });
        hasHistorico = true;
    }

    // Adiciona orçamentos ao histórico
    if (cliente.orcamentosCliente && cliente.orcamentosCliente.length > 0) {
        cliente.orcamentosCliente.forEach(orcamento => {
            const itemOrcamento = document.createElement('li');
            itemOrcamento.textContent = `Tipo: Orçamento, Serviço: ${orcamento.servico || 'N/A'}, Enviado em: ${orcamento.dataEnvio || 'N/A'}`;
            listaHistorico.appendChild(itemOrcamento);
        });
        hasHistorico = true;
    }

    if (hasHistorico) {
        listaHistoricoClienteAdm.appendChild(listaHistorico);
    } else {
        const mensagemNenhumHistorico = document.createElement('p');
        mensagemNenhumHistorico.textContent = 'Nenhum histórico de pedidos ou interações encontrado para este cliente.';
        listaHistoricoClienteAdm.appendChild(mensagemNenhumHistorico);
    }
}

// Funções auxiliares para carregar os dados relacionados
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

// Implemente estas funções para carregar os dados de pedidos ativos e histórico DA LOJA
function carregarPedidosAtivosDoCliente(emailCliente) {
    const chavePedidosCliente = `pedidos_${emailCliente.replace(/[^a-zA-Z0-9]/g, '')}`;
    const todosPedidos = localStorage.getItem(chavePedidosCliente);
    return todosPedidos ? JSON.parse(todosPedidos).filter(pedido => pedido.status !== 'Entregue' && pedido.status !== 'Concluído') : [];
}

function carregarHistoricoPedidosLojaDoCliente(emailCliente) {
    const chavePedidosCliente = `pedidos_${emailCliente.replace(/[^a-zA-Z0-9]/g, '')}`;
    const todosPedidos = localStorage.getItem(chavePedidosCliente);
    return todosPedidos ? JSON.parse(todosPedidos).filter(pedido => pedido.status === 'Entregue' || pedido.status === 'Concluído' || pedido.status === 'Pago') : [];
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

function loadMensagensFaleConosco() {
    const storedMensagens = localStorage.getItem('mensagensFaleConosco');
    return storedMensagens ? JSON.parse(storedMensagens) : [];
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

        // Adicionar botão de excluir
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
    const selectedProducts = Array.from(checkboxes).map(cb => cb.value); // Salva apenas os IDs
    savePopularProductsToLocalStorage(selectedProducts);
    popularProductsList = selectedProducts; // Atualiza a variável global
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

        // Adicionar botão de excluir
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
    const selectedProducts = Array.from(checkboxes).map(cb => cb.value); // Salva apenas os IDs
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

        // Adicionar botão de excluir
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

    // Verifica se o admin está logado ao carregar a página
    if (isAdminLoggedIn) {
        showAdminPanel();
    } else {
        loginSection.style.display = 'flex';
        adminContent.style.display = 'none';
    }
