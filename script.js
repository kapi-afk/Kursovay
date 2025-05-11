// Обработчики для выбора валюты
const desktopCurrencyBtn = document.getElementById('currencyBtn');
const mobileCurrencyBtn = document.getElementById('mobileCurrencyBtn');
const desktopCurrencyDropdown = document.getElementById('currencyDropdown');
const mobileCurrencyDropdown = document.getElementById('mobileCurrencyDropdown');

if (desktopCurrencyBtn && desktopCurrencyDropdown) {
    desktopCurrencyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        desktopCurrencyDropdown.classList.toggle('show');
        if (mobileCurrencyDropdown) {
            mobileCurrencyDropdown.classList.remove('show');
        }
    });
}

if (mobileCurrencyBtn && mobileCurrencyDropdown) {
    mobileCurrencyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileCurrencyDropdown.classList.toggle('show');
        if (desktopCurrencyDropdown) {
            desktopCurrencyDropdown.classList.remove('show');
        }
    });
}

// Закрытие дропдаунов при клике вне них
document.addEventListener('click', (e) => {
    if (!desktopCurrencyBtn?.contains(e.target) && !mobileCurrencyBtn?.contains(e.target)) {
        if (desktopCurrencyDropdown) {
            desktopCurrencyDropdown.classList.remove('show');
        }
        if (mobileCurrencyDropdown) {
            mobileCurrencyDropdown.classList.remove('show');
        }
    }
});

// Обработка выбора валюты
document.querySelectorAll('.currency-option').forEach(option => {
    option.addEventListener('click', () => {
        const currency = option.dataset.currency;
        const symbol = option.dataset.symbol;
        const rate = parseFloat(option.dataset.rate);

        // Обновление отображаемой валюты
        document.querySelectorAll('.current-currency').forEach(el => {
            el.textContent = currency;
        });

        // Обновление символа валюты
        document.querySelectorAll('.currency-symbol').forEach(symbolEl => {
            symbolEl.textContent = symbol;
        });

        // Обновление цен
        document.querySelectorAll('.price-value').forEach(priceEl => {
            // Сохраняем оригинальную цену, если она еще не сохранена
            if (!priceEl.dataset.originalPrice) {
                priceEl.dataset.originalPrice = priceEl.textContent;
            }
            const originalPrice = parseFloat(priceEl.dataset.originalPrice);
            if (!isNaN(originalPrice)) {
                const newPrice = (originalPrice * rate).toFixed(2);
                priceEl.textContent = newPrice;
            }
        });

        // Обновление цен в корзине
        document.querySelectorAll('.basket-item-price').forEach(priceEl => {
            const originalPrice = parseFloat(priceEl.dataset.basePrice);
            const quantity = parseInt(priceEl.dataset.quantity || 1);
            if (!isNaN(originalPrice)) {
                const newPrice = (originalPrice * rate * quantity).toFixed(2);
                priceEl.innerHTML = `<span class="currency-symbol">${symbol}</span>${newPrice}`;
            }
        });

        // Обновление общей суммы в корзине
        const summaryTotal = document.querySelector('.summary-total');
        if (summaryTotal) {
            const items = document.querySelectorAll('.basket-item-price');
            let total = 0;
            items.forEach(item => {
                const price = parseFloat(item.dataset.basePrice);
                const quantity = parseInt(item.dataset.quantity || 1);
                if (!isNaN(price)) {
                    total += price * quantity;
                }
            });
            total = (total * rate).toFixed(2);
            summaryTotal.innerHTML = `<span class="currency-symbol">${symbol}</span>${total}`;
        }

        // Закрытие дропдаунов
        const dropdowns = document.querySelectorAll('.currency-dropdown');
        dropdowns.forEach(dropdown => dropdown.classList.remove('show'));

        // Сохранение выбранной валюты
        localStorage.setItem('selectedCurrency', currency);
        localStorage.setItem('selectedSymbol', symbol);
        localStorage.setItem('selectedRate', rate);

        // Генерация события изменения валюты
        const event = new CustomEvent('currencyChanged', {
            detail: {
                currency: currency,
                symbol: symbol,
                rate: rate
            }
        });
        document.dispatchEvent(event);
    });
});

// Загрузка сохраненной валюты при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    const savedSymbol = localStorage.getItem('selectedSymbol');
    const savedRate = localStorage.getItem('selectedRate');

    if (savedCurrency && savedSymbol && savedRate) {
        // Обновление отображаемой валюты
        document.querySelectorAll('.current-currency').forEach(el => {
            el.textContent = savedCurrency;
        });

        // Обновление цен
        document.querySelectorAll('.price-value').forEach(priceEl => {
            // Получаем оригинальную цену в USD
            const originalPrice = parseFloat(priceEl.dataset.originalPrice || priceEl.textContent);
            // Если оригинальная цена не сохранена, сохраняем её
            if (!priceEl.dataset.originalPrice) {
                priceEl.dataset.originalPrice = originalPrice;
            }
            // Пересчитываем цену с учетом курса
            const newPrice = originalPrice * parseFloat(savedRate);
            priceEl.textContent = newPrice.toFixed(2);
        });

        // Обновление символа валюты
        document.querySelectorAll('.currency-symbol').forEach(symbolEl => {
            symbolEl.textContent = savedSymbol;
        });
    }
});

