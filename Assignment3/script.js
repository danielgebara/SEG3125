const THEMES = {
  animals:  ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮'],
  food:     ['🍕','🍔','🌮','🍜','🍣','🍩','🍦','🍇','🍓','🥑','🌽','🍋'],
  nature:   ['🌸','🌿','🍁','🌊','⛰️','🌙','☀️','🌈','❄️','🌵','🍄','🌻'],
  sports:   ['⚽','🏀','🎾','🏈','⚾','🏐','🏉','🎱','🏓','🏸','🥊','⛷️'],
};

const LEVELS = {
  easy:   { cols: 4, rows: 3 },
  medium: { cols: 4, rows: 4 },
  hard:   { cols: 6, rows: 4 },
};

let selectedDifficulty = 'easy';
let selectedTheme      = 'animals';
let flippedCards       = [];
let matchedPairs       = 0;
let totalPairs         = 0;
let moves              = 0;
let lockBoard          = false;
let timerInterval      = null;
let seconds            = 0;

// Option button selection
function setupOptionGroup(groupId, stateKey) {
  document.getElementById(groupId).querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(groupId).querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (stateKey === 'difficulty') selectedDifficulty = btn.dataset.value;
      if (stateKey === 'theme')      selectedTheme      = btn.dataset.value;
    });
  });
}
setupOptionGroup('difficultyGroup', 'difficulty');
setupOptionGroup('themeGroup',      'theme');

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('menuBtn').addEventListener('click', showMenu);
document.getElementById('menuBtn2').addEventListener('click', showMenu);
document.getElementById('playAgainBtn').addEventListener('click', startGame);

function startGame() {
  const { cols, rows } = LEVELS[selectedDifficulty];
  totalPairs   = (cols * rows) / 2;
  matchedPairs = 0;
  moves        = 0;
  flippedCards = [];
  lockBoard    = false;
  seconds      = 0;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById('timer').textContent = seconds + 's';
  }, 1000);

  document.getElementById('moveCount').textContent = '0';
  document.getElementById('pairCount').textContent  = '0';
  document.getElementById('pairTotal').textContent  = totalPairs;
  document.getElementById('timer').textContent      = '0s';

  buildBoard(cols, rows);

  show('gameScreen');
}

function buildBoard(cols, rows) {
  const board = document.getElementById('board');
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board.innerHTML = '';

  const emojis   = THEMES[selectedTheme].slice(0, totalPairs);
  const cards    = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back">?</div>
        <div class="card-front">${emoji}</div>
      </div>`;
    card.dataset.emoji = emoji;
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    moves++;
    document.getElementById('moveCount').textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flippedCards;
  if (a.dataset.emoji === b.dataset.emoji) {
    a.classList.add('matched');
    b.classList.add('matched');
    matchedPairs++;
    document.getElementById('pairCount').textContent = matchedPairs;
    flippedCards = [];
    lockBoard    = false;
    if (matchedPairs === totalPairs) endGame();
  } else {
    setTimeout(() => {
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      flippedCards = [];
      lockBoard    = false;
    }, 900);
  }
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById('winStats').textContent =
    `Finished in ${seconds} seconds with ${moves} moves on ${selectedDifficulty} difficulty.`;
  show('winScreen');
}

function showMenu() {
  clearInterval(timerInterval);
  show('setupScreen');
}

function show(id) {
  ['setupScreen', 'gameScreen', 'winScreen'].forEach(s => {
    document.getElementById(s).classList.toggle('hidden', s !== id);
  });
}