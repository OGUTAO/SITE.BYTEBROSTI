// Em carousel.js

let currentImage = 0;
const imagesContainer = document.querySelector('.carousel-images'); // Renomeado para clareza
const items = Array.from(imagesContainer.children); // Pegar os itens <a>
const imagesToShow = 2; // Exibe 2 imagens por vez (Comentário corrigido)
let autoSlideInterval;
let startX;
let isDragging = false;

// Função ajustada para pegar a largura real do item + margens
function getItemWidth() {
    if (items.length === 0) {
        return 0; // Evita erro se não houver itens
    }
    const firstItem = items[0];
    const itemStyle = window.getComputedStyle(firstItem);
    const itemWidth = firstItem.offsetWidth; // Largura total incluindo padding/border
    const marginLeft = parseFloat(itemStyle.marginLeft);
    const marginRight = parseFloat(itemStyle.marginRight);
    return itemWidth + marginLeft + marginRight; // Largura total ocupada
}

function nextImage() {
    // Avança pelo número de imagens visíveis
    currentImage += imagesToShow;
    // Verifica o limite e volta ao início se necessário
    // A condição correta é verificar se o *próximo* índice válido existe
    if (currentImage >= items.length) { // Se o índice for maior ou igual ao total, volta ao início
        currentImage = 0;
    }
    updateCarousel();
    resetAutoSlide();
}

function prevImage() {
    // Retrocede pelo número de imagens visíveis
    currentImage -= imagesToShow;
    // Verifica o limite e vai para o final se necessário
    if (currentImage < 0) {
        // Calcula o último índice inicial possível
        // Ex: 6 itens, mostra 2 -> Últimos índices são 4 e 5. Começa em 4.
        currentImage = items.length - (items.length % imagesToShow || imagesToShow);
        // Se o total for múltiplo de imagesToShow (ex: 6 itens, mostra 2), o último índice é total - imagesToShow (6 - 2 = 4)
        // Se não for (ex: 5 itens, mostra 2), o último índice é total - resto (5 - 1 = 4)
        if (currentImage >= items.length) { // Ajuste caso items.length < imagesToShow
             currentImage = 0;
        }
    }
    updateCarousel();
    resetAutoSlide();
}

function updateCarousel() {
    const itemWidth = getItemWidth(); // Usa a nova função
    // Desloca o container dos itens
    imagesContainer.style.transform = `translateX(-${currentImage * itemWidth}px)`;
}

function startAutoSlide() {
    clearInterval(autoSlideInterval); // Limpa intervalo anterior para evitar múltiplos timers
    autoSlideInterval = setInterval(() => {
        nextImage();
    }, 3000); // 3 segundos
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// --- Event Listeners (arrastar/touch) ---
// Adicionar verificação se há itens suficientes para arrastar/tocar
const canSlide = items.length > imagesToShow;

imagesContainer.addEventListener('mousedown', (e) => {
    if (!canSlide) return;
    isDragging = true;
    startX = e.pageX - imagesContainer.offsetLeft; // Posição relativa ao container
    imagesContainer.style.cursor = 'grabbing'; // Feedback visual
});

imagesContainer.addEventListener('mouseleave', () => {
     if (!canSlide) return;
     if (isDragging) { // Se saiu arrastando, solta
         isDragging = false;
         imagesContainer.style.cursor = 'grab';
         // Opcional: finalizar o slide baseado na distância
     }
});

imagesContainer.addEventListener('mouseup', () => {
    if (!canSlide) return;
    isDragging = false;
    imagesContainer.style.cursor = 'grab';
});

imagesContainer.addEventListener('mousemove', (e) => {
    if (!isDragging || !canSlide) return;
    e.preventDefault(); // Previne seleção de texto enquanto arrasta
    // const currentX = e.pageX - imagesContainer.offsetLeft;
    // const walk = currentX - startX;
    // Não vamos implementar o movimento em tempo real aqui, apenas a detecção do swipe
    // A lógica atual de swipe no mouseup/touchend já funciona para mudar slides
});

// Adiciona cursor inicial e listeners de toque
if (canSlide) {
    imagesContainer.style.cursor = 'grab';

    imagesContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
    }, { passive: true }); // Melhora performance de scroll

    imagesContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].pageX;
        const diff = startX - endX;
        if (diff > 50) { // Swipe para esquerda
            nextImage();
        } else if (diff < -50) { // Swipe para direita
            prevImage();
        }
    });
}


// Chamar updateCarousel no resize e no load
window.addEventListener('resize', () => {
    // Recalcular e aplicar imediatamente, sem transição para evitar "pulos"
    const itemWidth = getItemWidth();
    imagesContainer.style.transition = 'none'; // Desabilita transição temporariamente
    imagesContainer.style.transform = `translateX(-${currentImage * itemWidth}px)`;
    // Força o navegador a aplicar o estilo sem transição
    imagesContainer.offsetHeight; // Força reflow
    // Habilita a transição novamente
    imagesContainer.style.transition = 'transform 0.5s ease-in-out';
});

// Inicia o carrossel quando a página carregar
window.addEventListener('load', () => {
    updateCarousel(); // Define a posição inicial
    if (canSlide) { // Só inicia auto-slide e drag se houver mais imagens do que o visível
       startAutoSlide();
    }
});

// --- Fim dos Event Listeners ---