// настройки для наблюдателя за пересечением элементов
const observerOptions = {
    threshold: 0.1 // порог видимости элемента для срабатывания
};

// создаем наблюдатель за появлением элементов в viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// добавляем анимацию появления для карточек товаров и элементов футера
document.querySelectorAll('.product-card, .footer-link, .social-icon, .payment-icon').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// настраиваем плавный скролл для якорных ссылок
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



// Инициализация корзины
let cart;

// === ONLINE STATUS & LOGOUT MENU ===

// Проверка статуса при загрузке
window.addEventListener('DOMContentLoaded', function() {
    // инициализация корзины
    if (!cart) {
        cart = new ShoppingCart();
    }
    // инициализация модального окна корзины
    if (document.querySelector('.modal-overlay')) {
        const modalCart = new Modal_cart();
    }
    // инициализация профиля пользователя
    window.userProfile = new UserProfile();
    // Проверяем статус
    const userIcon = document.querySelector('.user-icon');
    const currentUser = window.userProfile.getCurrentUser && window.userProfile.getCurrentUser();
    if (userIcon) {
        if (currentUser) {
            userIcon.classList.add('logged-in');
        } else {
            userIcon.classList.remove('logged-in');
        }
    }

    // Инициализация бургер-меню
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileProfile = document.querySelector('.mobile-profile');
    const profileLink = document.querySelector('.profile-link');
    const mobileProfileInfo = document.querySelector('.mobile-profile-info');
    const mobileUsername = document.querySelector('.mobile-username');
    const mobileLogout = document.querySelector('.mobile-logout');
    const shopName = document.querySelector('.shop-name');

    // Обработчик для бургер-меню
    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            burgerMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Закрытие мобильного меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
                burgerMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }

    // Обработчик для мобильного профиля
    if (mobileProfile) {
        // Обработчик клика по ссылке профиля
        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                const currentUser = window.userProfile.getCurrentUser();
                if (!currentUser) {
                    window.userProfile.openModal();
                    if (burgerMenu) burgerMenu.classList.remove('active');
                    if (mobileMenu) mobileMenu.classList.remove('active');
                }
            });
        }

        // Обработчик клика по блоку профиля
        mobileProfile.addEventListener('click', (e) => {
            const currentUser = window.userProfile.getCurrentUser();
            if (currentUser) {
                // Если клик был по кнопке выхода, не делаем ничего
                if (e.target.closest('.mobile-logout')) return;
                
                // Создаем меню выхода
                const logoutMenu = document.createElement('div');
                logoutMenu.className = 'logout-menu';
                const logoutBtn = document.createElement('button');
                logoutBtn.className = 'logout-button';
                logoutBtn.textContent = 'Выйти';
                logoutBtn.onclick = () => {
                    window.userProfile.logout();
                    updateProfileDisplay();
                    logoutMenu.remove();
                };
                logoutMenu.appendChild(logoutBtn);
                
                // Удаляем старое меню, если оно есть
                const existingMenu = document.querySelector('.logout-menu');
                if (existingMenu) {
                    existingMenu.remove();
                }
                
                // Добавляем новое меню
                mobileProfile.appendChild(logoutMenu);
                
                // Закрываем меню при клике вне его
                document.addEventListener('click', function closeMenu(e) {
                    if (!mobileProfile.contains(e.target)) {
                        logoutMenu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                });
            }
        });

        // Обработчик кнопки выхода
        if (mobileLogout) {
            mobileLogout.addEventListener('click', () => {
                window.userProfile.logout();
                updateProfileDisplay();
            });
        }

        // Функция обновления отображения профиля
        function updateProfileDisplay() {
            const currentUser = window.userProfile.getCurrentUser();
            if (currentUser) {
                if (profileLink) profileLink.style.display = 'none';
                if (mobileProfileInfo) mobileProfileInfo.style.display = 'flex';
                if (mobileUsername) mobileUsername.textContent = currentUser.username;
                if (shopName) shopName.textContent = currentUser.username;
                if (userIcon) userIcon.classList.add('logged-in');
            } else {
                if (profileLink) profileLink.style.display = 'block';
                if (mobileProfileInfo) mobileProfileInfo.style.display = 'none';
                if (mobileUsername) mobileUsername.textContent = 'Night Elf Shop';
                if (shopName) shopName.textContent = 'Night Elf Shop';
                if (userIcon) userIcon.classList.remove('logged-in');
            }
        }

        // Инициализация отображения профиля
        updateProfileDisplay();
    }

    // Обработчик для иконки пользователя
    if (userIcon) {
        userIcon.addEventListener('click', (e) => {
            const currentUser = window.userProfile.getCurrentUser();
            if (!currentUser) {
                window.userProfile.openModal();
            } else {
                // Создаем меню выхода
                const logoutMenu = document.createElement('div');
                logoutMenu.className = 'logout-menu';
                const logoutBtn = document.createElement('button');
                logoutBtn.className = 'logout-button';
                logoutBtn.textContent = 'Выйти';
                logoutBtn.onclick = () => {
                    window.userProfile.logout();
                    updateProfileDisplay();
                    logoutMenu.remove();
                };
                logoutMenu.appendChild(logoutBtn);
                
                // Удаляем старое меню, если оно есть
                const existingMenu = document.querySelector('.logout-menu');
                if (existingMenu) {
                    existingMenu.remove();
                }
                
                // Добавляем новое меню
                userIcon.appendChild(logoutMenu);
                
                // Закрываем меню при клике вне его
                document.addEventListener('click', function closeMenu(e) {
                    if (!userIcon.contains(e.target)) {
                        logoutMenu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                });
            }
        });
    }

    // инициализация фильтра товаров
    new ProductFilter();
    // инициализация страницы товара, если она существует
    if (document.querySelector('.product-page')) {
        const productPage = new ProductPage();
        productPage.init();
    }
});

