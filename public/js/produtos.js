import { productService } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.querySelector('.product-list');
    const themeToggleButton = document.getElementById('theme-toggle');
    const cartBadgeElement = document.querySelector('.cart-icon-header .cart-badge');
    const quantityModalOverlay = document.getElementById('quantityModalOverlay');
    const quantityModalTitle = document.getElementById('quantityModalTitle');
    const quantityInput = document.getElementById('quantityInput');
    const quantityModalOk = document.getElementById('quantityModalOk');
    const quantityModalCancel = document.getElementById('quantityModalCancel');
    const quantityErrorMessage = document.getElementById('quantityErrorMessage');

    let cartItemCount = 0;
    let currentProductToAdd = null;
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemCount = storedCart.reduce((total, item) => total + item.quantity, 0);

    function updateCartBadge() {
        cartBadgeElement.textContent = cartItemCount;
        cartBadgeElement.classList.toggle('empty', cartItemCount === 0);
    }

    function showQuantityModal(product, availableQuantity) {
        currentProductToAdd = { ...product, available: availableQuantity };
        quantityModalTitle.textContent = `Quantas unidades de "${product.name}" você deseja adicionar? (Disponível: ${availableQuantity})`;
        quantityInput.value = 1;
        quantityInput.max = availableQuantity;
        quantityErrorMessage.style.display = 'none';
        quantityInput.classList.remove('error');
        quantityModalOverlay.style.display = 'flex';
    }

    function handleAddToCartButtonClick(event) {
        const button = event.currentTarget;
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productValue = parseFloat(button.dataset.productValue);
        const productQuantityAvailable = parseInt(button.dataset.productQuantity, 10);

        const product = {
            id: productId,
            name: productName,
            value: productValue
        };
        showQuantityModal(product, productQuantityAvailable);
    }

    quantityModalOk.addEventListener('click', () => {
        if (!currentProductToAdd) return;
        const quantity = parseInt(quantityInput.value, 10);
        quantityErrorMessage.style.display = 'none';
        quantityErrorMessage.textContent = '';
        quantityInput.classList.remove('error');

        if (isNaN(quantity) || quantity <= 0) {
            quantityErrorMessage.textContent = "Por favor, digite uma quantidade válida.";
            quantityErrorMessage.style.display = 'block';
            quantityInput.classList.add('error');
            return;
        }

        if (quantity > currentProductToAdd.available) {
            quantityErrorMessage.textContent = `A quantidade desejada (${quantity}) excede a disponível (${currentProductToAdd.available}).`;
            quantityErrorMessage.style.display = 'block';
            quantityInput.classList.add('error');
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === currentProductToAdd.id);

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > currentProductToAdd.available) {
                quantityErrorMessage.textContent = `Você já tem ${existingItem.quantity} no carrinho. Adicionar mais ${quantity} excederia o limite (${currentProductToAdd.available}).`;
                quantityErrorMessage.style.display = 'block';
                quantityInput.classList.add('error');
                return;
            }
            existingItem.quantity = newQuantity;
        } else {
            cart.push({
                id: currentProductToAdd.id,
                name: currentProductToAdd.name,
                value: currentProductToAdd.value,
                quantity: quantity,
                image: currentProductToAdd.image
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
        updateCartBadge();
        quantityModalOverlay.style.display = 'none';
        currentProductToAdd = null;
    });

    quantityModalCancel.addEventListener('click', () => {
        quantityModalOverlay.style.display = 'none';
        currentProductToAdd = null;
        quantityErrorMessage.style.display = 'none';
        quantityInput.classList.remove('error');
    });

    const sunIcon = '☀️';
    const moonIcon = '🌙';

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleButton.innerHTML = sunIcon;
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleButton.innerHTML = moonIcon;
            localStorage.setItem('theme', 'light');
        }
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    function getFavoritos() {
        return JSON.parse(localStorage.getItem("favoritos")) || [];
    }

    function salvarFavoritos(favoritos) {
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }

    function attachHeartListeners() {
        const coracoes = document.querySelectorAll(".coracao");
        coracoes.forEach(coracao => {
            const produto = coracao.closest(".product-item");
            const titulo = produto.querySelector(".product-name").textContent;

            coracao.addEventListener("click", (event) => {
                let favoritos = getFavoritos();
                if (favoritos.includes(titulo)) {
                    favoritos = favoritos.filter(item => item !== titulo);
                    coracao.classList.remove("favoritado");
                } else {
                    favoritos.push(titulo);
                    coracao.classList.add("favoritado");
                }
                salvarFavoritos(favoritos);
            });
        });
    }

    async function renderClientProducts() {
        productList.innerHTML = '';
        try {
            const productsToRender = await productService.getProducts();

            if (!productsToRender || productsToRender.length === 0) {
                productList.innerHTML = '<li class="no-products-message">Nenhuma peça disponível no momento.</li>';
                return;
            }

            const favoritos = getFavoritos();

            productsToRender.forEach((product) => {
                if (produto.Quantidade > 0) { 
                    const listItem = document.createElement('li');
                    listItem.classList.add('product-item');
                    listItem.dataset.productId = produto.Id;

                    const valueAsNumber = parseFloat(produto.Preco);
                    const formattedValue = !isNaN(valueAsNumber)
                        ? valueAsNumber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : 'Valor Indisponível';

                    const isFavorited = favoritos.includes(produto.Nome); 

                    listItem.innerHTML = `
                        <div class="product-image-container">
                            <img src="${product.image || 'img/default_product.jpg'}" alt="${produto.Nome || 'Produto'}" class="product-image">
                        </div>
                        <div class="product-info">
                            <span class="coracao ${isFavorited ? 'favoritado' : ''}" title="Favoritar"><i class="fas fa-heart"></i></span>
                            <h3 class="product-name">${produto.Nome || 'Nome Indisponível'}</h3>
                            <p class="product-details">${product.detalhes || ''}</p>
                            <div class="product-price-quantity">
                                <span class="product-price">${formattedValue}</span>
                                <span class="product-quantity">Disponível: ${produto.Quantidade}</span>
                            </div>
                        </div>
                        <button class="button add-to-cart-button"
                            data-product-id="${produto.Id}"
                            data-product-name="${produto.Nome}"
                            data-product-value="${produto.Preco}"
                            data-product-quantity="${produto.Quantidade}"> Adicionar ao Carrinho
                        </button>
                    `;
                    productList.appendChild(listItem);
                }
            });

            attachHeartListeners();
            const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', handleAddToCartButtonClick);
            });
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            productList.innerHTML = '<li class="no-products-message">Erro ao carregar produtos. Tente novamente mais tarde.</li>';
        }
    }

    function getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function destacarProduto(produtoId) {
        const productElements = document.querySelectorAll('.product-item');
        productElements.forEach(element => {
            if (element.dataset.productId === produtoId) {
                element.classList.add('destacado');
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    element.classList.remove('destacado');
                }, 3000);
            }
        });
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    loadTheme();
    updateCartBadge();
    renderClientProducts();

    const productIdNaUrl = getUrlParam('produtoId');
    if (productIdNaUrl) {
        destacarProduto(productIdNaUrl);
    }
});