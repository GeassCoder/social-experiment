export function gaussianRandom(mean, stdev) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1]
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

export function keep2DecimalDigits(n) {
    return parseFloat(parseFloat(n).toFixed(2));
}

export function isInRange(x, range, exclusiveBothEnds = false) {
    if (exclusiveBothEnds) {
        return x > range[0] && x < range[1];
    }

    return x >= range[0] && x < range[1];
}

// start from `lower`, build groups by `groupSize`, until `upper` is reached
// there is an edge case where `upper` is exactly the upper bound of the last group
function generateGroups(lower, upper, groupSize) {
    const result = [];

    // interpolate all groups
    let i = lower;
    while (i < upper) {
        result.push({
            count: 0,
            range: [i, i + groupSize],
            label: `${i}-${i + groupSize}`
        });

        i += groupSize;
    }

    return result;
}

export function getIqGroups(iqs, useHeuristicGrouping) {
    const maxIq = Math.max(...iqs);
    const minIq = Math.min(...iqs);
    console.log('max & min IQs', maxIq, minIq);

    // only 3 heuristic groups
    if (useHeuristicGrouping) {
        const groups = [
            // low iq
            {
                count: 0,
                range: [0, 85],
                label: 'low: < 85'
            },
            // medium iq
            {
                count: 0,
                range: [85, 115],
                label: 'medium: 85 - 115'
            },
            // hight iq
            {
                count: 0,
                range: [115, Infinity],
                label: 'high: >= 115'
            }
        ];

        updateGroupCount(iqs, groups);
        return groups;
    }

    const lowerBound = 65;
    const upperBound = 145;
    const groupSize = 10;

    const firstGroup = {
        count: 0,
        label: `< ${lowerBound}`,
        range: [0, lowerBound]
    };

    const lastGroup = {
        count: 0,
        label: `>= ${upperBound}`,
        range: [upperBound, Infinity]
    };

    const intermediateGroups = generateGroups(lowerBound, upperBound, groupSize);
    const groups = [firstGroup, ...intermediateGroups, lastGroup];

    updateGroupCount(iqs, groups);
    return groups;
}

// update group count
function updateGroupCount(data, groups) {
    data.forEach(one => {
        const group = groups.find(oneGroup => isInRange(one, oneGroup.range));

        if (!group) {
            console.error('Should not happen!', one);
            return;
        }

        ++group.count;
    });
}

export function getAssetGroups(assets, useHeuristicGrouping) {
    const maxAsset = Math.max(...assets);
    const minAsset = Math.min(...assets);
    console.log('max & min assets', maxAsset, minAsset);

    // only 3 heuristic groups
    if (useHeuristicGrouping) {
        const sortedAssets = assets.sort();
        
        const lowThreahold = sortedAssets[200];
        const highThreshold = sortedAssets[800];

        const groups = [
            // low iq
            {
                count: 0,
                range: [minAsset, lowThreahold],
                label: 'bottom 20%'
            },
            // medium iq
            {
                count: 0,
                range: [lowThreahold, highThreshold],
                label: 'medium'
            },
            // hight iq
            {
                count: 0,
                range: [highThreshold, Infinity],
                label: 'top 20%'
            }
        ];

        updateGroupCount(assets, groups);
        return groups;
    }

    let groupSize = 50;

    // if the range is too big, limit to 8 groups
    if (maxAsset > 400) {
        groupSize = Math.ceil(maxAsset / 8);
    }

    const groups = generateGroups(0, maxAsset, groupSize);

    // handle an edge case
    const lastGroup = groups[groups.length - 1];
    if (maxAsset == lastGroup[1]) {
        groups.push({
            count: 0,
            range: [maxAsset, maxAsset + groupSize],
            label: `${maxAsset}-${maxAsset + groupSize}`
        });
    }

    updateGroupCount(assets, groups);
    return groups;
}

// only make a shallow copy
export function sortBy (list ,key) {
    return list.slice().sort((a, b) => {
        return (a[key] > b[key]) ? 1 : (a[key] < b[key]) ? -1 : 0;
    });
}

export function drawTable (id, columns, rows, title) {
    const tableEl = document.getElementById(id);

    // build table title
    const tableTitle = `<caption>${title}</caption>`;

    // build table headers
    const ths = columns
        .map((column) => `<th>${column}</th>`)
        .join('\n');

    const tableHeaders = `<tr>${ths}</tr>`;

    // build table rows
    const tableRows = rows.map((row) => {
        const tds = columns
            .map((column) => {
                let value = row[column];

                if (typeof value === 'number') {
                    value = keep2DecimalDigits(value);
                }

                // if value is an object, just show play icon
                if (typeof value === 'object') {
                    value = '<i>&#9658;</i>';
                    return `<td data-id="${row.id}">${value}</td>`
                }

                return `<td>${value}</td>`;
            })
            .join('\n');

        return `<tr>${tds}</tr>`;
    }).join('\n');

    // render table
    tableEl.innerHTML = tableTitle + '\n' + tableHeaders + '\n' + tableRows;

    return tableEl;
}

function openModal (modalEl) {
    modalEl.style.display = 'block';

    // prevent background from scrolling
    document.body.style.overflow = 'hidden';
}

