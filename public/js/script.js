let currentImage = 0;
const images = document.querySelector('.carousel-images');
let imageWidth = 0; // Inicialize com 0 e atualize após o carregamento
const imagesToShow = 2; // Número de imagens a serem exibidas por vez
let autoSlideInterval; // Variável para armazenar o intervalo do slide automático
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
  resetAutoSlide(); // Reinicia o slide automático após a navegação manual
}

function prevImage() {
  if (!images) return;
  currentImage -= imagesToShow;
  if (currentImage < 0) {
    currentImage = images.children.length - imagesToShow;
  }
  updateCarousel();
  resetAutoSlide(); // Reinicia o slide automático após a navegação manual
}

function updateCarousel() {
  if (images) {
    images.style.transform = `translateX(-${currentImage * imageWidth}px)`;
  }
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
}

// Atualiza a largura das imagens ao redimensionar a janela
window.addEventListener('resize', updateImageWidth);

// Inicia o slide automático após o carregamento da janela
window.addEventListener('load', () => {
  updateImageWidth();
  startAutoSlide();
  checkLoginStatusOnLoad(); // Verifica o estado de login ao carregar a página
});

// Função para verificar o estado de login ao carregar a página
function checkLoginStatusOnLoad() {
  const headerAuthButtons = document.getElementById('header-auth-buttons');
  const headerProfileIcon = document.getElementById('header-profile-icon');
  const sidebarAuthButtons = document.getElementById('sidebar-auth-buttons');
  const sidebarProfileIcon = document.getElementById('sidebar-profile-icon');
  const logoutSetting = document.getElementById('logout-setting');

  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  if (headerAuthButtons && headerProfileIcon) {
    headerAuthButtons.style.display = isLoggedIn ? 'none' : 'flex';
    headerProfileIcon.style.display = isLoggedIn ? 'flex' : 'none';
  }

  if (sidebarAuthButtons && sidebarProfileIcon) {
    sidebarAuthButtons.style.display = isLoggedIn ? 'none' : 'block';
    sidebarProfileIcon.style.display = isLoggedIn ? 'flex' : 'none';
  }

  // Mostrar ou ocultar o botão de logout
  if (logoutSetting) {
    logoutSetting.style.display = isLoggedIn ? 'block' : 'none';
  }
}

// Função a ser chamada após o login bem-sucedido
function handleLoginSuccess(userName) {
  localStorage.setItem('userName', userName);
  localStorage.setItem('userLoggedIn', 'true');
  window.location.href = 'index.html'; // Redireciona para a página principal
}

// Função de validação de login
function validateLogin() {
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const errorElement = document.getElementById('login-error');
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[email] && users[email].password === password) {
    // Login bem-sucedido
    handleLoginSuccess(users[email].name); // Armazena o nome do usuário
  } else {
    // Credenciais inválidas
    errorElement.textContent = 'Email ou senha incorretos.';
  }
}

// Função de logout
function logout() {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('userName');
  window.location.reload();
}

// Adiciona eventos de clique para abrir e fechar a barra lateral de configurações
document.addEventListener('DOMContentLoaded', () => {
  const profileIconHeader = document.getElementById('header-profile-icon');
  const profileIconSidebar = document.getElementById('sidebar-profile-icon');
  const settingsSidebar = document.querySelector('.settings-sidebar');
  const closeSidebarButton = document.querySelector('.close-sidebar-button');

  function openSettingsSidebar() {
    settingsSidebar.classList.add('open');
  }

  function closeSettingsSidebar() {
    settingsSidebar.classList.remove('open');
  }

  if (profileIconHeader) {
    profileIconHeader.addEventListener('click', openSettingsSidebar);
  }

  if (profileIconSidebar) {
    profileIconSidebar.addEventListener('click', openSettingsSidebar);
  }

  if (closeSidebarButton) {
    closeSidebarButton.addEventListener('click', closeSettingsSidebar);
  }
});