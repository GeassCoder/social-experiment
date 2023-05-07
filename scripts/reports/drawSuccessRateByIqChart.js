import { getSuccessRate } from "../profiles-generator.js";


export default function drawSuccessRateByIqChart() {
    const xValues = [60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
    const yValues = xValues.map(getSuccessRate);

    new Chart(
        document.getElementById('success-rate-by-iq'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Success Rate VS IQ'
                    }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'line',
                        data: yValues,
                        fill: false,
                        // use interpolation mode
                        // cubicInterpolationMode: 'monotone',
                        // tension: 0.4
                    }
                ]
            },
        }
    );
}