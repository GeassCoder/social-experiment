import { getYType, isInRange, keep2DecimalDigits, useScientificForBigNumber } from '../util.js';

function addAssetInfo (iqGroups, profileList) {
    // add group total asset
    iqGroups.forEach(group => {
        group.totalAsset = 0;
    });

    profileList.forEach(one => {
        const group = iqGroups.find(oneGroup => isInRange(one.iq, oneGroup.range));

        if (!group) {
            console.error('Should not happen!', one);
            return;
        }

        group.totalAsset += one.asset;
    });

    // add group average asset
    iqGroups.forEach(group => {
        if (group.count === 0) {
            group.averageAsset = 0;
            return;
        }

        group.averageAsset = group.totalAsset / group.count;
    });

    // add group asset percentage
    const totalAsset = iqGroups.reduce((accumulator, curr) => {
        return accumulator + curr.totalAsset;
    }, 0);

    iqGroups.forEach(group => {
        group.assetPercentage = group.totalAsset / totalAsset;
    })
}

function drawTotal (iqGroups) {
    const xValues = iqGroups.map(one => one.label);
    const yValues = iqGroups.map(one => one.totalAsset);

    const yType = getYType(yValues);

    new Chart(
        document.getElementById('total-asset-by-iq-group'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Total Asset By IQ Group'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const totalAsset = context.raw;
                                return `Total Asset: ${useScientificForBigNumber(totalAsset)}`;
                            }
                        }
                    }
                },
                scales:{
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
                        type: 'bar',
                        data: yValues
                    }
                ]
            },
        }
    );
    
}

function drawAverage (iqGroups) {
    const xValues = iqGroups.map(one => one.label);
    const yValues = iqGroups.map(one => one.averageAsset);

    const yType = getYType(yValues);

    new Chart(
        document.getElementById('average-asset-by-iq-group'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Average Asset By IQ Group'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const averageAsset = context.raw;
                                return `Average Asset: ${useScientificForBigNumber(averageAsset)}`;
                            }
                        }
                    }
                },
                scales:{
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
                        type: 'bar',
                        data: yValues
                    }
                ]
            },
        }
    );
}

function drawPercentage (iqGroups) {
    const xValues = iqGroups.map(one => one.label);
    const yValues = iqGroups.map(one => one.assetPercentage);

    new Chart(
        document.getElementById('asset-percentage-by-iq-group'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Asset Percentage By IQ Group'
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

export default function drawAssetByIqGroupChart (iqGroups, profileList) {
    // add total asset, average asset, and asset percentage to each iq group
    addAssetInfo(iqGroups, profileList);
    drawTotal(iqGroups);
    drawAverage(iqGroups);
    drawPercentage(iqGroups);
}