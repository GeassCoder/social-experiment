export function gaussianRandom(mean, stdev) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1]
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

export function keep2DecimalDigits(n) {
    return parseFloat(n.toFixed(2));
}

function isInRange(x, range) {
    return x >= range[0] && x < range[1];
}

function generateGroups(lower, upper, groupSize) {
    const result = [];

    // interpolate all groups
    let i = lower;
    while (i < upper) {
        result.push({
            count: 0,
            range: [i, i + groupSize],
            label: `${i}-${i + groupSize}`
        });

        i += groupSize;
    }

    return result;
}

export function getIqGroups(data) {
    const groupSize = 10;
    const lowerBound = 65;
    const upperBound = 145;

    const firstGroup = {
        count: 0,
        label: `< ${lowerBound}`,
        range: [0, lowerBound]
    };

    const lastGroup = {
        count: 0,
        label: `>= ${upperBound}`,
        range: [upperBound, Infinity]
    };

    const intermediateGroups = generateGroups(lowerBound, upperBound, groupSize);
    const groups = [firstGroup, ...intermediateGroups, lastGroup];

    // update group count
    data.forEach(one => {
        const group = groups.find(oneGroup => isInRange(one, oneGroup.range));

        if (!group) {
            console.error('Should not happen!', one);
            return;
        }

        ++group.count;
    });

    return groups;
}

export function getAssetGroups(data) {
    const groupSize = 25;
    const assets = data.map(one => one.asset);
    const maxAsset = Math.max(...assets);
    const groups = generateGroups(0, maxAsset, groupSize);
    
    // update group count
    assets.forEach(one => {
        const group = groups.find(oneGroup => isInRange(one, oneGroup.range));

        if (!group) {
            console.error('Should not happen!', one);
            return;
        }

        ++group.count;
    });

    return groups;
}