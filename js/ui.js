// UI state and rendering for the knapsack visualizer.

// Initial state
let items = [];
let capacity = 50;

// Step-by-step tree state
let lastResult = null;
let currentStep = 1;
let totalSteps = 0;

function initSteps(treeNodes) {
    currentStep = 1;
    totalSteps = treeNodes.length;
    updateStepUI();
}

function stepForward() {
    if (currentStep < totalSteps) { currentStep++; updateStepUI(); }
}

function stepBack() {
    if (currentStep > 1) { currentStep--; updateStepUI(); }
}

function skipToEnd() {
    currentStep = totalSteps;
    updateStepUI();
}

function setZoom(value) {
    setZoomLevel(Math.round(value));
    updateStepUI();
}

const STATUS_LABEL = {
    'visited':       'Dikunjungi',
    'solution':      'Solusi Sementara',
    'pruned-weight': 'Batal (Kapasitas)',
    'pruned-bound':  'Prune (Bound)',
    'leaf':          'Daun (Leaf)',
};

function updateStepUI() {
    const indicator = document.getElementById('stepIndicator');
    const backBtn = document.getElementById('stepBackBtn');
    const nextBtn = document.getElementById('stepNextBtn');
    const statsPanel = document.getElementById('resultStatsPanel');
    const isLast = currentStep === totalSteps;

    if (indicator) indicator.textContent = `Node ${currentStep} dari ${totalSteps}`;
    if (backBtn) backBtn.disabled = currentStep === 1;
    if (nextBtn) nextBtn.disabled = isLast;
    if (statsPanel) {
        statsPanel.classList.toggle('result-stats-hidden', !isLast);
        statsPanel.classList.toggle('result-stats-visible', isLast);
    }
    const itemsPanel = document.getElementById('resultItemsPanel');
    if (itemsPanel) {
        itemsPanel.classList.toggle('result-end-hidden', !isLast);
        itemsPanel.classList.toggle('result-end-visible', isLast);
    }
    const extraStatsPanel = document.getElementById('resultExtraStatsPanel');
    if (extraStatsPanel) {
        extraStatsPanel.classList.toggle('result-stats-hidden', !isLast);
        extraStatsPanel.classList.toggle('result-stats-visible', isLast);
    }
    const resetPanel = document.getElementById('resetVisualisasiPanel');
    if (resetPanel) {
        resetPanel.classList.toggle('result-stats-hidden', !isLast);
        resetPanel.classList.toggle('result-stats-visible', isLast);
    }
    if (lastResult) {
        const pos = renderTree(lastResult.treeNodes, currentStep);
        if (pos) {
            const wrapper = document.querySelector('.tree-container-wrapper');
            if (wrapper) {
                wrapper.scrollLeft = pos.x - wrapper.clientWidth  / 2;
                wrapper.scrollTop  = pos.y - wrapper.clientHeight / 2;
            }
        }
        updateNodeInspect(lastResult, currentStep, isLast);
    }
    // Sync zoom UI
    const zoomLabel = document.getElementById('zoomLabel');
    if (zoomLabel) zoomLabel.textContent = Math.round(treeZoom * 100) + '%';
    const zoomSlider = document.getElementById('zoomSlider');
    if (zoomSlider) zoomSlider.value = Math.round(treeZoom * 100);
    // Disable skip-to-end when already at end
    const endBtn = document.getElementById('stepEndBtn');
    if (endBtn) endBtn.disabled = currentStep === totalSteps;
}

function updateNodeInspect(result, step, isLast) {
    const elWeight      = document.getElementById('inspectWeight');
    const elWeightLabel = document.getElementById('inspectWeightLabel');
    const elProfit      = document.getElementById('inspectProfit');
    const elProfitLabel = document.getElementById('inspectProfitLabel');
    const elBest        = document.getElementById('inspectBestProfit');
    const elStatus      = document.getElementById('inspectStatus');
    if (!elWeight || !elProfit || !elBest || !elStatus) return;

    if (isLast) {
        elWeightLabel.textContent = 'Berat Optimal';
        elProfitLabel.textContent = 'Profit Optimal';
        elWeight.textContent = `${result.totalWeight} / ${result.capacity}`;
        elProfit.textContent = result.totalProfit;
        elBest.textContent   = result.totalProfit;
        elStatus.textContent = 'Solusi Optimal';
        elStatus.dataset.status = 'optimal';
        return;
    }

    elWeightLabel.textContent = 'Berat Node';
    elProfitLabel.textContent = 'Profit Node';

    const node = result.treeNodes[step - 1];
    elWeight.textContent = `${node.weight} / ${result.capacity}`;
    elProfit.textContent = node.profit;

    // Best profit so far = max profit among solution nodes up to this step
    let bestSoFar = 0;
    for (let i = 0; i < step; i++) {
        if (result.treeNodes[i].status === 'solution' && result.treeNodes[i].profit > bestSoFar) {
            bestSoFar = result.treeNodes[i].profit;
        }
    }
    elBest.textContent = bestSoFar > 0 ? bestSoFar : '—';

    const statusKey = node.status;
    elStatus.textContent = STATUS_LABEL[statusKey] || statusKey;
    elStatus.dataset.status = statusKey;
}

// DOM References
const capacityInput = document.getElementById('capacityInput');
const itemNameInput = document.getElementById('itemNameInput');
const itemWeightInput = document.getElementById('itemWeightInput');
const itemProfitInput = document.getElementById('itemProfitInput');
const itemsContainer = document.getElementById('itemsContainer');
const emptyState = document.getElementById('emptyState');
const addItemForm = document.getElementById('addItemForm');

