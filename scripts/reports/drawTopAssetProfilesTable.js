import { drawTabel } from '../util.js';

export default function drawTopAssetProfilesTable(sortedProfilesByAsset, n) {
    const topProfiles = sortedProfilesByAsset.toReversed().slice(0, n);

    const columns = [
        'id',
        'iq',
        'successRate',
        'asset',
        // TODO:
        // 'history'
    ];

    drawTabel('top-asset-profiles', columns, topProfiles, `Top ${n} Asset Profiles`);
}