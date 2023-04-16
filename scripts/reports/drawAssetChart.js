import { keep2DecimalDigits } from '../util.js';

export default function drawAssetChart (sortedProfilesByAsset) {
    const xValues = sortedProfilesByAsset.map(one => one.id);
    const yValues = sortedProfilesByAsset.map(one => one.asset);

    new Chart(
        document.getElementById('sorted-asset'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Sorted Asset'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const currentIndex = context.dataIndex;
                                const currentDataPoint = sortedProfilesByAsset[currentIndex];

                                return `Asset: ${keep2DecimalDigits(currentDataPoint.asset)},  ` + `IQ: ${currentDataPoint.iq}`;
                            }
                        }
                    }
                },
                scales:{
                    x: {
                        display: false
                    }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'line',
                        data: yValues
                    }
                ]
            },
        }
    );
}