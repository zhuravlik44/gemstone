/* ========================================
   САЙТ ИДЕНТИФИКАЦИИ ДРАГОЦЕННЫХ КАМНЕЙ
   Логика на чистом JavaScript
   ======================================== */

// ========================================
// Ссылки НА ЭЛЕМЕНТЫ DOM
// ========================================

const gemstoneGrid = document.getElementById('gemstones-grid');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const exploreBtn = document.getElementById('explore-btn');

// ========================================
// ИНИЦИАЛИЗАЦИЯ
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeGemstones();
    setupEventListeners();
    setupScrollAnimations();
});

// ========================================
// ГЕНЕРАЦИЯ КАРТОчЕК ДРАГОЦЕННЫХ КАМНЕЙ
// ========================================

function initializeGemstones() {
    gemstoneGrid.innerHTML = '';

    gemstonesData.forEach((gemstone, index) => {
        const card = createGemstoneCard(gemstone, index);
        gemstoneGrid.appendChild(card);
    });
}

function createGemstoneCard(gemstone, index) {
    const card = document.createElement('div');
    card.className = 'gemstone-card animate-slide-in-up';
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
        <div class="card-bg" style="background-image: url('${gemstone.imageUrl}');"></div>
        <div class="card-overlay"></div>
        <div class="card-content">
            <h3 class="card-title">${gemstone.title}</h3>
            <p class="card-text">${gemstone.description}</p>
            <div class="card-footer">Подробнее →</div>
        </div>
    `;

    card.addEventListener('click', () => openModal(gemstone));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            openModal(gemstone);
        }
    });

    return card;
}

// ========================================
// УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ
// ========================================

function openModal(gemstone) {
    // Обновим содержимое модального окна
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalAnatomy = document.getElementById('modal-anatomy');
    const modalAuth = document.getElementById('modal-auth');

    modalTitle.textContent = gemstone.title;
    modalDescription.textContent = gemstone.description;
    modalAnatomy.textContent = gemstone.anatomy;
    modalAuth.textContent = gemstone.authentication;

    // Сброс на вкладку строения
    switchTab('anatomy');

    // Покажим модальное окно с анимацией
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Вызов анимации
    requestAnimationFrame(() => {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'none';
            setTimeout(() => {
                modalContent.style.animation = 'modalOpen 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, 10);
        }
    });
}

function closeModal() {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ========================================
// МОДАЛЬНЫЕ ВКЛАДКИ 
// ========================================

function switchTab(tabName) {
    // Скрываю все вкладки
    const tabContents = document.querySelectorAll('.modal-tab-content');
    tabContents.forEach(tab => {
        tab.classList.add('hidden');
    });

    // Отказываю активное состояние всех вкладок
    const tabButtons = document.querySelectorAll('.modal-tab');
    tabButtons.forEach(btn => {
        btn.classList.remove('active', 'border-yellow-700', 'text-yellow-700');
        btn.classList.add('border-stone-900', 'text-stone-400');
    });

    // Покажим выбранную вкладку
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    // Освещаю активную кнопку вкладки
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'border-yellow-700', 'text-yellow-700');
        activeBtn.classList.remove('border-stone-900', 'text-stone-400');
    }
}

// ========================================
// НАСТРОЙКА МЕрОПРИЯТИЙ СОБЫТИЙ
// ========================================

function setupEventListeners() {
    // Кнопка закрытия модального окна
    closeModalBtn.addEventListener('click', closeModal);

    // Закрытие на клик вне содержимого
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Закрытие на клавишу ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Кнопки модальных вкладок
    const tabButtons = document.querySelectorAll('.modal-tab');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });

        // Навигация клавиатуры для вкладок
        btn.addEventListener('keydown', (e) => {
            const tabName = btn.getAttribute('data-tab');
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchTab(tabName);
            }
        });
    });

    // Кнопка "Исследовать"
    exploreBtn.addEventListener('click', () => {
        const collectionSection = document.querySelector('.collection-section');
        collectionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// ========================================
// АНИМАЦИИ ПО МЕра Прокрутки
// ========================================

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Осматриваю секции для анимации
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ========================================
// ВОВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ========================================

// Добавляю плавную прокрутку всем ссылкам
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Она окна центрируется в ресайе
    if (modal.classList.contains('hidden') === false) {
        // Keep modal centered on resize
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.maxHeight = '90vh';
        }
    }
});

// ========================================
// ОСУНЕСТВЛЕНИЕ ДОСТУПНОстИ
// ========================================

// Обеспечивание полярности на картах
gemstoneGrid.addEventListener('keydown', (e) => {
    const cards = document.querySelectorAll('.gemstone-card');
    if (e.key === 'Tab') {
        // Поддержка Tab для карточек
        cards.forEach(card => {
            card.setAttribute('tabindex', '0');
        });
    }
});

// Объявление на края для ПОЛЬУСАТОРОВ
function announceToScreenReaders(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
}

// Обновить модального окна для объявления на экран
const originalOpenModal = openModal;
openModal = function(gemstone) {
    originalOpenModal(gemstone);
    announceToScreenReaders(`${gemstone.title} открыты. Нажмите Tab для навигации или Escape для закрытия.`);
};
