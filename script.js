// Фикс шапки сайта
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Управление темой
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }
    
    init() {
        // Устанавливаем начальную тему
        this.setTheme(this.currentTheme);
        
        // Добавляем обработчик клика
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Обновляем иконку при загрузке
        this.updateIcon();
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateIcon();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Добавляем анимацию переключения
        this.addTransition();
    }
    
    updateIcon() {
        const icon = this.themeToggle.querySelector('.theme-toggle__icon');
        if (this.currentTheme === 'dark') {
            icon.textContent = '🌙';
            icon.title = 'Переключить на светлую тему';
        } else {
            icon.textContent = '☀️';
            icon.title = 'Переключить на темную тему';
        }
    }
    
    addTransition() {
        document.documentElement.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }
}

// Менеджер мобильного меню
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.headerNav = document.getElementById('headerNav');
        
        if (!this.menuToggle || !this.headerNav) return;
        
        this.init();
    }
    
    init() {
        this.createOverlay();
        
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        this.overlay.addEventListener('click', () => this.closeMenu());
        
        // --- НАЧАЛО ИЗМЕНЕНИЙ ---
        
        // Обработчики для ссылок - закрываем меню и выполняем переход/скролл
        const links = this.headerNav.querySelectorAll('.header__link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // 1. Предотвращаем стандартное поведение ссылки,
                // чтобы вручную управлять скроллом/переходом
                e.preventDefault();
                
                // 2. Закрываем мобильное меню
                this.closeMenu();

                // 3. Выполняем действие с задержкой, равной анимации закрытия меню
                setTimeout(() => {
                    if (href && href.startsWith('#')) {
                        // Если это якорная ссылка (e.g., #products)
                        const targetId = href.substring(1);
                        const targetElement = document.getElementById(targetId);
                        
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    } else if (href) {
                        // Если это обычная ссылка (e.g., /about.html)
                        // (На случай, если вы их добавите в меню)
                        window.location.href = href;
                    }
                }, 300); // 300мс - это 0.3s, как в transition: left 0.3s ease;
            });
        });
        
        // --- КОНЕЦ ИЗМЕНЕНИЙ ---
        
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'nav-overlay';
        document.body.appendChild(this.overlay);
    }
    
    toggleMenu() {
        if (this.headerNav.classList.contains('active')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.headerNav.classList.add('active');
        this.menuToggle.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.headerNav.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleResize() {
        if (window.innerWidth > 500) {
            this.menuToggle.style.display = 'none';
            this.closeMenu();
        } else {
            this.menuToggle.style.display = 'flex';
        }
    }
}


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing managers...');
    new MobileMenu();
    new ThemeManager();
});