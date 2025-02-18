const jStat = require('jstat')

const paginateArray = (array, page = 1, limit = 24) => {
  const total = array.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: array.slice((page - 1) * limit, page * limit),
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1
  };
};

const groupDecksByArchetype = (decks, n = 3, minGames = 20) => {
  const grouped = {};

  decks.filter(c => c.games >= minGames).sort((a, b) => b.games - a.games).forEach(({ id, code, games, wins, data }) => {
    const archetypeList = data.slice(0, n).map(d => d.archetype).sort().join(" ");

    if (!grouped[archetypeList]) {
      grouped[archetypeList] = {
        archetype: archetypeList,
        games: 0,
        wins: 0,
        decks: [],
        data: data.slice(0, n)
      };
    }

    grouped[archetypeList].games += games;
    grouped[archetypeList].wins += wins;
    grouped[archetypeList].decks.push(code);
  });

  return Object.values(grouped);
};

const addPercentageToData = (groupedDecks) => {
  const totalDecks = groupedDecks.reduce((sum, { decks }) => sum + decks.length, 0);

  return groupedDecks.map(({ archetype, games, wins, decks, data }) => {
    const dataWithPercentage = data.map(d => ({
      ...d,
      percentage: ((decks.length / totalDecks) * 100).toFixed(2) + "%"
    }));

    return {
      archetype,
      games,
      wins,
      decks,
      data: dataWithPercentage
    };
  });
};

const calculateDeckScore = (totalGames, wins, totalDuels, W = 35, G = 50, P = 15) => {
  if (totalGames === 0 || totalDuels === 0) return 0; 

  const winRate = wins / totalGames;
  const popularity = totalGames / totalDuels;

  const tierScore = (winRate * W) + (Math.log10(totalGames) * G) + (popularity * P);
  return tierScore;
};

module.exports = {
  paginateArray,
  groupDecksByArchetype,
  addPercentageToData,
  calculateDeckScore,
}
