import { keep2DecimalDigits, useScientificForBigNumber } from "../util.js";

export default function showOtherAssetStats(sortedProfilesByAsset) {
    // asset: max, min, median, average
    const min = useScientificForBigNumber(sortedProfilesByAsset[0].asset);
    const max = useScientificForBigNumber(sortedProfilesByAsset[999].asset);
    const median = useScientificForBigNumber(
        (sortedProfilesByAsset[499].asset + sortedProfilesByAsset[500].asset) / 2
    );

    // total, average, total change
    const totalAsset = sortedProfilesByAsset.reduce((accumulator, current) => {
        accumulator += current.asset;
        return accumulator;
    }, 0);

    const average = useScientificForBigNumber(totalAsset / 1000);

    const totalAssetChangePercentage = keep2DecimalDigits((totalAsset / (100 * 1000) - 1) * 100);

    // thresholds of bottom 20% and top 20%
    const lowThrehold = useScientificForBigNumber(sortedProfilesByAsset[199].asset);
    const highThreshold = useScientificForBigNumber(sortedProfilesByAsset[799].asset);

    // how many ended up with more than 100
    const countOfMoreThan100 = sortedProfilesByAsset.reduce((accumulator, current) => {
        if (current.asset > 100) {
            ++accumulator;
        }

        return accumulator;
    }, 0);

    // how many ended up with bankruptcy
    const countOfBankruptcy = sortedProfilesByAsset.reduce((accumulator, current) => {
        if (current.asset === 0) {
            ++accumulator;
        }

        return accumulator;
    }, 0);

    // show stats
    const container = document.getElementById('other-asset-stats-container');
    container.innerHTML = `
<p>
    <span> Min Asset: <code>${min}</code>, </span>
    <span> Max Asset: <code>${max}</code>, </span>
    <span> Median Asset: <code>${median}</code>, </span>
    <span>Average Asset: <code>${average}</code> </span>
</p>
<p>Total Asset Change: <code>${totalAssetChangePercentage}%</code></p>
<p>
    <span>Bottom 20% Threshold: <code>${lowThrehold}</code>, </span>
    <span>Top 20% Threshold: <code>${highThreshold}</code> </span>
</p>
<p>How many people ended up with asset > 100: <code>${countOfMoreThan100}</code></p>
<p>How many people ended up with bankruptcy: <code>${countOfBankruptcy}</code></p>
    `;
}