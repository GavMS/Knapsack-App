// Knapsack 0/1 Backtracking Solver - Dual environment (Node.js & Browser)

function solveKnapsack(inputItems, maxWeight) {
  // 1. Sort items by density (profit/weight) in descending order to optimize pruning
  // We keep the original index so we can map it back to the input order.
  const sortedItems = inputItems
    .map((item, index) => ({
      ...item,
      originalIndex: index,
      ratio: item.weight > 0 ? item.profit / item.weight : 0,
    }))
    .sort((a, b) => b.ratio - a.ratio);

  // 2. Fractional knapsack bound function
  function getBound(startIndex, currentWeight, currentProfit) {
    if (currentWeight >= maxWeight) return 0;

    let bound = currentProfit;
    let totalWeight = currentWeight;

    for (let i = startIndex; i < sortedItems.length; i++) {
      if (totalWeight + sortedItems[i].weight <= maxWeight) {
        totalWeight += sortedItems[i].weight;
        bound += sortedItems[i].profit;
      } else {
        const remainingCapacity = maxWeight - totalWeight;
        bound += sortedItems[i].profit * (remainingCapacity / sortedItems[i].weight);
        break;
      }
    }
    return bound;
  }

  let bestProfit = 0;
  let bestWeight = 0;
  let bestChoice = [];

  let nodesVisited = 0;
  let nodesPrunedWeight = 0;
  let nodesPrunedBound = 0;

  const treeNodes = [];
  let nodeIdCounter = 0;
  const executionLog = [];

  function addLog(msg) {
    executionLog.push(msg);
  }

  function dfs(index, currentWeight, currentProfit, chosenIndices, parentId, decisionLabel) {
    const nodeId = nodeIdCounter++;
    nodesVisited++;

    const bound = getBound(index, currentWeight, currentProfit);

    const node = {
      id: nodeId,
      parentId: parentId,
      index: index,
      decision: decisionLabel,
      weight: currentWeight,
      profit: currentProfit,
      bound: bound,
      status: 'visited',
      item: index < sortedItems.length ? sortedItems[index] : null,
      chosenIndices: [...chosenIndices]
    };
    treeNodes.push(node);

    addLog(`[Node ${nodeId}] ${decisionLabel} -> Berat: ${currentWeight}, Profit: ${currentProfit}, Bound: ${bound.toFixed(2)}`);

    if (currentWeight > maxWeight) {
      node.status = 'pruned-weight';
      nodesPrunedWeight++;
      addLog(`  -> Dipangkas: Melebihi kapasitas (${currentWeight} > ${maxWeight})`);
      return;
    }

    if (currentProfit > bestProfit) {
      bestProfit = currentProfit;
      bestWeight = currentWeight;
      bestChoice = chosenIndices.map((idx) => sortedItems[idx].originalIndex);
      node.status = 'solution';
      addLog(`  -> Solusi baru ditemukan! Profit Terbaik: ${bestProfit}`);
    }

    if (index === sortedItems.length) {
      if (node.status !== 'solution') {
        node.status = 'leaf';
      }
      addLog(`  -> Selesai evaluasi cabang (Leaf).`);
      return;
    }

    if (bound <= bestProfit) {
      node.status = 'pruned-bound';
      nodesPrunedBound++;
      addLog(`  -> Dipangkas: Heuristik Bound (${bound.toFixed(2)}) <= Profit Terbaik (${bestProfit})`);
      return;
    }

    const nextItem = sortedItems[index];

    // Branch 1: Include item (Ambil)
    chosenIndices.push(index);
    dfs(
      index + 1,
      currentWeight + nextItem.weight,
      currentProfit + nextItem.profit,
      chosenIndices,
      nodeId,
      `Ambil [${nextItem.name}]`
    );
    chosenIndices.pop();

    // Branch 2: Exclude item (Lewati)
    dfs(
      index + 1,
      currentWeight,
      currentProfit,
      chosenIndices,
      nodeId,
      `Lewati [${nextItem.name}]`
    );
  }

  let startTime, executionTime;

  if (inputItems.length >= 8) {
    if (typeof process !== 'undefined' && process.hrtime && process.hrtime.bigint) {
      startTime = process.hrtime.bigint();
      dfs(0, 0, 0, [], null, 'Root');
      executionTime = Number(process.hrtime.bigint() - startTime) / 1e6;
    } else {
      startTime = performance.now();
      dfs(0, 0, 0, [], null, 'Root');
      executionTime = performance.now() - startTime;
    }

    // Mark optimal path
    let optimalNodeId = -1;
    for (let i = treeNodes.length - 1; i >= 0; i--) {
      if (treeNodes[i].profit === bestProfit && treeNodes[i].weight === bestWeight && treeNodes[i].status === 'solution') {
        optimalNodeId = treeNodes[i].id;
        break;
      }
    }

    if (optimalNodeId !== -1) {
      let currId = optimalNodeId;
      while (currId !== null) {
        const currNode = treeNodes.find((n) => n.id === currId);
        if (currNode) {
          currNode.isOptimal = true;
          currId = currNode.parentId;
        } else {
          break;
        }
      }
    }
  } else {
    executionTime = 0;
    addLog(`Program dibatalkan: Jumlah barang kurang dari 8 (minimum n=8).`);
  }

  const selectedItems = bestChoice.map((origIdx) => inputItems[origIdx]);

  return {
    items: sortedItems, // Note: these are sorted by density
    capacity: maxWeight,
    selectedItems,
    totalWeight: bestWeight,
    totalProfit: bestProfit,
    nodesVisited,
    nodesPrunedWeight,
    nodesPrunedBound,
    executionTime,
    treeNodes,
    executionLog,
    isValid: inputItems.length >= 8,
  };
}

// Expose solver globally in browser
if (typeof window !== 'undefined') {
  window.solveKnapsack = solveKnapsack;
}

// Export as Node.js module if supported
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { solveKnapsack };
}
