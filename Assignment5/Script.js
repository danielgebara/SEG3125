// ── Synthetic Data ─────────────────────────────────────────────────────────
const DATA = {
  goals: {
    2022: { 'L. Messi': 12, 'L. Suarez': 14, 'Cucho': 10, 'C. Lewis': 8,  'G. Pressé': 11 },
    2023: { 'L. Messi': 20, 'L. Suarez': 13, 'Cucho': 15, 'C. Lewis': 11, 'G. Pressé': 18 },
    2024: { 'L. Messi': 18, 'L. Suarez': 9,  'Cucho': 17, 'C. Lewis': 14, 'G. Pressé': 22 },
  },
  assists: {
    2022: { 'L. Messi': 14, 'L. Suarez': 6,  'Cucho': 7,  'C. Lewis': 9,  'G. Pressé': 8  },
    2023: { 'L. Messi': 16, 'L. Suarez': 7,  'Cucho': 9,  'C. Lewis': 10, 'G. Pressé': 12 },
    2024: { 'L. Messi': 15, 'L. Suarez': 5,  'Cucho': 11, 'C. Lewis': 12, 'G. Pressé': 14 },
  },
};

const TRENDS = {
  messi:  { name: 'L. Messi',   goals: [8, 11, 12, 20, 18] },
  suarez: { name: 'L. Suarez',  goals: [10, 12, 14, 13, 9]  },
  cucho:  { name: 'Cucho',      goals: [5,  7,  10, 15, 17] },
  lewis:  { name: 'C. Lewis',   goals: [4,  6,  8,  11, 14] },
  pressé: { name: 'G. Pressé',  goals: [6,  9,  11, 18, 22] },
};

const SEASONS = [2020, 2021, 2022, 2023, 2024];
const PLAYERS = Object.keys(DATA.goals[2024]);
const COLORS  = ['#7aadff','#5b8dee','#4a7de8','#3a6de0','#2a5cd8'];

// ── i18n ───────────────────────────────────────────────────────────────────
let lang = 'en';

const T = {
  en: {
    navTitle:    'MLS Stats',
    synthNote:   '⚠ Synthetic data — generated for educational purposes only.',
    mainTitle:   'MLS Player Statistics Dashboard',
    mainSub:     'Explore goals and assists for top MLS players. Use the controls below to filter by season and compare players.',
    chart1Label: 'Goals by Player',
    chart1Desc:  'Compare goals scored by selected players in a chosen season. Use the dropdown to switch seasons.',
    seasonLabel: 'Season',
    metricLabel: 'Metric',
    optGoals:    'Goals',
    optAssists:  'Assists',
    chart2Label: 'Goals Over Seasons',
    chart2Desc:  'Track how a player\'s goal tally has changed from 2020 to 2024. Select a player to update the chart.',
    playerLabel: 'Player',
    barYLabel:   'Goals',
    lineYLabel:  'Goals',
    footerText:  'Designed by Daniel Gebara · SEG3125 · University of Ottawa · 2026',
    goalsWord:   'Goals',
    assistsWord: 'Assists',
  },
  fr: {
    navTitle:    'Stats MLS',
    synthNote:   '⚠ Données synthétiques — générées à des fins pédagogiques uniquement.',
    mainTitle:   'Tableau de bord des statistiques MLS',
    mainSub:     'Explorez les buts et passes décisives des meilleurs joueurs MLS. Utilisez les contrôles ci-dessous pour filtrer par saison.',
    chart1Label: 'Buts par joueur',
    chart1Desc:  'Comparez les buts marqués par les joueurs sélectionnés lors d\'une saison choisie. Utilisez le menu pour changer de saison.',
    seasonLabel: 'Saison',
    metricLabel: 'Statistique',
    optGoals:    'Buts',
    optAssists:  'Passes déc.',
    chart2Label: 'Buts par saison',
    chart2Desc:  'Suivez l\'évolution des buts d\'un joueur de 2020 à 2024. Sélectionnez un joueur pour mettre à jour le graphique.',
    playerLabel: 'Joueur',
    barYLabel:   'Buts',
    lineYLabel:  'Buts',
    footerText:  'Conçu par Daniel Gebara · SEG3125 · Université d\'Ottawa · 2026',
    goalsWord:   'Buts',
    assistsWord: 'Passes déc.',
  }
};

function t(key) { return T[lang][key] || key; }

function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.getElementById('btnEn').classList.toggle('active', l === 'en');
  document.getElementById('btnFr').classList.toggle('active', l === 'fr');

  // Update all text
  const ids = ['navTitle','synthNote','mainTitle','mainSub','chart1Label','chart1Desc',
                'seasonLabel','metricLabel','chart2Label','chart2Desc','playerLabel','footerText'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(id);
  });
  document.getElementById('optGoals').textContent   = t('optGoals');
  document.getElementById('optAssists').textContent = t('optAssists');

  renderBar();
  renderLine();
}

// ── Charts ─────────────────────────────────────────────────────────────────
let barChart  = null;
let lineChart = null;

const CHART_DEFAULTS = {
  color: '#aaa',
  grid:  '#222',
};

function chartTextColor()  { return '#aaa'; }
function chartGridColor()  { return '#222'; }

function renderBar() {
  const season = document.getElementById('seasonSelect').value;
  const metric = document.getElementById('metricSelect').value;
  const values = Object.values(DATA[metric][season]);
  const label  = metric === 'goals' ? t('goalsWord') : t('assistsWord');

  if (barChart) barChart.destroy();

  barChart = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: PLAYERS,
      datasets: [{
        label: label,
        data: values,
        backgroundColor: COLORS,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#1e1e1e', titleColor: '#ddd', bodyColor: '#aaa', borderColor: '#2a2a2a', borderWidth: 1 }
      },
      scales: {
        x: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } },
        y: {
          ticks: { color: chartTextColor() },
          grid: { color: chartGridColor() },
          title: { display: true, text: label, color: chartTextColor(), font: { size: 11 } },
          beginAtZero: true
        }
      }
    }
  });
}

function renderLine() {
  const key    = document.getElementById('playerSelect').value;
  const player = TRENDS[key];

  if (lineChart) lineChart.destroy();

  lineChart = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: SEASONS,
      datasets: [{
        label: player.name,
        data: player.goals,
        borderColor: '#7aadff',
        backgroundColor: 'rgba(122,173,255,0.08)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#7aadff',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: chartTextColor() } },
        tooltip: { backgroundColor: '#1e1e1e', titleColor: '#ddd', bodyColor: '#aaa', borderColor: '#2a2a2a', borderWidth: 1 }
      },
      scales: {
        x: { ticks: { color: chartTextColor() }, grid: { color: chartGridColor() } },
        y: {
          ticks: { color: chartTextColor() },
          grid: { color: chartGridColor() },
          title: { display: true, text: t('lineYLabel'), color: chartTextColor(), font: { size: 11 } },
          beginAtZero: true
        }
      }
    }
  });
}

// ── Init ───────────────────────────────────────────────────────────────────
renderBar();
renderLine();