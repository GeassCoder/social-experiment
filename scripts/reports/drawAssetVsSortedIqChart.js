import { getYType, keep2DecimalDigits, useScientificForBigNumber } from '../util.js';

export default function drawAssetVsSortedIqChart (sortedProfilesByIq) {
    const xValues = sortedProfilesByIq.map(one => one.id);
    const yValues = sortedProfilesByIq.map(one => one.asset);

    const yType = getYType(yValues);

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

                                return `Asset: ${useScientificForBigNumber(currentDataPoint.asset)},  ` + `IQ: ${currentDataPoint.iq}`;
                            }
                        }
                    }
                },
                scales:{
                    x: {
                        display: false
                    },
                    y: {
                        type: yType,
                        ticks: {
                            callback: (value) => {
                                if (yType === 'logarithmic') {
                                    return useScientificForBigNumber(value);
                                }

                                return keep2DecimalDigits(value);
                            }
                        }
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