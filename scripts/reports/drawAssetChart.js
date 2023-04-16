import { keep2DecimalDigits } from '../util.js';

export default function drawAssetChart (profileList) {
    const sortedAssetsData = profileList
        .map(one => ({
            id: one.id,
            iq: one.iq,
            asset: one.asset
        }))
        .sort((a, b) => {
            return (a.asset > b.asset) ? 1 : (a.asset < b.asset) ? -1 : 0;
        });
    
    const xValues = sortedAssetsData.map(one => one.id);
    const yValues = sortedAssetsData.map(one => one.asset);

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
                                const currentDataPoint = sortedAssetsData[currentIndex];

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