// класс для управления корзиной покупок
class ShoppingCart {
    constructor() {
        // инициализация состояния корзины
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.currentRate = parseFloat(localStorage.getItem('selectedRate')) || 1;
        this.currentSymbol = localStorage.getItem('selectedSymbol') || '$';
        this.init();
    }

    // инициализация корзины
    init() {
        this.renderCart();
        this.updateCartCount();
        this.setupEventListeners();
    }

    // настройка обработчиков событий
    setupEventListeners() {
        // обработчик для кнопок добавления в корзину
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.id;

                // загрузка данных о товаре
                try {
                    const response = await fetch('products.json');
                    const data = await response.json();
                    const productData = data.products[productId];

                    // создание объекта товара
                    const product = {
                        id: productId,
                        title: productCard.querySelector('.product-title').textContent,
                        price: parseFloat(productCard.dataset.price),
                        image: productCard.querySelector('.product-image').src,
                        description: productData.description.overview,
                        publisher: productData.publisher,
                        genres: productData.genres.join(', ')
                    };

                    // добавление товара в корзину
                    this.addItem(product);

                    // анимация кнопки при клике
                    const button = e.target;
                    button.classList.add('clicked');
                    const ripple = document.createElement('div');
                    ripple.classList.add('ripple');
                    button.appendChild(ripple);

                    // удаление эффекта анимации
                    setTimeout(() => {
                        ripple.remove();
                        button.classList.remove('clicked');
                    }, 1000);
                } catch (error) {
                    console.error('Error loading product data:', error);
                }
            });
        });

        // обработчик клика по карточке товара
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // проверяем, не был ли клик по кнопке корзины
                if (!e.target.classList.contains('add-to-cart')) {
                    const productId = this.dataset.id;
                    if (productId) {
                        window.location.href = `product.html?id=${productId}`;
                    }
                }
            });
        });

        // обработчик изменения валюты
        document.addEventListener('currencyChanged', (e) => {
            this.currentRate = e.detail.rate;
            this.currentSymbol = e.detail.symbol;
            this.updatePrices();
        });

        // обработчик для кнопки оформления заказа
        const checkoutButton = document.querySelector('.checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (this.items.length > 0) {
                    const modalCart = new Modal_cart();
                    modalCart.openModal();
                }
            });
        }
    }

    // добавление товара в корзину
    addItem(product) {
        // проверка наличия товара в корзине
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            // увеличение количества существующего товара
            existingItem.quantity += 1;
        } else {
            // добавление нового товара
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                description: product.description || 'Описание отсутствует',
                publisher: product.publisher || 'Не указан',
                genres: product.genres || 'Не указаны',
                quantity: 1
            });
        }
        
        // сохранение состояния корзины
        this.saveToLocalStorage();
        
        // Сохраняем корзину в куки пользователя
        if (window.userProfile) {
            window.userProfile.saveUserCart();
        }
        
        // обновление отображения
        this.renderCart();
        this.updateCartCount();
    }

    // удаление товара из корзины
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToLocalStorage();
        
        // Сохраняем корзину в куки пользователя
        if (window.userProfile) {
            window.userProfile.saveUserCart();
        }
        
        this.updateCartCount();
        this.renderCart();
    }

    // обновление количества товара
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveToLocalStorage();
                // Сохраняем корзину в куки пользователя
                if (window.userProfile) {
                    window.userProfile.saveUserCart();
                }
                this.renderCart();
            }
        }
    }

    // подсчет общей стоимости
    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    }

    // обновление счетчика товаров
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // обновление цен при смене валюты
    updatePrices() {
        const total = this.calculateTotal() * this.currentRate;
        const summaryTotal = document.querySelector('.summary-total');
        if (summaryTotal) {
            summaryTotal.innerHTML = `
                <span class="currency-symbol">${this.currentSymbol}</span>
                ${total.toFixed(2)}
            `;
        }

        // обновление цен отдельных товаров
        document.querySelectorAll('.basket-item-price').forEach(priceElement => {
            const basePrice = parseFloat(priceElement.dataset.basePrice);
            const quantity = parseInt(priceElement.dataset.quantity);
            const convertedPrice = basePrice * this.currentRate * quantity;
            priceElement.innerHTML = `
                <span class="currency-symbol">${this.currentSymbol}</span>
                ${convertedPrice.toFixed(2)}
            `;
        });
    }

    // отрисовка содержимого корзины
    renderCart() {
        const basketItems = document.querySelector('.basket-items');
        const summaryTotal = document.querySelector('.summary-total');
        
        if (!basketItems || !summaryTotal) return;

        // если корзина пуста, показываем сообщение
        if (this.items.length === 0) {
            basketItems.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
            summaryTotal.innerHTML = `
                <span class="currency-symbol">${this.currentSymbol}</span>
                0.00
            `;
            return;
        }

        // формируем HTML для каждого товара в корзине
        basketItems.innerHTML = this.items.map(item => `
            <div class="basket-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="basket-item-image">
                <div class="basket-item-info">
                    <div class="basket-item-title">${item.title}</div>
                    <div class="basket-item-details">
                        <div class="basket-item-publisher">Издатель: ${item.publisher || 'Не указан'}</div>
                        <div class="basket-item-genres">Жанры: ${item.genres || 'Не указаны'}</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">${item.quantity || 1}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <div class="basket-item-price" data-base-price="${item.price}" data-quantity="${item.quantity || 1}">
                    <span class="currency-symbol">${this.currentSymbol}</span>
                    ${((item.price * (item.quantity || 1)) * this.currentRate).toFixed(2)}
                </div>
                <button class="basket-item-remove">✕</button>
            </div>
        `).join('');

        // обновляем общую сумму
        const total = this.calculateTotal() * this.currentRate;
        summaryTotal.innerHTML = `
            <span class="currency-symbol">${this.currentSymbol}</span>
            ${total.toFixed(2)}
        `;

        // добавляем обработчики для кнопок управления количеством
        basketItems.querySelectorAll('.basket-item').forEach(item => {
            const id = item.dataset.id;
            const product = this.items.find(p => p.id === id);

            // уменьшение количества
            item.querySelector('.minus').addEventListener('click', () => {
                if (product) this.updateQuantity(id, (product.quantity || 1) - 1);
            });

            // увеличение количества
            item.querySelector('.plus').addEventListener('click', () => {
                if (product) this.updateQuantity(id, (product.quantity || 1) + 1);
            });

            // удаление товара
            item.querySelector('.basket-item-remove').addEventListener('click', () => {
                this.removeItem(id);
            });
        });
    }

    // сохранение состояния корзины в localStorage
    saveToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    // очистка корзины
    clearCart() {
        this.items = [];
        this.saveToLocalStorage();
        this.renderCart();
        this.updateCartCount();
    }
}

