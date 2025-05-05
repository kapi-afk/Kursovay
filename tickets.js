document.addEventListener('DOMContentLoaded', function() {
    const selectedPerformance = JSON.parse(localStorage.getItem('selectedPerformance'));
    if (selectedPerformance) {
        const performanceInfo = document.querySelector('.performance-info');
        if (performanceInfo) {
            const img = performanceInfo.querySelector('img');
            const title = performanceInfo.querySelector('h2');
            if (img) img.src = selectedPerformance.image;
            if (title) title.textContent = selectedPerformance.name;
        }
    }

    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;

    const monthDisplay = document.querySelector('.current-month');
    const datesGrid = document.querySelector('.dates-grid');
    const prevButton = document.querySelector('.month-nav.prev');
    const nextButton = document.querySelector('.month-nav.next');
    const selectedDateDisplay = document.querySelector('.selected-date');
    const timeDropdown = document.querySelector('.time-dropdown');
    const timeSelectBtn = document.querySelector('.time-select-btn');
    const timeOptions = document.querySelector('.time-options');

    const seatingPlan = document.querySelector('.seating-plan');
    const selectedSeatsDisplay = document.querySelector('.seats-list');
    const totalPriceDisplay = document.querySelector('.price');
    const bookButton = document.querySelector('.book-button');
    let selectedSeats = [];

    function isPerformanceDay(date) {
        if (!selectedPerformance || !selectedPerformance.schedule) return false;
        
        const dayOfWeek = weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
        return selectedPerformance.schedule.days.includes(dayOfWeek);
    }

    function getPerformanceTime() {
        return selectedPerformance ? selectedPerformance.schedule.time : null;
    }

    function initCalendar() {
        updateMonthDisplay();
        renderCalendar();
        setupEventListeners();
    }

    function updateMonthDisplay() {
        monthDisplay.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }

    function renderCalendar() {
        datesGrid.innerHTML = '';
        
        weekDays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('weekday');
            dayHeader.textContent = day;
            datesGrid.appendChild(dayHeader);
        });

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('date-cell', 'empty');
            datesGrid.appendChild(emptyCell);
        }

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

    function isPastDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    function isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

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

    function selectDate(date) {
        selectedDate = date;
        renderCalendar();
        updateSelectedDateDisplay();
        updateTimeOptions();
    }

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

    function setupEventListeners() {
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

        if (overlay) {
            overlay.addEventListener('click', () => {
                dateSelect.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (calendarSection) {
            calendarSection.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

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
                    
                    const btnText = time === '14:00' ? 'Дневной сеанс (14:00)' : 'Вечерний сеанс (20:00)';
                    timeSelectBtn.textContent = btnText;
                    
                    timeOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    
                    updateSelectedDateDisplay();
                    
                    timeSelect.classList.remove('active');
                });
            });
        }

        document.addEventListener('click', (e) => {
            if (timeSelect && !timeSelect.contains(e.target)) {
                timeSelect.classList.remove('active');
            }
        });
    }

    initCalendar();
    updateTimeOptions();

    if (seatingPlan) {
        seatingPlan.addEventListener('click', (e) => {
            if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
                const row = e.target.dataset.row;
                const seat = e.target.dataset.seat;
                
                if (e.target.classList.contains('selected')) {
                    e.target.classList.remove('selected');
                    selectedSeats = selectedSeats.filter(s => s.row !== row || s.seat !== seat);
                } else {
                    e.target.classList.add('selected');
                    selectedSeats.push({ row, seat });
                }
                
                updateSelectedSeatsDisplay();
                updateTotalPrice();
                
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

    function setRandomOccupiedSeats() {
        const seats = document.querySelectorAll('.seat');
        const occupyCount = Math.floor(seats.length * 0.2); 
        
        const randomSeats = Array.from(seats)
            .sort(() => Math.random() - 0.5)
            .slice(0, occupyCount);
        
        randomSeats.forEach(seat => {
            seat.classList.add('occupied');
        });
    }

    document.addEventListener('DOMContentLoaded', setRandomOccupiedSeats);

    const modal = document.querySelector('.booking-modal');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.querySelector('.booking-form');

    function showModal() {
        const modalEl = document.querySelector('.booking-modal');
        const performanceName = document.querySelector('.performance-info h2').textContent;
        const selectedDateText = document.querySelector('.selected-date').textContent;

        let seatsText = 'Не выбрано';
        if (selectedSeats.length > 0) {
            seatsText = selectedSeats
                .sort((a, b) => a.row - b.row || a.seat - b.seat)
                .map(s => `Ряд ${s.row}, Место ${s.seat}`)
                .join('; ');
        }

        let totalPrice = '0 BYN.';
        const selectedPerformance = JSON.parse(localStorage.getItem('selectedPerformance'));
        if (selectedPerformance) {
            totalPrice = `${selectedSeats.length * selectedPerformance.price} BYN.`;
        }

        modalEl.querySelector('.performance-name').textContent = performanceName;
        modalEl.querySelector('.booking-date-time').textContent = selectedDateText;
        modalEl.querySelector('.selected-seats').textContent = seatsText;
        modalEl.querySelector('.total-price').textContent = totalPrice;

        modalEl.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    bookButton.addEventListener('click', showModal);
    closeModal.addEventListener('click', hideModal);
    modal.querySelector('.modal-overlay').addEventListener('click', hideModal);

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        console.log('Booking submitted:', {
            performance: document.querySelector('.performance-name').textContent,
            dateTime: document.querySelector('.booking-date-time').textContent,
            seats: document.querySelector('.selected-seats').textContent,
            price: document.querySelector('.total-price').textContent,
            email: email,
            phone: phone
        });

        alert('Бронирование успешно оформлено!');
        hideModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            hideModal();
        }
    });
}); 