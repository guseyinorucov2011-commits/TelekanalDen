// ===== НАСТРОЙКИ EMAILJS (замени на свои!) =====
emailjs.init("dKXa98LTUUYzY4xjA");
const SERVICE_ID = "service_3checcr";
const TEMPLATE_ID = "template_g09l06w";

const ROLES = ['owner','moderator','manager','reporter','viewer'];
const AVATAR_COLORS = ['#ff6b35','#ffb800','#4aa8ff','#4ade80','#a855f7','#ec4899','#14b8a6','#f97316'];

function showToast(msg, type='success') {
    const c = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${type==='success'?'✅':'⚠️'}</span><span>${msg}</span>`;
    c.appendChild(el);
    setTimeout(()=>el.remove(), 4000);
}

// ===== Storage helpers =====
function getUsers() { return JSON.parse(localStorage.getItem('users') || '{}'); }
function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }
function getCurrentUserEmail() { return localStorage.getItem('currentUserEmail'); }
function getCurrentUser() {
    const email = getCurrentUserEmail();
    if (!email) return null;
    const users = getUsers();
    if (!users[email]) return null;
    return { ...users[email], email };
}
function generateCode() { return Math.floor(100000+Math.random()*900000).toString(); }

function getSavedAccounts() { return JSON.parse(localStorage.getItem('savedAccounts') || '[]'); }
function addSavedAccount(email) { let l = getSavedAccounts(); if (!l.includes(email)) l.push(email); localStorage.setItem('savedAccounts', JSON.stringify(l)); }
function removeSavedAccount(email) { localStorage.setItem('savedAccounts', JSON.stringify(getSavedAccounts().filter(e=>e!==email))); }

function getCategories() {
    let cats = JSON.parse(localStorage.getItem('categories') || 'null');
    if (!cats) {
        cats = [
            { id:'sport', name:'Спорт', emoji:'⚽' },
            { id:'news', name:'Новости', emoji:'📰' },
            { id:'weather', name:'Погода', emoji:'☀️' },
            { id:'fun', name:'Развлечения', emoji:'🎬' }
        ];
        localStorage.setItem('categories', JSON.stringify(cats));
    }
    return cats;
}
function saveCategories(c) { localStorage.setItem('categories', JSON.stringify(c)); }

function getPosts() { return JSON.parse(localStorage.getItem('posts') || '[]'); }
function savePosts(p) { localStorage.setItem('posts', JSON.stringify(p)); }

function createDefaultUser(nickname, password, role) {
    return {
        nickname, displayName: nickname, password, role,
        avatar: null, avatarColor: null, banner: null, bio: '',
        favoriteCategory: 'all', verified: false,
        hideEmail: false, privateProfile: false, notifications: true,
        following: [], stats: { posts:0, deletedMessages:0 },
        lastLogin: Date.now(), createdAt: Date.now()
    };
}

function stringToColor(str) {
    let hash = 0;
    for (let i=0;i<str.length;i++) hash = str.charCodeAt(i) + ((hash<<5)-hash);
    return `hsl(${Math.abs(hash)%360}, 65%, 45%)`;
}
function renderAvatar(user, container, showRoleFrame=false) {
    container.innerHTML = '';
    container.className = container.className.replace(/role-\w+/g,'').trim();
    if (user.avatar) {
        const img = document.createElement('img');
        img.src = user.avatar; img.className = 'avatar-img';
        container.appendChild(img);
        container.style.background = 'transparent';
    } else {
        container.style.background = user.avatarColor || stringToColor(user.displayName || user.nickname);
        container.textContent = (user.displayName || user.nickname).charAt(0).toUpperCase();
    }
    if (showRoleFrame && user.role) container.classList.add('role-'+user.role);
}

// ===== Модалки =====
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
document.getElementById('loginBtn').onclick = () => loginModal.style.display='flex';
document.getElementById('registerBtn').onclick = () => registerModal.style.display='flex';
document.querySelectorAll('.close[data-close]').forEach(b => b.onclick = () => document.getElementById(b.dataset.close).style.display='none');
function backToStep(f) { document.getElementById(f+'Step2').style.display='none'; document.getElementById(f+'Step1').style.display='block'; }

let regCodeData={}, loginCodeData={}, forgotCodeData={}, emailChangeData={};

const nickRegex = /^[a-zA-Zа-яА-Я0-9_]{3,16}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterForm() {
    const nickname = document.getElementById('regNickname').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const nickMsg = document.getElementById('regNicknameMsg');
    const emailMsg = document.getElementById('regEmailMsg');
    const passMsg = document.getElementById('regPasswordMsg');
    let nOk=false, eOk=false, pOk=false;
    const users = getUsers();

    if (!nickname) nickMsg.textContent='';
    else if (nickname.length<3) { nickMsg.textContent=t('nickTooShort'); nickMsg.className='field-msg invalid'; }
    else if (!nickRegex.test(nickname)) { nickMsg.textContent=t('nickInvalid'); nickMsg.className='field-msg invalid'; }
    else if (Object.values(users).some(u=>u.nickname.toLowerCase()===nickname.toLowerCase())) { nickMsg.textContent=t('nickTaken'); nickMsg.className='field-msg invalid'; }
    else { nickMsg.textContent=t('nickOk'); nickMsg.className='field-msg valid'; nOk=true; }

    if (!email) emailMsg.textContent='';
    else if (!emailRegex.test(email)) { emailMsg.textContent=t('emailInvalid'); emailMsg.className='field-msg invalid'; }
    else if (users[email.toLowerCase()]) { emailMsg.textContent=t('emailTaken'); emailMsg.className='field-msg invalid'; }
    else { emailMsg.textContent=t('emailOk'); emailMsg.className='field-msg valid'; eOk=true; }

    if (!password) passMsg.textContent='';
    else if (password.length<6) { passMsg.textContent=t('passTooShort'); passMsg.className='field-msg invalid'; }
    else { passMsg.textContent=t('passOk'); passMsg.className='field-msg valid'; pOk=true; }

    document.getElementById('regSendBtn').disabled = !(nOk&&eOk&&pOk);
}
['regNickname','regEmail','regPassword'].forEach(id=>document.getElementById(id).addEventListener('input', validateRegisterForm));

function sendRegisterCode() {
    const nickname = document.getElementById('regNickname').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const code = generateCode();
    regCodeData = { code, nickname, email, password };
    emailjs.send(SERVICE_ID, TEMPLATE_ID, { to_email: email, code })
        .then(()=>{ document.getElementById('regStep1').style.display='none'; document.getElementById('regStep2').style.display='block'; })
        .catch(()=>showToast('Ошибка отправки письма','error'));
}
function verifyRegisterCode() {
    const code = document.getElementById('regCode').value.trim();
    if (code !== regCodeData.code) { showToast('Неверный код','error'); return; }
    const users = getUsers();
    const role = regCodeData.nickname.toLowerCase()==='noname' ? 'owner' : 'viewer';
    users[regCodeData.email] = createDefaultUser(regCodeData.nickname, regCodeData.password, role);
    saveUsers(users);
    localStorage.setItem('currentUserEmail', regCodeData.email);
    addSavedAccount(regCodeData.email);
    showToast(t('toastRegisterSuccess'),'success');
    setTimeout(()=>location.reload(), 1000);
}

function sendLoginCode() {
    const nickname = document.getElementById('loginNickname').value.trim();
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    const foundEmail = Object.keys(users).find(e=>users[e].nickname.toLowerCase()===nickname.toLowerCase());
    if (!foundEmail) { showToast('Пользователь не найден','error'); return; }
    if (users[foundEmail].password !== password) { showToast('Неверный пароль','error'); return; }
    const code = generateCode();
    loginCodeData = { code, email: foundEmail };
    emailjs.send(SERVICE_ID, TEMPLATE_ID, { to_email: foundEmail, code })
        .then(()=>{ document.getElementById('loginStep1').style.display='none'; document.getElementById('loginStep2').style.display='block'; })
        .catch(()=>showToast('Ошибка отправки письма','error'));
}
function verifyLoginCode() {
    const code = document.getElementById('loginCode').value.trim();
    if (code !== loginCodeData.code) { showToast('Неверный код','error'); return; }
    const users = getUsers();
    users[loginCodeData.email].lastLogin = Date.now();
    saveUsers(users);
    localStorage.setItem('currentUserEmail', loginCodeData.email);
    addSavedAccount(loginCodeData.email);
    showToast(t('toastLoginSuccess'),'success');
    setTimeout(()=>location.reload(), 1000);
}

function openForgotPassword() { loginModal.style.display='none'; document.getElementById('forgotModal').style.display='flex'; }
function sendForgotCode() {
    const nickname = document.getElementById('forgotNickname').value.trim();
    const users = getUsers();
    const foundEmail = Object.keys(users).find(e=>users[e].nickname.toLowerCase()===nickname.toLowerCase());
    if (!foundEmail) { showToast('Пользователь не найден','error'); return; }
    const code = generateCode();
    forgotCodeData = { code, email: foundEmail };
    emailjs.send(SERVICE_ID, TEMPLATE_ID, { to_email: foundEmail, code })
        .then(()=>{ document.getElementById('forgotStep1').style.display='none'; document.getElementById('forgotStep2').style.display='block'; })
        .catch(()=>showToast('Ошибка отправки письма','error'));
}
function verifyForgotCode() {
    const code = document.getElementById('forgotCode').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    if (code !== forgotCodeData.code) { showToast('Неверный код','error'); return; }
    if (!newPassword || newPassword.length<6) { showToast('Пароль слишком короткий','error'); return; }
    const users = getUsers();
    users[forgotCodeData.email].password = newPassword;
    saveUsers(users);
    showToast(t('toastPasswordReset'),'success');
    setTimeout(()=>location.reload(), 1000);
}

// ===== UI =====
function updateUI() {
    const user = getCurrentUser();
    const heroTitle = document.getElementById('heroTitle');
    const heroText = document.getElementById('heroText');

    if (user) {
        document.getElementById('auth-buttons').style.display='none';
        document.getElementById('userInfo').style.display='flex';
        document.getElementById('userName').textContent = user.displayName;
        renderAvatar(user, document.getElementById('userAvatar'));
        document.getElementById('miniVerified').style.display = user.verified ? 'inline' : 'none';

        const canAdmin = ['owner','moderator','manager'].includes(user.role);
        document.getElementById('adminFab').style.display = canAdmin ? 'flex' : 'none';

        const canPost = ['reporter','owner'].includes(user.role);
        document.getElementById('createPostFab').style.display = canPost ? 'flex' : 'none';

        heroTitle.textContent = t('welcomeBack').replace('{name}', user.displayName);
        heroTitle.removeAttribute('data-i18n');
        heroText.textContent = t('mainText');
    } else {
        document.getElementById('auth-buttons').style.display='flex';
        document.getElementById('userInfo').style.display='none';
        document.getElementById('adminFab').style.display='none';
        document.getElementById('createPostFab').style.display='none';
        heroTitle.setAttribute('data-i18n','mainTitle');
        heroTitle.textContent = t('mainTitle');
        heroText.textContent = t('mainText');
    }
}
document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('currentUserEmail');
    showToast(t('toastLogout'),'success');
    setTimeout(()=>location.reload(), 700);
};

// ===================== ПРОФИЛЬ (свой просмотр) =====================
function openProfileModal() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById('viewBannerSelf').style.backgroundImage = user.banner ? `url(${user.banner})` : '';
    renderAvatar(user, document.getElementById('viewAvatarSelf'), true);
    document.getElementById('viewNameSelf').textContent = user.displayName;
    document.getElementById('viewUsernameSelf').textContent = '@' + user.nickname;
    document.getElementById('viewVerifiedSelf').style.display = user.verified ? 'inline' : 'none';
    document.getElementById('viewBioSelf').textContent = user.bio || '';
    document.getElementById('viewRoleSelf').textContent = translateRole(user.role);
    document.getElementById('viewCreatedSelf').textContent = new Date(user.createdAt).toLocaleDateString();

    const statsEl = document.getElementById('viewStatsSelf');
    statsEl.innerHTML = '';
    if (user.role==='reporter' || user.role==='owner') statsEl.innerHTML += `<div class="stat-box"><span class="stat-num">${user.stats?.posts||0}</span><span class="stat-label">${t('postsStats')}</span></div>`;
    if (user.role==='moderator' || user.role==='owner') statsEl.innerHTML += `<div class="stat-box"><span class="stat-num">${user.stats?.deletedMessages||0}</span><span class="stat-label">${t('deletedStats')}</span></div>`;
    statsEl.innerHTML += `<div class="stat-box"><span class="stat-num">${(user.following||[]).length}</span><span class="stat-label">${t('followingStats')}</span></div>`;

    document.getElementById('profileModal').style.display = 'flex';
}
document.getElementById('userAvatar').onclick = openProfileModal;
document.getElementById('userName').onclick = openProfileModal;

// ===================== SETTINGS PANEL =====================
document.getElementById('openSettingsBtn').onclick = () => {
    document.getElementById('profileModal').style.display = 'none';
    openSettingsMenu();
    document.getElementById('settingsPanel').classList.add('open');
};
document.getElementById('closeSettingsPanel').onclick = () => document.getElementById('settingsPanel').classList.remove('open');

function openSettingsMenu() {
    document.getElementById('settingsMenu').style.display = 'block';
    document.querySelectorAll('.settings-page').forEach(p => p.classList.remove('active'));
    document.getElementById('settingsBackBtn').style.display = 'none';
    document.getElementById('settingsPanelTitle').textContent = t('settingsBtn');
}
document.querySelectorAll('.settings-menu-item').forEach(item => {
    item.onclick = () => {
        const targetId = item.dataset.target;
        document.getElementById('settingsMenu').style.display = 'none';
        document.getElementById(targetId).classList.add('active');
        document.getElementById('settingsBackBtn').style.display = 'inline-block';
        document.getElementById('settingsPanelTitle').textContent = item.querySelector('.menu-text').textContent;
        if (targetId === 'editProfilePage') loadEditProfilePage();
        if (targetId === 'switchAccountPage') loadSwitchAccountPage();
    };
});
document.getElementById('settingsBackBtn').onclick = openSettingsMenu;

function populateCategorySelect(selectEl, includeAll) {
    selectEl.innerHTML = '';
    if (includeAll) {
        const opt = document.createElement('option');
        opt.value = 'all'; opt.textContent = t('catAll');
        selectEl.appendChild(opt);
    }
    getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id; opt.textContent = `${cat.emoji} ${cat.name}`;
        selectEl.appendChild(opt);
    });
}

function loadEditProfilePage() {
    const user = getCurrentUser();
    document.getElementById('profileBannerBig').style.backgroundImage = user.banner ? `url(${user.banner})` : '';
    renderAvatar(user, document.getElementById('profileAvatarBig'), true);
    document.getElementById('editDisplayName').value = user.displayName;
    document.getElementById('editUsername').value = user.nickname;
    document.getElementById('editBio').value = user.bio || '';
    populateCategorySelect(document.getElementById('favCategorySelect'), true);
    document.getElementById('favCategorySelect').value = user.favoriteCategory || 'all';
    document.getElementById('hideEmailToggle').checked = !!user.hideEmail;
    document.getElementById('privateProfileToggle').checked = !!user.privateProfile;
    document.getElementById('notificationsToggle').checked = user.notifications !== false;
    document.getElementById('lastLoginText').textContent = new Date(user.lastLogin || user.createdAt).toLocaleString();
    document.getElementById('emailChangeStep2').style.display = 'none';
    document.getElementById('newEmailInput').value = '';
    document.getElementById('avatarPicker').style.display = 'none';
    document.querySelectorAll('.theme-card').forEach(c => c.classList.toggle('selected', c.dataset.theme === (localStorage.getItem('theme')||'dark')));
}

document.getElementById('avatarEditBtn').onclick = () => {
    const picker = document.getElementById('avatarPicker');
    picker.style.display = picker.style.display==='none' ? 'block' : 'none';
    const palette = document.getElementById('colorPalette');
    palette.innerHTML = '';
    AVATAR_COLORS.forEach(color => {
        const dot = document.createElement('div');
        dot.className = 'color-dot'; dot.style.background = color;
        dot.onclick = () => {
            const users = getUsers(); const email = getCurrentUserEmail();
            users[email].avatarColor = color; users[email].avatar = null;
            saveUsers(users); loadEditProfilePage(); updateUI();
        };
        palette.appendChild(dot);
    });
};
document.getElementById('uploadAvatarBtn').onclick = () => document.getElementById('avatarInput').click();
document.getElementById('avatarInput').onchange = function(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        const users = getUsers(); const email = getCurrentUserEmail();
        users[email].avatar = evt.target.result;
        saveUsers(users); loadEditProfilePage(); updateUI();
        showToast(t('toastUploadPhoto'),'success');
    };
    reader.readAsDataURL(file);
};
document.getElementById('removeAvatarBtn').onclick = () => {
    const users = getUsers(); const email = getCurrentUserEmail();
    users[email].avatar = null; users[email].avatarColor = null;
    saveUsers(users); loadEditProfilePage(); updateUI();
};
document.getElementById('changeBannerBtn').onclick = () => document.getElementById('bannerInput').click();
document.getElementById('bannerInput').onchange = function(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        const users = getUsers(); const email = getCurrentUserEmail();
        users[email].banner = evt.target.result;
        saveUsers(users); loadEditProfilePage();
    };
    reader.readAsDataURL(file);
};

document.getElementById('saveAllSettingsBtn').onclick = () => {
    const users = getUsers();
    const email = getCurrentUserEmail();
    const newDisplayName = document.getElementById('editDisplayName').value.trim();
    const newUsername = document.getElementById('editUsername').value.trim();
    const newBio = document.getElementById('editBio').value.trim();
    const newFavCat = document.getElementById('favCategorySelect').value;

    if (!newDisplayName || !newUsername) { showToast('Заполните имя и username','error'); return; }
    if (newUsername.toLowerCase() !== users[email].nickname.toLowerCase()) {
        const taken = Object.keys(users).some(e => e!==email && users[e].nickname.toLowerCase()===newUsername.toLowerCase());
        if (taken) { showToast(t('toastUsernameTaken'),'error'); return; }
    }

    users[email].displayName = newDisplayName;
    users[email].nickname = newUsername;
    users[email].bio = newBio;
    users[email].favoriteCategory = newFavCat;
    users[email].hideEmail = document.getElementById('hideEmailToggle').checked;
    users[email].privateProfile = document.getElementById('privateProfileToggle').checked;
    users[email].notifications = document.getElementById('notificationsToggle').checked;
    saveUsers(users);
    showToast(t('toastProfileSaved'),'success');
    updateUI();
};

document.querySelectorAll('.theme-card').forEach(card => {
    card.onclick = () => {
        applyTheme(card.dataset.theme);
        document.querySelectorAll('.theme-card').forEach(c=>c.classList.remove('selected'));
        card.classList.add('selected');
        showToast(t('toastThemeChanged'),'success');
    };
});
function applyTheme(theme) {
    document.body.classList.remove('theme-dark','theme-light','theme-sunset');
    document.body.classList.add('theme-'+theme);
    localStorage.setItem('theme', theme);
}

function requestEmailChange() {
    const newEmail = document.getElementById('newEmailInput').value.trim().toLowerCase();
    if (!emailRegex.test(newEmail)) { showToast('Некорректный email','error'); return; }
    const users = getUsers();
    if (users[newEmail]) { showToast('Этот email уже используется','error'); return; }
    const code = generateCode();
    emailChangeData = { code, newEmail };
    emailjs.send(SERVICE_ID, TEMPLATE_ID, { to_email: newEmail, code })
        .then(()=> document.getElementById('emailChangeStep2').style.display='block')
        .catch(()=>showToast('Ошибка отправки письма','error'));
}
function confirmEmailChange() {
    const code = document.getElementById('emailChangeCode').value.trim();
    if (code !== emailChangeData.code) { showToast('Неверный код','error'); return; }
    const users = getUsers();
    const oldEmail = getCurrentUserEmail();
    users[emailChangeData.newEmail] = users[oldEmail];
    delete users[oldEmail];
    saveUsers(users);
    removeSavedAccount(oldEmail);
    addSavedAccount(emailChangeData.newEmail);
    localStorage.setItem('currentUserEmail', emailChangeData.newEmail);
    showToast(t('toastEmailChanged'),'success');
    setTimeout(()=>location.reload(), 1000);
}

// ---- Смена аккаунта ----
function loadSwitchAccountPage() {
    const listEl = document.getElementById('savedAccountsList');
    listEl.innerHTML = '';
    const users = getUsers();
    const savedEmails = getSavedAccounts();
    const currentEmail = getCurrentUserEmail();

    savedEmails.forEach(email => {
        const u = users[email];
        if (!u) { removeSavedAccount(email); return; }
        const isCurrent = email === currentEmail;
        const row = document.createElement('div');
        row.className = 'account-row' + (isCurrent ? ' current' : '');

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar-small';
        renderAvatar({...u, email}, avatarDiv);
        row.appendChild(avatarDiv);

        const info = document.createElement('div');
        info.className = 'account-info';
        info.innerHTML = `<div class="aname">${u.displayName}</div><div class="auser">@${u.nickname}</div>`;
        row.appendChild(info);

        if (isCurrent) {
            const badge = document.createElement('span');
            badge.className = 'account-badge'; badge.textContent = t('currentAccountLabel');
            row.appendChild(badge);
        } else {
            row.onclick = () => {
                localStorage.setItem('currentUserEmail', email);
                showToast(t('switchAccountToast'),'success');
                setTimeout(()=>location.reload(), 600);
            };
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-account-btn'; removeBtn.textContent = '✕';
            removeBtn.onclick = e => { e.stopPropagation(); removeSavedAccount(email); loadSwitchAccountPage(); };
            row.appendChild(removeBtn);
        }
        listEl.appendChild(row);
    });
}
document.getElementById('addAccountBtn').onclick = () => {
    document.getElementById('settingsPanel').classList.remove('open');
    loginModal.style.display = 'flex';
};

// ===================== ЧУЖОЙ ПРОФИЛЬ =====================
function openViewUserModal(email) {
    const users = getUsers();
    const u = users[email];
    const currentUser = getCurrentUser();
    if (!u) return;

    document.getElementById('viewUserBanner').style.backgroundImage = u.banner ? `url(${u.banner})` : '';
    renderAvatar({...u, email}, document.getElementById('viewUserAvatar'), true);
    document.getElementById('viewUserDisplayName').textContent = u.displayName;
    document.getElementById('viewUserUsername').textContent = '@' + u.nickname;
    document.getElementById('viewVerifiedBadge').style.display = u.verified ? 'inline' : 'none';
    document.getElementById('viewUserBio').textContent = u.bio || '';
    document.getElementById('viewUserRole').textContent = translateRole(u.role);
    document.getElementById('viewUserCreatedAt').textContent = new Date(u.createdAt).toLocaleDateString();

    const isAdmin = currentUser && ['owner','moderator','manager'].includes(currentUser.role);
    const emailRow = document.getElementById('viewEmailRow');
    if (!u.hideEmail || isAdmin) { emailRow.style.display='block'; document.getElementById('viewUserEmail').textContent = email; }
    else emailRow.style.display = 'none';

    const statsBlock = document.getElementById('viewStatsBlock');
    statsBlock.innerHTML = '';
    if (u.role==='reporter'||u.role==='owner') statsBlock.innerHTML += `<div class="stat-box"><span class="stat-num">${u.stats?.posts||0}</span><span class="stat-label">${t('postsStats')}</span></div>`;
    if (u.role==='moderator'||u.role==='owner') statsBlock.innerHTML += `<div class="stat-box"><span class="stat-num">${u.stats?.deletedMessages||0}</span><span class="stat-label">${t('deletedStats')}</span></div>`;

    const followBtn = document.getElementById('followBtn');
    if (currentUser && currentUser.email !== email) {
        followBtn.style.display = 'block';
        const isFollowing = (currentUser.following||[]).includes(email);
        followBtn.textContent = isFollowing ? t('unfollowBtn') : t('followBtn');
        followBtn.onclick = () => toggleFollow(email);
    } else followBtn.style.display = 'none';

    document.getElementById('viewUserModal').style.display = 'flex';
}
document.getElementById('viewUserBackBtn').onclick = () => document.getElementById('viewUserModal').style.display = 'none';

function toggleFollow(targetEmail) {
    const users = getUsers();
    const myEmail = getCurrentUserEmail();
    if (!users[myEmail].following) users[myEmail].following = [];
    const idx = users[myEmail].following.indexOf(targetEmail);
    if (idx === -1) { users[myEmail].following.push(targetEmail); showToast(t('toastFollowed'),'success'); }
    else { users[myEmail].following.splice(idx,1); showToast(t('toastUnfollowed'),'success'); }
    saveUsers(users);
    openViewUserModal(targetEmail);
}

// ===================== ПОСТЫ =====================
let editingPostId = null;
let selectedPostImage = null;

document.getElementById('createPostFab').onclick = () => openPostEditModal(null);

function openPostEditModal(postId) {
    editingPostId = postId;
    selectedPostImage = null;
    populateCategorySelect(document.getElementById('postCategorySelect'), false);

    if (postId) {
        const post = getPosts().find(p => p.id === postId);
        document.getElementById('postEditModalTitle').textContent = t('editPostTitle');
        document.getElementById('postTitleInput').value = post.title;
        document.getElementById('postContentInput').value = post.content;
        document.getElementById('postCategorySelect').value = post.categoryId;
        document.getElementById('publishPostBtn').textContent = t('saveChangesBtn');
        if (post.image) {
            selectedPostImage = post.image;
            document.getElementById('postImagePreview').src = post.image;
            document.getElementById('postImagePreview').style.display = 'block';
            document.getElementById('postImagePlaceholder').style.display = 'none';
        } else {
            document.getElementById('postImagePreview').style.display = 'none';
            document.getElementById('postImagePlaceholder').style.display = 'block';
        }
    } else {
        document.getElementById('postEditModalTitle').textContent = t('newPostTitle');
        document.getElementById('postTitleInput').value = '';
        document.getElementById('postContentInput').value = '';
        document.getElementById('publishPostBtn').textContent = t('publishBtn');
        document.getElementById('postImagePreview').style.display = 'none';
        document.getElementById('postImagePlaceholder').style.display = 'block';
    }
    document.getElementById('postEditModal').style.display = 'flex';
}

document.getElementById('postImageUpload').onclick = () => document.getElementById('postImageInput').click();
document.getElementById('postImageInput').onchange = function(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
        selectedPostImage = evt.target.result;
        document.getElementById('postImagePreview').src = selectedPostImage;
        document.getElementById('postImagePreview').style.display = 'block';
        document.getElementById('postImagePlaceholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
};

document.getElementById('publishPostBtn').onclick = () => {
    const title = document.getElementById('postTitleInput').value.trim();
    const content = document.getElementById('postContentInput').value.trim();
    const categoryId = document.getElementById('postCategorySelect').value;
    if (!title || !content) { showToast('Заполните заголовок и текст','error'); return; }

    const posts = getPosts();
    const user = getCurrentUser();

    if (editingPostId) {
        const post = posts.find(p => p.id === editingPostId);
        post.title = title; post.content = content; post.categoryId = categoryId; post.image = selectedPostImage;
        savePosts(posts);
        showToast(t('toastPostUpdated'),'success');
    } else {
        posts.unshift({
            id: 'post_' + Date.now(),
            title, content, categoryId, image: selectedPostImage,
            authorEmail: user.email, createdAt: Date.now()
        });
        savePosts(posts);
        const users = getUsers();
        users[user.email].stats.posts = (users[user.email].stats.posts||0) + 1;
        saveUsers(users);
        showToast(t('toastPostPublished'),'success');
    }
    document.getElementById('postEditModal').style.display = 'none';
    renderPosts();
};

function openPostView(postId) {
    const post = getPosts().find(p => p.id === postId);
    if (!post) return;
    const users = getUsers();
    const author = users[post.authorEmail];
    const cat = getCategories().find(c => c.id === post.categoryId);
    const currentUser = getCurrentUser();

    document.getElementById('postViewImage').style.backgroundImage = post.image ? `url(${post.image})` : '';
    document.getElementById('postViewCategory').textContent = cat ? `${cat.emoji} ${cat.name}` : '';
    document.getElementById('postViewTitleText').textContent = post.title;
    document.getElementById('postViewContentText').textContent = post.content;

    const authorEl = document.getElementById('postViewAuthor');
    authorEl.innerHTML = '';
    if (author) {
        const av = document.createElement('div');
        av.className = 'avatar-small';
        renderAvatar({...author, email: post.authorEmail}, av);
        authorEl.appendChild(av);
        const nameSpan = document.createElement('span');
        nameSpan.textContent = author.displayName + ' · ' + new Date(post.createdAt).toLocaleDateString();
        authorEl.appendChild(nameSpan);
        authorEl.onclick = () => { document.getElementById('postViewModal').style.display='none'; openViewUserModal(post.authorEmail); };
    }

    const actionsEl = document.getElementById('postViewActions');
    actionsEl.innerHTML = '';
    const canEdit = currentUser && (currentUser.email === post.authorEmail || currentUser.role === 'owner');
    const canDelete = currentUser && ['owner','moderator','manager'].includes(currentUser.role) || (currentUser && currentUser.email === post.authorEmail);

    if (canEdit) {
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-fill'; editBtn.textContent = t('editPostBtn');
        editBtn.onclick = () => { document.getElementById('postViewModal').style.display='none'; openPostEditModal(post.id); };
        actionsEl.appendChild(editBtn);
    }
    if (canDelete) {
        const delBtn = document.createElement('button');
        delBtn.className = 'btn-outline'; delBtn.textContent = t('deletePostBtn');
        delBtn.onclick = () => deletePost(post.id, currentUser.email !== post.authorEmail);
        actionsEl.appendChild(delBtn);
    }

    document.getElementById('postViewModal').style.display = 'flex';
}
document.getElementById('postViewBackBtn').onclick = () => document.getElementById('postViewModal').style.display = 'none';

function deletePost(postId, byModerator) {
    if (!confirm(t('confirmDeletePost'))) return;
    const posts = getPosts().filter(p => p.id !== postId);
    savePosts(posts);
    if (byModerator) {
        const users = getUsers();
        const myEmail = getCurrentUserEmail();
        users[myEmail].stats.deletedMessages = (users[myEmail].stats.deletedMessages||0) + 1;
        saveUsers(users);
    }
    showToast(t('toastPostDeleted'),'success');
    document.getElementById('postViewModal').style.display = 'none';
    renderPosts();
}

// ===================== КАТЕГОРИИ (пилюли) =====================
let activeCategory = 'all';
function renderCategoryPills() {
    const container = document.getElementById('categories');
    container.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'category-pill' + (activeCategory==='all' ? ' active' : '');
    allBtn.textContent = t('catAll');
    allBtn.onclick = () => { activeCategory='all'; renderCategoryPills(); renderPosts(); };
    container.appendChild(allBtn);

    getCategories().forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-pill' + (activeCategory===cat.id ? ' active' : '');
        btn.textContent = `${cat.emoji} ${cat.name}`;
        btn.onclick = () => { activeCategory=cat.id; renderCategoryPills(); renderPosts(); };
        container.appendChild(btn);
    });
}

// ===================== ПОСТЫ: рендер сетки =====================
function renderPosts() {
    const posts = getPosts();
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const grid = document.getElementById('postsGrid');
    grid.innerHTML = '';

    const filtered = posts.filter(p => {
        const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
        const matchSearch = p.title.toLowerCase().includes(searchTerm) || p.content.toLowerCase().includes(searchTerm);
        return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-posts">📭 ${t('noPosts')}</div>`;
        return;
    }

    filtered.forEach(post => {
        const cat = getCategories().find(c => c.id === post.categoryId);
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <div class="post-card-image" style="${post.image ? `background-image:url(${post.image})` : ''}">${!post.image ? (cat?cat.emoji:'📄') : ''}</div>
            <div class="post-card-body">
                <div class="post-card-cat">${cat ? cat.emoji+' '+cat.name : ''}</div>
                <div class="post-card-title">${post.title}</div>
            </div>`;
        card.onclick = () => openPostView(post.id);
        grid.appendChild(card);
    });
}
document.getElementById('searchInput').addEventListener('input', renderPosts);

// ===================== АДМИНКА =====================
document.getElementById('adminFab').onclick = openAdminPanel;
document.getElementById('closeAdminPanel').onclick = () => document.getElementById('adminPanel').classList.remove('open');

function openAdminPanel() {
    renderUsersList();
    const currentUser = getCurrentUser();

    const canManageCats = ['owner','manager'].includes(currentUser.role);
    document.getElementById('categoriesDivider').style.display = canManageCats ? 'block' : 'none';
    document.getElementById('categoriesManagement').style.display = canManageCats ? 'block' : 'none';
    if (canManageCats) renderCategoriesAdmin();

    const canManagePosts = ['owner','moderator','manager'].includes(currentUser.role);
    document.getElementById('postsDivider').style.display = canManagePosts ? 'block' : 'none';
    document.getElementById('postsManagement').style.display = canManagePosts ? 'block' : 'none';
    if (canManagePosts) renderAdminPostsList();

    document.getElementById('adminPanel').classList.add('open');
}

function renderUsersList() {
    const users = getUsers();
    const currentUser = getCurrentUser();
    const listEl = document.getElementById('usersList');
    listEl.innerHTML = '';

    Object.keys(users).forEach(email => {
        const u = users[email];
        const row = document.createElement('div');
        row.className = 'user-row';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar-small';
        renderAvatar({...u, email}, avatarDiv);
        row.appendChild(avatarDiv);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'user-row-info';
        infoDiv.innerHTML = `<b>${u.displayName}</b><br><small>${email}</small>`;
        infoDiv.onclick = () => openViewUserModal(email);
        row.appendChild(infoDiv);

        if (currentUser && currentUser.role === 'owner' && email !== currentUser.email) {
            const select = document.createElement('select');
            ROLES.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r; opt.textContent = translateRole(r);
                if (r === u.role) opt.selected = true;
                select.appendChild(opt);
            });
            select.onchange = e => {
                const us = getUsers(); us[email].role = e.target.value; saveUsers(us);
                renderUsersList(); showToast('Роль обновлена','success');
            };
            row.appendChild(select);

            const verifyRow = document.createElement('label');
            verifyRow.className = 'verified-toggle-row';
            verifyRow.innerHTML = `<label class="switch" style="width:32px;height:18px;"><input type="checkbox" ${u.verified?'checked':''}><span class="slider"></span></label><img src="LogoGalochka.png">`;
            verifyRow.querySelector('input').onchange = e => {
                const us = getUsers(); us[email].verified = e.target.checked; saveUsers(us);
                showToast('Статус обновлён','success');
            };
            row.appendChild(verifyRow);
        } else {
            const badge = document.createElement('span');
            badge.className = 'role-badge';
            badge.textContent = translateRole(u.role);
            row.appendChild(badge);
        }
        listEl.appendChild(row);
    });
}

function renderCategoriesAdmin() {
    const listEl = document.getElementById('categoriesList');
    listEl.innerHTML = '';
    getCategories().forEach(cat => {
        const row = document.createElement('div');
        row.className = 'category-row';
        row.innerHTML = `<span class="cat-name">${cat.emoji} ${cat.name}</span><button>✕</button>`;
        row.querySelector('button').onclick = () => {
            if (!confirm(t('confirmDeleteCategory'))) return;
            const cats = getCategories().filter(c => c.id !== cat.id);
            saveCategories(cats);
            renderCategoriesAdmin();
            renderCategoryPills();
            showToast(t('toastCategoryDeleted'),'success');
        };
        listEl.appendChild(row);
    });
}
document.getElementById('addCategoryBtn').onclick = () => {
    const emoji = document.getElementById('newCategoryEmoji').value.trim() || '🎯';
    const name = document.getElementById('newCategoryName').value.trim();
    if (!name) { showToast('Введите название','error'); return; }
    const id = name.toLowerCase().replace(/\s+/g,'_') + '_' + Date.now();
    const cats = getCategories();
    cats.push({ id, name, emoji });
    saveCategories(cats);
    document.getElementById('newCategoryEmoji').value = '';
    document.getElementById('newCategoryName').value = '';
    renderCategoriesAdmin();
    renderCategoryPills();
    showToast(t('toastCategoryAdded'),'success');
};

function renderAdminPostsList() {
    const listEl = document.getElementById('adminPostsList');
    listEl.innerHTML = '';
    const posts = getPosts();
    const users = getUsers();

    if (posts.length === 0) { listEl.innerHTML = `<p class="hint-text">${t('noPosts')}</p>`; return; }

    posts.forEach(post => {
        const author = users[post.authorEmail];
        const row = document.createElement('div');
        row.className = 'admin-post-row';
        row.innerHTML = `<span class="apname">${post.title} — ${author?author.displayName:'?'}</span><button>${t('deletePostBtn')}</button>`;
        row.querySelector('span').onclick = () => openPostView(post.id);
        row.querySelector('button').onclick = () => {
            const currentUser = getCurrentUser();
            deletePost(post.id, currentUser.email !== post.authorEmail);
            renderAdminPostsList();
        };
        listEl.appendChild(row);
    });
}

// ===================== АВТОИСПРАВЛЕНИЕ =====================
function fixOldUsers() {
    const users = getUsers();
    let changed = false;
    Object.keys(users).forEach(email => {
        const u = users[email];
        if (!u.role) { u.role='viewer'; changed=true; }
        if (u.nickname.toLowerCase()==='noname' && u.role!=='owner') { u.role='owner'; changed=true; }
        if (u.displayName===undefined) { u.displayName=u.nickname; changed=true; }
        if (u.following===undefined) { u.following=[]; changed=true; }
        if (u.stats===undefined) { u.stats={posts:0, deletedMessages:0}; changed=true; }
        if (u.createdAt===undefined) { u.createdAt=Date.now(); changed=true; }
        if (u.lastLogin===undefined) { u.lastLogin=Date.now(); changed=true; }
    });
    if (changed) saveUsers(users);
    const current = getCurrentUserEmail();
    if (current) addSavedAccount(current);
    getCategories(); // инициализация категорий по умолчанию
}

// ===================== ЗАПУСК =====================
applyTheme(localStorage.getItem('theme') || 'dark');
fixOldUsers();
updateUI();
renderCategoryPills();
renderPosts();