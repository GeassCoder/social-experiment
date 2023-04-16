import { gaussianRandom } from './util.js'

const mean = 100;
const standardDeviation = 15;

function getIq() {
    return Math.round(gaussianRandom(mean, standardDeviation));
}

export default getIq;