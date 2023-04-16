import { getAssetGroups } from '../util.js';

export default function drawAssetDistributionChart (profileList) {
    const assetGroups = getAssetGroups(profileList);
    const xValues = assetGroups.map(one => one.label);
    const yValues = assetGroups.map(one => one.count);

    // ??
    console.log(1111, assetGroups[0]);

    new Chart(
        document.getElementById('asset-distribution'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Asset Distribution'
                    },
                    // ??
                    // tooltip: {
                    //     callbacks: {
                    //         label: (context) => {
                    //             const currentIndex = context.dataIndex;
                    //             const currentDataPoint = assetGroups[currentIndex];

                    //             return `Count: ${currentDataPoint.count}` + `Asset: ${keep2DecimalDigits(currentDataPoint.asset)}, ` + `IQ: ${currentDataPoint.iq}`;
                    //         }
                    //     }
                    // }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Count',
                        data: yValues
                    }
                ]
            },
        }
    );
}