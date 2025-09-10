// 頁面管理類別
class PageManager {
    private currentPage: string = 'home';
    private pages: NodeListOf<HTMLElement>;
    private navLinks: NodeListOf<HTMLAnchorElement>;
    private indicators: NodeListOf<HTMLButtonElement>;
    private scrollHint: HTMLElement | null;
    private scrollProgress: HTMLElement | null;
    private isScrolling: boolean = false;

    constructor() {
        this.pages = document.querySelectorAll('.page-section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.indicators = document.querySelectorAll('.indicator-btn');
        this.scrollHint = document.getElementById('scrollHint');
        this.scrollProgress = document.getElementById('scrollProgress');
        this.init();
    }

    private init(): void {
        this.setupNavigation();
        this.setupIndicators();
        this.setupScrollHandler();
        this.setupScrollProgress();
    }

    private setupNavigation(): void {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('href')?.substring(1);
                if (targetPage) {
                    this.scrollToPage(targetPage);
                }
            });
        });
    }

    private setupIndicators(): void {
        this.indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const targetPage = indicator.getAttribute('data-page');
                if (targetPage) {
                    this.scrollToPage(targetPage);
                }
            });
        });
    }

    private setupScrollHandler(): void {
        // 監聽滾動事件來更新當前頁面和進度條
        window.addEventListener('scroll', () => {
            this.updateCurrentPage();
            this.updateScrollProgress();
        });

        // 添加鍵盤導航支援
        window.addEventListener('keydown', (e) => {
            if (this.isScrolling) return;
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                this.scrollToNextPage();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                this.scrollToPrevPage();
            }
        });

        // 添加觸控支援（行動裝置）
        let touchStartY = 0;
        let touchEndY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        window.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;
            
            touchEndY = e.changedTouches[0].screenY;
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.scrollToNextPage();
                } else {
                    this.scrollToPrevPage();
                }
            }
        });
    }

    private setupScrollProgress(): void {
        // 初始化滾動進度條
        this.updateScrollProgress();
    }

    private scrollToPage(pageId: string): void {
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            this.isScrolling = true;
            targetPage.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            setTimeout(() => {
                this.isScrolling = false;
            }, 1000);
        }
    }

    private scrollToNextPage(): void {
        const pageOrder = ['home', 'about', 'portfolio', 'blog', 'contact'];
        const currentIndex = pageOrder.indexOf(this.currentPage);
        const nextIndex = currentIndex < pageOrder.length - 1 ? currentIndex + 1 : 0;
        this.scrollToPage(pageOrder[nextIndex]);
    }

    private scrollToPrevPage(): void {
        const pageOrder = ['home', 'about', 'portfolio', 'blog', 'contact'];
        const currentIndex = pageOrder.indexOf(this.currentPage);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : pageOrder.length - 1;
        this.scrollToPage(pageOrder[prevIndex]);
    }

    private updateCurrentPage(): void {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        this.pages.forEach(page => {
            const rect = page.getBoundingClientRect();
            const pageTop = rect.top + scrollPosition;
            const pageBottom = pageTop + rect.height;
            
            // 如果頁面在視窗中央區域，則設為當前頁面
            if (scrollPosition + windowHeight / 2 >= pageTop && 
                scrollPosition + windowHeight / 2 <= pageBottom) {
                const pageId = page.id;
                if (pageId !== this.currentPage) {
                    this.currentPage = pageId;
                    this.updateNavigation();
                }
            }
        });
    }

    private updateScrollProgress(): void {
        if (!this.scrollProgress) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        this.scrollProgress.style.width = `${scrollPercent}%`;
    }

    private updateNavigation(): void {
        // 更新導航連結狀態
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${this.currentPage}`) {
                link.classList.add('active');
            }
        });

        // 更新指示器狀態
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
            if (indicator.getAttribute('data-page') === this.currentPage) {
                indicator.classList.add('active');
            }
        });

        // 更新滾動提示顯示
        this.updateScrollHint();
    }

    private updateScrollHint(): void {
        if (!this.scrollHint) return;

        // 在首頁顯示滾動提示，其他頁面隱藏
        if (this.currentPage === 'home') {
            this.scrollHint.style.display = 'block';
        } else {
            this.scrollHint.style.display = 'none';
        }
    }
}

// 社交媒體管理類別
class SocialManager {
    private socialLinks: NodeListOf<HTMLAnchorElement>;

    constructor() {
        this.socialLinks = document.querySelectorAll('.social-link');
        this.init();
    }

    private init(): void {
        this.setupSocialLinks();
    }

    private setupSocialLinks(): void {
        this.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.classList.contains('facebook') ? 'Facebook' : 'Instagram';
                this.handleSocialClick(platform);
            });
        });
    }

    private handleSocialClick(platform: string): void {
        // 這裡可以添加實際的社交媒體連結
        console.log(`點擊了 ${platform} 按鈕`);
        
        // 顯示提示訊息
        this.showNotification(`即將前往 ${platform} 頁面`);
    }

    private showNotification(message: string): void {
        // 創建通知元素
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #6B46C1;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // 顯示動畫
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自動隱藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 圖片載入管理類別
class ImageManager {
    private gridPhotos: NodeListOf<HTMLElement>;

    constructor() {
        this.gridPhotos = document.querySelectorAll('.grid-photo');
        this.init();
    }

    private init(): void {
        this.setupImagePlaceholders();
        this.setupImageHover();
    }

    private setupImagePlaceholders(): void {
        // 為每個網格照片設置佔位符背景
        this.gridPhotos.forEach((photo, index) => {
            const colors = [
                'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                'linear-gradient(135deg, #87CEEB, #98E4FF)',
                'linear-gradient(135deg, #DDA0DD, #EE82EE)',
                'linear-gradient(135deg, #F0E68C, #FFFFE0)',
                'linear-gradient(135deg, #98FB98, #90EE90)',
                'linear-gradient(135deg, #F4A460, #DEB887)',
                'linear-gradient(135deg, #FFA07A, #FF7F50)',
                'linear-gradient(135deg, #20B2AA, #48D1CC)',
                'linear-gradient(135deg, #D8BFD8, #DDA0DD)'
            ];
            
            photo.style.background = colors[index % colors.length];
            photo.style.display = 'flex';
            photo.style.alignItems = 'center';
            photo.style.justifyContent = 'center';
            photo.style.fontSize = '24px';
            photo.style.color = '#ffffff';
            photo.style.fontWeight = 'bold';
            photo.textContent = `📸 ${index + 1}`;
        });
    }

    private setupImageHover(): void {
        this.gridPhotos.forEach(photo => {
            photo.addEventListener('mouseenter', () => {
                photo.style.transform = 'scale(1.05)';
                photo.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            });

            photo.addEventListener('mouseleave', () => {
                photo.style.transform = 'scale(1)';
                photo.style.boxShadow = 'none';
            });
        });
    }
}

// 動畫管理類別
class AnimationManager {
    private observer!: IntersectionObserver;

    constructor() {
        this.init();
    }

    private init(): void {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
    }

    private setupIntersectionObserver(): void {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // 觀察需要動畫的元素
        const animatedElements = document.querySelectorAll('.story-title, .story-text, .life-title, .grid-item');
        animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }

    private setupScrollAnimations(): void {
        // 添加動畫樣式
        const style = document.createElement('style');
        style.textContent = `
            .story-title, .story-text, .life-title, .grid-item {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .story-title.animate-in, .story-text.animate-in, .life-title.animate-in, .grid-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .grid-item.animate-in {
                transition-delay: calc(var(--index) * 0.1s);
            }
        `;
        document.head.appendChild(style);

        // 為網格項目設置延遲索引
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach((item, index) => {
            (item as HTMLElement).style.setProperty('--index', index.toString());
        });
    }
}

// 作品集管理類別
class PortfolioManager {
    private filterButtons: NodeListOf<HTMLButtonElement>;
    private portfolioItems: NodeListOf<HTMLElement>;

    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.init();
    }

    private init(): void {
        this.setupFilterButtons();
    }

    private setupFilterButtons(): void {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有按鈕的 active 類別
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                // 添加 active 類別到點擊的按鈕
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                this.filterPortfolio(filter);
            });
        });
    }

    private filterPortfolio(filter: string | null): void {
        this.portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// 聯絡表單管理類別
class ContactManager {
    private contactForm: HTMLFormElement | null;

    constructor() {
        this.contactForm = document.querySelector('.contact-form');
        this.init();
    }

    private init(): void {
        if (this.contactForm) {
            this.setupFormSubmission();
        }
    }

    private setupFormSubmission(): void {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    private handleFormSubmission(): void {
        if (!this.contactForm) return;

        const formData = new FormData(this.contactForm);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        // 簡單的表單驗證
        if (!name || !email || !subject || !message) {
            this.showNotification('請填寫所有必填欄位', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('請輸入有效的電子郵件地址', 'error');
            return;
        }

        // 模擬表單提交
        this.showNotification('訊息已發送！我們會盡快回覆您。', 'success');
        this.contactForm.reset();
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private showNotification(message: string, type: 'success' | 'error'): void {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // 顯示動畫
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自動隱藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 應用程式主類別
class App {
    private pageManager!: PageManager;
    private socialManager!: SocialManager;
    private imageManager!: ImageManager;
    private animationManager!: AnimationManager;
    private portfolioManager!: PortfolioManager;
    private contactManager!: ContactManager;

    constructor() {
        this.init();
    }

    private init(): void {
        // 等待 DOM 載入完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeManagers();
            });
        } else {
            this.initializeManagers();
        }
    }

    private initializeManagers(): void {
        this.pageManager = new PageManager();
        this.socialManager = new SocialManager();
        this.imageManager = new ImageManager();
        this.animationManager = new AnimationManager();
        this.portfolioManager = new PortfolioManager();
        this.contactManager = new ContactManager();
        
        console.log('Hannah Chen 的專業個人網站已載入完成！');
    }
}

// 啟動應用程式
new App();
