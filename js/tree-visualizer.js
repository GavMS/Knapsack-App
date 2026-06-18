// SVG tree visualization — circular nodes, step-by-step reveal with zoom & auto-center.

let treeZoom = 1.0;
const ZOOM_STEP = 0.2;
const ZOOM_MIN  = 0.3;
const ZOOM_MAX  = 3.0;

function zoomIn()    { treeZoom = Math.min(+(treeZoom + ZOOM_STEP).toFixed(1), ZOOM_MAX); updateStepUI(); }
function zoomOut()   { treeZoom = Math.max(+(treeZoom - ZOOM_STEP).toFixed(1), ZOOM_MIN); updateStepUI(); }
function resetZoom() { treeZoom = 1.0; updateStepUI(); }
// called by the slider (value is 30–300, representing percent)
function setZoomLevel(pct) { treeZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, pct / 100)); }

// Returns {x, y} pixel coords (in zoomed space) of the latest visible node, or null.
function renderTree(treeNodes, stepCount) {
    const container = document.getElementById('treeContainer');
    container.innerHTML = '';
    if (!treeNodes || treeNodes.length === 0) return null;

    const count = (stepCount !== undefined) ? stepCount : treeNodes.length;
    const visibleIds = new Set(treeNodes.slice(0, count).map(n => n.id));

    // Build full hierarchy for stable layout across all steps
    const map = {};
    treeNodes.forEach(node => { map[node.id] = { ...node, children: [] }; });
    let root = null;
    treeNodes.forEach(node => {
        if (node.parentId == null) root = map[node.id];
        else if (map[node.parentId]) map[node.parentId].children.push(map[node.id]);
    });
    if (!root) return null;

    // Tidy tree layout computed over ALL nodes so positions stay stable
    let leafCount = 0, maxDepth = 0;
    function layout(node, depth) {
        node.depth = depth;
        if (depth > maxDepth) maxDepth = depth;
        if (node.children.length > 0) {
            node.children.forEach(c => layout(c, depth + 1));
            node.x = node.children.length === 1
                ? node.children[0].x
                : (node.children[0].x + node.children[node.children.length - 1].x) / 2;
        } else {
            node.x = leafCount++;
        }
        node.y = depth;
    }
    layout(root, 0);

    const R = 25, hS = 80, vS = 110;
    const PAD_X = 30, PAD_Y = 40;
    const svgW = Math.max(leafCount * hS + 60, 400);
    const svgH = Math.max((maxDepth + 1) * vS + 80, 200);

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width',  svgW);
    svg.setAttribute('height', svgH);
    svg.setAttribute('class',  'tree-svg');
    svg.style.cssText = `position:absolute;top:0;left:0;transform:scale(${treeZoom});transform-origin:top left;`;

    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', `translate(${PAD_X}, ${PAD_Y})`);
    svg.appendChild(g);

    // Draw edges first (so they appear behind nodes)
    treeNodes.forEach(nd => {
        if (!visibleIds.has(nd.id)) return;
        const node = map[nd.id];
        node.children.forEach(child => {
            if (!visibleIds.has(child.id)) return;

            const x1 = node.x * hS + R, y1 = node.y * vS + R;
            const x2 = child.x * hS + R, y2 = child.y * vS + R;

            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', x1); line.setAttribute('y1', y1);
            line.setAttribute('x2', x2); line.setAttribute('y2', y2);
            line.setAttribute('class', `tree-link${child.isOptimal ? ' optimal-link' : ''}`);
            g.appendChild(line);

            // Edge label: xi=1 (Ambil) or xi=0 (Lewati)
            if (child.decision !== 'Root') {
                const val = child.decision.startsWith('Ambil') ? 1 : 0;
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                const goLeft = x2 < x1;

                const edgeLbl = document.createElementNS(svgNS, 'text');
                edgeLbl.setAttribute('x', midX + (goLeft ? -6 : 6));
                edgeLbl.setAttribute('y', midY + 4);
                edgeLbl.setAttribute('text-anchor', goLeft ? 'end' : 'start');
                edgeLbl.setAttribute('class', 'edge-label');
                edgeLbl.textContent = `x${child.index}=${val}`;
                g.appendChild(edgeLbl);
            }
        });
    });

    // Draw nodes
    treeNodes.forEach(nd => {
        if (!visibleIds.has(nd.id)) return;
        const node = map[nd.id];
        const cx = node.x * hS + R, cy = node.y * vS + R;

        const gNode = document.createElementNS(svgNS, 'g');
        gNode.setAttribute('class', `tree-node ${node.status}${node.isOptimal ? ' optimal' : ''}`);

        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', R);

        const idText = document.createElementNS(svgNS, 'text');
        idText.setAttribute('x', cx);
        idText.setAttribute('y', cy + 5);
        idText.setAttribute('text-anchor', 'middle');
        idText.setAttribute('class', 'node-id-text');
        idText.textContent = node.id;

        gNode.appendChild(circle);
        gNode.appendChild(idText);

        if (node.status === 'pruned-weight' || node.status === 'pruned-bound') {
            const bText = document.createElementNS(svgNS, 'text');
            bText.setAttribute('x', cx);
            bText.setAttribute('y', cy + R + 18);
            bText.setAttribute('text-anchor', 'middle');
            bText.setAttribute('class', 'prune-marker');
            bText.textContent = 'B';
            gNode.appendChild(bText);
        }

        g.appendChild(gNode);
    });

    // Wrapper gives the container the correct scrollable area for the zoomed SVG
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `width:${svgW * treeZoom}px;height:${svgH * treeZoom}px;position:relative;`;
    wrapper.appendChild(svg);
    container.appendChild(wrapper);

    // Compute zoomed pixel position of the latest visible node for auto-centering
    const latestNode = map[treeNodes[count - 1].id];
    return {
        x: (latestNode.x * hS + R + PAD_X) * treeZoom,
        y: (latestNode.y * vS + R + PAD_Y) * treeZoom
    };
}
