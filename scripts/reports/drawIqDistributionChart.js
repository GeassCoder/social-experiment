export default function drawIqDistributionChart (iqGroups) {
    const xValues = iqGroups.map(one => one.label);
    const yValues = iqGroups.map(one => one.count);

    new Chart(
        document.getElementById('iq-distribution'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'IQ Distribution'
                    }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Count',
                        data: yValues
                    },
                    {
                        type: 'line',
                        data: yValues
                    }
                ]
            },
        }
    );
}