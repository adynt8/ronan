document.addEventListener('DOMContentLoaded', () => {
    const calculatorPanel = document.getElementById('calculator');
    const calculateButton = document.querySelector('[data-run-analysis]');
    const statusIndicator = document.querySelector('[data-calc-status]');
    const resultTargets = ['advanced-result', 'size-comparison', 'pornstar-comparison']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if (!calculatorPanel || !calculateButton) {
        return;
    }

    let calcTimeout;

    const setCalculatingState = (isCalculating) => {
        calculatorPanel.classList.toggle('calculating', isCalculating);
        calculateButton.classList.toggle('is-calculating', isCalculating);

        if (statusIndicator) {
            statusIndicator.classList.toggle('is-active', isCalculating);
        }
    };

    calculateButton.addEventListener('click', () => {
        clearTimeout(calcTimeout);
        setCalculatingState(true);
        // Safety timeout in case calculations fail to populate
        calcTimeout = setTimeout(() => setCalculatingState(false), 5000);
    });

    const ELEMENT_NODE = window.Node ? window.Node.ELEMENT_NODE : 1;

    const revealNodes = (nodes) => {
        let index = 1;
        nodes.forEach(node => {
            if (node.nodeType !== ELEMENT_NODE) return;
            node.style.setProperty('--card-index', index);
            index += 1;
        });
        // Once new nodes arrive we can drop the calculation state
        if (nodes.length) {
            setCalculatingState(false);
        }
    };

    resultTargets.forEach(target => {
        const observer = new MutationObserver(mutations => {
            const added = [];
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => added.push(node));
            });
            if (added.length) {
                revealNodes(added);
            }
        });

        observer.observe(target, { childList: true });
    });
});