const alertPanel = document.getElementById('alertPanel');
const alertText = document.getElementById('alertText');
const visualizationPanels = document.getElementById('visualizationPanels');

// Metrics DOM References
const statProfit = document.getElementById('statProfit');
const statWeight = document.getElementById('statWeight');

// Result containers
const resultItemsContainer = document.getElementById('resultItemsContainer');
const resultEmptyState = document.getElementById('resultEmptyState');

function loadPreset(key) {
    if (presets[key]) {
        capacity = presets[key].capacity;
        items = JSON.parse(JSON.stringify(presets[key].items));
        capacityInput.value = capacity;
        updateUI();
    }
}

function clearItems() {
    items = [];
    updateUI();
}

function resetDefaults() {
    loadPreset('case1');
}

function deleteItem(index) {
    items.splice(index, 1);
    updateUI();
}

function updateUI() {
    // Check N < 8 constraint
    if (items.length < 8) {
        alertPanel.classList.add('active');
        alertText.textContent = `Jumlah barang minimal harus 8 untuk menjalankan simulasi (Saat ini: ${items.length} barang). Silakan tambah barang atau pilih preset.`;

        statProfit.textContent = '0';
        statWeight.textContent = `0 / ${capacity}`;
        renderItemCards([]);
        document.getElementById('treeContainer').innerHTML = '';
        resultItemsContainer.innerHTML = '';

        if (typeof goToScene === 'function' && typeof currentSceneIndex !== 'undefined' && currentSceneIndex > 0) {
            goToScene(0);
        }
        return;
    } else {
        alertPanel.classList.remove('active');
    }

    let result = null;
    if (typeof window.solveKnapsack === 'function') {
        // Ensure backtracking.js is loaded
        result = window.solveKnapsack(items, capacity);
    } else {
        console.error("Fungsi solveKnapsack tidak ditemukan.");
        return;
    }

    if (result && result.isValid) {
        lastResult = result;

        statProfit.textContent = result.totalProfit;
        statWeight.textContent = `${result.totalWeight} / ${capacity}`;

        const statNodes = document.getElementById('statNodesVisited');
        if (statNodes) statNodes.textContent = result.nodesVisited;
        const statTime = document.getElementById('statExecTime');
        if (statTime) statTime.textContent = result.executionTime.toFixed(3) + ' ms';

        renderItemCards(result.items, result.selectedItems);
        initSteps(result.treeNodes);
        renderResultItems(result);
        renderItemLegend(result.items);
    }
}

function renderResultItems(result) {
    resultItemsContainer.innerHTML = '';

    if (result.selectedItems.length === 0) {
        resultEmptyState.style.display = 'block';
        return;
    }
    resultEmptyState.style.display = 'none';

    result.selectedItems.forEach((item) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'item-card selected';
        cardElement.innerHTML = `
            <div>
                <div class="item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                <div class="item-details">
                    Berat: <strong>${item.weight}</strong><br>
                    Profit: <strong>${item.profit}</strong><br>
                    Ratio: <strong>${(item.profit / item.weight).toFixed(2)}</strong>
                </div>
            </div>
        `;
        resultItemsContainer.appendChild(cardElement);
    });
}

function renderItemCards(sortedItems, selectedItemsList = []) {
    itemsContainer.innerHTML = '';

    if (items.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    // We need to map back to original deletion index for the delete button
    // originalIndex in sortedItems maps to the exact index in `items` array.

    const selectedIndices = new Set();
    selectedItemsList.forEach(item => {
        selectedIndices.add(item.originalIndex); // originalIndex mapped by solver
    });

    // Use the sorted items provided by the solver, or fallback to raw items
    const displayItems = sortedItems.length > 0 ? sortedItems : items;

    displayItems.forEach((item) => {
        // Determine original index either from mapped prop or array index
        const oIndex = item.originalIndex !== undefined ? item.originalIndex : displayItems.indexOf(item);
        const isSelected = selectedIndices.has(oIndex);

        const cardElement = document.createElement('div');
        cardElement.className = `item-card${isSelected ? ' selected' : ''}`;

        cardElement.innerHTML = `
            <div>
                <div class="item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                <div class="item-details">
                    Berat: <strong>${item.weight}</strong><br>
                    Profit: <strong>${item.profit}</strong><br>
                    Ratio: <strong>${item.ratio !== undefined ? item.ratio.toFixed(2) : (item.profit/item.weight).toFixed(2)}</strong>
                </div>
            </div>
            <button type="button" class="delete-btn" onclick="deleteItem(${oIndex})" title="Hapus item">&times;</button>
        `;
        itemsContainer.appendChild(cardElement);
    });
}

function renderItemLegend(sortedItems) {
    const grid = document.getElementById('itemLegendGrid');
    if (!grid) return;
    grid.innerHTML = '';
    sortedItems.forEach((item, i) => {
        const cell = document.createElement('div');
        cell.className = 'legend-var-item';
        cell.innerHTML = `<span class="legend-var-name">x<sub>${i + 1}</sub></span><span class="legend-var-eq">=</span><span class="legend-var-label">${escapeHtml(item.name)}</span><span class="legend-var-detail">(w=${item.weight}, p=${item.profit})</span>`;
        grid.appendChild(cell);
    });
}

function escapeHtml(str) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
}

function resetVisualisasi() {
    currentStep = 1;
    updateStepUI();
    window.scrollTo(0, 0);
}
