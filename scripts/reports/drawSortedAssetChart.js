import { getYType, keep2DecimalDigits, useScientificForBigNumber } from '../util.js';

export default function drawSortedAssetChart (sortedProfilesByAsset) {
    const xValues = sortedProfilesByAsset.map(one => one.id);
    const yValues = sortedProfilesByAsset.map(one => one.asset);

    const yType = getYType(yValues);

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