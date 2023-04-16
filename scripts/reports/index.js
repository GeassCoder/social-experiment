import drawIqChart from './drawIqChart.js';
import drawAssetChart from './drawAssetChart.js'
import drawAssetDistributionChart from './drawAssetDistributionChart.js'
import { getIqGroups, getAssetGroups, sortBy } from '../util.js';

function createReports(profileList) {
    const iqs = profileList.map(one => one.iq);
    const iqGroups = getIqGroups(iqs);

    const assets = profileList.map(one => one.asset);
    const assetGroups = getAssetGroups(assets);

    const sortedProfilesByIq = sortBy(profileList, 'iq');
    const sortedProfilesByAsset = sortBy(profileList, 'asset');

    drawIqChart(iqGroups);
    drawAssetDistributionChart(assetGroups);

    drawAssetChart(sortedProfilesByAsset);
    

    // TODO:
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