// анимация иконок социальных сетей при наведении
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// обработка клика по кнопкам фильтров
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', function() {
        // переключение активного состояния
        this.classList.toggle('active');
        
        // добавление эффекта пульсации
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // удаление эффекта через 600мс
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// класс для работы со страницей товара
class ProductPage {
    constructor() {
        this.currentImageIndex = 0;
        this.productData = null;
        this.currentRate = 1;
        this.currentSymbol = '$';
    }

    // инициализация страницы товара
    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (!productId) {
            console.error('Product ID not found in URL');
            return;
        }
        await this.loadProductData(productId);
        this.setupEventListeners();
        this.setupAddToCartButton();
    }

    // загрузка данных о товаре
    async loadProductData(productId) {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.productData = data.products[productId];
            
            if (this.productData) {
                document.title = this.productData.title + " - Night Elf Shop";
                this.loadProductInfo();
                this.setupGallery();
                this.setupTabs();
                this.loadTabContent('description');
            } else {
                console.error('Product not found:', productId);
            }
        } catch (error) {
            console.error('Error loading product data:', error);
        }
    }

    // загрузка информации о товаре на страницу
    loadProductInfo() {
        const titleElement = document.querySelector('.product-title');
        const tagsContainer = document.querySelector('.product-tags');
        const priceElement = document.querySelector('.product-price .price-value');
        const genresElement = document.querySelector('.product-genres');
        const releaseDateElement = document.querySelector('.product-release-date');
        const publisherElement = document.querySelector('.product-publisher');
        const developerElement = document.querySelector('.product-developer');
        const interfaceLanguages = document.querySelector('.interface-languages');
        const voiceLanguages = document.querySelector('.voice-languages');

        // заполнение элементов данными
        if (titleElement) titleElement.textContent = this.productData.title;
        
        // создание тегов товара
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            this.productData.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }

        // заполнение остальной информации
        if (priceElement) {
            // Сохраняем оригинальную цену
            priceElement.dataset.originalPrice = this.productData.price;
            const basePrice = parseFloat(this.productData.price);
            if (!isNaN(basePrice) && !isNaN(this.currentRate)) {
                const convertedPrice = (basePrice * this.currentRate).toFixed(2);
                priceElement.textContent = convertedPrice;
                
                // Обновляем символ валюты
                const symbolElement = document.querySelector('.product-price .currency-symbol');
                if (symbolElement) {
                    symbolElement.textContent = this.currentSymbol;
                    symbolElement.style.opacity = '1';
                }
            }
        }
        if (genresElement) genresElement.textContent = this.productData.genres.join(', ');
        if (releaseDateElement) releaseDateElement.textContent = this.productData.releaseDate;
        if (publisherElement) publisherElement.textContent = this.productData.publisher;
        if (developerElement) developerElement.textContent = this.productData.developer;
        if (interfaceLanguages) interfaceLanguages.textContent = this.productData.languages.interface.join(', ');
        if (voiceLanguages) voiceLanguages.textContent = this.productData.languages.voice.join(', ');
    }

    // настройка галереи изображений
    setupGallery() {
        const mainImage = document.querySelector('.main-image img');
        const thumbnailsContainer = document.querySelector('.thumbnails');
        const prevButton = document.querySelector('.prev-button');
        const nextButton = document.querySelector('.next-button');

        if (!mainImage || !thumbnailsContainer || !prevButton || !nextButton) {
            console.error('Gallery elements not found');
            return;
        }

        // установка главного изображения
        mainImage.src = this.productData.images[this.currentImageIndex];

        // создание миниатюр
        thumbnailsContainer.innerHTML = '';
        this.productData.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.className = index === this.currentImageIndex ? 'active' : '';
            thumbnail.addEventListener('click', () => this.changeImage(index));
            thumbnailsContainer.appendChild(thumbnail);
        });

        // обработчики для кнопок навигации
        prevButton.addEventListener('click', () => {
            this.changeImage(this.currentImageIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            this.changeImage(this.currentImageIndex + 1);
        });
    }

    // смена изображения в галерее
    changeImage(index) {
        const mainImage = document.querySelector('.main-image img');
        const thumbnails = document.querySelectorAll('.thumbnails img');
        
        // обработка циклического переключения
        if (index < 0) {
            index = this.productData.images.length - 1;
        } else if (index >= this.productData.images.length) {
            index = 0;
        }
        
        // анимация смены изображения
        mainImage.classList.add('fade-out');
        
        setTimeout(() => {
            // обновление изображения
            mainImage.src = this.productData.images[index];
            mainImage.alt = `${this.productData.title} - изображение ${index + 1}`;
            
            // обновление активной миниатюры
            thumbnails.forEach((thumb, i) => {
                if (i === index) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
            
            // анимация появления нового изображения
            mainImage.classList.remove('fade-out');
            mainImage.classList.add('fade-in');
            
            setTimeout(() => {
                mainImage.classList.remove('fade-in');
            }, 600);
            
            this.currentImageIndex = index;
        }, 300);
    }

    // настройка вкладок с информацией
    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        if (!tabs.length) {
            console.error('Tabs not found');
            return;
        }

        // добавление обработчиков для вкладок
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // активация первой вкладки по умолчанию
        this.switchTab('description');
    }

    // переключение между вкладками
    switchTab(tabId) {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        if (!tabs.length || !tabContents.length) return;

        // обновление активной вкладки
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            }
        });

        // обновление активного содержимого
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.getAttribute('data-tab') === tabId) {
                content.classList.add('active');
            }
        });

        // загрузка содержимого вкладки
        this.loadTabContent(tabId);
    }

    // загрузка содержимого вкладки
    loadTabContent(tabId) {
        const content = document.querySelector(`.tab-content[data-tab="${tabId}"]`);
        if (!content || !this.productData) return;
        
        // заполнение содержимого в зависимости от типа вкладки
        switch(tabId) {
            case 'description':
                content.innerHTML = `
                    <h3>Описание</h3>
                    <p>${this.productData.description.overview}</p>
                    <h4>Особенности:</h4>
                    <ul>
                        ${this.productData.description.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                `;
                break;

            case 'requirements':
                content.innerHTML = `
                    <h3>Минимальные требования:</h3>
                    <ul>
                        ${Object.entries(this.productData.systemRequirements.minimum)
                            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
                            .join('')}
                    </ul>
                    <h3>Рекомендуемые требования:</h3>
                    <ul>
                        ${Object.entries(this.productData.systemRequirements.recommended)
                            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
                            .join('')}
                    </ul>
                `;
                break;

            case 'activation':
                content.innerHTML = `
                    <h3>Инструкция по активации:</h3>
                    <p><strong>Регион активации:</strong> ${this.productData.activation.region}</p>
                    <p><strong>Сервис активации:</strong> ${this.productData.activation.service}</p>
                    <ol>
                        ${this.productData.activation.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ol>
                    <p class="note">${this.productData.activation.note}</p>
                `;
                break;
        }
    }

    // настройка кнопки добавления в корзину
    setupAddToCartButton() {
        const addToCartBtn = document.querySelector('.product-page .add-to-cart-large');
        if (addToCartBtn && this.productData) {
            addToCartBtn.addEventListener('click', () => {
                // создание объекта товара
                const product = {
                    id: new URLSearchParams(window.location.search).get('id'),
                    title: this.productData.title,
                    price: parseFloat(this.productData.price),
                    image: this.productData.images[0],
                    details: this.productData.description.overview,
                    publisher: this.productData.publisher,
                    genres: this.productData.genres.join(', ')
                };

                // добавление товара в корзину
                cart.addItem(product);

                // анимация кнопки
                addToCartBtn.classList.add('clicked');
                const ripple = document.createElement('div');
                ripple.classList.add('ripple');
                addToCartBtn.appendChild(ripple);

                // удаление эффекта анимации
                setTimeout(() => {
                    ripple.remove();
                    addToCartBtn.classList.remove('clicked');
                }, 1000);
            });
        }
    }

    setupEventListeners() {
        // Обработчик изменения валюты
        document.addEventListener('currencyChanged', (e) => {
            const rate = parseFloat(e.detail.rate);
            if (!isNaN(rate)) {
                this.currentRate = rate;
                this.currentSymbol = e.detail.symbol;
                this.updatePrice();
            }
        });

        // Загрузка сохраненной валюты
        const savedCurrency = localStorage.getItem('selectedCurrency');
        const savedSymbol = localStorage.getItem('selectedSymbol');
        const savedRate = localStorage.getItem('selectedRate');

        if (savedCurrency && savedSymbol && savedRate) {
            const rate = parseFloat(savedRate);
            if (!isNaN(rate)) {
                this.currentRate = rate;
                this.currentSymbol = savedSymbol;
                this.updatePrice();
            }
        }
    }

    updatePrice() {
        const priceElement = document.querySelector('.product-price .price-value');
        if (priceElement && this.productData) {
            // Сохраняем оригинальную цену, если она еще не сохранена
            if (!priceElement.dataset.originalPrice) {
                priceElement.dataset.originalPrice = this.productData.price;
            }
            const basePrice = parseFloat(priceElement.dataset.originalPrice);
            if (!isNaN(basePrice) && !isNaN(this.currentRate)) {
                const convertedPrice = (basePrice * this.currentRate).toFixed(2);
                priceElement.textContent = convertedPrice;
                
                // Обновляем символ валюты
                const symbolElement = document.querySelector('.product-price .currency-symbol');
                if (symbolElement) {
                    symbolElement.textContent = this.currentSymbol;
                    symbolElement.style.opacity = '1';
                }
            }
        }
    }
}

