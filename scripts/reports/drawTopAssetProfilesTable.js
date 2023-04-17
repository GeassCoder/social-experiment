import { drawTable, addTableEventListener } from '../util.js';

export default function drawTopAssetProfilesTable(sortedProfilesByAsset, n) {
    const topProfiles = sortedProfilesByAsset.slice(n).reverse();

    const columns = [
        'id',
        'iq',
        'successRate',
        'asset',
        'history'
    ];

    const tableEl = drawTable('top-asset-profiles', columns, topProfiles, `Top ${n} Asset Profiles`);

    addTableEventListener(tableEl, topProfiles);
}