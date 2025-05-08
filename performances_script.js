document.addEventListener('DOMContentLoaded', function() {
    // Инициализация анимации
    initAnimation();
    
    // Инициализация кнопок
    initButtons();
});

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
            
            // Ищем спектакль в данных
            const performance = performancesData.performances.find(p => p.id === performanceId);
            if (performance) {
                // Сохраняем ВЕСЬ объект спектакля
                localStorage.setItem('selectedPerformance', JSON.stringify(performance));
                // Переходим на страницу билетов
                window.location.replace('tickets.html');
            }
        };
    });
} 