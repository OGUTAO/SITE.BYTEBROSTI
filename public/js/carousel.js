// Em carousel.js

document.addEventListener('DOMContentLoaded', () => {
    const imagesContainer = document.querySelector('.carousel-images');
    if (!imagesContainer) {
        console.warn("Elemento '.carousel-images' não encontrado. Carrossel não inicializado.");
        return; // Sai se o container não existe
    }

    const items = Array.from(imagesContainer.children);
    if (items.length === 0) {
        console.warn("Nenhum item encontrado dentro de '.carousel-images'.");
        return; // Sai se não há itens
    }

    // --- Configurações ---
    const imagesToShow = 2; // Quantas imagens mostrar por vez
    const moveThreshold = 50; // Distância mínima em pixels para considerar um swipe válido para mudar de slide
    const dragThreshold = 10; // Distância mínima para considerar que o usuário está arrastando/deslizando (para diferenciar de um clique)
    const autoSlideIntervalTime = 4000; // Tempo em ms para o slide automático (aumentado para 4s)

    // --- Estado ---
    let currentImage = 0;
    let autoSlideInterval;
    let isDragging = false; // Para mouse
    let isSwiping = false;  // Para toque
    let startX = 0;         // Posição inicial (mouse/toque)
    let startY = 0;         // Posição inicial Y (toque, para detecção de direção)
    let currentTranslate = 0; // Posição atual de translate X do container
    let startTranslate = 0; // Posição de translate X no início do arraste/swipe
    let currentMoveX = 0;   // Quanto o dedo/mouse moveu desde o início
    let animationFrameId = null; // ID para requestAnimationFrame
    let scrollDirection = null; // 'horizontal', 'vertical', ou null
    let interactionOccurred = false; // Flag para saber se houve swipe/drag

    const canSlide = items.length > imagesToShow;

    // --- Funções Auxiliares ---

    function getItemWidth() {
        // Recalcula a largura caso a janela mude ou itens sejam adicionados/removidos dinamicamente
        if (items.length === 0) return 0;
        const firstItem = items[0];
        if (!firstItem) return 0;
        const itemStyle = window.getComputedStyle(firstItem);
        const itemWidth = firstItem.offsetWidth;
        const marginLeft = parseFloat(itemStyle.marginLeft) || 0;
        const marginRight = parseFloat(itemStyle.marginRight) || 0;
        return itemWidth + marginLeft + marginRight;
    }

    function getTargetTranslate() {
        const itemWidth = getItemWidth();
        let targetIndex = currentImage;

        // Garante que o índice alvo esteja dentro dos limites válidos
        if (targetIndex < 0) targetIndex = 0;
        if (canSlide && targetIndex > items.length - imagesToShow) {
            targetIndex = items.length - imagesToShow;
        }
        if (targetIndex < 0) targetIndex = 0; // Checagem final

        return -(targetIndex * itemWidth);
    }

    function updateCarousel(smooth = true) {
        cancelAnimationFrame(animationFrameId); // Cancela qualquer animação pendente
        animationFrameId = null;

        const targetTranslate = getTargetTranslate();
        currentTranslate = targetTranslate; // Atualiza a posição atual conhecida

        imagesContainer.style.transition = smooth ? 'transform 0.4s ease-out' : 'none'; // Ease-out pode parecer mais suave
        imagesContainer.style.transform = `translateX(${targetTranslate}px)`;

        // Reinicia a interação após a atualização
        interactionOccurred = false;
    }

    function applyTranslate() {
        // Aplica a posição calculada durante o arraste/swipe via rAF
        imagesContainer.style.transform = `translateX(${currentTranslate}px)`;
        imagesContainer.style.transition = 'none'; // Garante que não haja transição durante o arraste
        animationFrameId = null; // Permite agendar o próximo frame
    }

    function scheduleUpdate() {
        // Agenda a atualização da posição no próximo quadro de animação, se não houver um já agendado
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(applyTranslate);
        }
    }

    function nextImage() {
        if (!canSlide) return;
        currentImage += imagesToShow;
        // Ajuste para não passar do limite (mostra o último conjunto completo)
        if (currentImage >= items.length - imagesToShow + 1) {
            currentImage = items.length - imagesToShow;
        }
         if (currentImage < 0) currentImage = 0; // Segurança extra
        updateCarousel();
        resetAutoSlide();
    }

    function prevImage() {
        if (!canSlide) return;
        currentImage -= imagesToShow;
        if (currentImage < 0) {
            currentImage = 0; // Volta para o início
        }
        updateCarousel();
        resetAutoSlide();
    }

    function startAutoSlide() {
        stopAutoSlide(); // Garante que não haja múltiplos intervalos
        if (canSlide) {
            autoSlideInterval = setInterval(() => {
                const currentTarget = getTargetTranslate();
                // Se o carrossel está na última posição, volta para o início, senão avança
                if (currentImage >= items.length - imagesToShow) {
                     currentImage = 0;
                } else {
                     currentImage += imagesToShow;
                     // Correção extra caso o cálculo pule o último item
                     if(currentImage > items.length - imagesToShow) {
                         currentImage = items.length - imagesToShow;
                     }
                }
                 if (currentImage < 0) currentImage = 0;
                updateCarousel();
            }, autoSlideIntervalTime);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // --- Tratadores de Eventos ---

    function handleInteractionStart(clientX, clientY) {
        stopAutoSlide();
        startX = clientX;
        startY = clientY; // Guarda Y para detecção de direção (touch)
        startTranslate = getTargetTranslate(); // Posição inicial *correta*
        currentTranslate = startTranslate; // Começa o movimento a partir daqui
        currentMoveX = 0;
        scrollDirection = null; // Reseta a direção detectada
        interactionOccurred = false; // Reseta flag de interação
        cancelAnimationFrame(animationFrameId); // Cancela rAF pendente
        animationFrameId = null;
        imagesContainer.style.cursor = 'grabbing';
    }

    function handleInteractionMove(clientX, clientY) {
        if (!isDragging && !isSwiping) return;

        currentMoveX = clientX - startX;
        const currentMoveY = clientY - startY; // Apenas para detecção de direção

        if (scrollDirection === null && (Math.abs(currentMoveX) > dragThreshold || Math.abs(currentMoveY) > dragThreshold)) {
            // Detecta a direção predominante do movimento inicial
            if (Math.abs(currentMoveX) > Math.abs(currentMoveY)) {
                scrollDirection = 'horizontal';
            } else {
                scrollDirection = 'vertical';
            }
        }

        // Só atualiza a posição do carrossel se o movimento for horizontal
        if (scrollDirection === 'horizontal') {
            // Previne a rolagem vertical da página *somente* quando o swipe horizontal é detectado
            // Nota: Isso pode precisar de `passive: false` no listener `touchmove`
            // e.preventDefault(); // DESCOMENTE SE NECESSÁRIO (e ajuste o listener touchmove)

            currentTranslate = startTranslate + currentMoveX;
            interactionOccurred = true; // Marca que houve movimento significativo
            scheduleUpdate(); // Atualiza a posição via requestAnimationFrame
        }
    }

    function handleInteractionEnd() {
        if (!isDragging && !isSwiping) return;

        imagesContainer.style.cursor = 'grab';
        cancelAnimationFrame(animationFrameId); // Cancela rAF pendente
        animationFrameId = null;

        let movedEnough = Math.abs(currentMoveX) > moveThreshold;

        if (interactionOccurred && scrollDirection === 'horizontal' && movedEnough) {
            if (currentMoveX < 0) { // Moveu para a esquerda (swipe left)
                nextImage();
            } else { // Moveu para a direita (swipe right)
                prevImage();
            }
        } else {
            // Se não moveu o suficiente, ou foi scroll vertical, ou não houve interação
            // Volta para a posição original suavemente
            updateCarousel();
        }

        // Reseta flags
        isDragging = false;
        isSwiping = false;
        currentMoveX = 0;
        scrollDirection = null;
        // Reinicia o auto-slide APÓS a animação de snap/mudança (se houver)
        // Um timeout pequeno ajuda a garantir isso.
        setTimeout(resetAutoSlide, 500); // Reinicia após a animação de 400ms
    }

    // --- Eventos de Mouse ---
    imagesContainer.addEventListener('mousedown', (e) => {
        if (!canSlide || e.button !== 0) return; // Apenas botão esquerdo
        isDragging = true;
        handleInteractionStart(e.pageX, e.pageY);
        // Previne arrastar imagem/link padrão do navegador
        e.preventDefault();
    });

    // Usamos 'document' para mousemove e mouseup para capturar mesmo se o mouse sair do container
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        handleInteractionMove(e.pageX, e.pageY);
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging || e.button !== 0) return;
        handleInteractionEnd();
    });

     // Caso o mouse saia da janela enquanto arrasta
    document.addEventListener('mouseleave', (e) => {
        if (!isDragging) return;
         // Se saiu da janela, trata como fim do arraste
         // Pode ser mais complexo dependendo do comportamento desejado
        handleInteractionEnd();
    });


    // --- Eventos de Toque ---
    imagesContainer.addEventListener('touchstart', (e) => {
        if (!canSlide || e.touches.length !== 1) return; // Apenas um dedo
        isSwiping = true;
        handleInteractionStart(e.touches[0].pageX, e.touches[0].pageY);
    }, { passive: true }); // Mantém passive: true para permitir scroll vertical inicial rápido

    imagesContainer.addEventListener('touchmove', (e) => {
        if (!isSwiping || e.touches.length !== 1) return;

        // IMPORTANTE: Se a prevenção de scroll vertical (e.preventDefault()) for necessária
        // dentro de handleInteractionMove quando scrollDirection === 'horizontal',
        // você PRECISA remover { passive: true } deste listener (touchmove).
        // Deixe como está primeiro, teste. Se o scroll vertical travar durante swipe horizontal,
        // remova o { passive: true } daqui e descomente o e.preventDefault() em handleInteractionMove.
        handleInteractionMove(e.touches[0].pageX, e.touches[0].pageY);

    }, { passive: true }); // <<< REMOVER SE e.preventDefault() for ativado em handleInteractionMove

    imagesContainer.addEventListener('touchend', (e) => {
        if (!isSwiping || e.changedTouches.length !== 1) return;
        handleInteractionEnd();
    });

    imagesContainer.addEventListener('touchcancel', (e) => {
        // Se o toque for cancelado pelo sistema
        if (!isSwiping) return;
        handleInteractionEnd(); // Trata como fim da interação
    });

    // --- Prevenção de Click em Links após Swipe ---
    // Adiciona um listener de click a todos os links dentro do carrossel
    const links = imagesContainer.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Se houve uma interação de swipe/drag recente (medida pelo `interactionOccurred`),
            // previne a ação padrão do link (navegação).
            if (interactionOccurred) {
                e.preventDefault();
                console.log("Click prevenido após swipe/drag.");
            }
        });
         // Adicional: Previne arrastar padrão de links/imagens
         link.addEventListener('dragstart', (e) => {
             e.preventDefault();
         });
    });


    // --- Inicialização ---
    imagesContainer.style.cursor = canSlide ? 'grab' : 'default'; // Define cursor inicial
    updateCarousel(false); // Define a posição inicial sem animação
    startAutoSlide();      // Inicia o slide automático

    // Ajusta no redimensionamento da janela
    window.addEventListener('resize', () => {
        // Atualiza sem animação e recalcula a posição atual baseada no índice
        updateCarousel(false);
        // Pode ser necessário reiniciar o autoslide dependendo do comportamento desejado
        resetAutoSlide();
    });
});