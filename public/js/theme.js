document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    if (localStorage.getItem('fontSize')) {
        document.documentElement.style.fontSize = localStorage.getItem('fontSize');
    }
});
