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

// Add styles for search overlay
const style = document.createElement('style');
style.textContent = `
    .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .search-content {
        position: relative;
        width: 80%;
        max-width: 600px;
    }
    
    .search-content input {
        width: 100%;
        padding: 1rem;
        font-size: 1.2rem;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-bottom: 2px solid var(--accent-color);
        color: white;
    }
    
    .search-content input:focus {
        outline: none;
    }
    
    .close-btn {
        position: absolute;
        right: -40px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
    }
`; 