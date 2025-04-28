document.addEventListener('DOMContentLoaded', () => {
    // Расписание выступлений
    const performanceSchedules = {
        'Крестики-нолики': { days: ['Пн', 'Ср'], time: '14:00' },
        'Оливер!': { days: ['Вт', 'Чт'], time: '20:00' },
        'Ричард 2': { days: ['Пт'], time: '20:00' },
        'Дьявол носит Prada': { days: ['Сб'], time: '14:00' },
        '101 далматинец': { days: ['Сб'], time: '20:00' },
        'Геркулес': { days: ['Вс'], time: '14:00' },
        'Пятый шаг': { days: ['Пн', 'Чт'], time: '20:00' },
        'Мой сосед Тоторо': { days: ['Вт', 'Пт'], time: '14:00' },
        'Дракула': { days: ['Ср', 'Вс'], time: '20:00' }
    };

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animation on scroll
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

    // Observe all performance cards
    document.querySelectorAll('.performance-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });

    // Add animation styles
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

    // Buy ticket button click handler
    document.querySelectorAll('.buy-ticket').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const performanceCard = this.closest('.performance-card');
            const performanceName = performanceCard.querySelector('h3').textContent;
            const performanceImage = performanceCard.querySelector('img').src;
            
            // Сохраняем информацию о выступлении в localStorage
            localStorage.setItem('selectedPerformance', JSON.stringify({
                name: performanceName,
                image: performanceImage,
                price: 30, // Цена билета в бел. рублях
                schedule: performanceSchedules[performanceName]
            }));
            
            // Перенаправляем на страницу билетов
            window.location.href = 'tickets.html';
        });
    });
}); 