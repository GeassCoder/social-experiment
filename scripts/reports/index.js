import drawIqDistributionChart from './drawIqDistributionChart.js';
import drawAssetDistributionChart from './drawAssetDistributionChart.js'
import drawSortedAssetChart from './drawSortedAssetChart.js'
import drawAssetVsSortedIqChart from './drawAssetVsSortedIqChart.js'
import drawAssetByIqGroupChart from './drawAssetByIqGroupChart.js'
import drawAssetByAssetGroupChart from './drawAssetByAssetGroupChart.js'

import { getIqGroups, getAssetGroups, sortBy } from '../util.js';

function createReports(profileList) {
    const iqs = profileList.map(one => one.iq);
    const iqGroups = getIqGroups(iqs);

    const assets = profileList.map(one => one.asset);
    const assetGroups = getAssetGroups(assets);

    const sortedProfilesByIq = sortBy(profileList, 'iq');
    const sortedProfilesByAsset = sortBy(profileList, 'asset');

    drawIqDistributionChart(iqGroups);
    drawAssetDistributionChart(assetGroups);

    // total asset, average asset, asset percentage by iq group
    drawAssetByIqGroupChart(iqGroups, profileList);

    // total asset, average asset, asset percentage, average iq by asset group
    drawAssetByAssetGroupChart(assetGroups, profileList);


    
    // top 20 iq profiles
    // top 50 iq profiles
    // drawTopIqProfilesTable()

    // top 20 asset profiles
    // top 50 iq profiles
    // drawTopAssetProfilesTable()

    drawSortedAssetChart(sortedProfilesByAsset);
    drawAssetVsSortedIqChart(sortedProfilesByIq);

    // ??
    // allow to adjust params from UI
}

export default createReports;