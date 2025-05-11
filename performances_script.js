import { loadPerformancesData } from './performances_data.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Загрузка данных о спектаклях
    const performances = await loadPerformancesData();
    
    // Группировка спектаклей по жанрам
    const performancesByGenre = performances.reduce((acc, performance) => {
        if (!acc[performance.genre]) {
            acc[performance.genre] = [];
        }
        acc[performance.genre].push(performance);
        return acc;
    }, {});

    // Создание секций для каждого жанра
    const performancesSection = document.querySelector('.performances');
    if (performancesSection) {
        performancesSection.innerHTML = '';
        
        Object.entries(performancesByGenre).forEach(([genre, genrePerformances]) => {
            const genreSection = document.createElement('div');
            genreSection.className = 'genre-section';
            
            const genreTitle = document.createElement('h2');
            genreTitle.textContent = genre;
            genreSection.appendChild(genreTitle);
            
            const performanceGrid = document.createElement('div');
            performanceGrid.className = 'performance-grid';
            
            genrePerformances.forEach(performance => {
                const card = createPerformanceCard(performance);
                performanceGrid.appendChild(card);
            });
            
            genreSection.appendChild(performanceGrid);
            performancesSection.appendChild(genreSection);
        });
    }

    // Инициализация анимации
    initAnimation();
    
    // Инициализация кнопок
    initButtons();
});

function createPerformanceCard(performance) {
    const card = document.createElement('div');
    card.className = 'performance-card';
    
    const img = document.createElement('img');
    img.src = performance.image;
    img.alt = performance.name;
    
    const info = document.createElement('div');
    info.className = 'performance-info';
    
    const title = document.createElement('h3');
    title.textContent = performance.name;
    
    const buyButton = document.createElement('button');
    buyButton.className = 'buy-ticket';
    buyButton.textContent = 'Забронировать билет';
    buyButton.dataset.performanceId = performance.id;
    
    info.appendChild(title);
    info.appendChild(buyButton);
    
    card.appendChild(img);
    card.appendChild(info);
    
    return card;
}

function initAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.performance-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });

    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 0.6s ease forwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function initButtons() {
    const buyButtons = document.querySelectorAll('.buy-ticket');
    buyButtons.forEach(button => {
        button.onclick = function(e) {
            e.preventDefault();
            const performanceId = this.dataset.performanceId;
            // Сохраняем только id спектакля
            localStorage.setItem('selectedPerformanceId', performanceId);
            window.location.replace('tickets.html');
        };
    });
} 