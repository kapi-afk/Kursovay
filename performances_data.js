
async function loadPerformancesData() {
    try {
        const response = await fetch('/data/performances.json');
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные о спектаклях');
        }
        const data = await response.json();
        return data.performances;
    } catch (error) {
        console.error('Ошибка при загрузке данных о спектаклях:', error);
        return [];
    }
}

export { loadPerformancesData }; 