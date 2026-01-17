/**
 * Completing the Square - Interactive Visualization
 *
 * A step-by-step demonstration of why "completing the square" is called that:
 * because you're literally completing a geometric square.
 */

// ============================================
// Configuration
// ============================================

const CONFIG = {
    // SVG dimensions (viewBox)
    svgWidth: 400,
    svgHeight: 400,
    padding: 50,

    // Default values
    defaultX: 140,  // Visual size of x (in pixels)
    defaultB: 8,    // The b value in x² + bx + c
    defaultC: 5,    // The c value in x² + bx + c

    // Animation durations (ms)
    animationDuration: 800,
    staggerDelay: 150,

    // Scale factor to convert b to pixels
    scaleFactor: 12,

    // Total steps
    totalSteps: 5
};

// ============================================
// State Management
// ============================================

const state = {
    currentStep: 1,
    previousStep: 0,
    bValue: CONFIG.defaultB,
    cValue: CONFIG.defaultC,
    xSize: 140,  // Match CONFIG.defaultX
    isAnimating: false,
    shapesDrawn: new Set(),
    // Step 2 interactive state (drag & drop)
    step2Completed: false,
    draggingRect: null,
    selectedRect: null,
    dragOffset: { x: 0, y: 0 },
    rect1State: { x: 0, y: 0, rotated: false },
    rect2State: { x: 0, y: 0, rotated: false },
    // Step 3 interactive state (input answer)
    step3Answer: null,
    step3Submitted: false
};

// ============================================
// Step Definitions
// ============================================

// Step definitions - messages are loaded from messages.js
const steps = [
    { id: 1, description: MESSAGES.steps[1] },
    { id: 2, description: MESSAGES.steps[2] },
    { id: 3, description: MESSAGES.steps[3] },
    { id: 4, description: MESSAGES.steps[4] },
    { id: 5, description: MESSAGES.steps[5] }
];

// ============================================
// DOM Elements
// ============================================

let elements = {};

