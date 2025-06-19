import { authService } from './api.js';

export async function handleUserLogin(email, password) {
    try {
        const userData = await authService.loginUser({ email: email, senha: password });
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('loggedInUserEmail', userData.email);
        localStorage.setItem('userName', userData.nome);
        localStorage.setItem('userToken', userData.token);
        localStorage.removeItem('adminToken');
        return { success: true, user: userData };
    } catch (error) {
        console.error("Erro no login de usuário:", error);
        return { success: false, error: error.message };
    }
}

export async function handleUserRegister(name, email, phone, password) {
    try {
        const userData = await authService.registerUser({ nome: name, email: email, senha: password });
        return { success: true, user: userData };
    } catch (error) {
        console.error("Erro no registro de usuário:", error);
        return { success: false, error: error.message };
    }
}

export async function handleAdminLogin(email, password) {
    try {
        const adminData = await authService.loginAdmin({ email: email, senha: password });
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('loggedInAdminEmail', adminData.email);
        localStorage.setItem('loggedInAdminName', adminData.nome);
        localStorage.setItem('isAdminSuper', adminData.is_admin);
        localStorage.setItem('adminToken', adminData.token);
        localStorage.removeItem('userToken');
        return { success: true, admin: adminData };
    } catch (error) {
        console.error("Erro no login de admin:", error);
        return { success: false, error: error.message };
    }
}

export async function handleAdminRegister(name, email, password, isAdmin) {
    try {
        const result = await authService.createAdmin({ nome: name, email: email, senha: password, is_admin: isAdmin });
        return { success: true, admin: result };
    } catch (error) {
        console.error("Erro no registro de admin:", error);
        return { success: false, error: error.message };
    }
}


export function logoutUser() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('userToken');
    window.location.reload();
}

export function logoutAdmin() {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('loggedInAdminEmail');
    localStorage.removeItem('loggedInAdminName');
    localStorage.removeItem('isAdminSuper');
    localStorage.removeItem('adminToken');
    window.location.href = 'ADM.html';
}

export function checkLoginStatusOnLoad() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

    const headerAuthButtons = document.getElementById('header-auth-buttons');
    const headerProfileIcon = document.getElementById('header-profile-icon');
    const sidebarProfileIcon = document.getElementById('sidebar-profile-icon');
    const logoutSetting = document.getElementById('logout-setting');
    const changeEmailSettingSidebar = document.getElementById('change-email-setting-sidebar');
    const changePasswordSettingSidebar = document.getElementById('change-password-setting-sidebar');
    const changePhoneSettingSidebar = document.getElementById('change-phone-setting-sidebar');
    const meusPedidosSettingSidebar = document.getElementById('meus-pedidos-setting-sidebar');
    const favoritosSettingSidebar = document.getElementById('favoritos-setting-sidebar');
    const avaliacaoSettingSidebar = document.getElementById('avaliacao-setting-sidebar');


    if (headerAuthButtons && headerProfileIcon) {
        headerAuthButtons.style.display = (isLoggedIn || isAdminLoggedIn) ? 'none' : 'flex';
        headerProfileIcon.style.display = (isLoggedIn || isAdminLoggedIn) ? 'flex' : 'none';
    }
    if (sidebarProfileIcon) {
        sidebarProfileIcon.style.display = (isLoggedIn || isAdminLoggedIn) ? 'flex' : 'none';
    }
    if (logoutSetting) {
        logoutSetting.style.display = (isLoggedIn || isAdminLoggedIn) ? 'block' : 'none';
    }
    if (changeEmailSettingSidebar) {
        changeEmailSettingSidebar.style.display = isLoggedIn ? 'block' : 'none';
    }
    if (changePasswordSettingSidebar) {
        changePasswordSettingSidebar.style.display = isLoggedIn ? 'block' : 'none'; 
    }
    if (changePhoneSettingSidebar) {
        changePhoneSettingSidebar.style.display = isLoggedIn ? 'block' : 'none';
    }
    if (meusPedidosSettingSidebar) {
        meusPedidosSettingSidebar.style.display = isLoggedIn ? 'block' : 'none';
    }
    if (favoritosSettingSidebar) {
        favoritosSettingSidebar.style.display = isLoggedIn ? 'block' : 'none';
    }
    if (avaliacaoSettingSidebar) {
        avaliacaoSettingSidebar.style.display = isLoggedIn ? 'block' : 'none';
    }


    const userName = localStorage.getItem('userName') || localStorage.getItem('loggedInAdminName');
    if (userName) {
        const headerUserNameElement = document.getElementById('header-user-name');
        const sidebarUserNameElement = document.getElementById('sidebar-user-name');
        if (headerUserNameElement) headerUserNameElement.textContent = userName;
        if (sidebarUserNameElement) sidebarUserNameElement.textContent = userName;
    }
}