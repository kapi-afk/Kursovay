function openModal() {
    document.getElementById('imageModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}
function initButtons() {
    const buyButtons = document.querySelectorAll('.more-link');
    
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