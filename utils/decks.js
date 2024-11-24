export const determineMatchWinner = (results) => {
  let player1Wins = 0;
  let player2Wins = 0;

  results.forEach(result => {
    if (result === 0) player1Wins++;
    else if (result === 1) player2Wins++;
  });

  if (player1Wins >= 2) return 0;
  if (player2Wins >= 2) return 1;

  return -1; // Sem vencedor (empate ou incompleto)
};

export function contarRepeticoes(arr) {
  const contador = {};
  arr.forEach(num => {
    contador[num] = (contador[num] || 0) + 1;
  });

  const resultado = Object.keys(contador).map(key => ({
    id: parseInt(key),
    qtd: contador[key]
  }));

  return resultado;
}