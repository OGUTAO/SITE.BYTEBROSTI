let currentImage = 0;
const images = document.querySelector('.carousel-images');
let imageWidth = document.querySelector('.carousel-images img').clientWidth;
const imagesToShow = 2; // Número de imagens a serem exibidas por vez
let autoSlideInterval; // Variável para armazenar o intervalo do slide automático
let startX;
let isDragging = false;

function nextImage() {
    currentImage += imagesToShow;
    if (currentImage > images.children.length - imagesToShow) {
        currentImage = 0;
    }
    updateCarousel();
    resetAutoSlide(); // Reinicia o slide automático após a navegação manual
}

function prevImage() {
    currentImage -= imagesToShow;
    if (currentImage < 0) {
        currentImage = images.children.length - imagesToShow;
    }
    updateCarousel();
    resetAutoSlide(); // Reinicia o slide automático após a navegação manual
}

function updateCarousel() {
    images.style.transform = `translateX(-${currentImage * (imageWidth + 20)}px)`; // Adiciona o dobro da margem (10px * 2)
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextImage();
    }, 3000); // Altere o valor (3000) para ajustar o tempo de transição (em milissegundos)
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Eventos de arrastar (swipe)
images.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
});

images.addEventListener('mouseup', () => {
    isDragging = false;
});

images.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diff = startX - e.pageX;
    if (diff > 50) {
        nextImage();
        isDragging = false;
    } else if (diff < -50) {
        prevImage();
        isDragging = false;
    }
});

// Eventos de toque (touch) para dispositivos móveis
images.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
});

images.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].pageX;
    if (diff > 50) {
        nextImage();
    } else if (diff < -50) {
        prevImage();
    }
});

// Atualiza a largura das imagens ao redimensionar a janela
window.addEventListener('resize', () => {
    imageWidth = document.querySelector('.carousel-images img').clientWidth;
    updateCarousel();
});

// Inicia o slide automático
startAutoSlide();