import getProfileList from './scripts/profiles-generator.js';
import createReports from './scripts/reports/index.js';
import { keep2DecimalDigits, addCloseModalListener } from './scripts/util.js';

// green dots
const pGreen = 0.8;
const gainFactor = 0.03;

// red dots
const pRed = 0.05;
const lossFactor = 0.5;
const lossCap = 100;

// how many iterations to run lifetime
const lifetimeTicks = 40 * 2;

// how many people in total
const numPeople = 1000;

// return true with probability of p
// simulate a random event with probability p
function randomEvent(p) {
    return Math.random() < p;
}

// for one profile
function tickOne (profile, tickId) {
    // if hit red
    if (randomEvent(pRed)) {
        let loss = profile.asset * lossFactor;

        // if need to cap AND it's past the cap, then cap it
        if (lossCap && (loss > lossCap)) {
            loss = lossCap;
        }

        // if asset is not enough to cover loss, just lose everything, no negative
        if (loss > profile.asset) {
            loss = profile.asset;
        }

        // deduct loss
        profile.asset -= loss;

        // log event
        profile.history.push({
            tickId,
            event: 'red',
            assetSnapshot: keep2DecimalDigits(profile.asset),
            assetDiff: -keep2DecimalDigits(loss)
        });

        // if already hit red, assume he cannot hit green
        return;
    }

    // if hit green
    if (randomEvent(pGreen)) {
        const isSuccess = randomEvent(profile.successRate);
        let gain = 0;

        // if seized opportunity successfully, then asset goes up
        if (isSuccess) {
            gain = profile.asset * gainFactor;
            profile.asset += gain;
        }

        // log event
        profile.history.push({
            tickId,
            event: 'green',
            isSuccess,
            assetSnapshot: keep2DecimalDigits(profile.asset),
            assetDiff: keep2DecimalDigits(gain)
        });

        return;
    }

    // log event
    // even there is nothing interesting happens, still log it to facilitate drawing charts later 
    profile.history.push({
        tickId,
        event: null,
        assetSnapshot: keep2DecimalDigits(profile.asset),
        assetDiff: 0
    });
}

// for all profiles
function tick (profileList, tickId) {
    profileList.forEach((profile) => {
        // if asset is already 0, bail out for bankrupt
        if (!profile.asset) {
            return;
        }

        tickOne(profile, tickId);
    });
}

function simulate(profileList) {
    for (let i = 0; i < lifetimeTicks; ++i) {
        tick(profileList, i + 1);
    }
}

const profileList = getProfileList(numPeople);
simulate(profileList);
createReports(profileList);

// add close modal event listener
addCloseModalListener();