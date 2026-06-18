// Application bootstrap: wires up form/input events and the tree drag-scroll.

function init() {
    goToScene(0);

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

}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.innerHTML = isDark
            ? '<span>&#9788;</span> Light'
            : '<span>&#9790;</span> Dark';
    }
    // Re-render tree so node fills update immediately
    if (lastResult) renderTree(lastResult.treeNodes, currentStep);
}

window.onload = init;
