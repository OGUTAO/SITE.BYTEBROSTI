let currentImage = 0;
const images = document.querySelector('.carousel-images');
const imagesToShow = 3; // Exibe 3 imagens por vez
let autoSlideInterval;
let startX;
let isDragging = false;

function getImageWidth() {
    return document.querySelector('.carousel-container').clientWidth / imagesToShow;
}

function nextImage() {
    currentImage += imagesToShow;
    if (currentImage > images.children.length - imagesToShow) {
        currentImage = 0;
    }
    updateCarousel();
    resetAutoSlide();
}

function prevImage() {
    currentImage -= imagesToShow;
    if (currentImage < 0) {
        currentImage = images.children.length - imagesToShow;
    }
    updateCarousel();
    resetAutoSlide();
}

function updateCarousel() {
    const imageWidth = getImageWidth();
    images.style.transform = `translateX(-${currentImage * imageWidth}px)`;
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextImage();
    }, 3000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

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

window.addEventListener('resize', () => {
    updateCarousel();
});

startAutoSlide();