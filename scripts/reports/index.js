import drawIqDistributionChart from './drawIqDistributionChart.js';
import drawAssetDistributionChart from './drawAssetDistributionChart.js';
import drawSortedAssetChart from './drawSortedAssetChart.js';
import drawAssetVsSortedIqChart from './drawAssetVsSortedIqChart.js';
import drawAssetByIqGroupChart from './drawAssetByIqGroupChart.js';
import drawAssetByAssetGroupChart from './drawAssetByAssetGroupChart.js';
import drawTopIqProfilesTable from './drawTopIqProfilesTable.js';
import drawTopAssetProfilesTable from './drawTopAssetProfilesTable.js';

import { getIqGroups, getAssetGroups, sortBy } from '../util.js';

function createReports(profileList) {
    const iqs = profileList.map(one => one.iq);
    const iqGroups = getIqGroups(iqs);

    const assets = profileList.map(one => one.asset);
    const assetGroups = getAssetGroups(assets);

    const sortedProfilesByIq = sortBy(profileList, 'iq');
    const sortedProfilesByAsset = sortBy(profileList, 'asset');

    // basic distribution
    drawIqDistributionChart(iqGroups);
    drawAssetDistributionChart(assetGroups);

    // break down by ip group
    // total asset, average asset, asset percentage by iq group
    drawAssetByIqGroupChart(iqGroups, profileList);

    // break down by asset group
    // total asset, average asset, asset percentage, average iq by asset group
    drawAssetByAssetGroupChart(assetGroups, profileList);

    // TODO: refactor 2 functions above

    // top 20/50 iq profiles
    drawTopIqProfilesTable(sortedProfilesByIq, 20);

    // top 20/50 asset profiles
    drawTopAssetProfilesTable(sortedProfilesByAsset, 20);

    // raw asset data
    drawSortedAssetChart(sortedProfilesByAsset);
    drawAssetVsSortedIqChart(sortedProfilesByIq);

    // ??
    // allow to adjust params from UI
    // adjust styles
}

export default createReports;