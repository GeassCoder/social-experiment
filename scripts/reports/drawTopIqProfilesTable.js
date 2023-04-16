import { drawTabel } from '../util.js';

export default function drawTopIqProfilesTable(sortedProfilesByIq, n) {
    const topProfiles = sortedProfilesByIq.toReversed().slice(0, n);

    const columns = [
        'id',
        'iq',
        'successRate',
        'asset',
        // TODO:
        // 'history'
    ];

    drawTabel('top-iq-profiles', columns, topProfiles, `Top ${n} IQ Profiles`);
}