// Mobile menu functionality
const menuBtn = document.querySelector('.menu-btn');
const burgerMenu = document.querySelector('.burger-menu');
const closeMenuBtn = document.querySelector('.close-menu');

// Open menu
menuBtn.addEventListener('click', () => {
    burgerMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
});

// Close menu
closeMenuBtn.addEventListener('click', () => {
    burgerMenu.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerMenu.classList.contains('active')) {
        burgerMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});