// класс для фильтрации товаров
class ProductFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-button');
        this.products = document.querySelectorAll('.product-card');
        this.init();
    }

    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.filterProducts(button));
        });
    }

    filterProducts(clickedButton) {
        // Убираем активный класс со всех кнопок
        this.filterButtons.forEach(button => button.classList.remove('active'));
        
        // Добавляем активный класс на нажатую кнопку
        clickedButton.classList.add('active');
        
        const selectedGenre = clickedButton.dataset.genre;
        
        this.products.forEach(product => {
            if (selectedGenre === 'all') {
                product.style.display = 'flex';
                return;
            }
            
            const productGenres = product.dataset.genres.split(',');
            if (productGenres.includes(selectedGenre)) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    }
}

class Modal_cart {
    constructor() {
        this.modal = document.querySelector('.modal-overlay');
        this.form = document.querySelector('.modal-form');
        this.successMessage = document.querySelector('.modal-success');
        this.closeButton = document.querySelector('.modal-close');
        this.emailInput = document.querySelector('.modal-input');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Обработчик отправки формы
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateEmail()) {
                this.showSuccess();
                // Очищаем корзину после успешного оформления
                cart.clearCart();
                if(window.userProfile){
                    window.userProfile.saveUserCart();
                }
            }
        });

        // Обработчик закрытия модального окна
        this.closeButton.addEventListener('click', () => {
            this.closeModal();
        });

        // Закрытие модального окна при клике вне его
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Валидация email при вводе
        this.emailInput.addEventListener('input', () => {
            this.emailInput.classList.remove('error');
        });
    }

    validateEmail() {
        const email = this.emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.emailInput.classList.add('error');
            return false;
        }
        return true;
    }

    showSuccess() {
        this.form.style.display = 'none';
        this.successMessage.classList.add('active');
        
        // Через 2 секунды закрываем модальное окно
        setTimeout(() => {
            this.closeModal();
        }, 2000);
    }

    closeModal() {
        this.modal.classList.remove('active');
        // Сбрасываем форму
        this.form.style.display = 'flex';
        this.successMessage.classList.remove('active');
        this.emailInput.value = '';
        this.emailInput.classList.remove('error');
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            if (this.loginForm) {
                this.loginForm.style.display = 'flex';
            }
            if (this.registerForm) {
                this.registerForm.style.display = 'none';
            }
        } else {
            console.error('Модальное окно не найдено');
        }
    }
}

