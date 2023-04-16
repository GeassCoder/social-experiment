import { isInRange, keep2DecimalDigits } from '../util.js';

function addAssetInfo (assetGroups, profileList) {
    // add group total asset
    assetGroups.forEach(group => {
        group.totalAsset = 0;
    });

    profileList.forEach(one => {
        const group = assetGroups.find(oneGroup => isInRange(one.asset, oneGroup.range));

        if (!group) {
            console.error('Should not happen!', one);
            return;
        }

        group.totalAsset += one.asset;
    });

    // add group average asset
    assetGroups.forEach(group => {
        if (group.count === 0) {
            group.averageAsset = 0;
            return;
        }

        group.averageAsset = group.totalAsset / group.count;
    });

    // add group asset percentage
    const totalAsset = assetGroups.reduce((accumulator, curr) => {
        return accumulator + curr.totalAsset;
    }, 0);

    assetGroups.forEach(group => {
        group.assetPercentage = group.totalAsset / totalAsset;
    });

    // add group average iq
    assetGroups.forEach(group => {
        group.iq = 0;
    });

    profileList.forEach(one => {
        const group = assetGroups.find(oneGroup => isInRange(one.asset, oneGroup.range));

        if (!group) {
            console.error('Should not happen!', one);
            return;
        }

        group.iq += one.iq;
    });

    assetGroups.forEach(group => {
        if (group.count === 0) {
            group.averageIq = 0;
            return;
        }

        group.averageIq = group.iq / group.count;
    });
}

function drawTotal (assetGroups) {
    const xValues = assetGroups.map(one => one.label);
    const yValues = assetGroups.map(one => keep2DecimalDigits(one.totalAsset));

    new Chart(
        document.getElementById('total-asset-by-asset-group'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Total Asset By Asset Group'
                    }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Total Asset',
                        data: yValues
                    }
                ]
            },
        }
    );
    
}

function drawAverageAsset (assetGroups) {
    const xValues = assetGroups.map(one => one.label);
    const yValues = assetGroups.map(one => keep2DecimalDigits(one.averageAsset));

    new Chart(
        document.getElementById('average-asset-by-asset-group'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Average Asset By Asset Group'
                    }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Average Asset',
                        data: yValues
                    }
                ]
            },
        }
    );
}

function drawAverageIq (assetGroups) {
    const xValues = assetGroups.map(one => one.label);
    const yValues = assetGroups.map(one => keep2DecimalDigits(one.averageIq));

    new Chart(
        document.getElementById('average-iq-by-asset-group'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Average IQ By Asset Group'
                    }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Average IQ',
                        data: yValues
                    }
                ]
            },
        }
    );
}

function drawPercentage (assetGroups) {
    const xValues = assetGroups.map(one => one.label);
    const yValues = assetGroups.map(one => one.assetPercentage);

    new Chart(
        document.getElementById('asset-percentage-by-asset-group'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Asset Percentage By Asset Group'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const percentage = keep2DecimalDigits(context.raw * 100);
                                return `Asset Percentage: ${percentage}%`;
                            }
                        }
                    }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'pie',
                        data: yValues
                    }
                ]
            },
        }
    );
}

export default function drawAssetByAssetGroupChart (assetGroups, profileList) {
    // add total asset, average asset, asset percentage and average iq to each asset group
    addAssetInfo(assetGroups, profileList);
    drawTotal(assetGroups);
    drawAverageAsset(assetGroups);
    drawAverageIq(assetGroups);
    drawPercentage(assetGroups);
}