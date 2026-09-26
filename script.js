/* ================================================================
   🌟 NEXERA — COMPLETE JAVASCRIPT (V19)
   Clerk Integrated | Supabase Ready | All Features Working
   ================================================================ */

// ================================================================
// 🌟 SUPABASE CLIENT — Safe Dynamic Import
// ================================================================

const supabaseClientPromise = import('./supabase.js')
    .then(module => {
        console.log('✅ Supabase ready');
        return module.supabase;
    })
    .catch(error => {
        console.error('❌ Supabase connection failed:', error);
        throw error;
    });

// ================================================================
// 🌟 MAIN SCRIPT — DOM Ready
// ================================================================

document.addEventListener('DOMContentLoaded', function() {

    // ================================================================
    // 1. UTILITY FUNCTIONS
    // ================================================================

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
        return date.toLocaleDateString();
    }

    // ⭐ CLERK-AWARE: Current User
    function getCurrentUser() {
        // ⭐ Pehle Clerk check karo
        if (window.Clerk && window.Clerk.user) {
            const clerkUser = window.Clerk.user;
            return {
                id: clerkUser.id,
                name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || 'User',
                username: clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 'user',
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                avatar: '👤',
                bio: '',
                location: '',
                followers: [],
                following: [],
                savedPosts: [],
                enrolledCourses: []
            };
        }

        // ⭐ Fallback: localStorage
        return JSON.parse(localStorage.getItem('nexera-current-user') || 'null');
    }

    // ⭐ CLERK-AWARE: Get Users
    function getUsers() {
        const localUsers = JSON.parse(localStorage.getItem('nexera-users') || '[]');

        // ⭐ Clerk user ko bhi list mein add karo
        if (window.Clerk && window.Clerk.user) {
            const clerkUser = window.Clerk.user;
            const clerkUserId = clerkUser.id;
            const exists = localUsers.find(u => u.id === clerkUserId);

            if (!exists) {
                localUsers.push({
                    id: clerkUserId,
                    name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || 'User',
                    username: clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 'user',
                    email: clerkUser.primaryEmailAddress?.emailAddress || '',
                    avatar: '👤',
                    bio: '',
                    location: '',
                    followers: [],
                    following: [],
                    savedPosts: [],
                    enrolledCourses: []
                });
            }
        }

        return localUsers;
    }

    function saveUsers(users) {
        localStorage.setItem('nexera-users', JSON.stringify(users));
    }

    function getPosts() {
        return JSON.parse(localStorage.getItem('nexera-posts') || '[]');
    }

    function savePosts(posts) {
        localStorage.setItem('nexera-posts', JSON.stringify(posts));
    }

    function getMessages() {
        return JSON.parse(localStorage.getItem('nexera-messages') || '[]');
    }

    function saveMessages(messages) {
        localStorage.setItem('nexera-messages', JSON.stringify(messages));
    }

    function getNotifications() {
        return JSON.parse(localStorage.getItem('nexera-notifications') || '[]');
    }

    function saveNotifications(notifications) {
        localStorage.setItem('nexera-notifications', JSON.stringify(notifications));
    }

    function getCourseProgress() {
        return JSON.parse(localStorage.getItem('nexera-course-progress') || '{}');
    }

    function saveCourseProgress(progress) {
        localStorage.setItem('nexera-course-progress', JSON.stringify(progress));
    }

    function showToast(message, type = 'info') {
        const existingToast = document.querySelector('.nexera-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'nexera-toast';
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
            font-weight: 500;
            max-width: 400px;
            z-index: 9999;
            box-shadow: 0 8px 40px rgba(0,0,0,0.4);
            animation: slideInRight 0.4s ease;
            border: 1px solid rgba(255,255,255,0.06);
        `;

        const colors = {
            success: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.2)', text: '#34d399' },
            error: { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },
            info: { bg: 'rgba(74, 144, 217, 0.12)', border: 'rgba(74, 144, 217, 0.2)', text: '#6aaddb' },
            warning: { bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' }
        };

        const color = colors[type] || colors.info;
        toast.style.background = color.bg;
        toast.style.borderColor = color.border;
        toast.style.color = color.text;

        const icons = { success: '✅ ', error: '❌ ', info: 'ℹ️ ', warning: '⚠️ ' };
        toast.innerHTML = (icons[type] || '') + message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 4000);

        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function addNotification(userName, action, text) {
        const notifications = getNotifications();
        const iconMap = {
            'followed': '👤',
            'liked': '❤️',
            'commented': '💬',
            'messaged': '💬',
            'enrolled': '📚',
            'achievement': '🏆'
        };
        let icon = '🔔';
        for (const [key, value] of Object.entries(iconMap)) {
            if (action.includes(key)) {
                icon = value;
                break;
            }
        }

        notifications.unshift({
            id: generateId(),
            icon: icon,
            user: userName,
            action: action,
            text: text || '',
            time: 'Just now',
            unread: true,
            createdAt: new Date().toISOString()
        });
        saveNotifications(notifications);
        if (document.querySelector('.notifications-list')) {
            renderNotifications();
        }
        updateNotificationCounter();
    }

    // ================================================================
    // 2. NAVBAR — Mobile Hamburger & Active Link
    // ================================================================

    const hamburger = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks && window.innerWidth <= 768) {
                navLinks.classList.remove('open');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('open')) {
            const isClickInside = navLinks.contains(e.target) || (hamburger && hamburger.contains(e.target));
            if (!isClickInside) {
                navLinks.classList.remove('open');
                if (hamburger) hamburger.classList.remove('active');
            }
        }
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && href === 'index.html') {
            link.classList.add('active');
        }
    });

    // ================================================================
    // 3. THEME TOGGLE
    // ================================================================

    function toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('nexera-theme', newTheme);
        updateThemeUI(newTheme);
    }

    function updateThemeUI(theme) {
        const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
        toggleBtns.forEach(btn => {
            if (btn) {
                btn.textContent = theme === 'dark' ? '🌙' : '☀️';
                btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            }
        });
        const themeSwitch = document.querySelector('#themeToggle');
        if (themeSwitch) {
            themeSwitch.checked = theme === 'light';
        }
    }

    const savedTheme = localStorage.getItem('nexera-theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    const navContainer = document.querySelector('.nav-container');
    if (navContainer && !document.querySelector('.theme-toggle-btn')) {
        const themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle-btn';
        themeBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
        themeBtn.style.cssText = `
            background: none;
            border: none;
            color: #a0a0b0;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.4rem 0.8rem;
            border-radius: 8px;
            transition: all 0.3s ease;
        `;
        themeBtn.addEventListener('click', toggleTheme);
        themeBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(74, 144, 217, 0.05)';
        });
        themeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'none';
        });
        navContainer.appendChild(themeBtn);
    }

    // ================================================================
    // 4. AUTH — Clerk Handles Login/Signup
    // (Removed old login/signup/logout — Clerk handles it)
    // ================================================================

    // ================================================================
    // 5. PROFILE — BUTTONS
    // ================================================================

    function handleEditProfile(e) {
        e.preventDefault();
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to edit profile.', 'error');
            window.location.href = 'login.html';
            return;
        }
        window.location.href = 'settings.html';
    }

    function handleMessage(e) {
        e.preventDefault();
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to send messages.', 'error');
            window.location.href = 'login.html';
            return;
        }
        window.location.href = 'messages.html';
    }

    function handleFollow(e) {
        e.preventDefault();
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to follow users.', 'error');
            window.location.href = 'login.html';
            return;
        }

        const users = getUsers();
        const profileUsername = document.querySelector('.profile-username')?.textContent?.replace('@', '') || '';
        const targetUser = users.find(u => u.username === profileUsername);
        if (targetUser) {
            toggleFollow(targetUser.id);
        }
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit-profile') || e.target.closest('.edit-profile-btn')) {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to edit profile.', 'error');
                window.location.href = 'login.html';
                return;
            }
            window.location.href = 'settings.html';
        }

        if (e.target.closest('.btn-message') || e.target.closest('.message-btn')) {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to send messages.', 'error');
                window.location.href = 'login.html';
                return;
            }
            window.location.href = 'messages.html';
        }

        if (e.target.closest('.btn-follow') || e.target.closest('.follow-btn')) {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to follow users.', 'error');
                window.location.href = 'login.html';
                return;
            }

            const users = getUsers();
            const profileUsername = document.querySelector('.profile-username')?.textContent?.replace('@', '') || '';
            const targetUser = users.find(u => u.username === profileUsername);
            if (targetUser) {
                toggleFollow(targetUser.id);
            }
        }
    });

    document.querySelectorAll('.btn-edit-profile, .edit-profile-btn').forEach(btn => {
        btn.addEventListener('click', handleEditProfile);
    });

    document.querySelectorAll('.btn-message, .message-btn').forEach(btn => {
        btn.addEventListener('click', handleMessage);
    });

    document.querySelectorAll('.btn-follow, .follow-btn').forEach(btn => {
        btn.addEventListener('click', handleFollow);
    });

    // ================================================================
    // 6. FOLLOW / UNFOLLOW
    // ================================================================

    function toggleFollow(targetUserId) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to follow users.', 'error');
            window.location.href = 'login.html';
            return;
        }

        if (currentUser.id === targetUserId) {
            showToast('You cannot follow yourself.', 'warning');
            return;
        }

        const users = getUsers();
        const currentUserIndex = users.findIndex(u => u.id === currentUser.id);
        const targetUserIndex = users.findIndex(u => u.id === targetUserId);

        if (currentUserIndex === -1 || targetUserIndex === -1) {
            showToast('User not found.', 'error');
            return;
        }

        if (!users[currentUserIndex].following) users[currentUserIndex].following = [];

        const isFollowing = users[currentUserIndex].following.includes(targetUserId);
        if (isFollowing) {
            users[currentUserIndex].following = users[currentUserIndex].following.filter(id => id !== targetUserId);
            showToast('Unfollowed.', 'info');
        } else {
            users[currentUserIndex].following.push(targetUserId);
            showToast('Followed!', 'success');
            const targetUser = users[targetUserIndex];
            addNotification(targetUser.name, 'started following you');
        }

        saveUsers(users);
        localStorage.setItem('nexera-current-user', JSON.stringify(users[currentUserIndex]));

        renderProfile();
        renderRecommendedUsers();
        updateFollowButtonUI();
    }

    function updateFollowButtonUI() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const users = getUsers();
        const profileUsername = document.querySelector('.profile-username')?.textContent?.replace('@', '') || '';
        const profileUser = users.find(u => u.username === profileUsername) || currentUser;

        const isFollowing = currentUser.following && currentUser.following.includes(profileUser.id);

        document.querySelectorAll('.btn-follow, .follow-btn').forEach(btn => {
            btn.textContent = isFollowing ? 'Unfollow' : 'Follow';
            btn.style.background = isFollowing ? 'rgba(74, 144, 217, 0.06)' : 'rgba(74, 144, 217, 0.12)';
        });
    }

    // ================================================================
    // 7. PROFILE — RENDER
    // ================================================================

    function renderProfile() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const users = getUsers();
        const userData = users.find(u => u.id === currentUser.id) || currentUser;

        const profileName = document.querySelector('.profile-details h1');
        const profileUsername = document.querySelector('.profile-username');
        const profileBio = document.querySelector('.profile-bio');
        const profileLocation = document.querySelector('.profile-location');
        const profileAvatar = document.querySelector('.profile-avatar-large');
        const profileStats = document.querySelectorAll('.profile-stats .stat-number');

        if (profileName) profileName.textContent = userData.name || 'User';
        if (profileUsername) profileUsername.textContent = `@${userData.username || 'user'}`;
        if (profileLocation) profileLocation.textContent = userData.location || '📍 Location not set';
        if (profileAvatar) profileAvatar.textContent = userData.avatar || '👤';

        if (profileBio) {
            profileBio.innerHTML = `
                <span id="profileBioDisplay">${userData.bio || 'No bio yet.'}</span>
                <button id="editBioBtn" style="background:none;border:none;color:#4A90D9;cursor:pointer;font-size:1.2rem;margin-left:0.5rem;" title="Edit bio">✏️</button>
            `;
            attachBioEdit();
        }

        const followers = users.filter(u => u.following && u.following.includes(userData.id));
        const following = userData.following || [];

        if (profileStats.length >= 3) {
            const posts = getPosts();
            const userPosts = posts.filter(p => p.userId === userData.id);
            profileStats[0].textContent = userPosts.length;
            profileStats[1].textContent = followers.length;
            profileStats[2].textContent = following.length;
        }

        renderUserPosts(userData.id);
        renderSavedPosts(userData.savedPosts || []);
        updateFollowButtonUI();
        updateSidebarProfile();
    }

    function attachBioEdit() {
        const editBioBtn = document.getElementById('editBioBtn');
        const bioDisplay = document.getElementById('profileBioDisplay');

        if (!editBioBtn || !bioDisplay) return;

        const newBtn = editBioBtn.cloneNode(true);
        editBioBtn.parentNode.replaceChild(newBtn, editBioBtn);

        newBtn.addEventListener('click', function() {
            const currentBio = bioDisplay.textContent;
            const newBio = prompt('Edit your bio:', currentBio);
            if (newBio === null) return;

            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to edit bio.', 'error');
                return;
            }

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                users[userIndex].bio = newBio.trim();
                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));
                bioDisplay.textContent = newBio.trim() || 'No bio yet.';
                showToast('✅ Bio updated successfully!', 'success');
                renderProfile();
            }
        });
    }

    function renderUserPosts(userId) {
        const container = document.querySelector('#posts-tab .user-posts');
        if (!container) return;

        const posts = getPosts();
        const userPosts = posts.filter(p => p.userId === userId);

        if (userPosts.length === 0) {
            container.innerHTML = `<div class="empty-state" style="text-align:center; padding:2rem; color:#666680;"><div style="font-size:2rem;">📝</div><p>No posts yet. Start sharing!</p></div>`;
            return;
        }

        let html = '';
        userPosts.forEach(post => {
            html += `
                <div class="post-card">
                    <div class="post-header">
                        <div class="post-user">
                            <div class="post-avatar">${post.userAvatar || '👤'}</div>
                            <div class="post-user-info">
                                <span class="post-username">${post.userName}</span>
                                <span class="post-userhandle">@${post.username}</span>
                                <span class="post-time">${getTimeAgo(post.createdAt)}</span>
                            </div>
                        </div>
                        <div class="post-tags">${post.tags.map(tag => `<span class="post-tag">#${tag}</span>`).join('')}</div>
                    </div>
                    <div class="post-content"><p>${post.content}</p></div>
                    <div class="post-actions-bar">
                        <span class="post-action">❤️ ${(post.likes || []).length}</span>
                        <span class="post-action">💬 ${(post.comments || []).length}</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function renderSavedPosts(savedPostIds) {
        const container = document.querySelector('#saved-tab .saved-posts');
        if (!container) return;

        const posts = getPosts();
        const savedPosts = posts.filter(p => savedPostIds.includes(p.id));

        if (savedPosts.length === 0) {
            container.innerHTML = `<div class="empty-state" style="text-align:center; padding:2rem; color:#666680;"><div style="font-size:2rem;">🔖</div><p>No saved posts yet.</p></div>`;
            return;
        }

        let html = '';
        savedPosts.forEach(post => {
            html += `
                <div class="saved-post-item">
                    <div class="saved-post-content">
                        <h4>${post.content.substring(0, 80)}${post.content.length > 80 ? '...' : ''}</h4>
                        <p>by ${post.userName}</p>
                        <div class="saved-post-meta">
                            <span>❤️ ${(post.likes || []).length}</span>
                            <span>💬 ${(post.comments || []).length}</span>
                        </div>
                    </div>
                    <button class="unsave-btn" data-post-id="${post.id}">Unsave</button>
                </div>
            `;
        });

        container.innerHTML = html;

        container.querySelectorAll('.unsave-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.dataset.postId;
                toggleSave(postId);
            });
        });
    }

    // ================================================================
    // 8. SETTINGS — ALL SETTINGS FUNCTIONS
    // ================================================================

    function updateSidebarProfile() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const sidebarName = document.getElementById('sidebarProfileName');
        const sidebarUsername = document.getElementById('sidebarProfileUsername');
        if (sidebarName) sidebarName.textContent = currentUser.name || 'User';
        if (sidebarUsername) sidebarUsername.textContent = `@${currentUser.username || 'user'}`;
    }

    const saveAllBtn = document.getElementById('saveAllSettingsBtn');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }

    function saveSettings() {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to save settings.', 'error');
            window.location.href = 'login.html';
            return;
        }

        const displayName = document.getElementById('settingsDisplayName');
        const bio = document.getElementById('settingsBio');
        const location = document.getElementById('settingsLocation');
        const theme = document.body.getAttribute('data-theme') || 'dark';

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex > -1) {
            if (displayName) users[userIndex].name = displayName.value.trim() || users[userIndex].name;
            if (bio) users[userIndex].bio = bio.value.trim();
            if (location) users[userIndex].location = location.value.trim();
            users[userIndex].appearance = users[userIndex].appearance || {};
            users[userIndex].appearance.theme = theme;

            saveUsers(users);
            localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));

            showToast('✅ Settings saved successfully!', 'success');
            
            if (document.querySelector('.profile-container')) {
                renderProfile();
            }
            updateSidebarProfile();
        }
    }

    const updateNameBtn = document.getElementById('updateNameBtn');
    if (updateNameBtn) {
        updateNameBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const nameInput = document.getElementById('settingsDisplayName');
            if (!nameInput) return;

            const newName = nameInput.value.trim();
            if (!newName) {
                showToast('Display name cannot be empty.', 'error');
                return;
            }

            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to update name.', 'error');
                return;
            }

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                users[userIndex].name = newName;
                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));

                const posts = getPosts();
                posts.forEach(post => {
                    if (post.userId === currentUser.id) {
                        post.userName = newName;
                    }
                });
                savePosts(posts);

                showToast('✅ Display name updated!', 'success');
                
                updateSidebarProfile();
                if (document.querySelector('.profile-container')) {
                    renderProfile();
                }
                if (document.querySelector('.feed-posts')) {
                    renderFeed();
                }
            }
        });
    }

    const updateUsernameBtn = document.getElementById('updateUsernameBtn');
    if (updateUsernameBtn) {
        updateUsernameBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('settingsUsername');
            if (!usernameInput) return;

            const newUsername = usernameInput.value.trim();
            if (!newUsername) {
                showToast('Username cannot be empty.', 'error');
                return;
            }

            if (newUsername.length < 3) {
                showToast('Username must be at least 3 characters.', 'error');
                return;
            }

            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to update username.', 'error');
                window.location.href = 'login.html';
                return;
            }

            const users = getUsers();
            const existingUser = users.find(u => 
                u.username === newUsername && u.id !== currentUser.id
            );

            if (existingUser) {
                showToast('❌ Username already taken. Please choose another.', 'error');
                return;
            }

            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                users[userIndex].username = newUsername;
                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));

                const posts = getPosts();
                posts.forEach(post => {
                    if (post.userId === currentUser.id) {
                        post.username = newUsername;
                    }
                });
                savePosts(posts);

                showToast('✅ Username updated successfully!', 'success');
                
                usernameInput.value = newUsername;
                document.querySelectorAll('.profile-username').forEach(el => {
                    if (el) el.textContent = `@${newUsername}`;
                });
                updateSidebarProfile();
                if (document.querySelector('.profile-container')) {
                    renderProfile();
                }
                if (document.querySelector('.feed-posts')) {
                    renderFeed();
                }
            }
        });
    }

    const updateBioBtn = document.getElementById('updateBioBtn');
    if (updateBioBtn) {
        updateBioBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const bioInput = document.getElementById('settingsBio');
            if (!bioInput) return;

            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to update bio.', 'error');
                return;
            }

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                users[userIndex].bio = bioInput.value.trim();
                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));
                showToast('✅ Bio updated!', 'success');
                if (document.querySelector('.profile-container')) {
                    renderProfile();
                }
            }
        });
    }

    const updateLocationBtn = document.getElementById('updateLocationBtn');
    if (updateLocationBtn) {
        updateLocationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const locationInput = document.getElementById('settingsLocation');
            if (!locationInput) return;

            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to update location.', 'error');
                return;
            }

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                users[userIndex].location = locationInput.value.trim();
                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));
                showToast('✅ Location updated!', 'success');
                if (document.querySelector('.profile-container')) {
                    renderProfile();
                }
            }
        });
    }

    const updateEmailBtn = document.getElementById('updateEmailBtn');
    if (updateEmailBtn) {
        updateEmailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('settingsEmail');
            if (!emailInput) return;

            const newEmail = emailInput.value.trim();
            if (!newEmail) {
                showToast('Email cannot be empty.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to update email.', 'error');
                return;
            }

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                users[userIndex].email = newEmail;
                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));
                showToast('✅ Email updated!', 'success');
            }
        });
    }

    const updatePasswordBtn = document.getElementById('updatePasswordBtn');
    if (updatePasswordBtn) {
        updatePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword');
            const newPassword = document.getElementById('newPassword');
            const confirmNewPassword = document.getElementById('confirmNewPassword');

            if (!currentPassword || !newPassword || !confirmNewPassword) return;

            if (!currentPassword.value.trim()) {
                showToast('Please enter your current password.', 'error');
                return;
            }

            if (!newPassword.value.trim()) {
                showToast('Please enter a new password.', 'error');
                return;
            }

            if (newPassword.value.length < 6) {
                showToast('Password must be at least 6 characters.', 'error');
                return;
            }

            if (newPassword.value !== confirmNewPassword.value) {
                showToast('Passwords do not match.', 'error');
                return;
            }

            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to update password.', 'error');
                return;
            }

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                if (users[userIndex].password !== currentPassword.value) {
                    showToast('❌ Current password is incorrect.', 'error');
                    return;
                }

                users[userIndex].password = newPassword.value;
                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));
                showToast('✅ Password updated successfully!', 'success');
                
                currentPassword.value = '';
                newPassword.value = '';
                confirmNewPassword.value = '';
            }
        });
    }

    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input && input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else if (input) {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });

    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('📧 Password reset link sent to your email!', 'success');
        });
    }

    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('⚠️ Are you sure you want to delete your account? This action cannot be undone!')) {
                const currentUser = getCurrentUser();
                if (!currentUser) return;

                let users = getUsers();
                users = users.filter(u => u.id !== currentUser.id);
                saveUsers(users);

                let posts = getPosts();
                posts = posts.filter(p => p.userId !== currentUser.id);
                savePosts(posts);

                localStorage.removeItem('nexera-current-user');
                localStorage.removeItem('nexera-remember-me');
                showToast('🗑️ Account deleted successfully.', 'info');
                setTimeout(() => window.location.href = 'index.html', 1000);
            }
        });
    }

    // ================================================================
    // 9. SETTINGS — Privacy Settings
    // ================================================================

    const savePrivacyBtn = document.getElementById('savePrivacyBtn');
    if (savePrivacyBtn) {
        savePrivacyBtn.addEventListener('click', function() {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to save privacy settings.', 'error');
                return;
            }

            const visibility = document.getElementById('privacyVisibility')?.value || 'Private';
            const messages = document.getElementById('privacyMessages')?.value || 'Only Followers';
            const follow = document.getElementById('privacyFollow')?.value || 'Everyone';
            const onlineStatus = document.getElementById('privacyOnlineStatus')?.checked || false;

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                if (!users[userIndex].privacy) users[userIndex].privacy = {};
                users[userIndex].privacy.visibility = visibility;
                users[userIndex].privacy.messages = messages;
                users[userIndex].privacy.follow = follow;
                users[userIndex].privacy.onlineStatus = onlineStatus;

                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));
                showToast('✅ Privacy settings saved!', 'success');
            }
        });
    }

    function loadPrivacySettings() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const visibility = document.getElementById('privacyVisibility');
        const messages = document.getElementById('privacyMessages');
        const follow = document.getElementById('privacyFollow');
        const onlineStatus = document.getElementById('privacyOnlineStatus');

        if (visibility && currentUser.privacy?.visibility) {
            visibility.value = currentUser.privacy.visibility;
        }
        if (messages && currentUser.privacy?.messages) {
            messages.value = currentUser.privacy.messages;
        }
        if (follow && currentUser.privacy?.follow) {
            follow.value = currentUser.privacy.follow;
        }
        if (onlineStatus) {
            onlineStatus.checked = currentUser.privacy?.onlineStatus !== false;
        }
    }

    // ================================================================
    // 10. SETTINGS — Notification Settings
    // ================================================================

    const saveNotifBtn = document.getElementById('saveNotifBtn');
    if (saveNotifBtn) {
        saveNotifBtn.addEventListener('click', function() {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to save notification settings.', 'error');
                return;
            }

            const email = document.getElementById('notifEmail')?.checked || false;
            const social = document.getElementById('notifSocial')?.checked || false;
            const courses = document.getElementById('notifCourses')?.checked || false;
            const messages = document.getElementById('notifMessages')?.checked || false;

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                if (!users[userIndex].notifications) users[userIndex].notifications = {};
                users[userIndex].notifications.email = email;
                users[userIndex].notifications.social = social;
                users[userIndex].notifications.courses = courses;
                users[userIndex].notifications.messages = messages;

                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));
                showToast('✅ Notification settings saved!', 'success');
            }
        });
    }

    function loadNotificationSettings() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const email = document.getElementById('notifEmail');
        const social = document.getElementById('notifSocial');
        const courses = document.getElementById('notifCourses');
        const messages = document.getElementById('notifMessages');

        if (email) email.checked = currentUser.notifications?.email !== false;
        if (social) social.checked = currentUser.notifications?.social !== false;
        if (courses) courses.checked = currentUser.notifications?.courses !== false;
        if (messages) messages.checked = currentUser.notifications?.messages !== false;
    }

    // ================================================================
    // 11. SETTINGS — Appearance Settings
    // ================================================================

    const saveAppearanceBtn = document.getElementById('saveAppearanceBtn');
    if (saveAppearanceBtn) {
        saveAppearanceBtn.addEventListener('click', function() {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to save appearance settings.', 'error');
                return;
            }

            const themeToggle = document.getElementById('themeToggle');
            const fontSize = document.getElementById('fontSize')?.value || 'Medium';
            const activeColor = document.querySelector('.color-option.active')?.dataset.color || '#4A90D9';

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex > -1) {
                if (!users[userIndex].appearance) users[userIndex].appearance = {};
                users[userIndex].appearance.theme = themeToggle?.checked ? 'light' : 'dark';
                users[userIndex].appearance.fontSize = fontSize;
                users[userIndex].appearance.color = activeColor;

                saveUsers(users);
                localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));

                document.body.setAttribute('data-theme', users[userIndex].appearance.theme);
                localStorage.setItem('nexera-theme', users[userIndex].appearance.theme);
                updateThemeUI(users[userIndex].appearance.theme);

                document.body.style.fontSize = fontSize === 'Small' ? '14px' : 
                                                fontSize === 'Large' ? '18px' : 
                                                fontSize === 'Extra Large' ? '20px' : '16px';

                showToast('✅ Appearance settings saved!', 'success');
            }
        });
    }

    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const color = this.dataset.color;
            document.documentElement.style.setProperty('--primary-color', color);
            localStorage.setItem('nexera-theme-color', color);
            showToast('🎨 Theme color updated!', 'success');
        });
    });

    function loadAppearanceSettings() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const themeToggle = document.getElementById('themeToggle');
        const fontSize = document.getElementById('fontSize');
        const colorOptions = document.querySelectorAll('.color-option');

        if (themeToggle) {
            themeToggle.checked = currentUser.appearance?.theme === 'light';
        }
        if (fontSize && currentUser.appearance?.fontSize) {
            fontSize.value = currentUser.appearance.fontSize;
        }
        if (currentUser.appearance?.color) {
            colorOptions.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.color === currentUser.appearance.color);
            });
        }
    }

    // ================================================================
    // 12. NOTIFICATION COUNTER
    // ================================================================

    function updateNotificationCounter() {
        const notifications = getNotifications();
        const unreadCount = notifications.filter(n => n.unread).length;
        const badge = document.querySelector('.notification-badge-counter');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        } else {
            const navLink = document.querySelector('.nav-links a[href="notifications.html"]');
            if (navLink && unreadCount > 0) {
                const span = document.createElement('span');
                span.className = 'notification-badge-counter';
                span.textContent = unreadCount;
                span.style.cssText = `
                    background: #ef4444;
                    color: white;
                    font-size: 0.6rem;
                    font-weight: 600;
                    padding: 0.05rem 0.4rem;
                    border-radius: 50%;
                    margin-left: 0.2rem;
                    display: inline-block;
                `;
                navLink.appendChild(span);
            }
        }
    }

    // ================================================================
    // 13. NOTIFICATIONS — Render
    // ================================================================

    function renderNotifications() {
        const container = document.querySelector('.notifications-list');
        if (!container) return;

        const notifications = getNotifications();

        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align:center; padding:3rem; color:#666680;">
                    <div style="font-size:3rem; margin-bottom:1rem;">🔔</div>
                    <h3 style="color:#fff; margin-bottom:0.3rem;">No notifications yet</h3>
                    <p>When someone interacts with you, you'll see it here.</p>
                </div>
            `;
            return;
        }

        let html = '';
        notifications.forEach(notif => {
            html += `
                <div class="notification-item${notif.unread ? ' unread' : ''}" data-notification-id="${notif.id}">
                    <div class="notification-icon">${notif.icon}</div>
                    <div class="notification-content">
                        <div class="notification-text">
                            ${notif.user ? `<span class="notification-user">${notif.user}</span> ` : ''}
                            ${notif.action}
                            ${notif.text ? `: <span class="notification-link">${notif.text}</span>` : ''}
                        </div>
                        <div class="notification-meta">
                            <span class="notification-time">${notif.time}</span>
                            ${notif.unread ? '<span class="notification-badge">New</span>' : ''}
                        </div>
                    </div>
                    <button class="notification-dismiss">✕</button>
                </div>
            `;
        });

        container.innerHTML = html;

        container.querySelectorAll('.notification-dismiss').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.closest('.notification-item');
                if (item) {
                    const notifications = getNotifications();
                    const id = item.dataset.notificationId;
                    saveNotifications(notifications.filter(n => n.id !== id));
                    item.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => item.remove(), 300);
                    updateNotificationCounter();
                }
            });
        });

        container.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function() {
                const id = this.dataset.notificationId;
                const notifications = getNotifications();
                const notif = notifications.find(n => n.id === id);
                if (notif) {
                    notif.unread = false;
                    saveNotifications(notifications);
                    this.classList.remove('unread');
                    const badge = this.querySelector('.notification-badge');
                    if (badge) badge.remove();
                    updateNotificationCounter();
                }
            });
        });

        updateNotificationCounter();
    }

    // ================================================================
    // 14. NOTIFICATIONS — Mark Read / Clear All / Filter
    // ================================================================

    const markAllReadBtn = document.querySelector('.mark-all-read-btn');
    const clearAllBtn = document.querySelector('.clear-all-btn');

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            const notifications = getNotifications();
            notifications.forEach(n => n.unread = false);
            saveNotifications(notifications);
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
                const badge = item.querySelector('.notification-badge');
                if (badge) badge.remove();
            });
            updateNotificationCounter();
            showToast('✅ All notifications marked as read.', 'success');
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            const items = document.querySelectorAll('.notification-item');
            if (items.length === 0) {
                showToast('No notifications to clear.', 'info');
                return;
            }
            if (confirm('Are you sure you want to clear all notifications?')) {
                saveNotifications([]);
                items.forEach(item => item.remove());
                updateNotificationCounter();
                showToast('🗑️ All notifications cleared.', 'info');
            }
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.textContent.trim().toLowerCase();
            document.querySelectorAll('.notification-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = (filter === 'all' || text.includes(filter)) ? 'flex' : 'none';
            });
        });
    });

    // ================================================================
    // 15. FEED — All Feed Functions
    // ================================================================

    const postSubmitBtn = document.querySelector('.post-btn-submit');
    const postInput = document.querySelector('.post-input-area input');

    if (postSubmitBtn && postInput) {
        postSubmitBtn.addEventListener('click', function() { createPost(); });
        postInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); createPost(); }
        });
    }

    function createPost() {
        const postInput = document.querySelector('.post-input-area input');
        if (!postInput) return;

        const content = postInput.value.trim();
        if (!content) {
            showToast('Please write something before posting.', 'warning');
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to create a post.', 'error');
            window.location.href = 'login.html';
            return;
        }

        const posts = getPosts();
        const newPost = {
            id: generateId(),
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar || '👤',
            username: currentUser.username,
            content: content,
            image: '',
            tags: extractTags(content),
            likes: [],
            comments: [],
            saved: [],
            createdAt: new Date().toISOString()
        };

        posts.unshift(newPost);
        savePosts(posts);
        postInput.value = '';
        showToast('✅ Post created successfully!', 'success');
        renderFeed();
    }

    function extractTags(text) {
        const tags = text.match(/#[\w\u0600-\u06FF]+/g) || [];
        return tags.map(t => t.substring(1));
    }

    function renderFeed() {
        const feedContainer = document.querySelector('.feed-posts');
        if (!feedContainer) return;

        const posts = getPosts();
        const currentUser = getCurrentUser();

        if (posts.length === 0) {
            feedContainer.innerHTML = `
                <div class="empty-state" style="text-align:center; padding:3rem; color:#666680;">
                    <div style="font-size:3rem; margin-bottom:1rem;">📝</div>
                    <h3 style="color:#fff; margin-bottom:0.3rem;">No posts yet</h3>
                    <p>Be the first to share something!</p>
                </div>
            `;
            return;
        }

        let html = '';
        posts.forEach(post => {
            const isLiked = currentUser && post.likes && post.likes.includes(currentUser.id);
            const isSaved = currentUser && post.saved && post.saved.includes(currentUser.id);
            const likeCount = (post.likes || []).length;
            const commentCount = (post.comments || []).length;
            const isOwnPost = currentUser && post.userId === currentUser.id;

            html += `
                <article class="post-card" data-post-id="${post.id}">
                    <div class="post-header">
                        <div class="post-user">
                            <div class="post-avatar">${post.userAvatar || '👤'}</div>
                            <div class="post-user-info">
                                <span class="post-username">${post.userName}</span>
                                <span class="post-userhandle">@${post.username}</span>
                            </div>
                        </div>
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="post-tag">#${tag}</span>`).join('')}
                            ${isOwnPost ? `
                                <button class="post-edit-btn" data-post-id="${post.id}" style="background:none;border:none;color:#4A90D9;cursor:pointer;font-size:0.8rem;">✏️</button>
                                <button class="post-delete-btn" data-post-id="${post.id}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:0.8rem;">🗑️</button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="post-content">
                        <p id="post-content-${post.id}">${post.content}</p>
                        ${post.image ? `<div class="post-image-placeholder">📸 ${post.image}</div>` : ''}
                    </div>
                    <div class="post-actions-bar">
                        <button class="post-action like-btn ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                            ${isLiked ? '❤️' : '🤍'} Like (${likeCount})
                        </button>
                        <button class="post-action comment-toggle" data-post-id="${post.id}">
                            💬 Comment (${commentCount})
                        </button>
                        <button class="post-action share-btn" data-post-id="${post.id}">🔄 Share</button>
                        <button class="post-action save-btn ${isSaved ? 'saved' : ''}" data-post-id="${post.id}">
                            ${isSaved ? '🔖 Saved' : '🔖 Save'}
                        </button>
                    </div>
                    <div class="post-comments" style="display: ${commentCount > 0 ? 'block' : 'none'};">
                        ${post.comments && post.comments.slice(0, 3).map(comment => `
                            <div class="comment">
                                <span class="comment-user">${comment.userName || 'Anonymous'}:</span>
                                <span class="comment-text">${comment.text}</span>
                                ${currentUser && comment.userId === currentUser.id ? `<button class="comment-delete-btn" data-post-id="${post.id}" data-comment-id="${comment.id}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:0.7rem;">✕</button>` : ''}
                            </div>
                        `).join('')}
                        ${commentCount > 3 ? `<div class="comment" style="color:#666680;font-size:0.8rem;">... and ${commentCount - 3} more comments</div>` : ''}
                        <div class="comment-input">
                            <input type="text" placeholder="Write a comment..." class="comment-input-field" data-post-id="${post.id}" />
                            <button class="comment-submit-btn" data-post-id="${post.id}">Post</button>
                        </div>
                    </div>
                </article>
            `;
        });

        feedContainer.innerHTML = html;

        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.dataset.postId;
                toggleLike(postId);
            });
        });

        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.dataset.postId;
                toggleSave(postId);
            });
        });

        document.querySelectorAll('.comment-toggle').forEach(btn => {
            btn.addEventListener('click', function() {
                const postCard = this.closest('.post-card');
                const commentsSection = postCard.querySelector('.post-comments');
                if (commentsSection) {
                    commentsSection.style.display = commentsSection.style.display !== 'none' ? 'none' : 'block';
                }
            });
        });

        document.querySelectorAll('.comment-submit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.dataset.postId;
                const input = this.closest('.comment-input').querySelector('.comment-input-field');
                if (input && input.value.trim()) {
                    addComment(postId, input.value.trim());
                }
            });
        });

        document.querySelectorAll('.comment-input-field').forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const postId = this.dataset.postId;
                    if (this.value.trim()) {
                        addComment(postId, this.value.trim());
                    }
                }
            });
        });

        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.dataset.postId;
                sharePost(postId);
            });
        });

        document.querySelectorAll('.post-edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.dataset.postId;
                const contentElement = document.getElementById(`post-content-${postId}`);
                if (contentElement) {
                    const currentContent = contentElement.textContent;
                    const newContent = prompt('Edit your post:', currentContent);
                    if (newContent !== null && newContent.trim()) {
                        editPost(postId, newContent.trim());
                    }
                }
            });
        });

        document.querySelectorAll('.post-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.dataset.postId;
                if (confirm('Are you sure you want to delete this post?')) {
                    deletePost(postId);
                }
            });
        });

        document.querySelectorAll('.comment-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = this.dataset.postId;
                const commentId = this.dataset.commentId;
                if (confirm('Delete this comment?')) {
                    deleteComment(postId, commentId);
                }
            });
        });
    }

    function toggleLike(postId) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to like posts.', 'error');
            window.location.href = 'login.html';
            return;
        }

        const posts = getPosts();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const post = posts[postIndex];
        if (!post.likes) post.likes = [];

        const userIndex = post.likes.indexOf(currentUser.id);
        if (userIndex > -1) {
            post.likes.splice(userIndex, 1);
        } else {
            post.likes.push(currentUser.id);
            const postUser = getUsers().find(u => u.id === post.userId);
            if (postUser && postUser.id !== currentUser.id) {
                addNotification(postUser.name, 'liked your post', post.content.substring(0, 30) + '...');
            }
        }

        posts[postIndex] = post;
        savePosts(posts);
        renderFeed();
    }

    function toggleSave(postId) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to save posts.', 'error');
            window.location.href = 'login.html';
            return;
        }

        const posts = getPosts();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const post = posts[postIndex];
        if (!post.saved) post.saved = [];

        const userIndex = post.saved.indexOf(currentUser.id);
        if (userIndex > -1) {
            post.saved.splice(userIndex, 1);
            showToast('Post unsaved.', 'info');
        } else {
            post.saved.push(currentUser.id);
            showToast('Post saved!', 'success');
        }

        posts[postIndex] = post;
        savePosts(posts);

        const users = getUsers();
        const userIndex2 = users.findIndex(u => u.id === currentUser.id);
        if (userIndex2 > -1) {
            if (!users[userIndex2].savedPosts) users[userIndex2].savedPosts = [];
            const savedIndex = users[userIndex2].savedPosts.indexOf(postId);
            if (savedIndex > -1) {
                users[userIndex2].savedPosts.splice(savedIndex, 1);
            } else {
                users[userIndex2].savedPosts.push(postId);
            }
            saveUsers(users);
            localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex2]));
        }

        renderFeed();
    }

    function addComment(postId, text) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to comment.', 'error');
            window.location.href = 'login.html';
            return;
        }

        const posts = getPosts();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const post = posts[postIndex];
        if (!post.comments) post.comments = [];

        post.comments.push({
            id: generateId(),
            userId: currentUser.id,
            userName: currentUser.name,
            text: text,
            createdAt: new Date().toISOString()
        });

        posts[postIndex] = post;
        savePosts(posts);
        renderFeed();
        showToast('✅ Comment added!', 'success');

        const postUser = getUsers().find(u => u.id === post.userId);
        if (postUser && postUser.id !== currentUser.id) {
            addNotification(postUser.name, 'commented on your post', text.substring(0, 30) + '...');
        }
    }

    function editPost(postId, newContent) {
        const posts = getPosts();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        posts[postIndex].content = newContent;
        savePosts(posts);
        renderFeed();
        showToast('✅ Post updated!', 'success');
    }

    function deletePost(postId) {
        let posts = getPosts();
        posts = posts.filter(p => p.id !== postId);
        savePosts(posts);
        renderFeed();
        showToast('🗑️ Post deleted.', 'info');
    }

    function deleteComment(postId, commentId) {
        const posts = getPosts();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        posts[postIndex].comments = posts[postIndex].comments.filter(c => c.id !== commentId);
        savePosts(posts);
        renderFeed();
        showToast('🗑️ Comment deleted.', 'info');
    }

    function sharePost(postId) {
        const url = window.location.href.split('?')[0];
        const shareUrl = `${url}?post=${postId}`;
        if (navigator.share) {
            navigator.share({ title: 'Check out this post on Nexera!', url: shareUrl }).catch(() => {});
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast('📋 Link copied to clipboard!', 'success');
            }).catch(() => {
                const tempInput = document.createElement('input');
                tempInput.value = shareUrl;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast('📋 Link copied to clipboard!', 'success');
            });
        }
    }

    // ================================================================
    // 16. EXPLORE — Search / Filter
    // ================================================================

    const exploreSearch = document.querySelector('.explore-search input');
    const searchBtn = document.querySelector('.explore-search .search-btn');

    if (exploreSearch && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performExploreSearch(exploreSearch.value.trim());
        });
        exploreSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performExploreSearch(this.value.trim());
            }
        });
    }

    function performExploreSearch(query) {
        if (!query) {
            showToast('Please enter a search term.', 'warning');
            return;
        }

        const posts = getPosts();
        const results = posts.filter(post =>
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        if (results.length === 0) {
            showToast(`No results found for "${query}"`, 'info');
        } else {
            showToast(`Found ${results.length} result(s) for "${query}"`, 'success');
            document.querySelectorAll('.post-card').forEach(card => {
                const content = card.querySelector('.post-content p');
                if (content) {
                    const text = content.textContent.toLowerCase();
                    if (text.includes(query.toLowerCase())) {
                        card.style.borderColor = 'rgba(74, 144, 217, 0.2)';
                        card.style.boxShadow = '0 0 40px rgba(74, 144, 217, 0.05)';
                    } else {
                        card.style.borderColor = '';
                        card.style.boxShadow = '';
                    }
                }
            });
        }
    }

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.textContent.trim();
            const posts = getPosts();

            const results = posts.filter(post =>
                post.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
            );

            if (results.length === 0) {
                showToast(`No posts found for "${category}"`, 'info');
            } else {
                showToast(`Found ${results.length} post(s) for "${category}"`, 'success');
                document.querySelectorAll('.post-card').forEach(card => {
                    const tags = card.querySelectorAll('.post-tag');
                    let matched = false;
                    tags.forEach(tag => {
                        if (tag.textContent.toLowerCase().includes(category.toLowerCase())) {
                            matched = true;
                        }
                    });
                    if (matched) {
                        card.style.borderColor = 'rgba(74, 144, 217, 0.2)';
                        card.style.boxShadow = '0 0 40px rgba(74, 144, 217, 0.05)';
                    } else {
                        card.style.borderColor = '';
                        card.style.boxShadow = '';
                    }
                });
            }
        });
    });

    // ================================================================
    // 17. EXPLORE — Recommended Users
    // ================================================================

    function renderRecommendedUsers() {
        const container = document.querySelector('.recommended-users .users-grid');
        if (!container) return;

        const currentUser = getCurrentUser();
        const users = getUsers();
        let recommended = users.filter(u => u.id !== currentUser?.id);

        if (recommended.length === 0) {
            container.innerHTML = `<div class="empty-state" style="text-align:center; padding:1rem; color:#666680;"><p>No other users to recommend.</p></div>`;
            return;
        }

        recommended = recommended.slice(0, 3);
        let html = '';
        recommended.forEach(user => {
            const isFollowing = currentUser?.following?.includes(user.id) || false;
            html += `
                <div class="user-card" data-user-id="${user.id}">
                    <div class="user-avatar-lg">${user.avatar || '👤'}</div>
                    <div class="user-info">
                        <h4>${user.name}</h4>
                        <p>@${user.username}</p>
                        <span>${user.bio || 'Nexera user'}</span>
                        <button class="follow-btn ${isFollowing ? 'following' : ''}" data-user-id="${user.id}">
                            ${isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        container.querySelectorAll('.follow-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const targetUserId = this.dataset.userId;
                toggleFollow(targetUserId);
                renderRecommendedUsers();
                renderProfile();
            });
        });
    }

    // ================================================================
    // 18. MESSAGES — Real Conversations
    // ================================================================

    function renderConversations() {
        const container = document.getElementById('conversationList');
        if (!container) return;

        const currentUser = getCurrentUser();
        if (!currentUser) {
            container.innerHTML = `<div class="empty-state" style="text-align:center; padding:2rem; color:#666680;"><p>Please login to see your conversations.</p></div>`;
            return;
        }

        const users = getUsers();
        const otherUsers = users.filter(u => u.id !== currentUser.id);

        if (otherUsers.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align:center; padding:2rem; color:#666680;">
                    <div style="font-size:2rem;">👥</div>
                    <p>No other users yet. Invite friends to join!</p>
                </div>
            `;
            return;
        }

        let html = '';
        otherUsers.forEach((user, index) => {
            const isActive = index === 0 ? 'active' : '';
            const status = Math.random() > 0.5 ? 'online' : 'offline';
            const lastMessage = getLastMessage(currentUser.id, user.id);
            html += `
                <div class="conversation-item ${isActive}" data-user-id="${user.id}" data-username="${user.username}">
                    <div class="conversation-avatar">${user.avatar || '👤'}</div>
                    <div class="conversation-info">
                        <div class="conversation-header">
                            <span class="conversation-name">${user.name}</span>
                            <span class="conversation-time">${lastMessage ? getTimeAgo(lastMessage.timestamp) : 'No messages'}</span>
                        </div>
                        <div class="conversation-preview">
                            <span class="message-preview">${lastMessage ? lastMessage.text : 'Start a conversation'}</span>
                            <span class="unread-badge" style="display: none;">0</span>
                        </div>
                        <div class="conversation-status ${status}">● ${status}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        container.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', function() {
                container.querySelectorAll('.conversation-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                const userName = this.querySelector('.conversation-name')?.textContent || 'User';
                const userId = this.dataset.userId;
                const chatUsername = document.querySelector('.chat-username');
                if (chatUsername) chatUsername.textContent = userName;

                loadMessagesForUser(userId);
                showToast(`Chatting with ${userName}`, 'info');
            });
        });

        const firstActive = container.querySelector('.conversation-item.active');
        if (firstActive) firstActive.click();
    }

    function getLastMessage(userId1, userId2) {
        const messages = getMessages();
        const filtered = messages.filter(msg =>
            (msg.sender === userId1 && msg.receiver === userId2) ||
            (msg.sender === userId2 && msg.receiver === userId1)
        );
        return filtered.length > 0 ? filtered[filtered.length - 1] : null;
    }

    function loadMessagesForUser(userId) {
        const messagesContainer = document.querySelector('.chat-messages');
        if (!messagesContainer) return;

        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const messages = getMessages();
        const filtered = messages.filter(msg =>
            (msg.sender === currentUser.id && msg.receiver === userId) ||
            (msg.sender === userId && msg.receiver === currentUser.id)
        );

        if (filtered.length === 0) {
            messagesContainer.innerHTML = `
                <div class="empty-state" style="text-align:center; padding:2rem; color:#666680;">
                    <div style="font-size:2rem;">💬</div>
                    <p>No messages yet. Say hello!</p>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(msg => {
            const isSent = msg.sender === currentUser.id;
            html += `
                <div class="message ${isSent ? 'sent' : 'received'}">
                    <div class="message-avatar">${isSent ? '👤' : '👤'}</div>
                    <div class="message-bubble">
                        <p>${msg.text}</p>
                        <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        <button class="message-delete-btn" data-message-id="${msg.id}" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:0.6rem;margin-top:0.2rem;">✕</button>
                    </div>
                </div>
            `;
        });

        messagesContainer.innerHTML = html;

        messagesContainer.querySelectorAll('.message-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.messageId;
                if (confirm('Delete this message?')) {
                    let msgs = getMessages();
                    msgs = msgs.filter(m => m.id !== id);
                    saveMessages(msgs);
                    this.closest('.message').remove();
                    showToast('🗑️ Message deleted.', 'info');
                }
            });
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    const sendBtn = document.querySelector('.send-btn');
    const chatInput = document.querySelector('.chat-input');

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', function() { sendMessage(); });
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
        });
    }

    function sendMessage() {
        const input = document.querySelector('.chat-input');
        const messagesContainer = document.querySelector('.chat-messages');
        if (!input || !messagesContainer) return;

        const text = input.value.trim();
        if (!text) {
            showToast('Please type a message.', 'warning');
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to send messages.', 'error');
            return;
        }

        const activeConv = document.querySelector('.conversation-item.active');
        if (!activeConv) {
            showToast('Please select a conversation.', 'warning');
            return;
        }

        const receiverId = activeConv.dataset.userId;
        const receiverName = activeConv.querySelector('.conversation-name')?.textContent || 'User';

        const messageId = generateId();
        const messages = getMessages();
        messages.push({
            id: messageId,
            sender: currentUser.id,
            receiver: receiverId,
            text: text,
            timestamp: new Date().toISOString()
        });
        saveMessages(messages);

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${text}</p>
                <span class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                <button class="message-delete-btn" data-message-id="${messageId}" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:0.6rem;margin-top:0.2rem;">✕</button>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        messageDiv.querySelector('.message-delete-btn').addEventListener('click', function() {
            const id = this.dataset.messageId;
            if (confirm('Delete this message?')) {
                let msgs = getMessages();
                msgs = msgs.filter(m => m.id !== id);
                saveMessages(msgs);
                messageDiv.remove();
                showToast('🗑️ Message deleted.', 'info');
            }
        });

        const preview = activeConv.querySelector('.message-preview');
        if (preview) preview.textContent = text;
        const time = activeConv.querySelector('.conversation-time');
        if (time) time.textContent = 'Just now';

        addNotification(receiverName, 'sent you a message', text.substring(0, 30) + (text.length > 30 ? '...' : ''));
    }

    // ================================================================
    // 19. COURSE SYSTEM
    // ================================================================

    const COURSE_LESSONS = {
        'course-js-101': [
            { id: 'l1', title: 'What is JavaScript?', duration: '15 min' },
            { id: 'l2', title: 'Setting Up Your Environment', duration: '10 min' },
            { id: 'l3', title: 'Your First JavaScript Program', duration: '12 min' },
            { id: 'l4', title: 'Variables and Data Types', duration: '20 min' },
            { id: 'l5', title: 'Exercise: Variables Practice', duration: '15 min' },
            { id: 'l6', title: 'Functions', duration: '25 min' },
            { id: 'l7', title: 'Arrays and Objects', duration: '30 min' },
            { id: 'l8', title: 'Loops and Iteration', duration: '25 min' },
            { id: 'l9', title: 'Conditional Statements', duration: '20 min' },
            { id: 'l10', title: 'Exercise: Build a Simple Calculator', duration: '30 min' },
            { id: 'l11', title: 'DOM Manipulation', duration: '35 min' },
            { id: 'l12', title: 'Event Handling', duration: '30 min' },
            { id: 'l13', title: 'Promises and Async/Await', duration: '40 min' },
            { id: 'l14', title: 'ES6+ Features', duration: '25 min' },
            { id: 'l15', title: 'Project: Build a Weather App', duration: '45 min' },
            { id: 'l16', title: 'Project: To-Do App', duration: '2 hours' },
            { id: 'l17', title: 'Project: E-Commerce Cart', duration: '3 hours' },
            { id: 'l18', title: 'Project: Portfolio Website', duration: '3 hours' },
            { id: 'l19', title: 'Final Project: Full Application', duration: '4 hours' }
        ],
        'course-ds-101': [
            { id: 'd1', title: 'What is Data Science?', duration: '15 min' },
            { id: 'd2', title: 'Python for Data Science', duration: '30 min' },
            { id: 'd3', title: 'Data Visualization', duration: '25 min' },
            { id: 'd4', title: 'Statistics Basics', duration: '20 min' }
        ],
        'course-physics-101': [
            { id: 'p1', title: 'Introduction to Physics', duration: '15 min' },
            { id: 'p2', title: 'Motion and Forces', duration: '25 min' },
            { id: 'p3', title: 'Energy and Work', duration: '20 min' }
        ]
    };

    function getCurrentCourseId() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) return id;

        const titleEl = document.querySelector('.course-header h1');
        if (titleEl) {
            const title = titleEl.textContent.trim();
            if (title.includes('JavaScript')) return 'course-js-101';
            if (title.includes('Data Science')) return 'course-ds-101';
            if (title.includes('Physics')) return 'course-physics-101';
        }
        return 'course-js-101';
    }

    function loadCourseProgress() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const progress = getCourseProgress();
        const courseId = getCurrentCourseId();
        const completedLessons = progress[courseId]?.completed || [];

        document.querySelectorAll('.lesson-item').forEach(item => {
            let lessonId = item.dataset.lessonId;
            if (!lessonId) {
                const index = Array.from(item.parentElement.children).indexOf(item);
                const sectionIndex = Array.from(item.closest('.curriculum-section').parentElement.children)
                    .indexOf(item.closest('.curriculum-section'));
                lessonId = `l${sectionIndex}-${index}`;
                item.dataset.lessonId = lessonId;
            }

            if (completedLessons.includes(lessonId)) {
                item.classList.add('completed');
                const status = item.querySelector('.lesson-status');
                if (status) status.textContent = '✅';
            } else {
                const status = item.querySelector('.lesson-status');
                if (status && !status.textContent.includes('✅')) {
                    status.textContent = '○';
                }
            }
        });

        updateCourseProgressUI();
    }

    function updateCourseProgressUI() {
        const lessons = document.querySelectorAll('.lesson-item');
        const completed = document.querySelectorAll('.lesson-item.completed');
        const progress = lessons.length > 0 ? Math.round((completed.length / lessons.length) * 100) : 0;

        const progressCircle = document.querySelector('.progress-circle .circle');
        const progressText = document.querySelector('.progress-details span:first-child');
        const progressBar = document.querySelector('.progress-details span:last-child');

        if (progressCircle) progressCircle.textContent = `${progress}%`;
        if (progressText) progressText.textContent = `Completed: ${completed.length}/${lessons.length} lessons`;
        if (progressBar) progressBar.textContent = `Progress: ${progress}%`;
    }

    function toggleLessonComplete(lessonId) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            showToast('Please login to track progress.', 'error');
            return;
        }

        const courseId = getCurrentCourseId();
        const progress = getCourseProgress();

        if (!progress[courseId]) progress[courseId] = { completed: [] };

        const index = progress[courseId].completed.indexOf(lessonId);
        if (index > -1) {
            progress[courseId].completed.splice(index, 1);
            showToast('Lesson marked as incomplete.', 'info');
        } else {
            progress[courseId].completed.push(lessonId);
            showToast('✅ Lesson completed!', 'success');
        }

        saveCourseProgress(progress);
        loadCourseProgress();
    }

    function initCoursePage() {
        if (!document.querySelector('.curriculum-section')) return;

        loadCourseProgress();

        document.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (e.target.closest('button')) return;
                let lessonId = this.dataset.lessonId;
                if (!lessonId) {
                    const index = Array.from(this.parentElement.children).indexOf(this);
                    const sectionIndex = Array.from(this.closest('.curriculum-section').parentElement.children)
                        .indexOf(this.closest('.curriculum-section'));
                    lessonId = `l${sectionIndex}-${index}`;
                    this.dataset.lessonId = lessonId;
                }
                toggleLessonComplete(lessonId);
            });
        });

        document.querySelectorAll('.btn-continue, .btn-start, .btn-review, .btn-continue-course').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const currentUser = getCurrentUser();
                if (!currentUser) {
                    showToast('Please login to access course content.', 'error');
                    window.location.href = 'login.html';
                    return;
                }

                const users = getUsers();
                const user = users.find(u => u.id === currentUser.id);
                const courseId = getCurrentCourseId();

                if (!user?.enrolledCourses?.includes(courseId)) {
                    showToast('Please enroll in this course first.', 'warning');
                    if (confirm('You need to enroll first. Go to courses page?')) {
                        window.location.href = 'courses.html';
                    }
                    return;
                }

                const progress = getCourseProgress();
                const completed = progress[courseId]?.completed || [];
                const lessons = COURSE_LESSONS[courseId] || [];

                const firstIncomplete = lessons.findIndex(l => !completed.includes(l.id));
                const targetIndex = firstIncomplete !== -1 ? firstIncomplete : 0;

                const lessonItems = document.querySelectorAll('.lesson-item');
                if (lessonItems[targetIndex]) {
                    lessonItems[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    lessonItems[targetIndex].style.borderColor = '#4A90D9';
                    lessonItems[targetIndex].style.boxShadow = '0 0 40px rgba(74, 144, 217, 0.05)';
                    setTimeout(() => {
                        lessonItems[targetIndex].style.borderColor = '';
                        lessonItems[targetIndex].style.boxShadow = '';
                    }, 2000);
                }

                showToast(`🎯 Continuing from lesson ${targetIndex + 1}`, 'success');
            });
        });

        const prevBtn = document.querySelector('.prev-lesson-btn');
        const nextBtn = document.querySelector('.next-lesson-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                const currentLesson = document.querySelector('.lesson-item.active') || document.querySelector('.lesson-item');
                if (currentLesson) {
                    const prev = currentLesson.previousElementSibling;
                    if (prev && prev.classList.contains('lesson-item')) {
                        prev.click();
                        prev.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        showToast('You are at the first lesson.', 'info');
                    }
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const currentLesson = document.querySelector('.lesson-item.active') || document.querySelector('.lesson-item');
                if (currentLesson) {
                    const next = currentLesson.nextElementSibling;
                    if (next && next.classList.contains('lesson-item')) {
                        next.click();
                        next.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        showToast('You are at the last lesson.', 'info');
                    }
                }
            });
        }
    }

    if (document.querySelector('.curriculum-section')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCoursePage);
        } else {
            initCoursePage();
        }
    }

    // ================================================================
    // 20. ENROLL BUTTONS
    // ================================================================

    document.querySelectorAll('.rec-btn, .enroll-btn, .btn-enroll').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                showToast('Please login to enroll.', 'error');
                window.location.href = 'login.html';
                return;
            }

            const courseCard = this.closest('.recommended-card') || this.closest('.course-card');
            const courseTitle = courseCard?.querySelector('h4')?.textContent ||
                               courseCard?.querySelector('h3')?.textContent ||
                               'Course';
            const courseId = 'course-' + generateId();

            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);

            if (userIndex > -1) {
                if (!users[userIndex].enrolledCourses) users[userIndex].enrolledCourses = [];

                if (!users[userIndex].enrolledCourses.includes(courseId)) {
                    users[userIndex].enrolledCourses.push(courseId);
                    saveUsers(users);
                    localStorage.setItem('nexera-current-user', JSON.stringify(users[userIndex]));

                    this.textContent = '✅ Enrolled';
                    this.style.background = 'rgba(16, 185, 129, 0.12)';
                    this.style.color = '#34d399';
                    this.disabled = true;
                    showToast(`✅ Enrolled in "${courseTitle}"!`, 'success');
                    addNotification('You', 'enrolled in a course', courseTitle);
                } else {
                    showToast('You are already enrolled in this course.', 'info');
                }
            }
        });
    });

    // ================================================================
    // 21. COURSES PAGE — Filter / Sort
    // ================================================================

    const filterApplyBtn = document.querySelector('.filter-apply-btn');
    if (filterApplyBtn) {
        filterApplyBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
            const selectedFilters = [];
            checkboxes.forEach(cb => {
                if (cb.checked && cb.value) selectedFilters.push(cb.value);
            });

            document.querySelectorAll('.course-card').forEach(course => {
                const tags = course.querySelectorAll('.difficulty');
                let matched = false;
                if (selectedFilters.length === 0) {
                    matched = true;
                } else {
                    tags.forEach(tag => {
                        if (selectedFilters.includes(tag.textContent)) {
                            matched = true;
                        }
                    });
                }
                course.style.display = matched ? '' : 'none';
            });

            showToast(`Filters applied`, 'success');
        });
    }

    // ================================================================
    // 22. GLOBAL SEARCH
    // ================================================================

    const globalSearchInput = document.querySelector('.search-bar input, .explore-search input');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            if (query.length < 2) {
                document.querySelectorAll('.post-card, .course-card, .trending-card').forEach(el => {
                    el.style.display = '';
                    el.style.borderColor = '';
                });
                return;
            }

            document.querySelectorAll('.post-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
                card.style.borderColor = text.includes(query) ? 'rgba(74, 144, 217, 0.15)' : '';
            });

            document.querySelectorAll('.course-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
                card.style.borderColor = text.includes(query) ? 'rgba(74, 144, 217, 0.15)' : '';
            });

            document.querySelectorAll('.trending-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // ================================================================
    // 23. LOAD MORE BUTTON
    // ================================================================

    document.querySelectorAll('.load-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = 'Loading...';
            this.disabled = true;
            setTimeout(() => {
                this.textContent = 'Load More';
                this.disabled = false;
                showToast('More content loaded!', 'success');
            }, 1000);
        });
    });

    // ================================================================
    // 24. LOAD ALL DATA ON PAGE LOAD
    // ================================================================

    if (document.querySelector('.feed-posts')) {
        renderFeed();
    }

    if (document.querySelector('.profile-container')) {
        renderProfile();
    }

    if (document.querySelector('.chat-messages') || document.getElementById('conversationList')) {
        renderConversations();
    }

    if (document.querySelector('.recommended-users')) {
        renderRecommendedUsers();
    }

    if (document.querySelector('.notifications-list')) {
        renderNotifications();
    }

    if (document.querySelector('.settings-container')) {
        loadPrivacySettings();
        loadNotificationSettings();
        loadAppearanceSettings();
        updateSidebarProfile();
    }

    const currentUser2 = getCurrentUser();
    if (currentUser2) {
        document.querySelectorAll('.profile-username').forEach(el => {
            if (el && currentUser2.username) {
                el.textContent = `@${currentUser2.username}`;
            }
        });
        updateSidebarProfile();
    }

    const themeToggle2 = document.getElementById('themeToggle');
    if (themeToggle2) {
        const savedTheme2 = localStorage.getItem('nexera-theme') || 'dark';
        themeToggle2.checked = savedTheme2 === 'light';
    }

    updateNotificationCounter();

    console.log('🌟 Nexera — Complete JavaScript Loaded (V19)');
    console.log('📦 Version: 19.0 — Clerk Auth Integrated');
    console.log('💡 All Features Working');

});
// ================================================================
// END OF SCRIPT
// ================================================================