function initElements() {
    elements = {
        svg: document.getElementById('geometrySvg'),
        shapesGroup: document.getElementById('shapesGroup'),
        equationDisplay: document.getElementById('equationDisplay'),
        stepDescription: document.getElementById('stepDescription'),
        slidersWrapper: document.getElementById('slidersWrapper'),
        bSlider: document.getElementById('bSlider'),
        bValue: document.getElementById('bValue'),
        cSlider: document.getElementById('cSlider'),
        cValue: document.getElementById('cValue'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        progressFill: document.getElementById('progressFill')
    };
}

// ============================================
// SVG Helper Functions
// ============================================

function createSvgElement(type, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', type);
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    return element;
}

function clearShapes() {
    elements.shapesGroup.innerHTML = '';
    state.shapesDrawn.clear();
}

// ============================================
// Shape Drawing Functions
// ============================================

function getScaledB() {
    return state.bValue * CONFIG.scaleFactor;
}

function getBHalf() {
    return getScaledB() / 2;
}

function drawXSquared(animate = true) {
    const size = state.xSize;
    const startX = 20;
    const startY = 20;

    const rect = createSvgElement('rect', {
        x: startX,
        y: startY,
        width: animate ? 0 : size,
        height: animate ? 0 : size,
        class: 'shape shape-x-squared',
        rx: 4
    });

    const label = createSvgElement('text', {
        x: startX + size / 2,
        y: startY + size / 2,
        class: 'shape-label',
        opacity: animate ? 0 : 1
    });
    label.textContent = 'x²';

    // Dimension labels
    const dimTop = createSvgElement('text', {
        x: startX + size / 2,
        y: startY - 8,
        class: 'dimension-label',
        opacity: animate ? 0 : 1
    });
    dimTop.textContent = 'x';

    const dimLeft = createSvgElement('text', {
        x: startX - 12,
        y: startY + size / 2,
        class: 'dimension-label',
        opacity: animate ? 0 : 1
    });
    dimLeft.textContent = 'x';

    elements.shapesGroup.appendChild(rect);
    elements.shapesGroup.appendChild(label);
    elements.shapesGroup.appendChild(dimTop);
    elements.shapesGroup.appendChild(dimLeft);

    if (animate) {
        requestAnimationFrame(() => {
            rect.style.transition = `all ${CONFIG.animationDuration}ms ease`;
            rect.setAttribute('width', size);
            rect.setAttribute('height', size);

            setTimeout(() => {
                label.style.transition = `opacity ${CONFIG.animationDuration / 2}ms ease`;
                label.setAttribute('opacity', 1);
                dimTop.style.transition = `opacity ${CONFIG.animationDuration / 2}ms ease`;
                dimTop.setAttribute('opacity', 1);
                dimLeft.style.transition = `opacity ${CONFIG.animationDuration / 2}ms ease`;
                dimLeft.setAttribute('opacity', 1);
            }, CONFIG.animationDuration / 2);
        });
    }

    state.shapesDrawn.add('xSquared');
    return { rect, label, dimTop, dimLeft };
}

function drawBxRectangle(animate = true) {
    const xSize = state.xSize;
    const bScaled = getScaledB();
    const startX = 20 + xSize;   // Position at right edge of x² square
    const startY = 20 + xSize;   // Position at bottom edge of x² square

    const rect = createSvgElement('rect', {
        x: startX,
        y: startY,
        width: animate ? 0 : bScaled,
        height: xSize,
        class: 'shape shape-bx',
        rx: 4
    });

    // Use actual b value in labels
    const bDisplay = Number.isInteger(state.bValue) ? state.bValue : state.bValue.toFixed(1);

    const label = createSvgElement('text', {
        x: startX + bScaled / 2,
        y: startY + xSize / 2,
        class: 'shape-label',
        opacity: animate ? 0 : 1
    });
    label.textContent = `${bDisplay}x`;

    const dimBottom = createSvgElement('text', {
        x: startX + bScaled / 2,
        y: startY + xSize + 15,
        class: 'dimension-label',
        opacity: animate ? 0 : 1
    });
    dimBottom.textContent = bDisplay;

    elements.shapesGroup.appendChild(rect);
    elements.shapesGroup.appendChild(label);
    elements.shapesGroup.appendChild(dimBottom);

    if (animate) {
        requestAnimationFrame(() => {
            rect.style.transition = `all ${CONFIG.animationDuration}ms ease`;
            rect.setAttribute('width', bScaled);

            setTimeout(() => {
                label.style.transition = `opacity ${CONFIG.animationDuration / 2}ms ease`;
                label.setAttribute('opacity', 1);
                dimBottom.style.transition = `opacity ${CONFIG.animationDuration / 2}ms ease`;
                dimBottom.setAttribute('opacity', 1);
            }, CONFIG.animationDuration / 2);
        });
    }

    state.shapesDrawn.add('bxRect');
    return { rect, label, dimBottom };
}

function drawSplitRectangles(animate = true) {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const bScaled = getScaledB();
    // Same position as step 2's bx rectangle (bottom-right of x² square)
    const startX = 20 + xSize;
    const startY = 20 + xSize;

    // Format display values
    const bHalfValue = state.bValue / 2;
    const bHalfDisplay = Number.isInteger(bHalfValue) ? bHalfValue : bHalfValue.toFixed(1);

    // Left half (splits the width)
    const rect1 = createSvgElement('rect', {
        x: startX,
        y: startY,
        width: bHalf,
        height: xSize,
        class: 'shape shape-bx-half',
        rx: 4
    });

    const label1 = createSvgElement('text', {
        x: startX + bHalf / 2,
        y: startY + xSize / 2,
        class: 'shape-label',
        style: 'font-size: 11px;'
    });
    label1.textContent = `${bHalfDisplay}x`;

    // Right half (with small gap to show the split)
    const rect2 = createSvgElement('rect', {
        x: startX + bHalf + 4,
        y: startY,
        width: bHalf,
        height: xSize,
        class: 'shape shape-bx-half',
        rx: 4
    });

    const label2 = createSvgElement('text', {
        x: startX + bHalf + 4 + bHalf / 2,
        y: startY + xSize / 2,
        class: 'shape-label',
        style: 'font-size: 11px;'
    });
    label2.textContent = `${bHalfDisplay}x`;

    // Dimension labels for each half
    const dimBottom1 = createSvgElement('text', {
        x: startX + bHalf / 2,
        y: startY + xSize + 15,
        class: 'dimension-label'
    });
    dimBottom1.textContent = bHalfDisplay;

    const dimBottom2 = createSvgElement('text', {
        x: startX + bHalf + 4 + bHalf / 2,
        y: startY + xSize + 15,
        class: 'dimension-label'
    });
    dimBottom2.textContent = bHalfDisplay;

    elements.shapesGroup.appendChild(rect1);
    elements.shapesGroup.appendChild(label1);
    elements.shapesGroup.appendChild(rect2);
    elements.shapesGroup.appendChild(label2);
    elements.shapesGroup.appendChild(dimBottom1);
    elements.shapesGroup.appendChild(dimBottom2);

    if (animate) {
        // Animate split from single rectangle
        rect1.style.opacity = 0;
        rect2.style.opacity = 0;
        label1.style.opacity = 0;
        label2.style.opacity = 0;
        dimBottom1.style.opacity = 0;
        dimBottom2.style.opacity = 0;

        requestAnimationFrame(() => {
            rect1.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            rect2.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            label1.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            label2.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            dimBottom1.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            dimBottom2.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;

            rect1.style.opacity = 1;
            rect2.style.opacity = 1;

            setTimeout(() => {
                label1.style.opacity = 1;
                label2.style.opacity = 1;
                dimBottom1.style.opacity = 1;
                dimBottom2.style.opacity = 1;
            }, CONFIG.animationDuration / 2);
        });
    }

    state.shapesDrawn.add('splitRects');
    return { rect1, rect2, label1, label2, dimBottom1, dimBottom2 };
}

function animateSplitTransition() {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const bScaled = getScaledB();
    const startX = 20 + xSize;
    const startY = 20 + xSize;

    // Format display values
    const bDisplay = Number.isInteger(state.bValue) ? state.bValue : state.bValue.toFixed(1);
    const bHalfValue = state.bValue / 2;
    const bHalfDisplay = Number.isInteger(bHalfValue) ? bHalfValue : bHalfValue.toFixed(1);

    // Draw x² square (static)
    drawXSquared(false);

    // Create the original bx rectangle that will be "cut"
    const originalRect = createSvgElement('rect', {
        x: startX,
        y: startY,
        width: bScaled,
        height: xSize,
        class: 'shape shape-bx',
        rx: 4
    });

    const originalLabel = createSvgElement('text', {
        x: startX + bScaled / 2,
        y: startY + xSize / 2,
        class: 'shape-label'
    });
    originalLabel.textContent = `${bDisplay}x`;

    // Create the cutting line (starts at top, will animate down)
    const cutLine = createSvgElement('line', {
        x1: startX + bHalf,
        y1: startY - 5,
        x2: startX + bHalf,
        y2: startY - 5,
        stroke: '#ef4444',
        'stroke-width': 3,
        'stroke-linecap': 'round',
        'stroke-dasharray': '6,3',
        class: 'cut-line'
    });

    // Create the two halves (start hidden, overlapping the original)
    const leftHalf = createSvgElement('rect', {
        x: startX,
        y: startY,
        width: bHalf,
        height: xSize,
        class: 'shape shape-bx-half',
        rx: 4,
        opacity: 0
    });

    const rightHalf = createSvgElement('rect', {
        x: startX + bHalf,
        y: startY,
        width: bHalf,
        height: xSize,
        class: 'shape shape-bx-half',
        rx: 4,
        opacity: 0
    });

    const label1 = createSvgElement('text', {
        x: startX + bHalf / 2,
        y: startY + xSize / 2,
        class: 'shape-label',
        style: 'font-size: 11px;',
        opacity: 0
    });
    label1.textContent = `${bHalfDisplay}x`;

    const label2 = createSvgElement('text', {
        x: startX + bHalf + bHalf / 2,
        y: startY + xSize / 2,
        class: 'shape-label',
        style: 'font-size: 11px;',
        opacity: 0
    });
    label2.textContent = `${bHalfDisplay}x`;

    // Dimension labels
    const dimBottom1 = createSvgElement('text', {
        x: startX + bHalf / 2,
        y: startY + xSize + 15,
        class: 'dimension-label',
        opacity: 0
    });
    dimBottom1.textContent = bHalfDisplay;

    const dimBottom2 = createSvgElement('text', {
        x: startX + bHalf + bHalf / 2 + 4,
        y: startY + xSize + 15,
        class: 'dimension-label',
        opacity: 0
    });
    dimBottom2.textContent = bHalfDisplay;

    // Append elements
    elements.shapesGroup.appendChild(originalRect);
    elements.shapesGroup.appendChild(originalLabel);
    elements.shapesGroup.appendChild(cutLine);
    elements.shapesGroup.appendChild(leftHalf);
    elements.shapesGroup.appendChild(rightHalf);
    elements.shapesGroup.appendChild(label1);
    elements.shapesGroup.appendChild(label2);
    elements.shapesGroup.appendChild(dimBottom1);
    elements.shapesGroup.appendChild(dimBottom2);

    // Animation sequence
    const cutDuration = CONFIG.animationDuration * 0.6;
    const splitDuration = CONFIG.animationDuration * 0.8;

    // Phase 1: Animate cutting line down through the rectangle
    requestAnimationFrame(() => {
        cutLine.style.transition = `all ${cutDuration}ms ease-in-out`;
        cutLine.setAttribute('y2', startY + xSize + 5);
    });

    // Phase 2: After cut completes, show the two halves and fade out original
    setTimeout(() => {
        // Fade out original
        originalRect.style.transition = `opacity ${splitDuration * 0.3}ms ease`;
        originalLabel.style.transition = `opacity ${splitDuration * 0.3}ms ease`;
        originalRect.style.opacity = 0;
        originalLabel.style.opacity = 0;

        // Fade out cut line
        cutLine.style.transition = `opacity ${splitDuration * 0.3}ms ease`;
        cutLine.style.opacity = 0;

        // Show the two halves
        leftHalf.style.transition = `all ${splitDuration}ms ease-out`;
        rightHalf.style.transition = `all ${splitDuration}ms ease-out`;
        leftHalf.style.opacity = 1;
        rightHalf.style.opacity = 1;

        // Animate separation (right half moves right to create gap)
        setTimeout(() => {
            rightHalf.setAttribute('x', startX + bHalf + 4);
            label2.setAttribute('x', startX + bHalf + 4 + bHalf / 2);

            // Fade in labels and dimensions
            label1.style.transition = `opacity ${splitDuration * 0.5}ms ease`;
            label2.style.transition = `opacity ${splitDuration * 0.5}ms ease`;
            dimBottom1.style.transition = `opacity ${splitDuration * 0.5}ms ease`;
            dimBottom2.style.transition = `opacity ${splitDuration * 0.5}ms ease`;

            label1.style.opacity = 1;
            label2.style.opacity = 1;
            dimBottom1.style.opacity = 1;
            dimBottom2.style.opacity = 1;

            // Phase 3: After separation, transition to interactive mode
            setTimeout(() => {
                transitionToInteractive();
            }, splitDuration * 0.6);
        }, 100);

    }, cutDuration);

    state.shapesDrawn.add('splitRects');
}

function transitionToInteractive() {
    // Clear and redraw as interactive
    clearShapes();
    drawInteractiveLShape();
}

// ============================================
// Step 2: Interactive Drag & Drop
// ============================================

function drawInteractiveLShape() {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const startX = 20;
    const startY = 20;

    // Format display values
    const bHalfValue = state.bValue / 2;
    const bHalfDisplay = Number.isInteger(bHalfValue) ? bHalfValue : bHalfValue.toFixed(1);

    // Reset interactive puzzle state
    state.step2Completed = false;
    state.selectedRect = null;

    // Initialize rectangle positions (at bottom-right of x² after split)
    const initialX = startX + xSize;
    const initialY = startY + xSize;

    state.rect1State = { x: initialX, y: initialY, rotated: false };
    state.rect2State = { x: initialX + bHalf + 4, y: initialY, rotated: false };

    // Draw x² square (static)
    const xSquare = createSvgElement('rect', {
        x: startX,
        y: startY,
        width: xSize,
        height: xSize,
        class: 'shape shape-x-squared',
        rx: 4
    });

    const xLabel = createSvgElement('text', {
        x: startX + xSize / 2,
        y: startY + xSize / 2,
        class: 'shape-label'
    });
    xLabel.textContent = 'x²';

    // Draw target zones (ghost outlines showing where to place)
    const targetRight = createSvgElement('rect', {
        x: startX + xSize,
        y: startY,
        width: bHalf,
        height: xSize,
        class: 'target-zone',
        rx: 4
    });

    const targetBottom = createSvgElement('rect', {
        x: startX,
        y: startY + xSize,
        width: xSize,
        height: bHalf,
        class: 'target-zone',
        rx: 4
    });

    // Create draggable rectangle 1
    const rect1Group = createSvgElement('g', {
        class: 'draggable-group',
        'data-rect-id': '1'
    });

    const rect1 = createSvgElement('rect', {
        x: 0,
        y: 0,
        width: bHalf,
        height: xSize,
        class: 'shape shape-bx-half draggable',
        rx: 4
    });

    const label1 = createSvgElement('text', {
        x: bHalf / 2,
        y: xSize / 2,
        class: 'shape-label',
        style: 'font-size: 11px;'
    });
    label1.textContent = `${bHalfDisplay}x`;

    rect1Group.appendChild(rect1);
    rect1Group.appendChild(label1);
    updateRectTransform(rect1Group, state.rect1State);

    // Create draggable rectangle 2
    const rect2Group = createSvgElement('g', {
        class: 'draggable-group',
        'data-rect-id': '2'
    });

    const rect2 = createSvgElement('rect', {
        x: 0,
        y: 0,
        width: bHalf,
        height: xSize,
        class: 'shape shape-bx-half draggable',
        rx: 4
    });

    const label2 = createSvgElement('text', {
        x: bHalf / 2,
        y: xSize / 2,
        class: 'shape-label',
        style: 'font-size: 11px;'
    });
    label2.textContent = `${bHalfDisplay}x`;

    rect2Group.appendChild(rect2);
    rect2Group.appendChild(label2);
    updateRectTransform(rect2Group, state.rect2State);

    // Add instruction text
    const instruction = createSvgElement('text', {
        x: 200,
        y: 360,
        class: 'instruction-text',
        'text-anchor': 'middle'
    });
    instruction.textContent = MESSAGES.feedback.step2Instruction;

    // Append all elements
    elements.shapesGroup.appendChild(targetRight);
    elements.shapesGroup.appendChild(targetBottom);
    elements.shapesGroup.appendChild(xSquare);
    elements.shapesGroup.appendChild(xLabel);
    elements.shapesGroup.appendChild(rect1Group);
    elements.shapesGroup.appendChild(rect2Group);
    elements.shapesGroup.appendChild(instruction);

    // Add event listeners for drag & drop
    setupDragListeners(rect1Group, '1');
    setupDragListeners(rect2Group, '2');

    // Store references for later
    state.rect1Group = rect1Group;
    state.rect2Group = rect2Group;

    state.shapesDrawn.add('interactiveLShape');
}

function updateRectTransform(group, rectState) {
    const xSize = state.xSize;
    const bHalf = getBHalf();

    // Always just translate - no rotation transform
    // rectState.x, rectState.y is always the visual top-left corner
    group.setAttribute('transform', `translate(${rectState.x}, ${rectState.y})`);

    // Update the rect dimensions based on rotation state
    const rect = group.querySelector('rect');
    const label = group.querySelector('text');

    if (rectState.rotated) {
        // Rotated: width = xSize, height = bHalf
        rect.setAttribute('width', xSize);
        rect.setAttribute('height', bHalf);
        label.setAttribute('x', xSize / 2);
        label.setAttribute('y', bHalf / 2);
    } else {
        // Not rotated: width = bHalf, height = xSize
        rect.setAttribute('width', bHalf);
        rect.setAttribute('height', xSize);
        label.setAttribute('x', bHalf / 2);
        label.setAttribute('y', xSize / 2);
    }
}

function setupDragListeners(group, rectId) {
    group.style.cursor = 'grab';

    group.addEventListener('mousedown', (e) => startDrag(e, rectId));
    group.addEventListener('touchstart', (e) => startDrag(e, rectId), { passive: false });

    group.addEventListener('click', (e) => {
        e.stopPropagation();
        selectRect(rectId);
    });
}

function selectRect(rectId) {
    // Deselect previous
    if (state.selectedRect) {
        const prevGroup = state.selectedRect === '1' ? state.rect1Group : state.rect2Group;
        prevGroup.querySelector('rect').classList.remove('selected');
    }

    // Select new
    state.selectedRect = rectId;
    const group = rectId === '1' ? state.rect1Group : state.rect2Group;
    group.querySelector('rect').classList.add('selected');
}

function startDrag(e, rectId) {
    e.preventDefault();

    const svg = elements.svg;
    const pt = svg.createSVGPoint();

    if (e.touches) {
        pt.x = e.touches[0].clientX;
        pt.y = e.touches[0].clientY;
    } else {
        pt.x = e.clientX;
        pt.y = e.clientY;
    }

    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    const rectState = rectId === '1' ? state.rect1State : state.rect2State;
    state.draggingRect = rectId;
    state.dragOffset = {
        x: svgP.x - rectState.x - 30, // Adjust for shapesGroup transform X
        y: svgP.y - rectState.y - 20  // Adjust for shapesGroup transform Y
    };

    const group = rectId === '1' ? state.rect1Group : state.rect2Group;
    group.style.cursor = 'grabbing';

    selectRect(rectId);
}

function handleDrag(e) {
    if (!state.draggingRect) return;

    e.preventDefault();

    const svg = elements.svg;
    const pt = svg.createSVGPoint();

    if (e.touches) {
        pt.x = e.touches[0].clientX;
        pt.y = e.touches[0].clientY;
    } else {
        pt.x = e.clientX;
        pt.y = e.clientY;
    }

    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    const rectState = state.draggingRect === '1' ? state.rect1State : state.rect2State;
    let newX = svgP.x - state.dragOffset.x - 30; // 30 is the shapesGroup transform X offset
    let newY = svgP.y - state.dragOffset.y - 20; // 20 is the shapesGroup transform Y offset

    // Get rectangle dimensions based on rotation state
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const rectWidth = rectState.rotated ? xSize : bHalf;
    const rectHeight = rectState.rotated ? bHalf : xSize;

    // Bounds checking - keep rectangle within the visible SVG area
    // The shapesGroup is at (30, 20), and viewBox is 400x400
    const minX = -25;
    const minY = -15;
    const maxX = 360 - rectWidth;
    const maxY = 370 - rectHeight;

    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    rectState.x = newX;
    rectState.y = newY;

    const group = state.draggingRect === '1' ? state.rect1Group : state.rect2Group;
    updateRectTransform(group, rectState);
}

function endDrag() {
    if (!state.draggingRect) return;

    const group = state.draggingRect === '1' ? state.rect1Group : state.rect2Group;
    group.style.cursor = 'grab';

    // Snap to target if close enough
    snapToTarget(state.draggingRect);

    state.draggingRect = null;

    // Check if puzzle is complete
    checkStep2Complete();
}

function snapToTarget(rectId) {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const startX = 20;
    const startY = 20;

    // Grid based on xSize/2
    const gridSize = xSize / 2;
    const snapThreshold = gridSize / 2; // Snap when within half a grid cell

    const rectState = rectId === '1' ? state.rect1State : state.rect2State;
    const group = rectId === '1' ? state.rect1Group : state.rect2Group;

    // Snap to nearest grid point (grid starts at startX, startY)
    const relX = rectState.x - startX;
    const relY = rectState.y - startY;

    const snappedRelX = Math.round(relX / gridSize) * gridSize;
    const snappedRelY = Math.round(relY / gridSize) * gridSize;

    // Only snap if close enough to a grid point
    const distToGridX = Math.abs(relX - snappedRelX);
    const distToGridY = Math.abs(relY - snappedRelY);

    if (distToGridX < snapThreshold && distToGridY < snapThreshold) {
        rectState.x = startX + snappedRelX;
        rectState.y = startY + snappedRelY;
        updateRectTransform(group, rectState);
        return true;
    }

    return false;
}

function rotateSelectedRect() {
    if (!state.selectedRect || state.currentStep !== 2) return;

    const rectState = state.selectedRect === '1' ? state.rect1State : state.rect2State;
    const group = state.selectedRect === '1' ? state.rect1Group : state.rect2Group;

    rectState.rotated = !rectState.rotated;
    updateRectTransform(group, rectState);

    // Re-snap after rotation
    snapToTarget(state.selectedRect);
    checkStep2Complete();
}

function checkStep2Complete() {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const startX = 20;
    const startY = 20;
    const tolerance = 5; // Small tolerance since grid snap should be exact

    // Target positions for L-shape
    // Right slot: (startX + xSize, startY) = (120, 20) - needs unrotated rect
    // Bottom slot: (startX, startY + xSize) = (20, 120) - needs rotated rect
    const rightTarget = { x: startX + xSize, y: startY };
    const bottomTarget = { x: startX, y: startY + xSize };

    // Check if rect1 is correctly placed
    const rect1AtRight = !state.rect1State.rotated &&
        Math.abs(state.rect1State.x - rightTarget.x) < tolerance &&
        Math.abs(state.rect1State.y - rightTarget.y) < tolerance;

    const rect1AtBottom = state.rect1State.rotated &&
        Math.abs(state.rect1State.x - bottomTarget.x) < tolerance &&
        Math.abs(state.rect1State.y - bottomTarget.y) < tolerance;

    // Check if rect2 is correctly placed
    const rect2AtRight = !state.rect2State.rotated &&
        Math.abs(state.rect2State.x - rightTarget.x) < tolerance &&
        Math.abs(state.rect2State.y - rightTarget.y) < tolerance;

    const rect2AtBottom = state.rect2State.rotated &&
        Math.abs(state.rect2State.x - bottomTarget.x) < tolerance &&
        Math.abs(state.rect2State.y - bottomTarget.y) < tolerance;

    // Complete if one is at right (not rotated) and other is at bottom (rotated)
    const wasCompleted = state.step2Completed;
    state.step2Completed = (rect1AtRight && rect2AtBottom) || (rect1AtBottom && rect2AtRight);

    updateNavButtons();

    if (state.step2Completed && !wasCompleted) {
        showStep2Success();
    }
}

function showStep2Success() {
    const instruction = elements.shapesGroup.querySelector('.instruction-text');
    if (instruction) {
        instruction.textContent = MESSAGES.feedback.step2Success;
        instruction.classList.add('success-text');
    }
}

function drawLShape(animate = true, showDimensions = true) {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const startX = 20;
    const startY = 20;

    // Format display values
    const bHalfValue = state.bValue / 2;
    const bHalfDisplay = Number.isInteger(bHalfValue) ? bHalfValue : bHalfValue.toFixed(1);

    // x² square (unchanged position)
    const xSquare = createSvgElement('rect', {
        x: startX,
        y: startY,
        width: xSize,
        height: xSize,
        class: 'shape shape-x-squared',
        rx: 4
    });

    const xLabel = createSvgElement('text', {
        x: startX + xSize / 2,
        y: startY + xSize / 2,
        class: 'shape-label'
    });
    xLabel.textContent = 'x²';

    // Right rectangle (b/2 × x)
    const rightRect = createSvgElement('rect', {
        x: startX + xSize,
        y: startY,
        width: bHalf,
        height: xSize,
        class: 'shape shape-bx-half',
        rx: 4
    });

    const rightLabel = createSvgElement('text', {
        x: startX + xSize + bHalf / 2,
        y: startY + xSize / 2,
        class: 'shape-label',
        style: 'font-size: 10px;'
    });
    rightLabel.textContent = `${bHalfDisplay}x`;

    // Bottom rectangle (x × b/2) - this is rotated/moved
    const bottomRect = createSvgElement('rect', {
        x: startX,
        y: startY + xSize,
        width: xSize,
        height: bHalf,
        class: 'shape shape-bx-half',
        rx: 4
    });

    const bottomLabel = createSvgElement('text', {
        x: startX + xSize / 2,
        y: startY + xSize + bHalf / 2,
        class: 'shape-label',
        style: 'font-size: 10px;'
    });
    bottomLabel.textContent = `${bHalfDisplay}x`;

    elements.shapesGroup.appendChild(xSquare);
    elements.shapesGroup.appendChild(xLabel);
    elements.shapesGroup.appendChild(rightRect);
    elements.shapesGroup.appendChild(rightLabel);
    elements.shapesGroup.appendChild(bottomRect);
    elements.shapesGroup.appendChild(bottomLabel);

    // Dimension labels (optional)
    let dimRight, dimBottom;
    if (showDimensions) {
        // Label above the right rectangle (labels its width = b/2)
        dimRight = createSvgElement('text', {
            x: startX + xSize + bHalf / 2,
            y: startY - 8,
            class: 'dimension-label'
        });
        dimRight.textContent = bHalfDisplay;

        dimBottom = createSvgElement('text', {
            x: startX - 15,
            y: startY + xSize + bHalf / 2,
            class: 'dimension-label'
        });
        dimBottom.textContent = bHalfDisplay;

        elements.shapesGroup.appendChild(dimRight);
        elements.shapesGroup.appendChild(dimBottom);
    }

    if (animate) {
        bottomRect.style.opacity = 0;
        bottomLabel.style.opacity = 0;
        if (showDimensions) {
            dimRight.style.opacity = 0;
            dimBottom.style.opacity = 0;
        }

        requestAnimationFrame(() => {
            bottomRect.style.transition = `all ${CONFIG.animationDuration}ms ease`;
            bottomLabel.style.transition = `all ${CONFIG.animationDuration}ms ease`;
            if (showDimensions) {
                dimRight.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
                dimBottom.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            }

            bottomRect.style.opacity = 1;
            bottomLabel.style.opacity = 1;
            if (showDimensions) {
                dimRight.style.opacity = 1;
                dimBottom.style.opacity = 1;
            }
        });
    }

    state.shapesDrawn.add('lShape');
    return { xSquare, rightRect, bottomRect };
}

function drawMissingSquare(animate = true) {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const startX = 20;
    const startY = 20;

    // Format display values
    const bHalfValue = state.bValue / 2;
    const bHalfSquared = bHalfValue * bHalfValue;
    const bHalfSquaredDisplay = Number.isInteger(bHalfSquared) ? bHalfSquared : bHalfSquared.toFixed(1);

    // Draw L-shape first
    drawLShape(false);

    // Missing square (dashed outline)
    const missingRect = createSvgElement('rect', {
        x: startX + xSize,
        y: startY + xSize,
        width: bHalf,
        height: bHalf,
        class: 'shape shape-missing',
        rx: 4
    });

    const missingLabel = createSvgElement('text', {
        x: startX + xSize + bHalf / 2,
        y: startY + xSize + bHalf / 2,
        class: 'shape-label dark',
        style: 'font-size: 11px; fill: #f97316;'
    });
    missingLabel.textContent = bHalfSquaredDisplay;

    // Arrow pointing to the gap
    const arrow = createSvgElement('path', {
        d: `M ${startX + xSize + bHalf + 30} ${startY + xSize + bHalf / 2}
            L ${startX + xSize + bHalf + 10} ${startY + xSize + bHalf / 2}`,
        stroke: '#f97316',
        'stroke-width': 2,
        fill: 'none',
        'marker-end': 'url(#arrowhead)'
    });

    // Add arrowhead marker
    const defs = elements.svg.querySelector('defs');
    if (!defs.querySelector('#arrowhead')) {
        const marker = createSvgElement('marker', {
            id: 'arrowhead',
            markerWidth: 10,
            markerHeight: 7,
            refX: 0,
            refY: 3.5,
            orient: 'auto'
        });
        const polygon = createSvgElement('polygon', {
            points: '0 0, 10 3.5, 0 7',
            fill: '#f97316'
        });
        marker.appendChild(polygon);
        defs.appendChild(marker);
    }

    elements.shapesGroup.appendChild(missingRect);
    elements.shapesGroup.appendChild(missingLabel);
    elements.shapesGroup.appendChild(arrow);

    if (animate) {
        missingRect.style.opacity = 0;
        missingLabel.style.opacity = 0;
        arrow.style.opacity = 0;

        requestAnimationFrame(() => {
            missingRect.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            missingLabel.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            arrow.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;

            setTimeout(() => {
                missingRect.style.opacity = 1;
                missingLabel.style.opacity = 1;
                arrow.style.opacity = 1;
            }, CONFIG.animationDuration / 2);
        });
    }

    state.shapesDrawn.add('missing');
    return { missingRect, missingLabel };
}

// ============================================
// Step 3: Interactive Area Input
// ============================================

function drawMissingSquareInteractive() {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const startX = 20;
    const startY = 20;

    // Reset step 3 state
    state.step3Answer = null;
    state.step3Submitted = false;

    // Draw L-shape first (static)
    drawLShape(false);

    // Draw dashed outline for the gap
    const missingRect = createSvgElement('rect', {
        x: startX + xSize,
        y: startY + xSize,
        width: bHalf,
        height: bHalf,
        class: 'shape shape-missing',
        rx: 4
    });

    // Question mark in the center
    const questionLabel = createSvgElement('text', {
        x: startX + xSize + bHalf / 2,
        y: startY + xSize + bHalf / 2,
        class: 'shape-label',
        style: 'font-size: 18px; fill: #ff9f43;',
        id: 'questionLabel'
    });
    questionLabel.textContent = '?';

    // Container for the user's answer square (will be updated dynamically)
    const answerSquare = createSvgElement('rect', {
        x: startX + xSize,
        y: startY + xSize,
        width: 0,
        height: 0,
        class: 'shape shape-answer',
        rx: 4,
        id: 'answerSquare'
    });

    const answerLabel = createSvgElement('text', {
        x: startX + xSize,
        y: startY + xSize,
        class: 'shape-label',
        style: 'font-size: 11px;',
        id: 'answerLabel',
        opacity: 0
    });

    elements.shapesGroup.appendChild(missingRect);
    elements.shapesGroup.appendChild(answerSquare);
    elements.shapesGroup.appendChild(answerLabel);
    elements.shapesGroup.appendChild(questionLabel);

    state.shapesDrawn.add('missingInteractive');
}

function handleAreaInput(event) {
    const value = parseFloat(event.target.value);

    if (isNaN(value) || value <= 0) {
        // Hide the answer square if invalid input
        updateAnswerSquare(null);
        state.step3Answer = null;
        return;
    }

    state.step3Answer = value;
    updateAnswerSquare(value);
}

function updateNegativeIndicator(value) {
    const indicator = document.getElementById('negativeIndicator');
    if (!indicator) return;

    if (value === null || value <= 0) {
        indicator.innerHTML = '';
        return;
    }

    const valueDisplay = Number.isInteger(value) ? value : value.toFixed(1);
    indicator.innerHTML = `<span class="operator term-negative"> − </span><span class="term term-negative">${valueDisplay}</span>`;
}

function handleAreaKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        checkStep3Answer();
    }
}

