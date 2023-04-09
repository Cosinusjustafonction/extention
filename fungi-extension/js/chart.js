
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
            label: '# of ',
            data: [135, 111, 160, 184, 135],
            backgroundColor: [
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 3
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});