// set up animation for progressive with linear easing effect
// https://www.chartjs.org/docs/latest/samples/animations/progressive-line.html
function getProgressiveEffect(length) {
    const totalDuration = 5000;
    const delayBetweenPoints = totalDuration / length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
            if (ctx.type !== 'data' || ctx.xStarted) {
                return 0;
            }
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
            if (ctx.type !== 'data' || ctx.yStarted) {
                return 0;
            }
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
            }
        }
    };

    return animation;
}

// https://www.chartjs.org/docs/latest/samples/utils.html#functions
const CHART_COLORS = {
    green: 'rgb(75, 192, 192)',
    red: 'rgb(255, 99, 132)',
    blue: 'rgb(54, 162, 235)'
};

function drawHistoryChart (modalEl, profile, profileIdToPlay) {
    const history = profile.history;
    const xValues = history.map(one => one.tickId);
    const yValues = history.map(one => keep2DecimalDigits(one.assetSnapshot));

    const animation = getProgressiveEffect(yValues.length);

    new Chart(
        modalEl.querySelector('.modal-content canvas'),
        {
            options: {
                animation,
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: `History for Profile-${profileIdToPlay}`
                    },
                    subtitle: {
                        display: true,
                        text: `IQ: ${profile.iq}, Success Rate: ${keep2DecimalDigits(profile.successRate)}`,
                        padding: {
                            bottom: 10
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const currentIndex = context.dataIndex;
                                const currentDataPoint = history[currentIndex];

                                return `Asset: ${keep2DecimalDigits(currentDataPoint.assetSnapshot)},  ` + `Change: ${currentDataPoint.assetDiff}`;
                            },
                            labelColor: (context) => {
                                const currentIndex = context.dataIndex;
                                const currentDataPoint = history[currentIndex];
                                
                                let backgroundColor = CHART_COLORS.blue;
                                if (currentDataPoint.assetDiff > 0) {
                                    backgroundColor = CHART_COLORS.green;
                                } else if (currentDataPoint.assetDiff < 0) {
                                    backgroundColor = CHART_COLORS.red;
                                }

                                return {
                                    backgroundColor
                                };
                            },
                        }
                    }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'line',
                        data: yValues,
                        // borderColor: CHART_COLORS.red,
                        backgroundColor: (context) => {
                            if (context.type === 'dataset') {
                                return;
                            }

                            const currentIndex = context.dataIndex;
                            const currentDataPoint = history[currentIndex];

                            if (!currentDataPoint) {
                                console.error('Should not happen');
                            }

                            if (currentDataPoint.event === 'green') {
                                return CHART_COLORS.green;
                            }
                            
                            if (currentDataPoint.event === 'red') {
                                return CHART_COLORS.red;
                            }

                            return CHART_COLORS.blue;
                        },
                        pointStyle: 'circle',
                        pointRadius: (context) => {
                            if (context.type === 'dataset') {
                                return;
                            }

                            const currentIndex = context.dataIndex;
                            const currentDataPoint = history[currentIndex];

                            if (!currentDataPoint) {
                                console.error('Should not happen');
                            }

                            if (currentDataPoint.event === 'green') {
                                return 5;
                            }

                            if (currentDataPoint.event === 'red') {
                                return 10;
                            }

                            return 2;
                        },
                    }
                ]
            },
        }
    );
}

const tableListners = [];

export function addTableEventListener (tableEl, topProfiles) {
    // define listener
    const tableListener = (event) => {
        const playTd = event.target.closest('[data-id]');
        const profileIdToPlay = playTd?.dataset.id;

        // if click is not on play button, bail out
        if (!profileIdToPlay) {
            return;
        }

        const profileToPlay = topProfiles.find((profile) => profile.id === profileIdToPlay);

        if (!profileToPlay?.history) {
            console.error('Should not happen.', profileIdToPlay, profileToPlay);
        }

        // draw chart in modal
        const modalEl = document.getElementById('modal');
        drawHistoryChart(modalEl, profileToPlay, profileIdToPlay);

        // open modal
        openModal(modalEl);
    };

    // add listener
    tableEl.addEventListener('click', tableListener);
    
    // have to keep track of all the added listeners so that we can clean up later
    tableListners.push({
        tableEl,
        tableListener
    });
}

export function addCloseModalListener() {
    const modalEl = document.getElementById('modal');
    const modalCloseBtn = modalEl.querySelector('.close');
    const modalContent = modalEl.querySelector('.modal-content');
    modalCloseBtn?.addEventListener('click', () => {
        modalEl.style.display = 'none';

        const chart = Chart.getChart(modalContent.querySelector('canvas'));
        chart.destroy();

        // allow body to scroll again
        document.body.style.overflow = 'auto';
    });
}

export function validateField (value, range, control) {
    const isValid = (isInRange(value, range, true));

    if (isValid) {
        control.classList.remove('invalid');
    } else {
        control.classList.add('invalid');
    }

    return isValid;
}

function cleanupCharts() {
    document.querySelectorAll('canvas').forEach((canvas) => {
        const chart = Chart.getChart(canvas);
        chart?.destroy();
    })
}

function cleanupTableListeners() {
    tableListners.forEach(({tableEl, tableListener}) => {
        tableEl.removeEventListener('click', tableListener);
    });
}

export function cleanup () {
    cleanupCharts();
    cleanupTableListeners();
}