let currentImage = 0;
const images = document.querySelector('.carousel-images');
let imageWidth = 0;
const imagesToShow = 2;
let autoSlideInterval;
let startX;
let isDragging = false;

function updateImageWidth() {
    const firstImage = document.querySelector('.carousel-images img');
    if (firstImage) {
        imageWidth = firstImage.clientWidth;
        updateCarousel();
    }
}

function nextImage() {
    if (!images) return;
    currentImage += imagesToShow;
    if (currentImage > images.children.length - imagesToShow) {
        currentImage = 0;
    }
    updateCarousel();
    resetAutoSlide();
}

function prevImage() {
    if (!images) return;
    currentImage -= imagesToShow;
    if (currentImage < 0) {
        currentImage = images.children.length - imagesToShow;
    }
    updateCarousel();
    resetAutoSlide();
}

function updateCarousel() {
    if (images) {
        images.style.transform = `translateX(-${currentImage * imageWidth}px)`;
    }
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

if (images) {
    images.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
    });

    images.addEventListener('mouseup', () => {
        isDragging = false;
    });

    images.addEventListener('mousemove', (e) => {
        if (!isDragging || !images) return;
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
}

window.addEventListener('resize', updateImageWidth);

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chatbot-messages');
    const message = userInput.value.trim();

    if (message) {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-message';
        userDiv.textContent = message;
        chatMessages.appendChild(userDiv);

        const botDiv = document.createElement('div');
        botDiv.className = 'bot-message';
        botDiv.textContent = 'Obrigado pela sua mensagem! Em breve responderemos.';
        chatMessages.appendChild(botDiv);

        userInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}