class UserProfile {
    constructor() {
        this.modal = document.querySelector('.profile-modal');
        this.loginForm = document.querySelector('.login-form');
        this.registerForm = document.querySelector('.register-form');
        this.switchToLogin = document.querySelector('.switch-to-login-btn');
        this.switchToRegister = document.querySelector('.switch-to-register-btn');
        this.closeButton = document.querySelector('.profile-modal-close');
        this.shopName = document.querySelector('.shop-name');
        this.userIcon = document.querySelector('.user-icon');
        
        // Проверяем наличие необходимых элементов
        if (!this.modal || !this.loginForm || !this.registerForm || !this.shopName || !this.userIcon) {
            console.error('Не все необходимые элементы найдены для инициализации UserProfile');
            return;
        }
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
        this.setupMobileEventListeners();
    }

    setupEventListeners() {
        // Переключение между формами
        if (this.switchToLogin) {
            this.switchToLogin.addEventListener('click', () => {
                this.loginForm.style.display = 'flex';
                this.registerForm.style.display = 'none';
            });
        }

        if (this.switchToRegister) {
            this.switchToRegister.addEventListener('click', () => {
                this.loginForm.style.display = 'none';
                this.registerForm.style.display = 'flex';
            });
        }

        // Обработка форм
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Закрытие модального окна
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Закрытие по клику вне окна
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
    }

