// Custom SVG tree visualization for the backtracking search tree.

function renderTree(treeNodes) {
    const container = document.getElementById('treeContainer');
    container.innerHTML = '';

    if (!treeNodes || treeNodes.length === 0) return;

    // Build hierarchy
    const map = {};
    treeNodes.forEach(node => {
        map[node.id] = { ...node, children: [] };
    });

    let root = null;
    treeNodes.forEach(node => {
        if (node.parentId === null || node.parentId === undefined) {
            root = map[node.id];
        } else if (map[node.parentId]) {
            map[node.parentId].children.push(map[node.id]);
        }
    });

    if (!root) return;

    // Tidy Tree Layout Algorithm
    let leafCount = 0;
    let maxDepth = 0;

    function layout(node, depth) {
        if (!node) return;
        node.depth = depth;
        if (depth > maxDepth) maxDepth = depth;

        if (node.children.length > 0) {
            node.children.forEach(child => layout(child, depth + 1));
            if (node.children.length === 1) {
                node.x = node.children[0].x;
            } else {
                node.x = (node.children[0].x + node.children[node.children.length - 1].x) / 2;
            }
        } else {
            node.x = leafCount;
            leafCount++;
        }
        node.y = depth;
    }

    layout(root, 0);

    const nodeWidth = 140;
    const nodeHeight = 55;
    const horizontalSpacing = 160;
    const verticalSpacing = 110;

    const width = leafCount * horizontalSpacing + 100;
    const height = (maxDepth + 1) * verticalSpacing + 100;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', Math.max(width, 600));
    svg.setAttribute('height', Math.max(height, 480));
    svg.setAttribute('class', 'tree-svg');

    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', `translate(50, 30)`);
    svg.appendChild(g);

    // Draw links
    treeNodes.forEach(nodeData => {
        const node = map[nodeData.id];
        node.children.forEach(child => {
            const path = document.createElementNS(svgNS, 'path');

            const startX = node.x * horizontalSpacing + nodeWidth / 2;
            const startY = node.y * verticalSpacing + nodeHeight;
            const endX = child.x * horizontalSpacing + nodeWidth / 2;
            const endY = child.y * verticalSpacing;

            const midY = startY + (endY - startY) / 2;

            // Orthogonal line
            const d = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
            path.setAttribute('d', d);
            path.setAttribute('class', `tree-link ${child.isOptimal ? 'optimal-link' : ''}`);
            g.appendChild(path);
        });
    });

    // Draw nodes
    treeNodes.forEach(nodeData => {
        const node = map[nodeData.id];
        const gNode = document.createElementNS(svgNS, 'g');
        const x = node.x * horizontalSpacing;
        const y = node.y * verticalSpacing;
        gNode.setAttribute('transform', `translate(${x}, ${y})`);
        gNode.setAttribute('class', `tree-node ${node.status} ${node.isOptimal ? 'optimal' : ''}`);

        gNode.addEventListener('click', () => {
            showNodeDetails(node);
            // Open the Node Inspector scene (index 4) when a node is selected
            if (typeof goToScene === 'function') {
                goToScene(4);
            }
        });

        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('width', nodeWidth);
        rect.setAttribute('height', nodeHeight);
        rect.setAttribute('rx', 0);
        rect.setAttribute('ry', 0);

        const text1 = document.createElementNS(svgNS, 'text');
        text1.setAttribute('x', nodeWidth / 2);
        text1.setAttribute('y', 22);
        text1.setAttribute('text-anchor', 'middle');
        text1.setAttribute('class', 'node-title');
        text1.textContent = node.decision || `Node ${node.id}`;

        const text2 = document.createElementNS(svgNS, 'text');
        text2.setAttribute('x', nodeWidth / 2);
        text2.setAttribute('y', 42);
        text2.setAttribute('text-anchor', 'middle');
        text2.setAttribute('class', 'node-subtitle');
        text2.textContent = `W:${node.weight} P:${node.profit} B:${node.bound ? node.bound.toFixed(0) : '-'}`;

        gNode.appendChild(rect);
        gNode.appendChild(text1);
        gNode.appendChild(text2);
        g.appendChild(gNode);
    });

    container.appendChild(svg);
}

function showNodeDetails(node) {
    const panel = document.getElementById('nodeDetailsPanel');
    if (!panel) return;

    let statusText = node.status.toUpperCase();
    if (node.status === 'pruned-weight') statusText = 'PRUNED (MELEBIHI KAPASITAS)';
    if (node.status === 'pruned-bound') statusText = 'PRUNED (BOUND ≤ PROFIT TERBAIK)';
    if (node.isOptimal) statusText += ' & OPTIMAL';

    panel.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px; font-size: 1.1rem; color: var(--metro-blue);">ID Node: ${node.id}</div>
        <div style="margin-bottom: 6px;"><strong>Keputusan:</strong> ${node.decision}</div>
        <div style="margin-bottom: 12px;"><strong>Status:</strong> ${statusText}</div>
        <hr style="margin: 12px 0; border: none; border-top: 2px solid var(--border-color);" />
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div><strong>Berat (W):</strong><br/>${node.weight}</div>
            <div><strong>Profit (P):</strong><br/>${node.profit}</div>
            <div style="grid-column: 1 / -1;"><strong>Nilai Bound Heuristik (Maksimal Teoritis):</strong><br/>${node.bound ? node.bound.toFixed(2) : '-'}</div>
        </div>
    `;
}

// Enable click-drag panning inside the tree scroll container.
function setupTreeDragScroll(slider) {
    let isDown = false;
    let startX;
    let startY;
    let scrollLeft;
    let scrollTop;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        startY = e.pageY - slider.offsetTop;
        scrollLeft = slider.scrollLeft;
        scrollTop = slider.scrollTop;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const y = e.pageY - slider.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        slider.scrollLeft = scrollLeft - walkX;
        slider.scrollTop = scrollTop - walkY;
    });
}
