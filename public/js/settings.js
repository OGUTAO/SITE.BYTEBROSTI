document.getElementById('saveSettings').addEventListener('click', function() {
    const theme = document.getElementById('theme').value;
    const fontSize = document.getElementById('fontSize').value;
    const notifications = document.getElementById('notifications').checked;

    // Aqui você pode salvar as configurações usando localStorage, cookies ou enviando para um servidor
    console.log('Tema:', theme);
    console.log('Tamanho da Fonte:', fontSize);
    console.log('Notificações:', notifications);

    alert('Configurações salvas!');
});

document.getElementById('closeSettings').addEventListener('click', function() {
    // Redireciona o usuário de volta à página anterior
    window.history.back(); // Ou window.location.href = 'sua_pagina_anterior.html';
});