    handleLogin() {
        const email = this.loginForm.querySelector('input[type="email"]').value;
        const password = this.loginForm.querySelector('input[type="password"]').value;

        // Получаем всех пользователей из куки
        const users = this.getUsersFromCookie();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.loginUser(user);
        } else {
            this.showError('Неверный email или пароль');
        }
    }

    handleRegister() {
        const username = this.registerForm.querySelector('.profile-input[type="text"]').value;
        const email = this.registerForm.querySelector('.profile-input[type="email"]').value;
        const password = this.registerForm.querySelector('.profile-input[type="password"]').value;
        const confirmPassword = this.registerForm.querySelectorAll('.profile-input[type="password"]')[1].value;

        if (password !== confirmPassword) {
            this.showError('Пароли не совпадают');
            return;
        }

        // Получаем всех пользователей из куки
        const users = this.getUsersFromCookie();
        
        // Проверяем, не занят ли email
        if (users.some(u => u.email === email)) {
            this.showError('Этот email уже зарегистрирован');
            return;
        }

        // Создаем нового пользователя
        const newUser = {
            username,
            email,
            password,
            cart: []
        };

        // Добавляем пользователя в список
        users.push(newUser);
        this.saveUsersToCookie(users);

        // Авторизуем пользователя
        this.loginUser(newUser);
    }

    loginUser(user) {
        if (this.userIcon) {
            this.userIcon.classList.add('logged-in');
        }
        // Сохраняем текущего пользователя в куки
        document.cookie = `currentUser=${JSON.stringify(user)}; path=/; max-age=2592000`; // 30 дней
        
        // Обновляем интерфейс
        this.shopName.textContent = user.username;
        if (this.userIcon) {
            this.userIcon.classList.add('logged-in');
        }
        
        // Закрываем модальные окна
        this.closeModal();
        this.closeMobileModal();
        
        // Загружаем корзину пользователя
        this.loadUserCart();
        
        // Обновляем отображение мобильного профиля
        this.updateMobileProfileDisplay();
    }

    logout() {
        if (this.userIcon) {
            this.userIcon.classList.remove('logged-in');
        }
        // Сохраняем текущую корзину в профиль пользователя
        this.saveUserCart();
        
        // Удаляем куки текущего пользователя
        document.cookie = 'currentUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // Обновляем интерфейс
        this.shopName.textContent = 'Night Elf Shop';
        if (this.userIcon) {
            this.userIcon.classList.remove('logged-in');
        }
        
        // Очищаем корзину
        cart.clearCart();
        
        // Обновляем отображение мобильного профиля
        this.updateMobileProfileDisplay();
    }

    checkAuth() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            this.shopName.textContent = currentUser.username;
            if (this.userIcon) {
                this.userIcon.classList.add('logged-in');
            }
            this.loadUserCart();
        }
    }

    getCurrentUser() {
        const cookies = document.cookie.split(';');
        const currentUserCookie = cookies.find(c => c.trim().startsWith('currentUser='));
        if (currentUserCookie) {
            return JSON.parse(decodeURIComponent(currentUserCookie.split('=')[1]));
        }
        return null;
    }

    getUsersFromCookie() {
        const cookies = document.cookie.split(';');
        const usersCookie = cookies.find(c => c.trim().startsWith('users='));
        if (usersCookie) {
            return JSON.parse(decodeURIComponent(usersCookie.split('=')[1]));
        }
        return [];
    }

    saveUsersToCookie(users) {
        document.cookie = `users=${JSON.stringify(users)}; path=/; max-age=2592000`;
    }

    saveUserCart() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            // Обновляем корзину текущего пользователя
            currentUser.cart = cart.items;
            
            // Получаем всех пользователей
            const users = this.getUsersFromCookie();
            
            // Находим индекс текущего пользователя по email
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            
            if (userIndex !== -1) {
                // Обновляем пользователя в массиве
                users[userIndex] = currentUser;
                
                // Сохраняем обновленный массив пользователей
                this.saveUsersToCookie(users);
                
                // Обновляем куки текущего пользователя
                document.cookie = `currentUser=${JSON.stringify(currentUser)}; path=/; max-age=2592000`;
            }
        }
    }

    loadUserCart() {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.cart) {
            cart.items = currentUser.cart;
            cart.saveToLocalStorage();
            cart.renderCart();
            cart.updateCartCount();
        }
    }

    showError(message) {
        const errorElement = document.querySelector('.profile-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 3000);
        }
    }

    openModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            if (this.loginForm) {
                this.loginForm.style.display = 'flex';
            }
            if (this.registerForm) {
                this.registerForm.style.display = 'none';
            }
        } else {
            console.error('Модальное окно не найдено');
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        // Сбрасываем форму
        this.form.style.display = 'flex';
        this.successMessage.classList.remove('active');
        this.emailInput.value = '';
        this.emailInput.classList.remove('error');
    }

    setupMobileEventListeners() {
        // Обработчик для ссылки профиля в мобильном меню
        const mobileProfileLink = document.querySelector('.mobile-profile-link');
        const mobileProfileInfo = document.querySelector('.mobile-profile-info');
        const mobileUsername = document.querySelector('.mobile-username');
        const mobileLogout = document.querySelector('.mobile-logout');

        if (mobileProfileLink) {
            mobileProfileLink.addEventListener('click', (e) => {
                e.preventDefault();
                const currentUser = this.getCurrentUser();
                if (!currentUser) {
                    this.openMobileModal();
                }
            });
        }

        if (mobileLogout) {
            mobileLogout.addEventListener('click', () => {
                this.logout();
                this.updateMobileProfileDisplay();
            });
        }

        // Инициализация отображения мобильного профиля
        this.updateMobileProfileDisplay();
    }

    updateMobileProfileDisplay() {
        const currentUser = this.getCurrentUser();
        const mobileProfileLink = document.querySelector('.mobile-profile-link');
        const mobileProfileInfo = document.querySelector('.mobile-profile-info');
        const mobileUsername = document.querySelector('.mobile-username');

        if (currentUser) {
            if (mobileProfileLink) mobileProfileLink.style.display = 'none';
            if (mobileProfileInfo) {
                mobileProfileInfo.classList.add('active');
                mobileProfileInfo.style.display = 'flex';
            }
            if (mobileUsername) mobileUsername.textContent = currentUser.username;
        } else {
            if (mobileProfileLink) mobileProfileLink.style.display = 'block';
            if (mobileProfileInfo) {
                mobileProfileInfo.classList.remove('active');
                mobileProfileInfo.style.display = 'none';
            }
            if (mobileUsername) mobileUsername.textContent = '';
        }
    }

    openMobileModal() {
        if (this.modal) {
            this.modal.classList.add('active');
            if (this.loginForm) {
                this.loginForm.style.display = 'flex';
            }
            if (this.registerForm) {
                this.registerForm.style.display = 'none';
            }
        } else {
            console.error('Модальное окно не найдено');
        }
    }

    closeMobileModal() {
        this.modal.classList.remove('active');
        this.loginForm.reset();
        this.registerForm.reset();
    }
} 