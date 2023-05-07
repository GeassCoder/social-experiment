import { keep2DecimalDigits, useScientificForBigNumber } from "../util.js";

const N = 1000;

export default function drawGiniIndexChart(sortedProfilesByAsset) {
    const indices = [...Array(N)].map((_, index) => index + 1);

    // calculate cumulative assets
    let current = 0;
    const cumulativeAssets = [];

    for (let index = 0; index < N; ++index) {
        current += sortedProfilesByAsset[index].asset;
        cumulativeAssets.push(current);
    }

    const totalAsset = cumulativeAssets[N - 1];

    // calculate evenly distributed assets
    const evenlyDistributedAssets = [];

    for (let index = 0; index < N; ++index) {
        evenlyDistributedAssets.push(totalAsset / N * (index + 1));
    }

    // calculate Gini index
    const sumCumulative = cumulativeAssets.reduce((accumulator, current) => {
        accumulator += current;
        return accumulator;
    }, 0);

    const sumEven = evenlyDistributedAssets.reduce((accumulator, current) => {
        accumulator += current;
        return accumulator;
    }, 0);

    const giniIndex = keep2DecimalDigits(1 - sumCumulative / sumEven);

    new Chart(
        document.getElementById('gini-index'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: `Gini Index: ${giniIndex}`
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return useScientificForBigNumber(context.raw);
                            }
                        }
                    }
                },
                scales:{
                    x: {
                        display: false
                    },
                    y: {
                        ticks: {
                            callback: (value) => {
                                return useScientificForBigNumber(value);
                            }
                        }
                    }
                }
            },
            data: {
                labels: indices,
                datasets: [
                    {
                        type: 'line',
                        data: evenlyDistributedAssets,
                        fill: 1,
                    },
                    {
                        type: 'line',
                        data: cumulativeAssets,
                    }
                ]
            },
        }
    );
}