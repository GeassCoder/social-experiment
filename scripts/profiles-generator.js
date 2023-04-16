import getIq from './iq-generator.js';

const initAsset = 100;

// < 70 => 0.1
// > 140 => 0.9
function getSuccessRate(iq) {
    if (iq < 70) {
        return 0.1;
    };
    
    if (iq > 140) {
        return 0.9;
    }

    const k = (0.9 - 0.1) / (140 - 70);
    return k * iq - 0.7;
}

function getProfile(id) {
    const iq = getIq();
    const successRate = getSuccessRate(iq);

    return {
        id,
        iq,
        successRate,
        asset: initAsset,
        // set initial value in history
        history: [{
            tickId: 0,
            event: null,
            assetSnapshot: 100,
            assetDiff: 0
        }]
    };
}

function getProfileList(total) {
    const result = [];

    for (let i = 0; i < total; ++i) {
        const profile = getProfile('person-' + (i + 1));
        result.push(profile);
    }

    return result;
}

export default getProfileList;