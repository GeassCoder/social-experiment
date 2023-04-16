import drawIqChart from './drawIqChart.js';
import drawAssetChart from './drawAssetChart.js'
import drawAssetDistributionChart from './drawAssetDistributionChart.js'

function createReports(profileList) {
    drawIqChart(profileList);
    drawAssetDistributionChart(profileList);
    drawAssetChart(profileList);

    // top 20 iq profiles

    // top 50 iq profiles

    // top 20 asset profiles

    // top 50 iq profiles

    // average asset, total asset by iq group

    // average asset, total asset, average iq by asset group

    // ??
    // allow to adjust params from UI
}

export default createReports;