export default function drawAssetDistributionChart (assetGroups) {
    const xValues = assetGroups.map(one => one.label);
    const yValues = assetGroups.map(one => one.count);

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