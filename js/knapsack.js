// Knapsack 0/1 - Node.js CLI & result printer.
// The core algorithm lives in backtracking.js; in the browser it is loaded
// as a separate <script>, in Node.js it is required below.

if (typeof require !== 'undefined' && typeof window === 'undefined') {
  var { solveKnapsack } = require('./backtracking.js');
}

function printResult(result) {
  if (!result.isValid) {
    console.log('Kesalahan: Jumlah barang minimal 8 untuk menjalankan program.');
    return;
  }

  console.log('Daftar Barang (Diurutkan berdasarkan Profit/Berat):');
  result.items.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.name} | berat: ${item.weight} | profit: ${item.profit} | ratio: ${item.ratio.toFixed(2)}`,
    );
  });

  console.log('\nKombinasi Optimal:');
  if (result.selectedItems.length === 0) {
    console.log('- Tidak ada item yang dipilih');
  } else {
    result.selectedItems.forEach((item) => {
      console.log(`- ${item.name} (berat: ${item.weight}, profit: ${item.profit})`);
    });
  }

  console.log(`Total Berat: ${result.totalWeight} / ${result.capacity}`);
  console.log(`Total Profit Maksimum: ${result.totalProfit}`);
  console.log(`Jumlah Node yang Dikunjungi: ${result.nodesVisited}`);
  console.log(`Jumlah Node Dipangkas (Berat): ${result.nodesPrunedWeight}`);
  console.log(`Jumlah Node Dipangkas (Bound): ${result.nodesPrunedBound}`);
  console.log(`Waktu Eksekusi: ${result.executionTime.toFixed(3)} ms`);
}

// Node.js CLI entrypoint
if (typeof require !== 'undefined' && require.main === module) {
  const readline = require('readline/promises');
  const { stdin: input, stdout: output } = require('process');

  async function main() {
    const rl = readline.createInterface({ input, output });

    console.log('=== Input Data Knapsack ===');
    const capacityInput = await rl.question('Masukkan kapasitas maksimal Knapsack: ');
    const capacity = parseInt(capacityInput);

    let itemCount = 0;
    while (true) {
      const itemCountInput = await rl.question('Masukkan jumlah barang (Minimal 8): ');
      itemCount = parseInt(itemCountInput);
      if (itemCount >= 8) {
        break;
      }
      console.log('Kesalahan: Jumlah barang harus minimal 8!');
    }

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
}

// Export as Node.js module if supported
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { solveKnapsack, printResult };
}
