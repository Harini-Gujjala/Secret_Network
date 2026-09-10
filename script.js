/**
 * SECRET NETWORK - Deductive Puzzle Game
 */

// Game Configuration
const CONFIG = {
  nodes: ['A', 'B', 'C', 'D'],
  targetConnectionCount: 3,
  maxAttempts: 10,
  maxHints: 2,
  initialScore: 1000,
  scorePenaltyPerAttempt: 100,
  scorePenaltyPerHint: 100
};

// Game State Variables
let secretNetwork = [];
let userConnections = [];
let selectedNode = null;
let attemptsLeft = CONFIG.maxAttempts;
let score = CONFIG.initialScore;
let hintsLeft = CONFIG.maxHints;
let guessHistory = [];
let isGameOver = false;

// DOM Elements
const nodesContainer = document.getElementById('nodes-container');
const svgLayer = document.getElementById('svg-layer');
const checkBtn = document.getElementById('check-btn');
const hintBtn = document.getElementById('hint-btn');
const hintBox = document.getElementById('hint-box');
const hintsLeftDisplay = document.getElementById('hints-left');
const scoreDisplay = document.getElementById('score-display');
const attemptsDisplay = document.getElementById('attempts-display');
const historyList = document.getElementById('history-list');

const correctCountEl = document.getElementById('correct-count');
const incorrectCountEl = document.getElementById('incorrect-count');
const missingCountEl = document.getElementById('missing-count');

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalNodesContainer = document.getElementById('modal-nodes-container');
const modalSvgLayer = document.getElementById('modal-svg-layer');
const modalSolutionTags = document.getElementById('modal-solution-tags');
const modalFinalScore = document.getElementById('modal-final-score');
const modalAttemptsUsed = document.getElementById('modal-attempts-used');
const restartBtn = document.getElementById('restart-btn');

/**
 * Initialize the game on load
 */
document.addEventListener('DOMContentLoaded', () => {
  initGame();

  // Handle window resizing to keep SVG lines dynamic and aligned
  window.addEventListener('resize', () => {
    renderLines();
    if (isGameOver) renderModalSecretNetwork();
  });

  // Event Listeners
  checkBtn.addEventListener('click', handleCheckNetwork);
  hintBtn.addEventListener('click', handleGiveHint);
  restartBtn.addEventListener('click', initGame);
});

/**
 * Start or reset the game state
 */
function initGame() {
  score = CONFIG.initialScore;
  attemptsLeft = CONFIG.maxAttempts;
  hintsLeft = CONFIG.maxHints;
  userConnections = [];
  selectedNode = null;
  guessHistory = [];
  isGameOver = false;

  // Generate valid connections pool and secret network
  const allPossibleConnections = getAllPossibleConnections(CONFIG.nodes);
  secretNetwork = generateSecretNetwork(allPossibleConnections, CONFIG.targetConnectionCount);

  // Reset UI
  updateStatsUI();
  resetFeedbackUI();
  renderNodes();
  renderLines();
  
  hintBox.classList.add('hidden');
  hintBox.textContent = '';
  modalOverlay.classList.add('hidden');
  historyList.innerHTML = '<p class="empty-history">No guesses submitted yet.</p>';
  
  checkBtn.disabled = false;
  hintBtn.disabled = false;
}

/**
 * Generates all unique node pair combinations (e.g. A-B, A-C, etc.)
 */
function getAllPossibleConnections(nodes) {
  const connections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      connections.push(`${nodes[i]}-${nodes[j]}`);
    }
  }
  return connections;
}

/**
 * Randomly picks targetCount unique connections for the secret network
 */
function generateSecretNetwork(allConnections, targetCount) {
  const shuffled = [...allConnections].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, targetCount);
}

/**
 * Standardize edge format to maintain alphabetical ordering (A-B instead of B-A)
 */
function formatEdge(node1, node2) {
  return [node1, node2].sort().join('-');
}

/**
 * Render node elements in the DOM
 */
function renderNodes() {
  nodesContainer.innerHTML = '';
  CONFIG.nodes.forEach(label => {
    const nodeEl = document.createElement('button');
    nodeEl.className = 'node';
    nodeEl.dataset.label = label;
    nodeEl.textContent = label;
    nodeEl.setAttribute('aria-label', `Node ${label}`);
    nodeEl.addEventListener('click', () => handleNodeClick(label));
    nodesContainer.appendChild(nodeEl);
  });
}