function updateAnswerSquare(area) {
    const xSize = state.xSize;
    const startX = 20;
    const startY = 20;

    const answerSquare = document.getElementById('answerSquare');
    const answerLabel = document.getElementById('answerLabel');
    const questionLabel = document.getElementById('questionLabel');

    if (!answerSquare || !answerLabel) return;

    if (area === null || area <= 0) {
        // Hide the square
        answerSquare.setAttribute('width', 0);
        answerSquare.setAttribute('height', 0);
        answerLabel.setAttribute('opacity', 0);
        if (questionLabel) questionLabel.setAttribute('opacity', 1);
        return;
    }

    // Calculate side length from area
    const sideLength = Math.sqrt(area) * CONFIG.scaleFactor;

    // Position at bottom-right of x² square
    answerSquare.setAttribute('x', startX + xSize);
    answerSquare.setAttribute('y', startY + xSize);
    answerSquare.setAttribute('width', sideLength);
    answerSquare.setAttribute('height', sideLength);

    // Update label
    const areaDisplay = Number.isInteger(area) ? area : area.toFixed(1);
    answerLabel.textContent = areaDisplay;
    answerLabel.setAttribute('x', startX + xSize + sideLength / 2);
    answerLabel.setAttribute('y', startY + xSize + sideLength / 2);
    answerLabel.setAttribute('opacity', 1);

    // Hide question mark
    if (questionLabel) questionLabel.setAttribute('opacity', 0);

    // Check if answer is correct
    const bHalf = state.bValue / 2;
    const correctArea = bHalf * bHalf;
    const isCorrect = Math.abs(area - correctArea) < 0.01;

    // Update square color based on correctness
    if (isCorrect) {
        answerSquare.classList.remove('shape-answer-wrong');
        answerSquare.classList.add('shape-answer-correct');
        state.step3Submitted = true;
        updateNavButtons();
    } else {
        answerSquare.classList.remove('shape-answer-correct');
        answerSquare.classList.add('shape-answer-wrong');
        state.step3Submitted = false;
        updateNavButtons();
    }
}

