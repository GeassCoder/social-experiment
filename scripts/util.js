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

export function isInRange(x, range) {
    return x >= range[0] && x < range[1];
}

// start from `lower`, build groups by `groupSize`, until `upper` is reached
// there is an edge case where `upper` is exactly the upper bound of the last group
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

export function getIqGroups(iqs) {
    const lowerBound = 65;
    const upperBound = 145;
    const groupSize = 10;

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
    iqs.forEach(one => {
        const group = groups.find(oneGroup => isInRange(one, oneGroup.range));

        if (!group) {
            console.error('Should not happen!', one);
            return;
        }

        ++group.count;
    });

    return groups;
}

export function getAssetGroups(assets) {
    const groupSize = 25;
    const maxAsset = Math.max(...assets);
    const groups = generateGroups(0, maxAsset, groupSize);

    // handle an edge case
    const lastGroup = groups[groups.length - 1];
    if (maxAsset == lastGroup[1]) {
        groups.push({
            count: 0,
            range: [maxAsset, maxAsset + groupSize],
            label: `${maxAsset}-${maxAsset + groupSize}`
        });
    }

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

// only make a shallow copy
export function sortBy (list ,key) {
    return list.slice().sort((a, b) => {
        return (a[key] > b[key]) ? 1 : (a[key] < b[key]) ? -1 : 0;
    });
}

export function drawTabel (id, columns, rows, title) {
    const tableEl = document.getElementById(id);

    // build table title
    const tableTitle = `<caption>${title}</caption>`;

    // build table headers
    const ths = columns
        .map((column) => `<th>${column}</th>`)
        .join('\n');

    const tableHeaders = `<tr>${ths}</tr>`;

    // build table rows
    const tableRows = rows.map((profile) => {
        const tds = columns
            .map((column) => {
                let value = profile[column];

                if (typeof value === 'number') {
                    value = keep2DecimalDigits(value);
                }

                // TODO: if value is object or array?

                return `<td>${value}</td>`;
            })
            .join('\n');

        return `<tr>${tds}</tr>`;
    }).join('\n');

    // render table
    tableEl.innerHTML = tableTitle + '\n' + tableHeaders + '\n' + tableRows;
}