/**
 * Node click handling logic
 */
function handleNodeClick(label) {
  if (isGameOver) return;

  if (selectedNode === null) {
    selectedNode = label;
  } else if (selectedNode === label) {
    selectedNode = null;
  } else {
    toggleConnection(selectedNode, label);
    selectedNode = null;
  }

  updateNodeSelectionUI();
  renderLines();
}

/**
 * Add or remove a connection between two nodes
 */
function toggleConnection(node1, node2) {
  const edge = formatEdge(node1, node2);
  const index = userConnections.indexOf(edge);

  if (index > -1) {
    userConnections.splice(index, 1);
  } else {
    userConnections.push(edge);
  }
}

/**
 * Updates CSS active state for selected node
 */
function updateNodeSelectionUI() {
  const nodeEls = nodesContainer.querySelectorAll('.node');
  nodeEls.forEach(nodeEl => {
    if (nodeEl.dataset.label === selectedNode) {
      nodeEl.classList.add('selected');
    } else {
      nodeEl.classList.remove('selected');
    }
  });
}

/**
 * Draws SVG line connections on top of nodes
 */
function renderLines() {
  svgLayer.innerHTML = '';
  const boardRect = nodesContainer.getBoundingClientRect();

  userConnections.forEach(edge => {
    const [n1, n2] = edge.split('-');
    const pos1 = getNodeCenter(n1, nodesContainer, boardRect);
    const pos2 = getNodeCenter(n2, nodesContainer, boardRect);

    if (pos1 && pos2) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', pos1.x);
      line.setAttribute('y1', pos1.y);
      line.setAttribute('x2', pos2.x);
      line.setAttribute('y2', pos2.y);
      line.setAttribute('class', 'edge-line');
      svgLayer.appendChild(line);
    }
  });
}

/**
 * Render solution network visually inside modal
 */
function renderModalSecretNetwork() {
  modalNodesContainer.innerHTML = '';
  modalSvgLayer.innerHTML = '';

  // Render mini nodes
  CONFIG.nodes.forEach(label => {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'node mini-node';
    nodeEl.dataset.label = label;
    nodeEl.textContent = label;
    modalNodesContainer.appendChild(nodeEl);
  });

  // Render solution tags
  modalSolutionTags.innerHTML = secretNetwork
    .map(conn => `<span class="conn-tag solution-tag">${conn}</span>`)
    .join('');

  // Render mini SVG lines
  const boardRect = modalNodesContainer.getBoundingClientRect();

  secretNetwork.forEach(edge => {
    const [n1, n2] = edge.split('-');
    const pos1 = getNodeCenter(n1, modalNodesContainer, boardRect);
    const pos2 = getNodeCenter(n2, modalNodesContainer, boardRect);

    if (pos1 && pos2) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', pos1.x);
      line.setAttribute('y1', pos1.y);
      line.setAttribute('x2', pos2.x);
      line.setAttribute('y2', pos2.y);
      line.setAttribute('class', 'edge-line solution-line');
      modalSvgLayer.appendChild(line);
    }
  });
}

/**
 * Get (x, y) coordinates for line anchor points relative to container
 */
function getNodeCenter(label, container, boardRect) {
  const nodeEl = container.querySelector(`[data-label="${label}"]`);
  if (!nodeEl) return null;
  
  const rect = nodeEl.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - boardRect.left,
    y: rect.top + rect.height / 2 - boardRect.top
  };
}

/**
 * Process network evaluation when CHECK NETWORK button is pressed
 */
