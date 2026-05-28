const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

function solveKnapsack(inputItems, maxWeight) {
  const sortedItems = inputItems.map((item, index) => ({ ...item, originalIndex: index }));
  const suffixProfit = new Array(sortedItems.length + 1).fill(0);

  for (let index = sortedItems.length - 1; index >= 0; index -= 1) {
    suffixProfit[index] = suffixProfit[index + 1] + sortedItems[index].profit;
  }

  let bestProfit = 0;
  let bestWeight = 0;
  let bestChoice = [];
  let nodesVisited = 0;

  function dfs(index, currentWeight, currentProfit, chosenIndices) {
    nodesVisited += 1;

    if (currentWeight > maxWeight) {
      return;
    }

    if (currentProfit > bestProfit) {
      bestProfit = currentProfit;
      bestWeight = currentWeight;
      bestChoice = chosenIndices.slice();
    }

    if (index === sortedItems.length) {
      return;
    }

    const optimisticProfit = currentProfit + suffixProfit[index];
    if (optimisticProfit <= bestProfit) {
      return;
    }

    chosenIndices.push(index);
    dfs(
      index + 1,
      currentWeight + sortedItems[index].weight,
      currentProfit + sortedItems[index].profit,
      chosenIndices,
    );
    chosenIndices.pop();

    dfs(index + 1, currentWeight, currentProfit, chosenIndices);
  }

  const startTime = process.hrtime.bigint();
  dfs(0, 0, 0, []);
  const executionTime = Number(process.hrtime.bigint() - startTime) / 1e6;

  const selectedItems = bestChoice.map((index) => sortedItems[index]);

  return {
    items: sortedItems,
    capacity: maxWeight,
    selectedItems,
    totalWeight: bestWeight,
    totalProfit: bestProfit,
    nodesVisited,
    executionTime,
  };
}

function printResult(result) {
  console.log('Daftar Barang:');
  result.items.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.name} | berat: ${item.weight} | profit: ${item.profit}`,
    );
  });

  console.log('\nKombinasi Optimal:');
  if (result.selectedItems.length === 0) {
    console.log('- Tidak ada item yang dipilih');
  } else {
    result.selectedItems.forEach((item) => {
      console.log(`- ${item.name}`);
    });
  }

  console.log(`Total Berat: ${result.totalWeight}`);
  console.log(`Total Profit Maksimum: ${result.totalProfit}`);
  console.log(`Jumlah Node yang Dikunjungi: ${result.nodesVisited}`);
  console.log(`Waktu Eksekusi: ${result.executionTime.toFixed(3)} ms`);
}

async function main() {
  const rl = readline.createInterface({ input, output });

  console.log('=== Input Data Knapsack ===');
  const capacityInput = await rl.question('Masukkan kapasitas maksimal Knapsack: ');
  const capacity = parseInt(capacityInput);

  const itemCountInput = await rl.question('Masukkan jumlah barang: ');
  const itemCount = parseInt(itemCountInput);

  const items = [];
  for (let i = 0; i < itemCount; i++) {
    console.log(`\nBarang ke-${i + 1}:`);
    const name = await rl.question('Nama barang: ');
    const weight = parseInt(await rl.question('Berat: '));
    const profit = parseInt(await rl.question('Profit: '));
    items.push({ name, weight, profit });
  }

  rl.close();

  console.log('\n--- Hasil Perhitungan ---\n');
  const result = solveKnapsack(items, capacity);
  printResult(result);
}

main().catch((err) => console.error(err));
