const translations = {
    ru: {
        loginBtn: "Вход", registerBtn: "Регистрация", logoutBtn: "Выйти",
        mainTitle: "Добро пожаловать на телеканал «День»!",
        mainText: "Свежие новости, спорт и развлечения каждый день.",
        welcomeBack: "С возвращением, {name}! ☀️",
        registerTitle: "Регистрация", loginTitle: "Вход",
        nicknamePlaceholder: "Никнейм", emailPlaceholder: "Email",
        passwordPlaceholder: "Пароль", newPasswordPlaceholder: "Новый пароль",
        sendCodeBtn: "Отправить код", codePlaceholder: "Код из письма",
        confirmBtn: "Подтвердить", loginBtnModal: "Войти",
        codeSentText: "Код отправлен на почту, введите его:",
        backBtn: "← Назад", forgotPassword: "Забыли пароль?",
        forgotTitle: "Восстановление пароля", resetPasswordBtn: "Сменить пароль",
        emailLabel: "Email:", roleLabel: "Роль:",
        adminPanelTitle: "Админ панель",
        searchPlaceholder: "Поиск по темам...",
        catAll: "Все",
        toastRegisterSuccess: "Аккаунт успешно создан!", toastLoginSuccess: "Вы успешно вошли!",
        toastPasswordReset: "Пароль изменён!", toastLogout: "Вы вышли из аккаунта",
        nickTooShort: "✗ Минимум 3 символа", nickInvalid: "✗ Только буквы, цифры и _",
        nickOk: "✓ Отлично!", nickTaken: "✗ Этот ник уже занят",
        emailInvalid: "✗ Некорректный email", emailOk: "✓ Email верный", emailTaken: "✗ Email уже зарегистрирован",
        passTooShort: "✗ Минимум 6 символов", passOk: "✓ Надёжный пароль",
        bioPlaceholder: "Расскажите о себе...",
        favCategoryLabel: "Любимая категория", displayNameLabel: "Отображаемое имя",
        usernameLabel: "Username", bioLabel: "О себе",
        settingsBtn: "Настройки",
        menuEditProfile: "Редакция профиля", menuSwitchAccount: "Сменить аккаунт",
        saveBtn: "Сохранить",
        privacyTitle: "Приватность",
        hideEmailLabel: "Скрыть email от других", privateProfileLabel: "Приватный профиль",
        notificationsLabel: "Email-уведомления",
        tabTheme: "Оформление", tabSecurity: "Безопасность",
        twoFAHint: "🔒 Двухфакторная защита уже включена.",
        lastLoginLabel: "Последний вход:", changeEmailTitle: "Сменить Email",
        newEmailPlaceholder: "Новый email",
        themeDark: "Тёмная", themeLight: "Светлая", themeSunset: "Закат",
        followBtn: "Подписаться", unfollowBtn: "Отписаться",
        postsStats: "Постов", deletedStats: "Удалено", followingStats: "Подписки",
        toastProfileSaved: "Профиль сохранён!", toastEmailChanged: "Email изменён!",
        toastThemeChanged: "Тема изменена!", toastUsernameTaken: "Этот username уже занят",
        toastFollowed: "Вы подписались!", toastUnfollowed: "Вы отписались",
        addAccountBtn: "+ Добавить аккаунт", currentAccountLabel: "Текущий",
        switchAccountToast: "Аккаунт переключён",
        toastUploadPhoto: "Фото обновлено", uploadPhoto: "Загрузить фото", removePhoto: "Убрать фото",
        newPostTitle: "Новый пост", editPostTitle: "Редакция поста",
        addPhotoText: "Добавить фото",
        postTitlePlaceholder: "Заголовок поста", postContentPlaceholder: "Текст поста...",
        publishBtn: "Опубликовать", saveChangesBtn: "Сохранить изменения",
        editPostBtn: "✏️ Редактировать", deletePostBtn: "🗑️ Удалить",
        noPosts: "Пока нет постов", toastPostPublished: "Пост опубликован!",
        toastPostUpdated: "Пост обновлён!", toastPostDeleted: "Пост удалён",
        usersManagementTitle: "Пользователи", categoriesManagementTitle: "Категории",
        postsManagementTitle: "Управление постами",
        categoryNamePlaceholder: "Название категории", addCategoryBtn: "Добавить",
        toastCategoryAdded: "Категория добавлена!", toastCategoryDeleted: "Категория удалена",
        confirmDeletePost: "Удалить этот пост?", confirmDeleteCategory: "Удалить эту категорию?",
        verifiedToggleLabel: "Верифицирован"
    },
    en: {
        loginBtn: "Login", registerBtn: "Register", logoutBtn: "Logout",
        mainTitle: "Welcome to Day TV Channel!",
        mainText: "Fresh news, sports and entertainment every day.",
        welcomeBack: "Welcome back, {name}! ☀️",
        registerTitle: "Registration", loginTitle: "Login",
        nicknamePlaceholder: "Nickname", emailPlaceholder: "Email",
        passwordPlaceholder: "Password", newPasswordPlaceholder: "New password",
        sendCodeBtn: "Send code", codePlaceholder: "Code from email",
        confirmBtn: "Confirm", loginBtnModal: "Login",
        codeSentText: "Code sent to your email, enter it:",
        backBtn: "← Back", forgotPassword: "Forgot password?",
        forgotTitle: "Password Recovery", resetPasswordBtn: "Reset password",
        emailLabel: "Email:", roleLabel: "Role:",
        adminPanelTitle: "Admin Panel",
        searchPlaceholder: "Search topics...",
        catAll: "All",
        toastRegisterSuccess: "Account created!", toastLoginSuccess: "You are logged in!",
        toastPasswordReset: "Password changed!", toastLogout: "You have logged out",
        nickTooShort: "✗ Minimum 3 characters", nickInvalid: "✗ Only letters, numbers and _",
        nickOk: "✓ Looks good!", nickTaken: "✗ This nickname is taken",
        emailInvalid: "✗ Invalid email", emailOk: "✓ Email is valid", emailTaken: "✗ Email already registered",
        passTooShort: "✗ Minimum 6 characters", passOk: "✓ Strong password",
        bioPlaceholder: "Tell about yourself...",
        favCategoryLabel: "Favorite category", displayNameLabel: "Display name",
        usernameLabel: "Username", bioLabel: "Bio",
        settingsBtn: "Settings",
        menuEditProfile: "Edit Profile", menuSwitchAccount: "Switch Account",
        saveBtn: "Save",
        privacyTitle: "Privacy",
        hideEmailLabel: "Hide email from others", privateProfileLabel: "Private profile",
        notificationsLabel: "Email notifications",
        tabTheme: "Appearance", tabSecurity: "Security",
        twoFAHint: "🔒 Two-factor security is already enabled.",
        lastLoginLabel: "Last login:", changeEmailTitle: "Change Email",
        newEmailPlaceholder: "New email",
        themeDark: "Dark", themeLight: "Light", themeSunset: "Sunset",
        followBtn: "Follow", unfollowBtn: "Unfollow",
        postsStats: "Posts", deletedStats: "Deleted", followingStats: "Following",
        toastProfileSaved: "Profile saved!", toastEmailChanged: "Email changed!",
        toastThemeChanged: "Theme changed!", toastUsernameTaken: "This username is taken",
        toastFollowed: "Now following!", toastUnfollowed: "Unfollowed",
        addAccountBtn: "+ Add account", currentAccountLabel: "Current",
        switchAccountToast: "Account switched",
        toastUploadPhoto: "Photo updated", uploadPhoto: "Upload photo", removePhoto: "Remove photo",
        newPostTitle: "New Post", editPostTitle: "Edit Post",
        addPhotoText: "Add photo",
        postTitlePlaceholder: "Post title", postContentPlaceholder: "Post text...",
        publishBtn: "Publish", saveChangesBtn: "Save changes",
        editPostBtn: "✏️ Edit", deletePostBtn: "🗑️ Delete",
        noPosts: "No posts yet", toastPostPublished: "Post published!",
        toastPostUpdated: "Post updated!", toastPostDeleted: "Post deleted",
        usersManagementTitle: "Users", categoriesManagementTitle: "Categories",
        postsManagementTitle: "Posts Management",
        categoryNamePlaceholder: "Category name", addCategoryBtn: "Add",
        toastCategoryAdded: "Category added!", toastCategoryDeleted: "Category deleted",
        confirmDeletePost: "Delete this post?", confirmDeleteCategory: "Delete this category?",
        verifiedToggleLabel: "Verified"
    }
};

const ROLE_LABELS = {
    ru: { owner: "Владелец", moderator: "Модератор", manager: "Менеджер", reporter: "Репортер", viewer: "Зритель" },
    en: { owner: "Owner", moderator: "Moderator", manager: "Manager", reporter: "Reporter", viewer: "Viewer" }
};

let currentLang = localStorage.getItem('lang') || 'ru';
function t(key) { return translations[currentLang][key] || key; }
function translateRole(role) { return ROLE_LABELS[currentLang][role] || role; }

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) el.placeholder = translations[lang][key];
    });
    document.getElementById('langSelect').value = lang;
    if (typeof updateUI === 'function') updateUI();
    if (typeof renderCategoryPills === 'function') renderCategoryPills();
    if (typeof renderPosts === 'function') renderPosts();
}

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
    document.getElementById('langSelect').addEventListener('change', e => applyLanguage(e.target.value));
});