// UI state and rendering for the knapsack visualizer.

// Initial state
let items = [];
let capacity = 50;

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
const statNodes = document.getElementById('statNodes');
const statPrunedW = document.getElementById('statPrunedW');
const statPrunedB = document.getElementById('statPrunedB');
const statTime = document.getElementById('statTime');

// Capacity visualizer DOM References
const barFill = document.getElementById('barFill');
const barText = document.getElementById('barText');

const logContainer = document.getElementById('logContainer');

// Scene-specific containers
const overviewSummary = document.getElementById('overviewSummary');
const overviewItemsContainer = document.getElementById('overviewItemsContainer');
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
        visualizationPanels.style.opacity = '0.3';
        visualizationPanels.style.pointerEvents = 'none';

        // Zero out metrics
        statProfit.textContent = '0';
        statWeight.textContent = `0 / ${capacity}`;
        statNodes.textContent = '0';
        statPrunedW.textContent = '0';
        statPrunedB.textContent = '0';
        statTime.textContent = '0.000 ms';
        barFill.style.width = '0%';
        barText.textContent = `0 / ${capacity} (0%)`;

        renderItemCards([]);
        document.getElementById('treeContainer').innerHTML = '';
        logContainer.innerHTML = '<div class="log-entry">Program dibatalkan: Jumlah barang kurang dari 8.</div>';
        overviewSummary.innerHTML = '';
        overviewItemsContainer.innerHTML = '';
        resultItemsContainer.innerHTML = '';

        // A scene beyond Problem Setup may be open while the problem became invalid
        if (typeof goToScene === 'function' && typeof currentSceneIndex !== 'undefined' && currentSceneIndex > 0) {
            goToScene(0);
        }
        return;
    } else {
        alertPanel.classList.remove('active');
        visualizationPanels.style.opacity = '1';
        visualizationPanels.style.pointerEvents = 'auto';
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
        // 1. Update Metrics
        statProfit.textContent = result.totalProfit;
        statWeight.textContent = `${result.totalWeight} / ${capacity}`;
        statNodes.textContent = result.nodesVisited;
        statPrunedW.textContent = result.nodesPrunedWeight;
        statPrunedB.textContent = result.nodesPrunedBound;
        statTime.textContent = `${result.executionTime.toFixed(3)} ms`;

        // 2. Capacity Visualizer
        const percentage = capacity > 0 ? Math.min(100, Math.round((result.totalWeight / capacity) * 100)) : 0;
        barFill.style.width = `${percentage}%`;
        barText.textContent = `${result.totalWeight} / ${capacity} (${percentage}%)`;

        barFill.className = 'capacity-bar-fill';
        if (percentage === 100) {
            barFill.classList.add('full');
        } else if (result.totalWeight > capacity) {
            barFill.classList.add('over');
        } else {
            barFill.classList.add('normal');
        }

        // 3. Render Item Cards
        renderItemCards(result.items, result.selectedItems);

        // 4. Render Tree
        renderTree(result.treeNodes);

        // 5. Render Logs
        renderLogs(result.executionLog);

        // 6. Render scene-specific views (overview & final result)
        renderOverview(result);
        renderResultItems(result);
    }
}

function renderOverview(result) {
    overviewSummary.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div><strong>Kapasitas Maksimal (W):</strong><br/>${capacity}</div>
            <div><strong>Jumlah Barang (n):</strong><br/>${items.length}</div>
            <div style="grid-column: 1 / -1;"><strong>Metode:</strong><br/>DFS Backtracking dengan pruning kapasitas dan pruning bound (heuristik Fractional Knapsack)</div>
        </div>
    `;

    overviewItemsContainer.innerHTML = '';
    result.items.forEach((item) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'item-card';
        cardElement.innerHTML = `
            <div>
                <div class="item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                <div class="item-details">
                    Berat: <strong>${item.weight}</strong><br>
                    Profit: <strong>${item.profit}</strong><br>
                    Ratio: <strong>${item.ratio.toFixed(2)}</strong>
                </div>
            </div>
        `;
        overviewItemsContainer.appendChild(cardElement);
    });
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

function renderLogs(logs) {
    logContainer.innerHTML = '';
    if (!logs) return;
    logs.forEach(log => {
        const el = document.createElement('div');
        el.className = 'log-entry';
        el.textContent = log;
        logContainer.appendChild(el);
    });
}

function escapeHtml(str) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
}
