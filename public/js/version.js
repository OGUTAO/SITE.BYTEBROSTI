document.addEventListener('DOMContentLoaded', function() {
    const versionElement = document.querySelectorAll('#system-version');
    const currentVersion = 'Versão 1.0'; // Defina a versão aqui

    versionElement.forEach(element => {
        if (element) {
            element.textContent = currentVersion;
        }
    });
});