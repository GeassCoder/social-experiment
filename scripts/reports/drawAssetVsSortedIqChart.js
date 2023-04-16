import { keep2DecimalDigits } from '../util.js';

export default function drawAssetVsSortedIqChart (sortedProfilesByIq) {
    const xValues = sortedProfilesByIq.map(one => one.id);
    const yValues = sortedProfilesByIq.map(one => one.asset);

    new Chart(
        document.getElementById('asset-vs-sorted-iq'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Asset VS Sorted IQ'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const currentIndex = context.dataIndex;
                                const currentDataPoint = sortedProfilesByIq[currentIndex];

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