import { newsService } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const sunIcon = '☀️';
    const moonIcon = '🌙';
    let currentPage = 1;
    const newsPerPage = 10;
    let allNews = [];
    const themeKey = 'theme';

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleButton.textContent = sunIcon;
            localStorage.setItem(themeKey, 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            themeToggleButton.textContent = moonIcon;
            localStorage.setItem(themeKey, 'light');
        }
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem(themeKey);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    async function fetchNews(page) {
        if (page === 1) {
            newsContainer.innerHTML = '<div class="loading">Carregando notícias...</div>';
        }

        try {
            const allNewsFromApi = await newsService.getNews();
            console.log("Notícias recebidas da API:", allNewsFromApi);
            allNews = allNewsFromApi;

            displayNews(allNews.slice(0, page * newsPerPage));

            if (allNews.length > page * newsPerPage) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }

            if (allNews.length === 0) {
                newsContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
                loadMoreBtn.style.display = 'none';
            }

        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
            newsContainer.innerHTML = '<p>Erro ao carregar as notícias. Tente novamente mais tarde.</p>';
            loadMoreBtn.style.display = 'none';
        }
    }

    function displayNews(news) {
        newsContainer.innerHTML = ''; 
        if (news.length === 0) {
            newsContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>'; 
            return;
        }

        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            newsItem.innerHTML = `
                <h3>${item.titulo || 'Título não disponível'}</h3>
                ${item.subtitulo ? `<p class="news-subtitle">${item.subtitulo}</p>` : ''}
                <p class="news-content-full">${item.conteudo || 'Conteúdo não disponível.'}</p>
                <p class="news-author-date">
                    <em>Autor: ${item.autor || 'Desconhecido'}</em>
                    <br>
                    <em>Publicado em: ${item.data ? new Date(item.data).toLocaleDateString() : 'Data não disponível'}</em>
                </p>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        fetchNews(currentPage);
    });

    themeToggleButton.addEventListener('click', toggleTheme);

    loadTheme();
    fetchNews(currentPage);
});