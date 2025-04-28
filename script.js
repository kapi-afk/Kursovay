// Mobile menu functionality
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Search functionality
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    
    const searchContent = document.createElement('div');
    searchContent.className = 'search-content';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск спектаклей...';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'close-btn';
    
    searchContent.appendChild(searchInput);
    searchContent.appendChild(closeBtn);
    searchOverlay.appendChild(searchContent);
    document.body.appendChild(searchOverlay);
    
    // Focus the input
    searchInput.focus();
    
    // Close search overlay
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(searchOverlay);
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(searchOverlay);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Add animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all elements with fade-in-element class
    document.querySelectorAll('.fade-in-element').forEach(element => {
        observer.observe(element);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 0.5s ease-in forwards;
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

    // Burger menu functionality
    const closeMenuBtn = document.querySelector('.close-menu');
    const burgerMenu = document.querySelector('.burger-menu');

    menuBtn.addEventListener('click', () => {
        burgerMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeMenuBtn.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && burgerMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}); 