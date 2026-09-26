/* ================================================================
   🌟 NEXERA — CLERK NAVIGATION (Auto UserButton)
   Har page par Clerk UserButton + Login state automatically
   ================================================================ */

(function () {
    'use strict';

    // ⭐ Clerk key
    const CLERK_PUBLISHABLE_KEY = 'pk_test_b3B0aW11bS1ob25leWJlZS0zMzk4LmNsZXJrLmFjY291bnRzLmRldiQ';
    const CLERK_FRONTEND_API = 'https://optimum-honeybee-3398.clerk.accounts.dev';

    // ⭐ Clerk script load karo (agar already nahi hai)
    function loadClerkScript() {
        return new Promise((resolve, reject) => {
            // Agar Clerk already load hai, to resolve karo
            if (window.Clerk) {
                resolve(window.Clerk);
                return;
            }

            // Check karo script already hai ya nahi
            const existingScript = document.querySelector('script[data-clerk-publishable-key]');
            if (existingScript) {
                // Script already hai, Clerk load hone ka wait karo
                const checkInterval = setInterval(() => {
                    if (window.Clerk) {
                        clearInterval(checkInterval);
                        resolve(window.Clerk);
                    }
                }, 100);
                setTimeout(() => {
                    clearInterval(checkInterval);
                    if (window.Clerk) resolve(window.Clerk);
                    else reject(new Error('Clerk load timeout'));
                }, 10000);
                return;
            }

            // Naya script add karo
            const script = document.createElement('script');
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY);
            script.src = `${CLERK_FRONTEND_API}/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
            script.type = 'text/javascript';

            script.onload = () => {
                const checkInterval = setInterval(() => {
                    if (window.Clerk) {
                        clearInterval(checkInterval);
                        resolve(window.Clerk);
                    }
                }, 100);
                setTimeout(() => {
                    clearInterval(checkInterval);
                    if (window.Clerk) resolve(window.Clerk);
                    else reject(new Error('Clerk load timeout'));
                }, 10000);
            };

            script.onerror = () => reject(new Error('Clerk script load failed'));
            document.head.appendChild(script);
        });
    }

    // ⭐ Navbar mein UserButton add karo
    function injectUserButton(clerk) {
        const navContainer = document.querySelector('.nav-container');
        const navLinks = document.querySelector('.nav-links');

        if (!navLinks || !navContainer) {
            console.log('⚠️ Navbar not found on this page');
            return;
        }

        // ⭐ Login/Signup links dhundo aur hide karo (jab user logged in ho)
        const loginLink = navLinks.querySelector('a[href="login.html"]');
        const signupLink = navLinks.querySelector('a[href="signup.html"]');

        // ⭐ UserButton ke liye container banao
        let userButtonContainer = document.getElementById('clerk-user-button');
        if (!userButtonContainer) {
            userButtonContainer = document.createElement('div');
            userButtonContainer.id = 'clerk-user-button';
            userButtonContainer.style.cssText = `
                display: flex;
                align-items: center;
                margin-left: 1rem;
            `;
            navContainer.appendChild(userButtonContainer);
        }

        // ⭐ Clerk ka UserButton mount karo
        clerk.mountUserButton(userButtonContainer, {
            appearance: {
                variables: {
                    colorPrimary: '#4A90D9',
                    colorBackground: '#14141f',
                    colorText: '#e0e6ff',
                    colorTextSecondary: '#8b94b8',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif'
                },
                elements: {
                    userButtonAvatarBox: {
                        width: '36px',
                        height: '36px',
                        border: '2px solid rgba(74, 144, 217, 0.3)',
                        boxShadow: '0 0 20px rgba(74, 144, 217, 0.2)'
                    }
                }
            }
        });

        // ⭐ User logged in hai — Login/Signup hide karo
        if (clerk.user) {
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';

            // Profile link add karo (agar nahi hai)
            if (!navLinks.querySelector('a[href="profile.html"]')) {
                const profileLi = document.createElement('li');
                profileLi.innerHTML = `<a href="profile.html">Profile</a>`;
                const lastLi = navLinks.lastElementChild;
                navLinks.insertBefore(profileLi, lastLi);
            }
        }

        // ⭐ User logged out hai — Login/Signup dikhao, UserButton hide karo
        else {
            if (loginLink) loginLink.style.display = '';
            if (signupLink) signupLink.style.display = '';
            userButtonContainer.style.display = 'none';
        }
    }

    // ⭐ Logout event handle karo
    function setupLogoutListener(clerk) {
        clerk.addListener(({ user }) => {
            const userButtonContainer = document.getElementById('clerk-user-button');
            const navLinks = document.querySelector('.nav-links');
            if (!navLinks) return;

            const loginLink = navLinks.querySelector('a[href="login.html"]');
            const signupLink = navLinks.querySelector('a[href="signup.html"]');

            if (user) {
                // Logged in
                if (loginLink) loginLink.style.display = 'none';
                if (signupLink) signupLink.style.display = 'none';
                if (userButtonContainer) userButtonContainer.style.display = 'flex';
            } else {
                // Logged out
                if (loginLink) loginLink.style.display = '';
                if (signupLink) signupLink.style.display = '';
                if (userButtonContainer) userButtonContainer.style.display = 'none';
            }
        });
    }

    // ⭐ Main function
    async function initClerkNav() {
        try {
            const clerk = await loadClerkScript();

            // Clerk load karo (agar already load nahi hai)
            if (!clerk.loaded) {
                await clerk.load({
                    appearance: {
                        variables: {
                            colorPrimary: '#4A90D9',
                            colorBackground: '#14141f',
                            colorText: '#e0e6ff',
                            colorTextSecondary: '#8b94b8',
                            colorInputBackground: '#0a0e20',
                            colorInputText: '#e0e6ff',
                            borderRadius: '12px',
                            fontFamily: 'Inter, sans-serif'
                        }
                    }
                });
            }

            // UserButton inject karo
            injectUserButton(clerk);

            // Logout listener setup karo
            setupLogoutListener(clerk);

            console.log('✅ Clerk Nav loaded successfully');

        } catch (error) {
            console.error('❌ Clerk Nav error:', error);
        }
    }

    // ⭐ DOM ready hone par start karo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initClerkNav);
    } else {
        initClerkNav();
    }

})();