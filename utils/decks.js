import db from './db.js';
import { decode } from './converter.js'
import { archetypeLib, decodeDeck } from './setcodes.js';

export function contarRepeticoes(arr, str) {
  const contador = {};
  arr.forEach(num => {
    contador[num] = (contador[num] || 0) + 1;
  });

  const resultado = Object.keys(contador).map(key => ({
    id: str ? key : parseInt(key),
    qtd: contador[key]
  }));

  return resultado;
}

export const getDeck = async (deck) => {
  const { mainSize, passwords } = decode(deck)
  const sets = await decodeDeck(passwords.slice(0, mainSize))
  const count = sets.reduce((acc, card) => {
    acc[card.set] = (acc[card.set] || 0) + 1;
    return acc;
  }, {})

  const archetypesPure = Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .map(([set, count]) => ({ ...archetypeLib.find(a => a.archetype.toLowerCase() === set.toLowerCase()), qtd: count, }))

  const archetypes = archetypesPure.filter(c => c.hasOwnProperty('archetype') & c.qtd >= ((archetypesPure[0].qtd / mainSize) / 2 * mainSize))
  if (archetypes.length > 0) {
    return archetypes
  } else {
    return archetypesPure.filter(c => c.hasOwnProperty('archetype'))
  }
}