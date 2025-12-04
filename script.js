// Fundación Rimas Landing Page - JavaScript

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        delay: 0
    });

    // Initialize Music Player
    initMusicPlayer();

    // Initialize Dashboard Animations
    initDashboardAnimations();
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Music Player Logic
function initMusicPlayer() {
    const playerContainer = document.querySelector('#showcase');
    if (!playerContainer) return;

    const playBtn = playerContainer.querySelector('button.w-12'); // The big play button
    const tracks = playerContainer.querySelectorAll('.track-item'); // Track list items
    const progressBar = playerContainer.querySelector('.bg-rimas-red.h-full'); // Progress bar
    const playIcon = '<svg class="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    const pauseIcon = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';

    let isPlaying = false;
    let currentProgress = 33; // Initial progress
    let progressInterval;

    // Toggle Play/Pause
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playBtn.innerHTML = isPlaying ? pauseIcon : playIcon;

            // Toggle animations on active track
            const activeTrack = playerContainer.querySelector('.active-track');
            if (activeTrack) {
                if (isPlaying) {
                    activeTrack.classList.remove('paused');
                    startProgress();
                } else {
                    activeTrack.classList.add('paused');
                    stopProgress();
                }
            }
        });
    }

    // Track Selection
    tracks.forEach(track => {
        track.addEventListener('click', () => {
            // Reset previous active track
            tracks.forEach(t => {
                t.classList.remove('active-track', 'bg-white/10', 'border-l-2', 'border-rimas-red');
                t.classList.add('hover:bg-white/5', 'border-transparent', 'hover:border-white/20');
                // Hide visualizer bars
                const bars = t.querySelector('.space-x-1');
                if (bars) bars.classList.add('hidden');
            });

            // Set new active track
            track.classList.add('active-track', 'bg-white/10', 'border-l-2', 'border-rimas-red');
            track.classList.remove('hover:bg-white/5', 'border-transparent', 'hover:border-white/20');

            // Show visualizer bars
            const bars = track.querySelector('.space-x-1');
            if (bars) {
                bars.classList.remove('hidden');
                bars.classList.add('flex');
            }

            // If playing, ensure animation runs
            if (isPlaying) {
                track.classList.remove('paused');
            } else {
                track.classList.add('paused');
            }
        });
    });

    function startProgress() {
        clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            currentProgress += 0.1;
            if (currentProgress >= 100) currentProgress = 0;
            if (progressBar) progressBar.style.width = `${currentProgress}%`;
        }, 100);
    }

    function stopProgress() {
        clearInterval(progressInterval);
    }
}

// Dashboard Animations
function initDashboardAnimations() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Circular Chart (Retention)
                const circle = dashboard.querySelector('circle:nth-child(2)');
                if (circle) {
                    // 553 is circumference (2 * pi * 88)
                    // 85% means offset should be 15% of 553 = 83
                    circle.style.strokeDashoffset = '83';
                }

                // Animate Bar Chart (Growth)
                const bars = dashboard.querySelectorAll('.bg-rimas-red, .bg-rimas-gray\\/50');
                bars.forEach(bar => {
                    // Trigger height transition by resetting and setting height
                    // This assumes inline styles are set in HTML, which they are
                    const targetHeight = bar.style.height;
                    bar.style.height = '0';
                    setTimeout(() => {
                        bar.style.height = targetHeight;
                    }, 100);
                });

                // Animate Area/Line Chart (Funds)
                const fundBars = dashboard.querySelectorAll('.bg-rimas-cyan, .bg-rimas-cyan\\/70, .bg-rimas-cyan\\/40');
                fundBars.forEach(bar => {
                    const targetWidth = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 100);
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(dashboard);
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Get actual navbar height (64px on mobile, 80px on desktop)
            const navbar = document.querySelector('nav');
            const offset = navbar ? navbar.offsetHeight : 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animated Counter for Statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60 FPS
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.ceil(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(start);
        }
    }, 16);
}

// Intersection Observer for Stats Animation
const statElements = document.querySelectorAll('[data-count]');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('stat-animated')) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            animateCounter(entry.target, target);
            entry.target.classList.add('stat-animated');
        }
    });
}, {
    threshold: 0.5
});

statElements.forEach(element => {
    statObserver.observe(element);
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navigation Bar - Add shadow on scroll
const navbar = document.querySelector('nav');

window.addEventListener('scroll', function () {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Form Submission Handler (Newsletter)
// Form Submission Handler (Newsletter)
const newsletterForms = document.querySelectorAll('#newsletter-form, #footer-newsletter-form');

newsletterForms.forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;

        // Basic email validation
        if (email && validateEmail(email)) {
            // Show success message with translation key
            showNotification('ui.thankYou', 'success');
            emailInput.value = '';
        } else {
            showNotification('ui.invalidEmail', 'error');
        }
    });
});

