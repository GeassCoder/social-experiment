import { addCloseModalListener } from './scripts/util.js';
import runSimulate from './simulate.js';
import { keep2DecimalDigits, validateField } from './scripts/util.js';

// initial values
// green dots
let pGreen = 0.8;
let gainFactor = 0.03;

// red dots
let pRed = 0.05;
let lossFactor = 0.5;
let lossFloor = 5;
let lossCap = 50;
let useLossCap = true;

// grouping option
let useHeuristicGrouping = true;

function init() {
    const paramsSection = document.querySelector('.params');
    const paramsHeader = document.getElementById('params-header');
    paramsHeader.addEventListener('click', () => {
        paramsSection.classList.toggle('expanded');
    }, false);

    // get controls
    const pGreenInput = document.getElementById('pGreen-input');
    const gainFactorInput = document.getElementById('gain-factor-input');
    const pRedInput = document.getElementById('pRed-input');
    const lossFactorInput = document.getElementById('loss-factor-input');
    const lossFloorInput = document.getElementById('loss-floor-input');
    const lossCapInput = document.getElementById('loss-cap-input');
    const useLossCapCheckbox = document.getElementById('use-loss-cap-checkbox');
    const useHeuristicGroupingCheckbox = document.getElementById('use-heuristic-grouping-checkbox');

    // set initial values to controls
    pGreenInput.value = pGreen;
    gainFactorInput.value = gainFactor;
    pRedInput.value = pRed;
    lossFactorInput.value = lossFactor;
    lossFloorInput.value = lossFloor;
    lossCapInput.value = lossCap;
    useLossCapCheckbox.checked = useLossCap;
    lossCapInput.disabled = !useLossCap;
    useHeuristicGroupingCheckbox.checked = useHeuristicGrouping;

    // get heuristic interpretation containers
    const greenOccurrences = document.getElementById('average-green-event-occurrences');
    const redOccurrences = document.getElementById('average-red-event-occurrences');

    // set heuristic interpretations
    greenOccurrences.textContent = keep2DecimalDigits(pGreen * 80);
    redOccurrences.textContent = keep2DecimalDigits(pRed * 80);

    // listen to value changes from controls
    pGreenInput.addEventListener('change', (event) => {
        pGreen = keep2DecimalDigits(event.target.value);
        event.target.value = pGreen;

        // update green event heuristic interpretation
        greenOccurrences.textContent = keep2DecimalDigits(pGreen * 80);
    });

    gainFactorInput.addEventListener('change', (event) => {
        gainFactor = keep2DecimalDigits(event.target.value);
        event.target.value = gainFactor;
    });

    pRedInput.addEventListener('change', (event) => {
        pRed = keep2DecimalDigits(event.target.value);
        event.target.value = pRed;

        // update red event heuristic interpretation
        redOccurrences.textContent = keep2DecimalDigits(pRed * 80);
    });

    lossFactorInput.addEventListener('change', (event) => {
        lossFactor = keep2DecimalDigits(event.target.value);
        event.target.value = lossFactor;
    });

    lossFloorInput.addEventListener('change', (event) => {
        lossFloor = parseInt(event.target.value, 10);
        event.target.value = lossFloor;
    });

    lossCapInput.addEventListener('change', (event) => {
        lossCap = parseInt(event.target.value, 10);
        event.target.value = lossCap;
    });

    useLossCapCheckbox.addEventListener('change', (event) => {
        // update flag
        useLossCap = event.target.checked;

        // toggle loss cap input
        lossCapInput.disabled = !useLossCap;
    });

    useHeuristicGroupingCheckbox.addEventListener('change', (event) => {
        // update flag
        useHeuristicGrouping = event.target.checked;
    });

    const validateForm = () => {
        // form validation
        const range = [0, 1];

        const validations = [
            validateField(pGreen, range, pGreenInput),
            validateField(gainFactor, range, gainFactorInput),
            validateField(pRed, range, pRedInput),
            validateField(lossFactor, range, lossFactorInput),
            // hack to include both ends of the range (1, 50)
            validateField(lossFloor, [0.9, 50.1], lossFloorInput)
        ];

        if (useLossCap) {
            validations.push(
                validateField(lossCap, [0, Infinity], lossCapInput)
            );
        }

        // if some validations failed
        if (validations.some(result => result === false)) {
            return false;
        }

        return true;
    }

    // validate form on the fly
    document.querySelector('.params form').addEventListener('change', validateForm)

    const simulateBtn = document.getElementById('simulate-btn');
    simulateBtn.addEventListener('click', (event) => {
        // validate form, bail out if failed
        if (!validateForm()) {
            return;
        }

        // run simulation
        runSimulate({
            pGreen,
            gainFactor,
            pRed,
            lossFactor,
            lossFloor,
            lossCap,
            useLossCap,
            useHeuristicGrouping
        });

        // show results
        document.querySelector('main').style.display = 'block';
    })

    // add close modal event listener
    addCloseModalListener();
}

init();