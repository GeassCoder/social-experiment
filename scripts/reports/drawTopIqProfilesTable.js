import { drawTable, addTableEventListener } from '../util.js';

export default function drawTopIqProfilesTable(sortedProfilesByIq, n) {
    const topProfiles = sortedProfilesByIq.slice(n).reverse();

    const columns = [
        'id',
        'iq',
        'successRate',
        'asset',
        'history'
    ];

    const tableEl = drawTable('top-iq-profiles', columns, topProfiles, `Top ${n} IQ Profiles`);

    addTableEventListener(tableEl, topProfiles);
}