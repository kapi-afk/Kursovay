function openModal() {
    document.getElementById('imageModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.more-link[data-performance-id]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-performance-id');
            if (id) {
                localStorage.setItem('selectedPerformanceId', id);
                window.location.href = 'tickets.html';
            }
        });
    });
});