function checkStep3Answer() {
    if (state.step3Answer === null) return;

    const bHalf = state.bValue / 2;
    const correctArea = bHalf * bHalf;
    const isCorrect = Math.abs(state.step3Answer - correctArea) < 0.01;

    if (isCorrect) {
        state.step3Submitted = true;
        showStep3Success();
        updateNavButtons();
    }
}

function showStep3Success() {
    const bHalfSquared = state.bValue / 2 * state.bValue / 2;
    elements.stepDescription.textContent = MESSAGES.feedback.step3Success(bHalfSquared);

    const answerSquare = document.getElementById('answerSquare');
    if (answerSquare) {
        answerSquare.classList.add('animate-celebrate');
    }
}

function drawCompletedSquare(animate = true) {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const startX = 20;
    const startY = 20;
    const totalSize = xSize + bHalf;

    // Format display values
    const bHalfValue = state.bValue / 2;
    const bHalfDisplay = Number.isInteger(bHalfValue) ? bHalfValue : bHalfValue.toFixed(1);
    const bHalfSquared = bHalfValue * bHalfValue;
    const bHalfSquaredDisplay = Number.isInteger(bHalfSquared) ? bHalfSquared : bHalfSquared.toFixed(1);

    // Draw L-shape first (without dimension labels since we show x + b/2 instead)
    drawLShape(false, false);

    // Completed square (filled)
    const completedRect = createSvgElement('rect', {
        x: startX + xSize,
        y: startY + xSize,
        width: bHalf,
        height: bHalf,
        class: 'shape shape-completed',
        rx: 4
    });

    const completedLabel = createSvgElement('text', {
        x: startX + xSize + bHalf / 2,
        y: startY + xSize + bHalf / 2,
        class: 'shape-label',
        style: 'font-size: 11px;'
    });
    completedLabel.textContent = bHalfSquaredDisplay;

    // Outer square outline to show (x + b/2)²
    const outerSquare = createSvgElement('rect', {
        x: startX,
        y: startY,
        width: totalSize,
        height: totalSize,
        fill: 'none',
        stroke: '#50c878',
        'stroke-width': 3,
        rx: 6
    });

    // Total dimension label
    const totalDimTop = createSvgElement('text', {
        x: startX + totalSize / 2,
        y: startY - 15,
        class: 'dimension-label',
        style: 'font-weight: 600; fill: #50c878;'
    });
    totalDimTop.textContent = `x + ${bHalfDisplay}`;

    const totalDimRight = createSvgElement('text', {
        x: startX + totalSize + 20,
        y: startY + totalSize / 2,
        class: 'dimension-label',
        style: 'font-weight: 600; fill: #50c878;'
    });
    totalDimRight.textContent = `x + ${bHalfDisplay}`;

    elements.shapesGroup.appendChild(completedRect);
    elements.shapesGroup.appendChild(completedLabel);
    elements.shapesGroup.appendChild(outerSquare);
    elements.shapesGroup.appendChild(totalDimTop);
    elements.shapesGroup.appendChild(totalDimRight);

    if (animate) {
        completedRect.style.opacity = 0;
        completedRect.style.transform = 'scale(0)';
        completedRect.style.transformOrigin = 'center';
        completedLabel.style.opacity = 0;
        outerSquare.style.opacity = 0;
        totalDimTop.style.opacity = 0;
        totalDimRight.style.opacity = 0;

        requestAnimationFrame(() => {
            completedRect.style.transition = `all ${CONFIG.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
            completedLabel.style.transition = `opacity ${CONFIG.animationDuration / 2}ms ease`;
            outerSquare.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            totalDimTop.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            totalDimRight.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;

            completedRect.style.opacity = 1;
            completedRect.style.transform = 'scale(1)';

            setTimeout(() => {
                completedLabel.style.opacity = 1;
                outerSquare.style.opacity = 1;
                totalDimTop.style.opacity = 1;
                totalDimRight.style.opacity = 1;

                // Celebration animation
                outerSquare.classList.add('animate-celebrate');
            }, CONFIG.animationDuration / 2);
        });
    }

    state.shapesDrawn.add('completed');
    return { completedRect, completedLabel, outerSquare };
}

function drawFinalForm(animate = true) {
    const xSize = state.xSize;
    const bHalf = getBHalf();
    const startX = 20;
    const startY = 20;
    const totalSize = xSize + bHalf;

    // Format display values
    const bHalfValue = state.bValue / 2;
    const bHalfDisplay = Number.isInteger(bHalfValue) ? bHalfValue : bHalfValue.toFixed(1);
    const bHalfSquared = bHalfValue * bHalfValue;
    const bHalfSquaredDisplay = Number.isInteger(bHalfSquared) ? bHalfSquared : bHalfSquared.toFixed(1);

    // Draw L-shape first (without dimension labels since we show x + b/2 instead)
    drawLShape(false, false);

    // Outer square outline to show (x + b/2)²
    const outerSquare = createSvgElement('rect', {
        x: startX,
        y: startY,
        width: totalSize,
        height: totalSize,
        fill: 'none',
        stroke: '#50c878',
        'stroke-width': 3,
        rx: 6
    });

    // Total dimension labels
    const totalDimTop = createSvgElement('text', {
        x: startX + totalSize / 2,
        y: startY - 15,
        class: 'dimension-label',
        style: 'font-weight: 600; fill: #50c878;'
    });
    totalDimTop.textContent = `x + ${bHalfDisplay}`;

    const totalDimRight = createSvgElement('text', {
        x: startX + totalSize + 20,
        y: startY + totalSize / 2,
        class: 'dimension-label',
        style: 'font-weight: 600; fill: #50c878;'
    });
    totalDimRight.textContent = `x + ${bHalfDisplay}`;

    // Starting position (in the gap)
    const origX = startX + xSize;
    const origY = startY + xSize;

    // Final position (pulled out to the side)
    const movedSquareX = startX + totalSize + 70;
    const movedSquareY = startY + xSize;

    // The (b/2)² square that will animate from gap to side
    const movedRect = createSvgElement('rect', {
        x: animate ? origX : movedSquareX,
        y: animate ? origY : movedSquareY,
        width: bHalf,
        height: bHalf,
        class: 'shape shape-completed',
        rx: 4
    });

    const movedLabel = createSvgElement('text', {
        x: animate ? (origX + bHalf / 2) : (movedSquareX + bHalf / 2),
        y: animate ? (origY + bHalf / 2) : (movedSquareY + bHalf / 2),
        class: 'shape-label',
        style: 'font-size: 11px;'
    });
    movedLabel.textContent = bHalfSquaredDisplay;

    // Ghost rectangle (shows where the square was)
    const ghostRect = createSvgElement('rect', {
        x: origX,
        y: origY,
        width: bHalf,
        height: bHalf,
        class: 'shape shape-missing',
        rx: 4,
        opacity: 0
    });

    // Minus sign before the moved square
    const minusSign = createSvgElement('text', {
        x: movedSquareX - 18,
        y: movedSquareY + bHalf / 2,
        class: 'shape-label',
        style: 'font-size: 28px; fill: #ef4444; font-weight: 700;',
        opacity: 0
    });
    minusSign.textContent = '−';

    elements.shapesGroup.appendChild(outerSquare);
    elements.shapesGroup.appendChild(totalDimTop);
    elements.shapesGroup.appendChild(totalDimRight);
    elements.shapesGroup.appendChild(ghostRect);
    elements.shapesGroup.appendChild(movedRect);
    elements.shapesGroup.appendChild(movedLabel);
    elements.shapesGroup.appendChild(minusSign);

    if (animate && state.previousStep === 4) {
        // Animate the "pull out" effect
        const pullDuration = CONFIG.animationDuration * 1.2;

        requestAnimationFrame(() => {
            // Set up transitions
            movedRect.style.transition = `all ${pullDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
            movedLabel.style.transition = `all ${pullDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
            ghostRect.style.transition = `opacity ${pullDuration * 0.5}ms ease`;
            minusSign.style.transition = `opacity ${pullDuration * 0.5}ms ease`;

            // Start the pull animation after a brief delay
            setTimeout(() => {
                // Move the square out
                movedRect.setAttribute('x', movedSquareX);
                movedRect.setAttribute('y', movedSquareY);
                movedLabel.setAttribute('x', movedSquareX + bHalf / 2);
                movedLabel.setAttribute('y', movedSquareY + bHalf / 2);

                // Show the ghost (dashed outline where it was)
                ghostRect.style.opacity = 0.6;

                // Show the minus sign
                setTimeout(() => {
                    minusSign.style.opacity = 1;
                }, pullDuration * 0.4);
            }, 200);
        });
    } else if (animate) {
        // Simple fade in if not coming from step 4
        movedRect.style.opacity = 0;
        movedLabel.style.opacity = 0;
        ghostRect.style.opacity = 0;

        requestAnimationFrame(() => {
            movedRect.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            movedLabel.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            ghostRect.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;
            minusSign.style.transition = `opacity ${CONFIG.animationDuration}ms ease`;

            setTimeout(() => {
                movedRect.style.opacity = 1;
                movedLabel.style.opacity = 1;
                ghostRect.style.opacity = 0.6;
                minusSign.style.opacity = 1;
            }, 100);
        });
    } else {
        // No animation - just show final state
        ghostRect.style.opacity = 0.6;
        minusSign.style.opacity = 1;
    }

    state.shapesDrawn.add('finalForm');
    return { outerSquare, movedRect, minusSign, ghostRect };
}

// ============================================
// Step Rendering
// ============================================

function renderStep(stepNum, animate = true) {
    const stepData = steps[stepNum - 1];

    // Update text content
    elements.stepDescription.textContent = stepData.description;

    // Update equation with actual b values
    updateEquationWithValues();

    // Show/hide sliders (only visible on step 1)
    if (stepNum === 1) {
        elements.slidersWrapper.classList.remove('hidden');
    } else {
        elements.slidersWrapper.classList.add('hidden');
    }

    // Clear and redraw shapes
    clearShapes();

    // Check for special transition animations
    const isTransitionFromStep1To2 = state.previousStep === 1 && stepNum === 2 && animate;

    switch (stepNum) {
        case 1:
            drawXSquared(false);
            drawBxRectangle(animate);
            break;
        case 2:
            if (isTransitionFromStep1To2) {
                // Animate the split transition, then enable interactive mode
                animateSplitTransition();
            } else {
                // Coming back to step 2 or refreshing - show interactive immediately
                drawInteractiveLShape();
            }
            break;
        case 3:
            drawMissingSquareInteractive();
            break;
        case 4:
            drawCompletedSquare(animate);
            break;
        case 5:
            drawFinalForm(animate);
            break;
    }

    // Update navigation buttons and progress
    updateNavButtons();
    updateProgress();
}

// ============================================
// Navigation
// ============================================

function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > CONFIG.totalSteps || state.isAnimating) return;

    state.isAnimating = true;
    state.previousStep = state.currentStep;
    state.currentStep = stepNum;
    renderStep(stepNum, true);

    setTimeout(() => {
        state.isAnimating = false;
    }, CONFIG.animationDuration);
}

function nextStep() {
    if (state.currentStep < CONFIG.totalSteps) {
        goToStep(state.currentStep + 1);
    }
}

function prevStep() {
    if (state.currentStep > 1) {
        goToStep(state.currentStep - 1);
    }
}

function updateNavButtons() {
    // Back button - disabled on first step
    elements.prevBtn.disabled = state.currentStep === 1;

    // Continue button - disabled on interactive steps until complete, or on last step
    if (state.currentStep === 2) {
        elements.nextBtn.disabled = !state.step2Completed;
    } else if (state.currentStep === 3) {
        elements.nextBtn.disabled = !state.step3Submitted;
    } else {
        elements.nextBtn.disabled = state.currentStep === CONFIG.totalSteps;
    }

    // Update button text
    if (state.currentStep === CONFIG.totalSteps) {
        elements.nextBtn.textContent = MESSAGES.buttons.complete;
    } else {
        elements.nextBtn.textContent = MESSAGES.buttons.continue;
    }
}

function updateProgress() {
    const progress = (state.currentStep / CONFIG.totalSteps) * 100;
    elements.progressFill.style.width = `${progress}%`;
}

function updateEquationWithValues() {
    const b = state.bValue;
    const c = state.cValue;
    const bDisplay = Number.isInteger(b) ? b : b.toFixed(1);
    const cDisplay = Number.isInteger(c) ? c : c.toFixed(1);
    const cSign = c >= 0 ? '+' : '−';
    const cAbs = Math.abs(c);
    const cAbsDisplay = Number.isInteger(cAbs) ? cAbs : cAbs.toFixed(1);
    const bHalf = b / 2;
    const bHalfDisplay = Number.isInteger(bHalf) ? bHalf : bHalf.toFixed(1);
    const bHalfSquared = bHalf * bHalf;
    const bHalfSquaredDisplay = Number.isInteger(bHalfSquared) ? bHalfSquared : bHalfSquared.toFixed(1);

    // C-term display (grayed out after step 1)
    const cTermGrayed = `<span class="operator c-term-grayed"> ${cSign} </span><span class="term c-term-grayed">${cAbsDisplay}</span>`;
    const cTermNormal = `<span class="operator c-term"> ${cSign} </span><span class="term c-term">${cAbsDisplay}</span>`;

    // Check if we're transitioning from step 4 to step 5 (animate the term moving)
    const isStep4To5Transition = state.currentStep === 5 && state.previousStep === 4;

    // Update equation based on current step with actual values
    let equation = '';
    switch (state.currentStep) {
        case 1:
            equation = `<span class="term x-squared">x²</span><span class="operator"> + </span><span class="term bx">${bDisplay}x</span>${cTermNormal}`;
            break;
        case 2:
            equation = `<span class="term x-squared">x²</span><span class="operator"> + </span><span class="term bx">${bHalfDisplay}x</span><span class="operator"> + </span><span class="term bx">${bHalfDisplay}x</span>${cTermGrayed}`;
            break;
        case 3:
            // Show input box for user to enter the missing area
            equation = `<span class="term x-squared">x²</span><span class="operator"> + </span><span class="term bx">${bDisplay}x</span><span class="operator"> + </span><input type="number" id="areaInput" class="area-input" placeholder="?" min="0" step="any">${cTermGrayed}`;
            break;
        case 4:
            equation = `<span class="term x-squared">x²</span><span class="operator"> + </span><span class="term bx">${bDisplay}x</span>${cTermGrayed}<span class="operator"> + </span><span class="term b-half-squared">${bHalfSquaredDisplay}</span><span class="equals"> = </span><span class="result">(x + ${bHalfDisplay})²</span>${cTermGrayed}`;
            break;
        case 5:
            if (isStep4To5Transition) {
                // Animated version: term starts on left, will animate to right
                equation = `<span class="term x-squared">x²</span><span class="operator"> + </span><span class="term bx">${bDisplay}x</span>${cTermGrayed}<span class="operator" id="plusToMinus"> + </span><span class="term b-half-squared moving-term" id="movingTerm">${bHalfSquaredDisplay}</span><span class="equals"> = </span><span class="result">(x + ${bHalfDisplay})²</span><span class="term-placeholder" id="termPlaceholder"></span>${cTermNormal}`;
            } else {
                // Static final version
                equation = `<span class="term x-squared">x²</span><span class="operator"> + </span><span class="term bx">${bDisplay}x</span>${cTermNormal}<span class="equals"> = </span><span class="result">(x + ${bHalfDisplay})²</span><span class="operator"> − </span><span class="term b-half-squared">${bHalfSquaredDisplay}</span>${cTermNormal}`;
            }
            break;
    }
    elements.equationDisplay.innerHTML = equation;

    // Animate the term moving for step 4 to 5 transition
    if (isStep4To5Transition) {
        animateEquationTermMove(bHalfSquaredDisplay, cTermNormal);
    }

    // Add event listener for step 3 input
    if (state.currentStep === 3) {
        const input = document.getElementById('areaInput');
        if (input) {
            input.addEventListener('input', handleAreaInput);
            input.addEventListener('keydown', handleAreaKeydown);
            // Focus the input after a brief delay
            setTimeout(() => input.focus(), 100);
        }
    }
}

function animateEquationTermMove(bHalfSquaredDisplay, cTermNormal) {
    // Wait for the DOM to update
    requestAnimationFrame(() => {
        const movingTerm = document.getElementById('movingTerm');
        const placeholder = document.getElementById('termPlaceholder');
        const plusToMinus = document.getElementById('plusToMinus');

        if (!movingTerm || !placeholder) return;

        // Get the starting position of the term
        const startRect = movingTerm.getBoundingClientRect();
        const placeholderRect = placeholder.getBoundingClientRect();

        // Calculate the distance to move
        const deltaX = placeholderRect.left - startRect.left;
        const deltaY = placeholderRect.top - startRect.top;

        // Set up the animation
        movingTerm.style.position = 'relative';
        movingTerm.style.display = 'inline-block';
        movingTerm.style.transition = `transform ${CONFIG.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${CONFIG.animationDuration * 0.3}ms ease`;
        movingTerm.style.zIndex = '10';

        // Start the animation after a short delay
        setTimeout(() => {
            // Move the term
            movingTerm.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

            // Fade out the plus sign
            if (plusToMinus) {
                plusToMinus.style.transition = `opacity ${CONFIG.animationDuration * 0.3}ms ease`;
                plusToMinus.style.opacity = '0';
            }

            // After animation completes, update to final state
            setTimeout(() => {
                // Get current b and c values for final equation
                const b = state.bValue;
                const c = state.cValue;
                const bDisplay = Number.isInteger(b) ? b : b.toFixed(1);
                const cSign = c >= 0 ? '+' : '−';
                const cAbs = Math.abs(c);
                const cAbsDisplay = Number.isInteger(cAbs) ? cAbs : cAbs.toFixed(1);
                const bHalf = b / 2;
                const bHalfDisplayFinal = Number.isInteger(bHalf) ? bHalf : bHalf.toFixed(1);
                const bHalfSquared = bHalf * bHalf;
                const bHalfSquaredDisplayFinal = Number.isInteger(bHalfSquared) ? bHalfSquared : bHalfSquared.toFixed(1);

                // Final static equation
                const finalEquation = `<span class="term x-squared">x²</span><span class="operator"> + </span><span class="term bx">${bDisplay}x</span><span class="operator c-term"> ${cSign} </span><span class="term c-term">${cAbsDisplay}</span><span class="equals"> = </span><span class="result">(x + ${bHalfDisplayFinal})²</span><span class="operator"> − </span><span class="term b-half-squared">${bHalfSquaredDisplayFinal}</span><span class="operator c-term"> ${cSign} </span><span class="term c-term">${cAbsDisplay}</span>`;
                elements.equationDisplay.innerHTML = finalEquation;
            }, CONFIG.animationDuration + 100);
        }, 200);
    });
}

function handleBSliderChange(event) {
    state.bValue = parseFloat(event.target.value);
    elements.bValue.textContent = state.bValue;

    // Re-render current step without animation
    renderStep(state.currentStep, false);
}

function handleCSliderChange(event) {
    state.cValue = parseFloat(event.target.value);
    elements.cValue.textContent = state.cValue;

    // Re-render current step without animation
    renderStep(state.currentStep, false);
}

// ============================================
// Keyboard Navigation
// ============================================

function handleKeydown(event) {
    switch (event.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
            event.preventDefault();
            nextStep();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            prevStep();
            break;
        case 'r':
        case 'R':
            event.preventDefault();
            rotateSelectedRect();
            break;
    }
}

// ============================================
// Initialization
// ============================================

function init() {
    initElements();

    // Event listeners
    elements.prevBtn.addEventListener('click', prevStep);
    elements.nextBtn.addEventListener('click', nextStep);
    elements.bSlider.addEventListener('input', handleBSliderChange);
    elements.cSlider.addEventListener('input', handleCSliderChange);
    document.addEventListener('keydown', handleKeydown);

    // Drag event listeners (on document for smooth dragging)
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', endDrag);

    // Click on SVG to deselect
    elements.svg.addEventListener('click', () => {
        if (state.selectedRect && state.currentStep === 2) {
            const group = state.selectedRect === '1' ? state.rect1Group : state.rect2Group;
            if (group) {
                group.querySelector('rect').classList.remove('selected');
            }
            state.selectedRect = null;
        }
    });

    // Initialize first step
    renderStep(1, true);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