function handleCheckNetwork() {
  if (isGameOver) return;

  if (userConnections.length === 0) {
    alert("Please create at least one connection before checking.");
    return;
  }

  attemptsLeft--;

  let correctCount = 0;
  let incorrectCount = 0;

  userConnections.forEach(edge => {
    if (secretNetwork.includes(edge)) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const missingCount = secretNetwork.length - correctCount;

  const isWin = (correctCount === secretNetwork.length && incorrectCount === 0 && userConnections.length === secretNetwork.length);

  if (!isWin) {
    score = Math.max(0, score - CONFIG.scorePenaltyPerAttempt);
  }

  updateStatsUI();
  updateFeedbackUI(correctCount, incorrectCount, missingCount);
  addHistoryEntry(userConnections, correctCount, incorrectCount, missingCount);

  if (isWin) {
    endGame(true);
  } else if (attemptsLeft <= 0) {
    endGame(false);
  }

  selectedNode = null;
  updateNodeSelectionUI();
}

/**
 * Handle Hint Logic
 */
function handleGiveHint() {
  if (isGameOver || hintsLeft <= 0) return;

  hintsLeft--;
  score = Math.max(0, score - CONFIG.scorePenaltyPerHint);
  updateStatsUI();

  let hintText = "";
  const allPossible = getAllPossibleConnections(CONFIG.nodes);

  if (hintsLeft === 1) {
    const randomNode = CONFIG.nodes[Math.floor(Math.random() * CONFIG.nodes.length)];
    const degree = secretNetwork.filter(edge => edge.includes(randomNode)).length;
    hintText = `💡 Hint: Node ${randomNode} is connected to exactly ${degree} other node${degree === 1 ? '' : 's'}.`;
  } else {
    const unrevealed = allPossible.filter(conn => !userConnections.includes(conn));
    const targetConn = unrevealed.length > 0 ? unrevealed[Math.floor(Math.random() * unrevealed.length)] : allPossible[0];
    
    if (secretNetwork.includes(targetConn)) {
      hintText = `💡 Hint: Connection ${targetConn} IS part of the secret network.`;
    } else {
      hintText = `💡 Hint: Connection ${targetConn} is NOT part of the secret network.`;
    }
  }

  hintBox.textContent = hintText;
  hintBox.classList.remove('hidden');

  if (hintsLeft === 0) {
    hintBtn.disabled = true;
  }
}

/**
 * Update score and attempt indicators
 */
function updateStatsUI() {
  scoreDisplay.textContent = score;
  attemptsDisplay.textContent = `${attemptsLeft} / ${CONFIG.maxAttempts}`;
  hintsLeftDisplay.textContent = hintsLeft;
}

/**
 * Update feedback counters
 */
function updateFeedbackUI(correct, incorrect, missing) {
  correctCountEl.textContent = correct;
  incorrectCountEl.textContent = incorrect;
  missingCountEl.textContent = missing;
}

/**
 * Reset feedback counters
 */
function resetFeedbackUI() {
  correctCountEl.textContent = '-';
  incorrectCountEl.textContent = '-';
  missingCountEl.textContent = '-';
}

/**
 * Add a row to guess history
 */
function addHistoryEntry(connections, correct, incorrect, missing) {
  if (guessHistory.length === 0) {
    historyList.innerHTML = '';
  }

  const guessNumber = CONFIG.maxAttempts - attemptsLeft;
  guessHistory.push({ connections, correct, incorrect, missing });

  const item = document.createElement('div');
  item.className = 'history-item';

  const tagsHTML = connections.map(c => `<span class="conn-tag">${c}</span>`).join(' ');

  item.innerHTML = `
    <span class="history-guess-num">#${guessNumber}</span>
    <div class="history-connections">${tagsHTML}</div>
    <div class="history-badge-group">
      <span class="badge badge-correct">${correct} C</span>
      <span class="badge badge-incorrect">${incorrect} I</span>
      <span class="badge badge-missing">${missing} M</span>
    </div>
  `;

  historyList.insertBefore(item, historyList.firstChild);
}

/**
 * Handle game end conditions
 */
function endGame(isWin) {
  isGameOver = true;
  checkBtn.disabled = true;
  hintBtn.disabled = true;

  if (isWin) {
    modalTitle.textContent = "🎉 Network Solved!";
    modalDescription.textContent = "Great deduction! You found the secret network.";
  } else {
    modalTitle.textContent = "Network Unsolved";
    modalDescription.textContent = "You ran out of attempts.";
    score = 0;
    updateStatsUI();
  }

  modalFinalScore.textContent = score;
  modalAttemptsUsed.textContent = CONFIG.maxAttempts - attemptsLeft;

  // Reveal main board solution as well
  userConnections = [...secretNetwork];
  renderLines();

  // Show modal with visual solution rendering
  modalOverlay.classList.remove('hidden');
  renderModalSecretNetwork();
}