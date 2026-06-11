// Application bootstrap: wires up form/input events and the tree drag-scroll.

function init() {
    loadPreset('case1');

    addItemForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = itemNameInput.value.trim();
        const weight = parseInt(itemWeightInput.value);
        const profit = parseInt(itemProfitInput.value);

        if (name && !isNaN(weight) && !isNaN(profit)) {
            items.push({ name, weight, profit });

            itemNameInput.value = '';
            itemWeightInput.value = '';
            itemProfitInput.value = '';
            itemNameInput.focus();

            updateUI();
        }
    });

    capacityInput.addEventListener('input', function () {
        const val = parseInt(capacityInput.value);
        if (!isNaN(val) && val >= 0) {
            capacity = val;
            updateUI();
        }
    });

    setupTreeDragScroll(document.getElementById('treeScrollContainer'));
}

window.onload = init;