// Email Validation Function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification System
function showNotification(messageKey, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Get translated message
    let message = messageKey;
    if (window.LanguageSwitcher) {
        message = window.LanguageSwitcher.translate(messageKey);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all transform translate-x-0 ${type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Lazy Loading for Images (if images are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Parallax Effect on Hero Section Background
const heroParallaxBg = document.getElementById('hero-parallax-bg');
const heroSection = document.getElementById('hero');
const heroContent = document.querySelector('#hero .text-center');

let ticking = false;

window.addEventListener('scroll', function () {
    if (!ticking) {
        window.requestAnimationFrame(function () {
            if (heroParallaxBg && heroSection) {
                const scrolled = window.pageYOffset;
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

                // Only apply parallax when scrolling within the hero section
                if (scrolled < heroBottom) {
                    // Move background slower than scroll for parallax effect
                    // Using translate3d for better performance
                    heroParallaxBg.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;

                    // Subtle parallax on content - very slight to avoid overlap
                    if (heroContent) {
                        heroContent.style.transform = `translate3d(0, ${scrolled * 0.1}px, 0)`;
                        // Fade out content slightly as you scroll
                        const opacity = 1 - (scrolled / heroBottom) * 0.5;
                        heroContent.style.opacity = Math.max(opacity, 0.5);
                    }
                }
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', function () {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-rimas-cyan', 'font-bold'); // Updated color
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-rimas-cyan', 'font-bold'); // Updated color
        }
    });
});

// Card Hover 3D Effect
const campusCards = document.querySelectorAll('.campus-card');

campusCards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Performance: Debounce Function
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimize scroll events with debounce
const optimizedScroll = debounce(function () {
    // Scroll-based operations here
});

window.addEventListener('scroll', optimizedScroll);

// Keyboard Navigation Enhancement
document.addEventListener('keydown', function (e) {
    // Press 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
});

// Track Outbound Links (Analytics placeholder)
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const url = this.href;
        console.log('Outbound link clicked:', url);
        // Add analytics tracking here if needed
    });
});

// Accessibility: Focus Trap for Mobile Menu
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap when mobile menu is open
if (mobileMenu) {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (!mobileMenu.classList.contains('hidden')) {
                trapFocus(mobileMenu);
            }
        });
    });

    observer.observe(mobileMenu, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Print Page Function
function printPage() {
    window.print();
}

// Share Page Function (Web Share API)
async function sharePage() {
    const lang = window.LanguageSwitcher ? window.LanguageSwitcher.getLanguage() : 'es';
    const titles = {
        es: 'Fundación Rimas - Transformando Juventud PR',
        en: 'Fundación Rimas - Transforming Youth PR'
    };
    const descriptions = {
        es: 'Únicos trabajando con jóvenes en justicia juvenil en PR. Más que eventos, creamos sistemas de cambio.',
        en: 'Unique organization working with youth in juvenile justice in PR. More than events, we create systems of change.'
    };

    if (navigator.share) {
        try {
            await navigator.share({
                title: titles[lang],
                text: descriptions[lang],
                url: window.location.href
            });
        } catch (err) {
            console.log('Error sharing:', err);
        }
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('ui.linkCopied', 'success');
    }
}

// Detect if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Disable animations
    AOS.init({
        disable: true
    });
}

// Page Load Performance Tracking
window.addEventListener('load', function () {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime, 'ms');
    }
});

// Easter Egg: Konami Code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function (e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiPattern.join('')) {
        showNotification('ui.easterEgg', 'success');
        document.body.style.animation = 'rainbow 2s ease-in-out';
    }
});

// Console message for developers
console.log('%c¡Hola desarrollador!', 'color: #FF0033; font-size: 20px; font-weight: bold;');
console.log('%c¿Interesado en contribuir a la misión de Fundación Rimas?', 'color: #e5e7eb; font-size: 14px;');
console.log('%cContáctanos: info@fundacionrimas.org', 'color: #FF0033; font-size: 14px;');

// Theme Manager
const ThemeManager = {
    init() {
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        this.sunIcon = document.getElementById('sun-icon');
        this.moonIcon = document.getElementById('moon-icon');

        // Check saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

        if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
            this.setTheme('light');
        } else {
            this.setTheme('dark');
        }

        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    },

    setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            if (this.sunIcon) this.sunIcon.classList.remove('hidden');
            if (this.moonIcon) this.moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            if (this.sunIcon) this.sunIcon.classList.add('hidden');
            if (this.moonIcon) this.moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        }
    },

    toggleTheme() {
        if (document.body.classList.contains('light-mode')) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
    }
};

// Initialize Theme Manager
document.addEventListener('DOMContentLoaded', function () {
    ThemeManager.init();
});

// Export functions for potential use in other scripts
window.FundacionRimas = {
    showNotification,
    sharePage,
    printPage,
    ThemeManager
};
