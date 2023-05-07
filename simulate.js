import getProfileList from './scripts/profiles-generator.js';
import createReports from './scripts/reports/index.js';
import { keep2DecimalDigits, cleanup } from './scripts/util.js';

// how many iterations to run lifetime
const LIFETIME_TICKS = 40 * 2;

// how many people in total
const NUM_PEOPLE = 1000;

// return true with probability of p
// simulate a random event with probability p
function randomEvent(p) {
    return Math.random() < p;
}

// for one profile
function tickOne (userInputs, profile, tickId) {
    // retrieve user inputs
    const {
        pGreen,
        gainFactor,
        pRed,
        lossFactor,
        lossCap,
        useLossCap
    } = userInputs;

    // if hit red
    if (randomEvent(pRed)) {
        let loss = profile.asset * lossFactor;

        // if need to cap AND it's past the cap, then cap it
        if (useLossCap && lossCap && (loss > lossCap)) {
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
function tick (userInputs, profileList, tickId) {
    profileList.forEach((profile) => {
        // if asset is already 0, bail out for bankrupt
        if (!profile.asset) {
            return;
        }

        tickOne(userInputs, profile, tickId);
    });
}

function simulate(userInputs, profileList) {
    for (let i = 0; i < LIFETIME_TICKS; ++i) {
        tick(userInputs, profileList, i + 1);
    }
}

export default function runSimulate (userInputs) {
    // cleanup charts and tables' event listeners to keep old stuff from haunting
    cleanup();

    const profileList = getProfileList(NUM_PEOPLE);
    simulate(userInputs, profileList);
    createReports(profileList, userInputs.useHeuristicGrouping);
}