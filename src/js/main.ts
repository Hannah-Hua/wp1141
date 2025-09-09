// 頁面管理類別
class PageManager {
    private currentPage: string = 'home';
    private pages: NodeListOf<HTMLElement>;
    private navLinks: NodeListOf<HTMLAnchorElement>;
    private indicators: NodeListOf<HTMLButtonElement>;
    private scrollHint: HTMLElement | null;

    constructor() {
        this.pages = document.querySelectorAll('.page-section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.indicators = document.querySelectorAll('.indicator-btn');
        this.scrollHint = document.getElementById('scrollHint');
        this.init();
    }

    private init(): void {
        this.setupNavigation();
        this.setupIndicators();
        this.setupScrollHandler();
    }

    private setupNavigation(): void {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('href')?.substring(1);
                if (targetPage) {
                    this.showPage(targetPage);
                }
            });
        });
    }

    private setupIndicators(): void {
        this.indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const targetPage = indicator.getAttribute('data-page');
                if (targetPage) {
                    this.showPage(targetPage);
                }
            });
        });
    }

    private setupScrollHandler(): void {
        let isScrolling = false;
        let scrollTimeout: ReturnType<typeof setTimeout>;
        
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (isScrolling) return;
            
            isScrolling = true;
            const direction = e.deltaY > 0 ? 'next' : 'prev';
            this.navigatePage(direction);
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 800);
        });

        // 添加鍵盤導航支援
        window.addEventListener('keydown', (e) => {
            if (isScrolling) return;
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                isScrolling = true;
                this.navigatePage('next');
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 800);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                isScrolling = true;
                this.navigatePage('prev');
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        });

        // 添加觸控支援（行動裝置）
        let touchStartY = 0;
        let touchEndY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        window.addEventListener('touchend', (e) => {
            if (isScrolling) return;
            
            touchEndY = e.changedTouches[0].screenY;
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;

            if (Math.abs(diff) > swipeThreshold) {
                isScrolling = true;
                const direction = diff > 0 ? 'next' : 'prev';
                this.navigatePage(direction);
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        });
    }

    private navigatePage(direction: 'next' | 'prev'): void {
        const pageOrder = ['home', 'story', 'life'];
        const currentIndex = pageOrder.indexOf(this.currentPage);
        
        let nextIndex: number;
        if (direction === 'next') {
            nextIndex = currentIndex < pageOrder.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : pageOrder.length - 1;
        }
        
        this.showPage(pageOrder[nextIndex]);
    }

    private showPage(pageId: string): void {
        // 隱藏所有頁面
        this.pages.forEach(page => {
            page.classList.remove('active');
        });

        // 顯示目標頁面
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // 更新導航連結狀態
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });

        // 更新指示器狀態
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
            if (indicator.getAttribute('data-page') === pageId) {
                indicator.classList.add('active');
            }
        });

        // 平滑滾動到頂部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // 添加頁面切換動畫效果
        this.addPageTransitionEffect(targetPage);

        // 管理滾動提示顯示
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

    private addPageTransitionEffect(targetPage: HTMLElement | null): void {
        if (!targetPage) return;

        // 添加淡入效果
        targetPage.style.opacity = '0';
        targetPage.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            targetPage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            targetPage.style.opacity = '1';
            targetPage.style.transform = 'translateY(0)';
        });

        // 重置其他頁面的樣式
        this.pages.forEach(page => {
            if (page !== targetPage) {
                page.style.transition = '';
                page.style.opacity = '';
                page.style.transform = '';
            }
        });
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

// 應用程式主類別
class App {
    private pageManager!: PageManager;
    private socialManager!: SocialManager;
    private imageManager!: ImageManager;
    private animationManager!: AnimationManager;

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
        
        console.log('Hannah 的個人網站已載入完成！');
    }
}

// 啟動應用程式
new App();
