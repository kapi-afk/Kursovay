document.addEventListener('DOMContentLoaded', function() {
    // Загрузка выбранного выступления
    const selectedPerformance = JSON.parse(localStorage.getItem('selectedPerformance'));
    if (selectedPerformance) {
        const performanceInfo = document.querySelector('.performance-info');
        if (performanceInfo) {
            const img = performanceInfo.querySelector('img');
            const title = performanceInfo.querySelector('h2');
            const cast = performanceInfo.querySelector('.cast');
            if (img) img.src = selectedPerformance.image;
            if (title) title.textContent = selectedPerformance.name;
            if (cast) cast.style.display = 'none'; // Скрываем блок с актерами
        }
    }

    // Русские названия месяцев и дней недели
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    // Текущая дата
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;

    // Элементы DOM
    const monthDisplay = document.querySelector('.current-month');
    const datesGrid = document.querySelector('.dates-grid');
    const prevButton = document.querySelector('.month-nav.prev');
    const nextButton = document.querySelector('.month-nav.next');
    const selectedDateDisplay = document.querySelector('.selected-date');
    const timeDropdown = document.querySelector('.time-dropdown');
    const timeSelectBtn = document.querySelector('.time-select-btn');
    const timeOptions = document.querySelector('.time-options');

    // Обработка выбора мест
    const seatingPlan = document.querySelector('.seating-plan');
    const selectedSeatsDisplay = document.querySelector('.seats-list');
    const totalPriceDisplay = document.querySelector('.price');
    const bookButton = document.querySelector('.book-button');
    let selectedSeats = [];

    // Функция для проверки, является ли день днем выступления
    function isPerformanceDay(date) {
        if (!selectedPerformance || !selectedPerformance.schedule) return false;
        
        const dayOfWeek = weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
        return selectedPerformance.schedule.days.includes(dayOfWeek);
    }

    // Функция для получения времени выступления
    function getPerformanceTime() {
        return selectedPerformance ? selectedPerformance.schedule.time : null;
    }

    // Инициализация календаря
    function initCalendar() {
        updateMonthDisplay();
        renderCalendar();
        setupEventListeners();
    }

    // Обновление отображения текущего месяца и года
    function updateMonthDisplay() {
        monthDisplay.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }

    // Обновление отображения календаря
    function renderCalendar() {
        datesGrid.innerHTML = '';
        
        // Добавляем заголовки дней недели
        weekDays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('weekday');
            dayHeader.textContent = day;
            datesGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Добавляем пустые ячейки для дней до начала месяца
        const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('date-cell', 'empty');
            datesGrid.appendChild(emptyCell);
        }

        // Добавляем дни месяца
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dateCell = document.createElement('div');
            dateCell.classList.add('date-cell');
            
            const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            if (isPastDate(cellDate)) {
                dateCell.classList.add('disabled');
            } else if (isPerformanceDay(cellDate)) {
                dateCell.classList.add('available');
                dateCell.addEventListener('click', () => selectDate(cellDate));
            } else {
                dateCell.classList.add('disabled');
            }

            if (selectedDate && isSameDate(cellDate, selectedDate)) {
                dateCell.classList.add('selected');
            }

            dateCell.textContent = day;
            datesGrid.appendChild(dateCell);
        }
    }

    // Проверка, является ли дата прошедшей
    function isPastDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    // Проверка на совпадение дат
    function isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    // Обновление отображения времени
    function updateTimeOptions() {
        if (selectedPerformance && selectedPerformance.schedule) {
            const timeOptions = document.querySelectorAll('.time-option');
            timeOptions.forEach(option => {
                const time = option.dataset.time;
                if (time === selectedPerformance.schedule.time) {
                    option.style.display = 'flex';
                } else {
                    option.style.display = 'none';
                }
            });
        }
    }

    // Выбор даты
    function selectDate(date) {
        selectedDate = date;
        renderCalendar();
        updateSelectedDateDisplay();
        updateTimeOptions();
    }

    // Обновление отображения выбранной даты
    function updateSelectedDateDisplay() {
        if (selectedDate) {
            const formattedDate = `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
            selectedDateDisplay.textContent = formattedDate;
            if (selectedTime) {
                selectedDateDisplay.textContent += ` ${selectedTime}`;
            }
        } else {
            selectedDateDisplay.textContent = 'Не выбрано';
        }
    }

    // Установка обработчиков событий
    function setupEventListeners() {
        // Обработчик для кнопки календаря
        const calendarToggle = document.querySelector('.calendar-toggle');
        const dateSelect = document.querySelector('.date-select');
        const overlay = document.querySelector('.overlay');
        const calendarSection = document.querySelector('.calendar-section');
        
        if (calendarToggle) {
            calendarToggle.addEventListener('click', () => {
                dateSelect.classList.toggle('active');
                if (dateSelect.classList.contains('active')) {
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Закрытие календаря при клике на оверлей
        if (overlay) {
            overlay.addEventListener('click', () => {
                dateSelect.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Предотвращаем закрытие при клике на сам календарь
        if (calendarSection) {
            calendarSection.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Закрытие календаря при клике вне его области
        document.addEventListener('click', (e) => {
            if (dateSelect.classList.contains('active') && 
                !calendarSection.contains(e.target) && 
                !calendarToggle.contains(e.target)) {
                dateSelect.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        prevButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateMonthDisplay();
            renderCalendar();
        });

        nextButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateMonthDisplay();
            renderCalendar();
        });

        // Обработчики для выбора времени
        const timeSelect = document.querySelector('.time-select');
        const timeSelectBtn = document.querySelector('.time-select-btn');
        const timeOptions = document.querySelectorAll('.time-option');

        if (timeSelectBtn) {
            timeSelectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                timeSelect.classList.toggle('active');
            });
        }

        if (timeOptions) {
            timeOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const time = option.dataset.time;
                    selectedTime = time;
                    
                    // Обновляем текст кнопки
                    const btnText = time === '14:00' ? 'Дневной сеанс (14:00)' : 'Вечерний сеанс (20:00)';
                    timeSelectBtn.textContent = btnText;
                    
                    // Обновляем стили выбранной опции
                    timeOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    
                    // Обновляем отображение даты и времени
                    updateSelectedDateDisplay();
                    
                    // Закрываем выпадающий список
                    timeSelect.classList.remove('active');
                });
            });
        }

        // Закрываем выпадающий список при клике вне его
        document.addEventListener('click', (e) => {
            if (timeSelect && !timeSelect.contains(e.target)) {
                timeSelect.classList.remove('active');
            }
        });
    }

    // Инициализация календаря при загрузке страницы
    initCalendar();
    updateTimeOptions();

    if (seatingPlan) {
        seatingPlan.addEventListener('click', (e) => {
            if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
                const row = e.target.dataset.row;
                const seat = e.target.dataset.seat;
                
                if (e.target.classList.contains('selected')) {
                    // Отменяем выбор места
                    e.target.classList.remove('selected');
                    selectedSeats = selectedSeats.filter(s => s.row !== row || s.seat !== seat);
                } else {
                    // Выбираем место
                    e.target.classList.add('selected');
                    selectedSeats.push({ row, seat });
                }
                
                // Обновляем отображение выбранных мест и общей стоимости
                updateSelectedSeatsDisplay();
                updateTotalPrice();
                
                // Активируем/деактивируем кнопку бронирования
                bookButton.disabled = selectedSeats.length === 0;
            }
        });
    }

    function updateSelectedSeatsDisplay() {
        if (selectedSeatsDisplay) {
            if (selectedSeats.length === 0) {
                selectedSeatsDisplay.textContent = 'Не выбрано';
            } else {
                const seatsList = selectedSeats
                    .sort((a, b) => a.row - b.row || a.seat - b.seat)
                    .map(s => `Ряд ${s.row}, Место ${s.seat}`)
                    .join('; ');
                selectedSeatsDisplay.textContent = seatsList;
            }
        }
    }

    function updateTotalPrice() {
        if (totalPriceDisplay) {
            const selectedPerformance = JSON.parse(localStorage.getItem('selectedPerformance'));
            if (selectedPerformance) {
                const totalPrice = selectedSeats.length * selectedPerformance.price;
                totalPriceDisplay.textContent = `${totalPrice} BYN.`;
            } else {
                totalPriceDisplay.textContent = '0 BYN.';
            }
        }
    }

    // Имитация занятых мест (для демонстрации)
    function setRandomOccupiedSeats() {
        const seats = document.querySelectorAll('.seat');
        const occupyCount = Math.floor(seats.length * 0.2); // Занимаем 20% мест
        
        const randomSeats = Array.from(seats)
            .sort(() => Math.random() - 0.5)
            .slice(0, occupyCount);
        
        randomSeats.forEach(seat => {
            seat.classList.add('occupied');
        });
    }

    // Вызываем функцию после загрузки страницы
    document.addEventListener('DOMContentLoaded', setRandomOccupiedSeats);
}); 