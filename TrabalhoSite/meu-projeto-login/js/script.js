function validateLogin() {
    var email = document.getElementById("login-email").value;
    var password = document.getElementById("login-password").value;
    var errorMessage = document.getElementById("login-error");

    if (email === "admin@mail.com" && password === "1234") {
        alert("Login bem-sucedido!");
        window.location.href = "dashboard.html";
    } else {
        errorMessage.textContent = "Email ou senha incorretos.";
    }
}

function registerUser() {
    var name = document.getElementById("register-name").value;
    var email = document.getElementById("register-email").value;
    var password = document.getElementById("register-password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    var errorMessage = document.getElementById("register-error");

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        errorMessage.textContent = "Todos os campos devem ser preenchidos.";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "As senhas não coincidem.";
        return;
    }

    alert("Cadastro realizado com sucesso!");
    window.location.href = "index.html";
}

function changeEmail() {
    var currentEmail = document.getElementById("current-email").value;
    var newEmail = document.getElementById("new-email").value;
    var confirmNewEmail = document.getElementById("confirm-new-email").value;
    var errorMessage = document.getElementById("email-error");

    if (currentEmail === "" || newEmail === "" || confirmNewEmail === "") {
        errorMessage.textContent = "Todos os campos devem ser preenchidos.";
        return;
    }

    if (newEmail !== confirmNewEmail) {
        errorMessage.textContent = "Os e-mails não coincidem.";
        return;
    }

    alert("E-mail atualizado com sucesso!");
    window.location.href = "index.html";
}

function recoverPassword() {
    var email = document.getElementById("recover-email").value;
    var errorMessage = document.getElementById("recover-error");

    if (email === "") {
        errorMessage.textContent = "Por favor, insira seu email.";
        return;
    }

    alert("Um link de recuperação foi enviado para " + email);
    window.location.href = "index.html";
}

